import { describe, expect, it } from 'vitest';
import { ResumeData } from '@/types/resume';
import { buildResumeExportContent } from './resumeExportContent';

const resumeData: ResumeData = {
  basics: {
    name: 'Alex Example',
    label: 'Platform Engineer',
    image: '',
    email: 'alex@example.com',
    phone: '+1-555-000-1111',
    url: 'https://alex.dev',
    summary: 'Builds resilient developer tooling.',
    location: {
      address: '123 Main St',
      postalCode: '12345',
      city: 'Chicago',
      countryCode: 'US',
      region: 'IL',
    },
    profiles: [
      {
        network: 'GitHub',
        username: 'alex',
        url: 'https://github.com/alex',
        visible: true,
      },
      {
        network: 'Hidden',
        username: 'hidden',
        url: 'https://hidden.example.com',
        visible: false,
      },
    ],
  },
  basicsVisibility: {
    label: true,
    email: true,
    phone: true,
    url: true,
    location: true,
    summary: true,
  },
  work: [
    {
      name: 'Visible Co',
      position: 'Senior Engineer',
      url: 'https://visible.example.com',
      startDate: '2021-01',
      endDate: '',
      summary: 'Built platform features.',
      highlights: [
        { content: 'Visible work highlight', visible: true },
        { content: 'Hidden work highlight', visible: false },
      ],
      visible: true,
    },
  ],
  volunteer: [],
  education: [
    {
      institution: 'State University',
      url: '',
      area: 'Computer Science',
      studyType: 'BS',
      startDate: '2014-09',
      endDate: '2018-05',
      score: '',
      courses: [
        { name: 'Algorithms', visible: true },
        { name: 'Hidden course', visible: false },
      ],
      visible: true,
    },
  ],
  skills: [
    {
      name: 'TypeScript',
      level: 'Advanced',
      keywords: [
        { name: 'React', visible: true },
        { name: 'Hidden keyword', visible: false },
      ],
      visible: true,
    },
  ],
  projects: [
    {
      name: 'Visible Project',
      description: 'A project users can see.',
      highlights: [
        { content: 'Visible project highlight', visible: true },
        { content: 'Hidden project highlight', visible: false },
      ],
      keywords: [
        { name: 'Node.js', visible: true },
        { name: 'Hidden stack', visible: false },
      ],
      startDate: '2022-01',
      endDate: '2022-12',
      url: 'https://project.example.com',
      roles: [
        { name: 'Lead', visible: true },
        { name: 'Hidden role', visible: false },
      ],
      entity: 'Independent',
      type: 'App',
      visible: true,
    },
  ],
  awards: [],
  certificates: [],
  publications: [],
  languages: [],
  interests: [
    {
      name: 'Accessibility',
      keywords: [
        { name: 'WCAG', visible: true },
        { name: 'Hidden interest', visible: false },
      ],
      visible: true,
    },
  ],
  references: [
    {
      name: 'Morgan Ref',
      reference: 'Available on request',
      visible: true,
    },
  ],
  meta: undefined,
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
    references: true,
  },
};

describe('buildResumeExportContent', () => {
  it('keeps only visible content and expands supported sections', () => {
    const content = buildResumeExportContent(resumeData);

    expect(content.header?.profiles).toEqual(['GitHub: alex']);

    const workSection = content.sections.find((section) => section.title === 'Work Experience');
    expect(workSection?.entries[0]?.bullets).toEqual(['Visible work highlight']);

    const educationSection = content.sections.find((section) => section.title === 'Education');
    expect(educationSection?.entries[0]?.details).toContain('Relevant courses: Algorithms');

    const skillsSection = content.sections.find((section) => section.title === 'Skills');
    expect(skillsSection?.entries[0]?.details).toEqual(['React']);

    const projectsSection = content.sections.find((section) => section.title === 'Projects');
    expect(projectsSection?.entries[0]?.details).toEqual([
      'Technologies: Node.js',
      'Roles: Lead',
    ]);
    expect(projectsSection?.entries[0]?.bullets).toEqual(['Visible project highlight']);

    const interestsSection = content.sections.find((section) => section.title === 'Interests');
    expect(interestsSection?.entries[0]?.details).toEqual(['WCAG']);

    const referencesSection = content.sections.find((section) => section.title === 'References');
    expect(referencesSection?.entries[0]?.summary).toBe('Available on request');
  });

  it('omits sections that are hidden or have no visible entries', () => {
    const hiddenResumeData: ResumeData = {
      ...resumeData,
      sectionVisibility: {
        ...resumeData.sectionVisibility,
        work: false,
        interests: false,
      },
      projects: [
        {
          ...resumeData.projects[0],
          visible: false,
        },
      ],
    };

    const content = buildResumeExportContent(hiddenResumeData);

    expect(content.sections.find((section) => section.title === 'Work Experience')).toBeUndefined();
    expect(content.sections.find((section) => section.title === 'Interests')).toBeUndefined();
    expect(content.sections.find((section) => section.title === 'Projects')).toBeUndefined();
  });

  it('respects basics field visibility in the export header', () => {
    const content = buildResumeExportContent({
      ...resumeData,
      basicsVisibility: {
        label: true,
        email: true,
        phone: false,
        url: false,
        location: true,
        summary: false,
      },
    });

    expect(content.header?.contacts).toEqual(['alex@example.com', 'Chicago, IL']);
    expect(content.header?.summary).toBeUndefined();
  });
});
