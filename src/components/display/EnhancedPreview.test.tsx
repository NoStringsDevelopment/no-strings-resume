
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnhancedPreview } from './EnhancedPreview';

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
    summary: 'Test summary',
    image: '',
    url: '',
    location: {
      address: '',
      postalCode: '',
      city: '',
      countryCode: '',
      region: ''
    },
    profiles: []
  },
  work: [],
  volunteer: [],
  education: [],
  skills: [],
  projects: [],
  awards: [],
  certificates: [],
  publications: [],
  languages: [],
  interests: [],
  references: [],
  sectionVisibility: {
    basics: true,
    work: true,
    volunteer: true,
    education: true,
    skills: true,
    projects: true,
    awards: true,
    certificates: true,
    publications: true,
    languages: true,
    interests: true,
    references: true
  }
};

describe('EnhancedPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders enhanced preview with proper test id', () => {
    render(<EnhancedPreview resumeData={mockResumeData} theme={mockTheme} />);
    
    expect(screen.getByTestId('enhanced-preview')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<EnhancedPreview resumeData={mockResumeData} theme={mockTheme} className="custom-class" />);
    
    const preview = screen.getByTestId('enhanced-preview');
    expect(preview).toHaveClass('enhanced-preview', 'custom-class');
  });

  it('contains fade gradients for overflow indication', () => {
    render(<EnhancedPreview resumeData={mockResumeData} theme={mockTheme} />);
    
    const preview = screen.getByTestId('enhanced-preview');
    const gradients = preview.querySelectorAll('.bg-gradient-to-b, .bg-gradient-to-t');
    
    expect(gradients).toHaveLength(2); // Top and bottom gradients
  });

  it('has proper scrollable container with max height', () => {
    render(<EnhancedPreview resumeData={mockResumeData} theme={mockTheme} />);
    
    const preview = screen.getByTestId('enhanced-preview');
    const scrollContainer = preview.querySelector('.max-h-\\[80vh\\]');
    
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('overflow-y-auto');
  });

  it('applies proper padding to content', () => {
    render(<EnhancedPreview resumeData={mockResumeData} theme={mockTheme} />);
    
    const preview = screen.getByTestId('enhanced-preview');
    const paddedContent = preview.querySelector('.py-8.px-4');
    
    expect(paddedContent).toBeInTheDocument();
  });

  it('renders ResumeRenderer with scaled styling', () => {
    render(<EnhancedPreview resumeData={mockResumeData} theme={mockTheme} />);
    
    const resumeRenderer = screen.getByTestId('resume-renderer');
    expect(resumeRenderer).toBeInTheDocument();
    expect(resumeRenderer).toHaveClass('scale-75', 'origin-top', 'transform-gpu');
  });

  it('passes through resume data and theme to ResumeRenderer', () => {
    render(<EnhancedPreview resumeData={mockResumeData} theme={mockTheme} />);
    
    // Verify that the resume content is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
  });

  it('handles empty resume data gracefully', () => {
    const emptyResumeData = {
      ...mockResumeData,
      basics: {
        ...mockResumeData.basics,
        name: '',
        label: '',
        email: '',
        phone: ''
      }
    };

    render(<EnhancedPreview resumeData={emptyResumeData} theme={mockTheme} />);
    
    expect(screen.getByTestId('enhanced-preview')).toBeInTheDocument();
    expect(screen.getByTestId('resume-renderer')).toBeInTheDocument();
  });
});
