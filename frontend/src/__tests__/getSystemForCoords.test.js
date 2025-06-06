// Unit test for getSystemForCoords utility in App.jsx
import { describe, it, expect } from '@jest/globals';
import { SUPPORTED_SYSTEMS, getSystemForCoords } from '../App.jsx';

describe('getSystemForCoords', () => {
  it('returns correct system for coordinates inside a region', () => {
    // Use the first supported system as a test
    const sys = SUPPORTED_SYSTEMS[0];
    const result = getSystemForCoords(sys.region.lat, sys.region.lon);
    expect(result).toBe(sys.name);
  });

  it('returns null for coordinates outside all regions', () => {
    // Use coordinates far from any defined region
    const result = getSystemForCoords(0, 0);
    expect(result).toBeNull();
  });
});
