import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as recentTrips from '../recentTrips';

// Mock HomePage component for recent trips display
function RecentTripsSection() {
  const trips = recentTrips.getRecentTrips();
  if (!trips.length) return <div>No recent trips</div>;
  return (
    <ul data-testid="recent-trips-list">
      {trips.map((t, i) => (
        <li key={i}>
          <button onClick={() => recentTrips.onTripClick && recentTrips.onTripClick(t)}>
            {t.start} → {t.destination}
          </button>
        </li>
      ))}
    </ul>
  );
}

describe('Display Recent Trips – Homepage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  it('Test 4: Show recent trips on page load', () => {
    recentTrips.saveTrip({ start: 'A', destination: 'B', timestamp: 1 });
    recentTrips.saveTrip({ start: 'C', destination: 'D', timestamp: 2 });
    render(<RecentTripsSection />);
    const items = screen.getAllByRole('button');
    expect(items[0]).toHaveTextContent('C → D');
    expect(items[1]).toHaveTextContent('A → B');
  });

  it('Test 5: Hide recent trips if none exist', () => {
    render(<RecentTripsSection />);
    expect(screen.getByText(/no recent trips/i)).toBeInTheDocument();
  });

  it('Test 6: Clickable recent trip restores it', () => {
    const trip = { start: 'A', destination: 'B', timestamp: 1 };
    recentTrips.saveTrip(trip);
    const onTripClick = jest.fn();
    recentTrips.onTripClick = onTripClick;
    render(<RecentTripsSection />);
    fireEvent.click(screen.getByRole('button', { name: /A → B/ }));
    expect(onTripClick).toHaveBeenCalledWith(trip);
    delete recentTrips.onTripClick;
  });
});
