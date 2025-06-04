// src/__tests__/TransitSystemSelector.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransitSystemSelector from '../TransitSystemSelector.jsx';

describe('TransitSystemSelector', () => {
  it('shows all supported systems by default', () => {
    render(<TransitSystemSelector onSelect={() => {}} />);
    expect(screen.getByText('GO Transit')).toBeInTheDocument();
    expect(screen.getByText('TTC')).toBeInTheDocument();
    expect(screen.getByText('MTA')).toBeInTheDocument();
    expect(screen.getByText('BART')).toBeInTheDocument();
  });

  it('filters systems by query', () => {
    render(<TransitSystemSelector onSelect={() => {}} />);
    const input = screen.getByLabelText(/transit system search/i);
    fireEvent.change(input, { target: { value: 'ttc' } });
    fireEvent.focus(input); // Ensure dropdown is open
    expect(screen.getByText('TTC')).toBeInTheDocument();
    expect(screen.queryByText('GO Transit')).not.toBeInTheDocument();
  });

  it('calls onSelect when a system is clicked', () => {
    const onSelect = jest.fn();
    render(<TransitSystemSelector onSelect={onSelect} />);
    fireEvent.click(screen.getByText('TTC'));
    expect(onSelect).toHaveBeenCalledWith('TTC');
  });
});
