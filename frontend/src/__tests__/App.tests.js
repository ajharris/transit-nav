// src/__tests__/App.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders home page', () => {
  global.navigator.geolocation = undefined; // Simulate no geolocation
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  // Should show manual selector UI
  expect(screen.getByRole('region', { name: /system selector/i })).toBeInTheDocument();
});

test('renders 404 for unknown route', () => {
  render(<MemoryRouter initialEntries={['/unknown']}><App /></MemoryRouter>);
  expect(screen.getByText(/not found/i)).toBeInTheDocument();
});

// Geolocation Detection: Returns coordinates from browser geolocation API
it('detects system from geolocation', async () => {
  const mockGetCurrentPosition = jest.fn(cb =>
    cb({ coords: { latitude: 43.65, longitude: -79.38 } })
  );
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  await waitFor(() => expect(screen.getByText(/Detected system: GO Transit/)).toBeInTheDocument());
});

// Handles user denial of geolocation permission
it('shows manual system selector if geolocation denied', async () => {
  const mockGetCurrentPosition = jest.fn((_, err) => err({ message: 'denied' }));
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  await waitFor(() => expect(screen.getByRole('region', { name: /system selector/i })).toBeInTheDocument());
  expect(screen.getByRole('alert')).toHaveTextContent(/denied/);
});

// Handles geolocation errors gracefully
it('shows error and manual selector on geolocation error', async () => {
  const mockGetCurrentPosition = jest.fn((_, err) => err({ message: 'error' }));
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/error/));
  expect(screen.getByRole('region', { name: /system selector/i })).toBeInTheDocument();
});

// Location-to-System Mapping: Returns null/fallback for unknown coordinates
it('shows manual selector for unknown coordinates', async () => {
  const mockGetCurrentPosition = jest.fn(cb =>
    cb({ coords: { latitude: 0, longitude: 0 } })
  );
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  await waitFor(() => expect(screen.getByRole('region', { name: /system selector/i })).toBeInTheDocument());
});

// Manual System Selection Fallback: Allows user to select a system
it('allows manual system selection', async () => {
  global.navigator.geolocation = undefined; // Simulate no geolocation
  render(<MemoryRouter><App /></MemoryRouter>);
  await waitFor(() => expect(screen.getByRole('region', { name: /system selector/i })).toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: /GO Transit/i }));
  expect(screen.getByText(/Detected system: GO Transit/)).toBeInTheDocument();
});

// Integration: user allows location → system is inferred → UI updates
it('integration: geolocation success updates UI', async () => {
  const mockGetCurrentPosition = jest.fn(cb =>
    cb({ coords: { latitude: 43.65, longitude: -79.38 } })
  );
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  await waitFor(() => expect(screen.getByText(/Detected system: GO Transit/)).toBeInTheDocument());
});

// Integration: user blocks location → system picker appears → user selects → app updates
it('integration: geolocation denied, manual select updates UI', async () => {
  const mockGetCurrentPosition = jest.fn((_, err) => err({ message: 'denied' }));
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  await waitFor(() => expect(screen.getByRole('region', { name: /system selector/i })).toBeInTheDocument());
  fireEvent.click(screen.getByRole('button', { name: /TTC/i }));
  expect(screen.getByText(/Detected system: TTC/)).toBeInTheDocument();
});

// Accessibility: System selector is keyboard-navigable and screen-reader friendly
it('system selector is accessible', async () => {
  global.navigator.geolocation = undefined;
  render(<MemoryRouter><App /></MemoryRouter>);
  await waitFor(() => expect(screen.getByRole('region', { name: /system selector/i })).toBeInTheDocument());
  const list = screen.getByRole('region', { name: /system selector/i });
  expect(list).toHaveAccessibleName('System selector');
  expect(screen.getByRole('button', { name: /GO Transit/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /TTC/i })).toBeInTheDocument();
});
