// src/__tests__/StopSelector.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import StopSelector from '../StopSelector.jsx';

describe('StopSelector', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([
      { name: 'Union', system: 'TTC' },
      { name: 'Kipling', system: 'TTC' }
    ]) }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads stops for system and shows origin/destination inputs', async () => {
    render(<StopSelector system="TTC" origin="" setOrigin={() => {}} destination="" setDestination={() => {}} />);
    await waitFor(() => expect(screen.getByLabelText(/origin stop/i)).toBeInTheDocument());
    expect(screen.getByLabelText(/destination stop/i)).toBeInTheDocument();
  });

  it('shows error on fetch failure', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
    render(<StopSelector system="TTC" origin="" setOrigin={() => {}} destination="" setDestination={() => {}} />);
    await waitFor(() => expect(screen.getByText(/failed to fetch stops/i)).toBeInTheDocument());
  });
});
