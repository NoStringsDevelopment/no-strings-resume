
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeCustomizer } from './ThemeCustomizer';

// Mock the useTheme hook
const mockSetTheme = vi.fn();
const mockThemeState = {
  currentTheme: {
    id: 'test',
    name: 'Test Theme',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#0ea5e9',
      text: '#1e293b',
      textSecondary: '#64748b',
      background: '#ffffff',
      border: '#e2e8f0'
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: 1.5
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    spacing: {
      section: '2rem',
      item: '1rem'
    }
  },
  availableThemes: [
    {
      id: 'professional',
      name: 'Professional Blue',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9',
        text: '#1e293b',
        textSecondary: '#64748b',
        background: '#ffffff',
        border: '#e2e8f0'
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        section: '2rem',
        item: '1rem'
      }
    }
  ]
};

vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    themeState: mockThemeState,
    setTheme: mockSetTheme
  })
}));

describe('ThemeCustomizer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders color customization section', () => {
    render(<ThemeCustomizer />);
    
    expect(screen.getByText('Colors')).toBeInTheDocument();
    expect(screen.getByText('Primary Color')).toBeInTheDocument();
    expect(screen.getByText('Secondary Color')).toBeInTheDocument();
    expect(screen.getByText('Accent Color')).toBeInTheDocument();
    expect(screen.getByText('Text Color')).toBeInTheDocument();
  });

  it('renders typography customization section', () => {
    render(<ThemeCustomizer />);
    
    expect(screen.getByText('Typography')).toBeInTheDocument();
    expect(screen.getByText('Font Family')).toBeInTheDocument();
    expect(screen.getByText('Base Font Size')).toBeInTheDocument();
    expect(screen.getByText('Line Height')).toBeInTheDocument();
  });

  it('renders layout customization section', () => {
    render(<ThemeCustomizer />);
    
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Section Spacing')).toBeInTheDocument();
    expect(screen.getByText('Item Spacing')).toBeInTheDocument();
  });

  it('updates primary color when color picker changes', () => {
    render(<ThemeCustomizer />);
    
    const colorInputs = screen.getAllByDisplayValue('#2563eb');
    const primaryColorInput = colorInputs[0];
    
    fireEvent.change(primaryColorInput, { target: { value: '#ff0000' } });
    
    expect(mockSetTheme).toHaveBeenCalledWith({
      ...mockThemeState.currentTheme,
      colors: {
        ...mockThemeState.currentTheme.colors,
        primary: '#ff0000'
      }
    });
  });

  it('updates font size when slider changes', () => {
    render(<ThemeCustomizer />);
    
    // Find the font size slider (it should have a value of 14)
    const sliders = screen.getAllByRole('slider');
    const fontSizeSlider = sliders.find(slider => 
      slider.getAttribute('aria-valuenow') === '14'
    );
    
    expect(fontSizeSlider).toBeInTheDocument();
    
    fireEvent.change(fontSizeSlider!, { target: { value: '16' } });
    
    expect(mockSetTheme).toHaveBeenCalledWith({
      ...mockThemeState.currentTheme,
      typography: {
        ...mockThemeState.currentTheme.typography,
        fontSize: 16
      }
    });
  });

  it('updates section spacing when layout option changes', () => {
    render(<ThemeCustomizer />);
    
    // Find the section spacing select
    const sectionSpacingSelect = screen.getByDisplayValue('Spacious (2rem)');
    
    fireEvent.click(sectionSpacingSelect);
    
    // Wait for the dropdown to appear and select compact option
    const compactOption = screen.getByText('Compact (1rem)');
    fireEvent.click(compactOption);
    
    expect(mockSetTheme).toHaveBeenCalledWith({
      ...mockThemeState.currentTheme,
      spacing: {
        ...mockThemeState.currentTheme.spacing,
        section: '1rem'
      }
    });
  });

  it('renders preset themes section', () => {
    render(<ThemeCustomizer />);
    
    expect(screen.getByText('Preset Themes')).toBeInTheDocument();
    expect(screen.getByText('Professional Blue')).toBeInTheDocument();
  });

  it('renders reset button', () => {
    render(<ThemeCustomizer />);
    
    expect(screen.getByText('Reset to Default Theme')).toBeInTheDocument();
  });
});
