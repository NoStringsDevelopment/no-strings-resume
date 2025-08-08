
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResumeRenderer } from './ResumeRenderer';
import { ResumeData, Theme } from '@/types/resume';

const mockTheme: Theme = {
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

const mockResumeData: ResumeData = {
  basics: {
    name: 'John Doe',
    label: 'Software Engineer',
    email: 'john@example.com',
    phone: '555-1234',
    url: 'https://johndoe.com',
    summary: 'Experienced software engineer with a passion for building great products.',
    image: '',
    location: {
      address: '123 Main St',
      city: 'San Francisco',
      region: 'CA',
      postalCode: '94102',
      countryCode: 'US'
    },
    profiles: [
      { network: 'LinkedIn', username: 'johndoe', url: 'https://linkedin.com/in/johndoe', visible: true }
    ]
  },
  work: [
    {
      name: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: '2020-01',
      endDate: '2023-12',
      summary: 'Led development of web applications',
      highlights: ['Built scalable APIs', 'Mentored junior developers'],
      url: 'https://techcorp.com',
      location: 'San Francisco, CA',
      description: 'Technology company',
      visible: true
    }
  ],
  education: [
    {
      institution: 'University of California',
      area: 'Computer Science',
      studyType: 'Bachelor',
      startDate: '2016-09',
      endDate: '2020-05',
      score: '3.8',
      url: 'https://uc.edu',
      courses: ['Data Structures', 'Algorithms'],
      visible: true
    }
  ],
  skills: [
    {
      name: 'JavaScript',
      level: 'Expert',
      keywords: ['React', 'Node.js', 'TypeScript'],
      visible: true
    }
  ],
  projects: [],
  awards: [],
  certificates: [],
  publications: [],
  languages: [],
  interests: [],
  references: [],
  volunteer: [],
  sectionVisibility: {
    basics: true,
    work: true,
    education: true,
    skills: true,
    projects: true,
    awards: true,
    certificates: true,
    publications: true,
    languages: true,
    interests: true,
    references: true,
    volunteer: true
  }
};

describe('ResumeRenderer', () => {
  it('renders resume with basic information', () => {
    render(<ResumeRenderer resumeData={mockResumeData} theme={mockTheme} />);

    expect(screen.getByTestId('resume-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('resume-label')).toHaveTextContent('Software Engineer');
    expect(screen.getByTestId('resume-email')).toHaveTextContent('john@example.com');
    expect(screen.getByTestId('resume-phone')).toHaveTextContent('555-1234');
    expect(screen.getByTestId('resume-summary')).toHaveTextContent('Experienced software engineer');
  });

  it('renders work experience section', () => {
    render(<ResumeRenderer resumeData={mockResumeData} theme={mockTheme} />);

    expect(screen.getByTestId('resume-work-section')).toBeInTheDocument();
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
  });

  it('renders education section', () => {
    render(<ResumeRenderer resumeData={mockResumeData} theme={mockTheme} />);

    expect(screen.getByTestId('resume-education-section')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Bachelor in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('University of California')).toBeInTheDocument();
  });

  it('renders skills section', () => {
    render(<ResumeRenderer resumeData={mockResumeData} theme={mockTheme} />);

    expect(screen.getByTestId('resume-skills-section')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('JavaScript (Expert)')).toBeInTheDocument();
    expect(screen.getByText('React, Node.js, TypeScript')).toBeInTheDocument();
  });

  it('hides sections when visibility is false', () => {
    const hiddenWorkData = {
      ...mockResumeData,
      sectionVisibility: {
        ...mockResumeData.sectionVisibility,
        work: false
      }
    };

    render(<ResumeRenderer resumeData={hiddenWorkData} theme={mockTheme} />);

    expect(screen.queryByTestId('resume-work-section')).not.toBeInTheDocument();
    expect(screen.queryByText('Work Experience')).not.toBeInTheDocument();
  });

  it('applies theme styles', () => {
    render(<ResumeRenderer resumeData={mockResumeData} theme={mockTheme} />);

    const nameElement = screen.getByTestId('resume-name');
    expect(nameElement).toHaveStyle({ fontFamily: 'var(--font-heading)' });
  });

  describe('Icon Positioning', () => {
    it('should position icon at specified top and right distances', () => {
      const resumeWithIcon: ResumeData = {
        ...mockResumeData,
        icon: {
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPjwvc3ZnPg==',
          position: { top: 30, right: 40 },
          size: 60
        }
      };

      const { container } = render(
        <ResumeRenderer resumeData={resumeWithIcon} theme={mockTheme} />
      );

      const iconElement = container.querySelector('img.absolute');
      expect(iconElement).toBeTruthy();
      
      if (iconElement) {
        const style = (iconElement as HTMLElement).style;
        expect(style.top).toBe('30px');
        expect(style.right).toBe('40px');
      }
    });

    it('should maintain top-right anchor point when size changes', () => {
      const resumeWithIcon: ResumeData = {
        ...mockResumeData,
        icon: {
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPjwvc3ZnPg==',
          position: { top: 20, right: 20 },
          size: 60
        }
      };

      const { container, rerender } = render(
        <ResumeRenderer resumeData={resumeWithIcon} theme={mockTheme} />
      );

      let iconElement = container.querySelector('img.absolute') as HTMLElement;
      
      // Check initial position and size
      expect(iconElement.style.top).toBe('20px');
      expect(iconElement.style.right).toBe('20px');
      expect(iconElement.style.width).toBe('60px');
      expect(iconElement.style.height).toBe('60px');

      // Change size but keep position
      const updatedResume = {
        ...resumeWithIcon,
        icon: {
          ...resumeWithIcon.icon!,
          size: 120
        }
      };

      rerender(<ResumeRenderer resumeData={updatedResume} theme={mockTheme} />);
      
      iconElement = container.querySelector('img.absolute') as HTMLElement;
      
      // Position should remain the same (top-right corner stays fixed)
      expect(iconElement.style.top).toBe('20px');
      expect(iconElement.style.right).toBe('20px');
      // Size should update (maintains aspect ratio)
      expect(iconElement.style.width).toBe('120px');
      expect(iconElement.style.height).toBe('120px');
    });

    it('should render icon with correct size', () => {
      const resumeWithIcon: ResumeData = {
        ...mockResumeData,
        icon: {
          data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiPjwvc3ZnPg==',
          position: { top: 10, right: 10 },
          size: 80
        }
      };

      const { container } = render(
        <ResumeRenderer resumeData={resumeWithIcon} theme={mockTheme} />
      );

      const iconElement = container.querySelector('img.absolute') as HTMLElement;
      
      expect(iconElement.style.width).toBe('80px');
      expect(iconElement.style.height).toBe('80px');
    });

    it('should not render icon when icon data is not provided', () => {
      const { container } = render(
        <ResumeRenderer resumeData={mockResumeData} theme={mockTheme} />
      );

      const iconElement = container.querySelector('img.absolute');
      expect(iconElement).toBeNull();
    });
  });
});
