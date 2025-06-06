import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Test NotFound route rendering

describe('NotFound component', () => {
  it('renders not found message', () => {
    window.history.pushState({}, '', '/some-nonexistent-route');
    const { getByText } = render(
      <MemoryRouter initialEntries={['/some-nonexistent-route']}>
        <App />
      </MemoryRouter>
    );
    expect(getByText(/not found/i)).toBeInTheDocument();
  });
});
