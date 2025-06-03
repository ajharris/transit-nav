// Polyfill for TextEncoder in Jest environment
import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch';
import '@testing-library/jest-dom';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Polyfill BroadcastChannel for MSW
if (typeof global.BroadcastChannel === 'undefined') {
  global.BroadcastChannel = class {
    constructor() {}
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  };
}
