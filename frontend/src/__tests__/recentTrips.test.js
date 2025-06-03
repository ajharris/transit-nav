import { getRecentTrips, saveTrip, RECENT_TRIPS_KEY } from '../recentTrips';

describe('Local Storage – Recent Trips', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers().setSystemTime(new Date('2025-06-03T12:00:00Z'));
  });
  afterEach(() => {
    localStorage.clear();
    jest.useRealTimers();
  });

  it('Test 1: Save a trip after it\'s planned', () => {
    const trip = { start: 'A', destination: 'B', timestamp: Date.now() };
    saveTrip(trip);
    const trips = getRecentTrips();
    expect(trips.length).toBe(1);
    expect(trips[0]).toMatchObject({ start: 'A', destination: 'B' });
  });

  it('Test 2: Limit to most recent 5 trips', () => {
    for (let i = 1; i <= 6; i++) {
      saveTrip({ start: `A${i}`, destination: `B${i}`, timestamp: Date.now() + i });
    }
    const trips = getRecentTrips();
    expect(trips.length).toBe(5);
    expect(trips[0].start).toBe('A6');
    expect(trips[4].start).toBe('A2');
  });

  it('Test 3: Store trip details clearly', () => {
    const trip = { start: 'A', destination: 'B', timestamp: 1234567890 };
    saveTrip(trip);
    const trips = getRecentTrips();
    expect(trips[0]).toHaveProperty('start', 'A');
    expect(trips[0]).toHaveProperty('destination', 'B');
    expect(trips[0]).toHaveProperty('timestamp', 1234567890);
  });
});
