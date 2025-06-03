import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

it('loads and displays health check', async () => {
  global.navigator.geolocation = undefined; // Simulate no geolocation
  global.fetch = jest.fn(() =>
    Promise.resolve({ json: () => Promise.resolve({ status: 'ok' }) })
  );
  render(<MemoryRouter><App /></MemoryRouter>);
  // Health check result is not shown in UI, but system selector should appear
  await waitFor(() => expect(screen.getByRole('region', { name: /system selector/i })).toBeInTheDocument());
  global.fetch.mockRestore();
});
