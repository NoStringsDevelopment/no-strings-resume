
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Test component that uses the theme context
const TestComponent = () => {
  const { themeState, setTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme-id">{themeState.currentTheme.id}</div>
      <div data-testid="current-theme-name">{themeState.currentTheme.name}</div>
      <button 
        onClick={() => setTheme({
          ...themeState.currentTheme,
          id: 'custom',
          name: 'Custom Theme'
        })}
        data-testid="change-theme-button"
      >
        Change Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('provides default theme when no saved theme exists', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme-id')).toHaveTextContent('professional');
    expect(screen.getByTestId('current-theme-name')).toHaveTextContent('Professional Blue');
  });

  it('loads saved theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('modern');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme-id')).toHaveTextContent('modern');
    expect(screen.getByTestId('current-theme-name')).toHaveTextContent('Modern Teal');
  });

  it('updates theme and saves to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('change-theme-button'));

    expect(screen.getByTestId('current-theme-id')).toHaveTextContent('custom');
    expect(screen.getByTestId('current-theme-name')).toHaveTextContent('Custom Theme');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nostrings-resume-theme', 'custom');
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
    
    consoleSpy.mockRestore();
  });
});
