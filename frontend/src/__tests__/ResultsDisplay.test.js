import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultsDisplay from '../ResultsDisplay';

describe('ResultsDisplay', () => {
  it('shows empty state when no result', () => {
    render(<ResultsDisplay result={null} />);
    expect(screen.getByTestId('results-empty')).toBeInTheDocument();
  });

  it('shows optimal car location for single car', () => {
    render(
      <ResultsDisplay result={{ car: 2, notes: 'Board car 2', explanation: 'Use car 2' }} />
    );
    // Only the <b> tag inside the recommended car span should have this text
    const carBold = screen.getByText('2', { selector: 'b' });
    expect(carBold).toBeInTheDocument();
    expect(screen.getByText(/Board car 2/)).toBeInTheDocument();
    expect(screen.getByText(/Use car 2/)).toBeInTheDocument();
  });

  it('updates when result changes', () => {
    const { rerender } = render(
      <ResultsDisplay result={{ car: 2, notes: 'Board car 2', explanation: 'Use car 2' }} />
    );
    expect(screen.getByText('2', { selector: 'b' })).toBeInTheDocument();
    rerender(
      <ResultsDisplay result={{ car: 4, notes: 'Board car 4', explanation: 'Use car 4' }} />
    );
    expect(screen.getByText('4', { selector: 'b' })).toBeInTheDocument();
    expect(screen.getByText(/Board car 4/)).toBeInTheDocument();
    expect(screen.getByText(/Use car 4/)).toBeInTheDocument();
  });

  it('formats output in a user-friendly way (multiple cars)', () => {
    const result = {
      car: [2, 3],
      notes: 'Either car 2 or 3 is optimal.',
      explanation: 'Use car 2 or 3.'
    };
    render(<ResultsDisplay result={result} />);
    // Only the <b> tag should have '2 or 3'
    expect(screen.getByText('2 or 3', { selector: 'b' })).toBeInTheDocument();
    expect(screen.getByText(/Either car 2 or 3/)).toBeInTheDocument();
    expect(screen.getByText(/Use car 2 or 3/)).toBeInTheDocument();
  });
});
