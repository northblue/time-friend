import '@testing-library/jest-dom';
// Polyfill for TextEncoder and TextDecoder
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add any other setup code here if needed