// src/__tests__/App.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import userEvent from '@testing-library/user-event';

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
  const mockGetCurrentPosition = jest.fn((success) =>
    success({ coords: { latitude: 43.65, longitude: -79.38 } })
  );
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  // Wait for the system selector to appear
  const systemInput = await screen.findByLabelText(/transit system search/i);
  expect(systemInput).toBeInTheDocument();
  // The detected system should be available as an option
  await userEvent.type(systemInput, 'GO');
  expect(await screen.findByText('GO Transit')).toBeInTheDocument();
});

// Geolocation success: system selector is pre-filled
it('shows system selector with detected system as selectable option on geolocation success', async () => {
  const mockGetCurrentPosition = jest.fn((success) =>
    success({ coords: { latitude: 43.65, longitude: -79.38 } })
  );
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  // Wait for the system selector to appear
  const systemInput = await screen.findByLabelText(/transit system search/i);
  expect(systemInput).toBeInTheDocument();
  // The detected system should be available as an option
  await userEvent.type(systemInput, 'GO');
  expect(await screen.findByText('GO Transit')).toBeInTheDocument();
});

// Handles user denial of geolocation permission
it('shows manual system selector if geolocation denied', async () => {
  const mockGetCurrentPosition = jest.fn((success, error) => error({ code: 1 }));
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  // Wait for the system selector to appear
  const systemInput = await screen.findByLabelText(/transit system search/i);
  expect(systemInput).toBeInTheDocument();
});

// Handles geolocation errors gracefully
it('shows manual system selector on geolocation error', async () => {
  const mockGetCurrentPosition = jest.fn((success, error) => error({ code: 2 }));
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  render(<MemoryRouter><App /></MemoryRouter>);
  // Wait for the system selector to appear
  const systemInput = await screen.findByLabelText(/transit system search/i);
  expect(systemInput).toBeInTheDocument();
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
  const mockGetCurrentPosition = jest.fn((success) =>
    success({ coords: { latitude: 43.65, longitude: -79.38 } })
  );
  global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };
  // Mock stops fetch
  const stops = [
    { id: 1, name: 'Union', system: 'GO Transit' },
    { id: 2, name: 'Oakville', system: 'GO Transit' },
    { id: 3, name: 'Bloor-Yonge', system: 'TTC' },
    { id: 4, name: 'Spadina', system: 'TTC' },
  ];
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/stops')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(stops),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'ok' }) });
  });
  render(<MemoryRouter><App /></MemoryRouter>);
  // Wait for the system selector to appear
  const systemInput = await screen.findByLabelText(/transit system search/i);
  expect(systemInput).toBeInTheDocument();
  // User selects the detected system
  await userEvent.type(systemInput, 'GO');
  const goOption = await screen.findByText('GO Transit');
  await userEvent.click(goOption);
  // Now the StopSelector should appear
  expect(await screen.findByLabelText(/origin stop/i)).toBeInTheDocument();
  jest.restoreAllMocks();
});

// Integration: user blocks location → system picker appears → user selects → app updates
it('integration: geolocation denied, manual select updates UI', async () => {
  const mockGetCurrentPosition = jest.fn((success, error) => error({ code: 1 }));
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

describe('Bootstrap layout and responsive classes', () => {
  it('main container uses Bootstrap classes', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    const container = document.querySelector('.container');
    expect(container).toBeInTheDocument();
    expect(container.className).toMatch(/container/);
  });

  it('uses Bootstrap grid and button classes when system is selected', async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    // Simulate user selecting a system to reveal StopSelector and buttons
    const systemButton = await screen.findByRole('button', { name: /GO Transit/i });
    fireEvent.click(systemButton);
    // Focus the origin input to trigger the dropdown (list-group)
    const originInput = await screen.findByLabelText(/origin stop/i);
    fireEvent.focus(originInput);
    // Now check for Bootstrap classes
    expect(document.querySelector('.row')).toBeInTheDocument();
    expect(document.querySelector('.col-12')).toBeInTheDocument();
    expect(document.querySelector('.btn')).toBeInTheDocument();
    expect(document.querySelector('.form-control')).toBeInTheDocument();
    expect(document.querySelector('.list-group')).toBeInTheDocument();
  });
});
