import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Test that Home renders and handles geolocation fallback

describe('Home component', () => {
  it('renders system selector if no geolocation', () => {
    global.navigator.geolocation = undefined;
    const { getByRole } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(getByRole('region', { name: /system selector/i })).toBeInTheDocument();
  });
});
