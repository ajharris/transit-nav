import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import userEvent from '@testing-library/user-event';

// Mock fetch for stops
const stops = [
  { id: 1, name: 'Union', system: 'GO Transit' },
  { id: 2, name: 'Oakville', system: 'GO Transit' },
  { id: 3, name: 'Bloor-Yonge', system: 'TTC' },
  { id: 4, name: 'Spadina', system: 'TTC' },
];

describe('StopSelector repopulates on system change', () => {
  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('/api/stops')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(stops),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'ok' }) });
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows only stops for selected system after switching', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Select GO Transit
    const systemInput = await screen.findByLabelText(/transit system search/i);
    await userEvent.clear(systemInput);
    await userEvent.type(systemInput, 'GO Transit');
    // Select from dropdown if needed
    const goOption = await screen.findByText('GO Transit');
    await userEvent.click(goOption);

    // Wait for stops to load and input to appear
    const originInput = await screen.findByLabelText(/origin stop/i);
    await userEvent.click(originInput);
    await userEvent.type(originInput, 'U');
    expect(await screen.findByText('Union')).toBeInTheDocument();
    expect(screen.queryByText('Bloor-Yonge')).not.toBeInTheDocument();

    // Switch to TTC
    await userEvent.click(screen.getByText(/Change System/i));
    const systemInput2 = await screen.findByLabelText(/transit system search/i);
    await userEvent.clear(systemInput2);
    await userEvent.type(systemInput2, 'TTC');
    const ttcOption = await screen.findByText('TTC');
    await userEvent.click(ttcOption);

    // Wait for stops to load and input to reappear
    const originInput2 = await screen.findByLabelText(/origin stop/i);
    await userEvent.clear(originInput2);
    await userEvent.type(originInput2, 'B');
    expect(await screen.findByText('Bloor-Yonge')).toBeInTheDocument();
    expect(screen.queryByText('Union')).not.toBeInTheDocument();
  });
});