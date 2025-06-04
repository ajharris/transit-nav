// src/__tests__/LocationDetector.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import LocationDetector from '../LocationDetector.jsx';

describe('LocationDetector', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls onDetect with coords on success', async () => {
    const onDetect = jest.fn();
    global.navigator.geolocation = {
      getCurrentPosition: (success) => success({ coords: { latitude: 1, longitude: 2 } })
    };
    render(<LocationDetector onDetect={onDetect} />);
    await waitFor(() => expect(onDetect).toHaveBeenCalledWith(1, 2));
  });

  it('calls onError on failure', async () => {
    const onError = jest.fn();
    global.navigator.geolocation = {
      getCurrentPosition: (success, error) => error({ message: 'fail' })
    };
    render(<LocationDetector onError={onError} />);
    await waitFor(() => expect(onError).toHaveBeenCalled());
  });
});
