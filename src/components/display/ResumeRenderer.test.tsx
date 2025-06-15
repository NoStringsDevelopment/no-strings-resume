
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
});
