// src/__tests__/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

test('renders home page', () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});

test('renders 404 for unknown route', () => {
  render(<MemoryRouter initialEntries={['/unknown']}><App /></MemoryRouter>);
  expect(screen.getByText(/not found/i)).toBeInTheDocument();
});
