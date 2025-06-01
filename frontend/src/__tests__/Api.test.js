import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test('loads and displays health check', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => ({ status: 'ok' })
  });
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  await waitFor(() => expect(screen.getByText(/ok/i)).toBeInTheDocument());
  global.fetch.mockRestore();
});
