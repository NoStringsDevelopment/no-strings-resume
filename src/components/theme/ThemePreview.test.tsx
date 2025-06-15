
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemePreview } from './ThemePreview';

const mockTheme = {
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
};

const mockResumeData = {
  basics: {
    name: 'John Doe',
    label: 'Software Developer',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    summary: 'Test summary'
  }
};

vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    themeState: {
      currentTheme: mockTheme
    }
  })
}));

vi.mock('@/context/ResumeContext', () => ({
  useResume: () => ({
    state: {
      resumeData: mockResumeData
    }
  })
}));

describe('ThemePreview', () => {
  it('renders preview with theme styles applied', () => {
    render(<ThemePreview />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('+1 234 567 8900')).toBeInTheDocument();
  });

  it('applies correct font family from theme', () => {
    render(<ThemePreview />);
    
    const previewContainer = screen.getByText('John Doe').closest('div');
    expect(previewContainer).toHaveStyle({ fontFamily: 'Inter' });
  });

  it('shows default content when no resume data', () => {
    vi.mocked(require('@/context/ResumeContext').useResume).mockReturnValue({
      state: { resumeData: { basics: {} } }
    });
    
    render(<ThemePreview />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument(); // Default fallback
  });
});
