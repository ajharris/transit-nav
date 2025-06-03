// Utility for managing recent trips in localStorage
export const RECENT_TRIPS_KEY = 'recentTrips';

export function getRecentTrips() {
  const data = localStorage.getItem(RECENT_TRIPS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveTrip(trip) {
  let trips = getRecentTrips();
  trips.unshift(trip);
  if (trips.length > 5) trips = trips.slice(0, 5);
  localStorage.setItem(RECENT_TRIPS_KEY, JSON.stringify(trips));
}
