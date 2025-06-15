import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Suppress non-critical warnings to clean up test output
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (
    typeof args[0] === 'string' && (
      // Suppress React act() warnings for RadixUI components
      (args[0].includes('Warning: An update to') && args[0].includes('was not wrapped in act')) ||
      // Suppress RadixUI internal warnings
      args[0].includes('Warning: An update to Select') ||
      args[0].includes('Warning: An update to SelectItemText')
    )
  ) {
    return; // Suppress these specific warnings
  }
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  if (
    typeof args[0] === 'string' && (
      // Suppress RadixUI warnings
      args[0].includes('Radix') ||
      args[0].includes('react-select')
    )
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.innerWidth for mobile detection
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock fetch for ResumeContext
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({}),
  })
); 