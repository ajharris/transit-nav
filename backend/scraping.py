import requests
from bs4 import BeautifulSoup

def scrape_stops_for_system(system_name):
    """
    Scrape real stops for a given system. Implemented for TTC, GO Transit, MTA, and BART.
    Uses a browser-like User-Agent to avoid basic bot blocks.
    Returns static fallback stops if scraping fails or returns no stops.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    system = system_name.lower()
    # Static fallback stops for each system
    static_stops = {
        "ttc": [
            {"name": "Union Station", "line": "TTC", "system": "TTC"},
            {"name": "Kipling", "line": "TTC", "system": "TTC"},
            {"name": "Yorkdale", "line": "TTC", "system": "TTC"},
            {"name": "Bloor-Yonge", "line": "TTC", "system": "TTC"},
        ],
        "go": [
            {"name": "Union Station", "line": "GO", "system": "GO Transit"},
            {"name": "Oakville", "line": "GO", "system": "GO Transit"},
            {"name": "Kitchener", "line": "GO", "system": "GO Transit"},
            {"name": "Pickering", "line": "GO", "system": "GO Transit"},
        ],
        "go transit": [
            {"name": "Union Station", "line": "GO", "system": "GO Transit"},
            {"name": "Oakville", "line": "GO", "system": "GO Transit"},
            {"name": "Kitchener", "line": "GO", "system": "GO Transit"},
            {"name": "Pickering", "line": "GO", "system": "GO Transit"},
        ],
        "mta": [
            {"name": "Times Sq - 42 St", "line": "MTA", "system": "MTA"},
            {"name": "Grand Central - 42 St", "line": "MTA", "system": "MTA"},
            {"name": "34 St - Penn Station", "line": "MTA", "system": "MTA"},
            {"name": "Fulton St", "line": "MTA", "system": "MTA"},
        ],
        "bart": [
            {"name": "Embarcadero", "line": "BART", "system": "BART"},
            {"name": "Powell St", "line": "BART", "system": "BART"},
            {"name": "12th St/Oakland City Center", "line": "BART", "system": "BART"},
            {"name": "Daly City", "line": "BART", "system": "BART"},
        ],
    }
    if system == "ttc":
        url = "https://www.ttc.ca/subway-stations"
        try:
            resp = requests.get(url, timeout=10, headers=headers)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            stops = []
            for a in soup.find_all("a", class_="station-link"):
                name = a.get_text(strip=True)
                stops.append({"name": name, "line": "TTC", "system": "TTC"})
            if stops:
                return stops
        except Exception as e:
            print(f"[scrape_stops_for_system] Error scraping TTC: {e}")
        return static_stops["ttc"]
    if system in ("go", "go transit"):
        url = "https://www.gotransit.com/en/the-future-go/stations"
        try:
            resp = requests.get(url, timeout=10, headers=headers)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            stops = []
            for h3 in soup.find_all("h3"):
                name = h3.get_text(strip=True)
                if "station" in name.lower():
                    stops.append({"name": name, "line": "GO", "system": "GO Transit"})
            if stops:
                return stops
        except Exception as e:
            print(f"[scrape_stops_for_system] Error scraping GO Transit: {e}")
        return static_stops[system]
    if system == "mta":
        url = "https://new.mta.info/maps/subway-line-maps"
        try:
            resp = requests.get(url, timeout=10, headers=headers)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            stops = []
            for span in soup.find_all("span"):
                name = span.get_text(strip=True)
                if "station" in name.lower():
                    stops.append({"name": name, "line": "MTA", "system": "MTA"})
            if stops:
                return stops
        except Exception as e:
            print(f"[scrape_stops_for_system] Error scraping MTA: {e}")
        return static_stops["mta"]
    if system == "bart":
        url = "https://www.bart.gov/stations"
        try:
            resp = requests.get(url, timeout=10, headers=headers)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")
            stops = []
            for a in soup.find_all("a", class_="station"):
                name = a.get_text(strip=True)
                stops.append({"name": name, "line": "BART", "system": "BART"})
            if stops:
                return stops
        except Exception as e:
            print(f"[scrape_stops_for_system] Error scraping BART: {e}")
        return static_stops["bart"]
    return []
