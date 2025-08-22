import { describe, it, expect } from 'vitest';
import { normalizeResumeData } from './dataHelpers';

describe('dataHelpers - array cleaning', () => {
  it('should clean empty strings from project keywords', () => {
    const input = {
      basics: {
        name: 'Test User',
        label: 'Developer',
        email: 'test@example.com',
        phone: '123-456-7890',
        url: 'https://example.com',
        summary: 'Test summary',
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        }
      },
      projects: [
        {
          name: 'Test Project',
          description: 'Test description',
          keywords: ['React', '', 'TypeScript', '   ', 'Node.js'],
          highlights: ['Built something', '', 'Did another thing']
        }
      ]
    };

    const result = normalizeResumeData(input);
    
    expect(result.projects[0].keywords).toEqual(['React', 'TypeScript', 'Node.js']);
    expect(result.projects[0].highlights).toEqual(['Built something', 'Did another thing']);
  });

  it('should clean empty objects from work highlights', () => {
    const input = {
      basics: {
        name: 'Test User',
        label: 'Developer',
        email: 'test@example.com',
        phone: '123-456-7890',
        url: 'https://example.com',
        summary: 'Test summary',
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        }
      },
      work: [
        {
          name: 'Test Company',
          position: 'Developer',
          highlights: [
            'Did something',
            {},
            { name: '', visible: true },
            { name: 'Valid highlight', visible: true },
            ''
          ]
        }
      ]
    };

    const result = normalizeResumeData(input);
    
    expect(result.work[0].highlights).toEqual([
      'Did something',
      { name: 'Valid highlight', visible: true }
    ]);
  });

  it('should clean skills keywords', () => {
    const input = {
      basics: {
        name: 'Test User',
        label: 'Developer',
        email: 'test@example.com',
        phone: '123-456-7890',
        url: 'https://example.com',
        summary: 'Test summary',
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        }
      },
      skills: [
        {
          name: 'Frontend',
          level: 'Expert',
          keywords: ['React', '', {}, { name: '' }, 'TypeScript']
        }
      ]
    };

    const result = normalizeResumeData(input);
    
    expect(result.skills[0].keywords).toEqual(['React', 'TypeScript']);
  });

  it('should handle the problematic data from the issue', () => {
    const input = {
      basics: {
        name: 'John Lee',
        label: 'Founder at Python AI Solutions',
        email: 'test@example.com',
        phone: '123-456-7890',
        url: 'https://example.com',
        summary: 'Test summary',
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        }
      },
      work: [
        {
          name: 'Python AI Solutions Ltd.',
          position: 'Director',
          highlights: [
            'Built pipelines for extracting scientific transparency metrics from public sources.',
            'Contributed improvements to PyTorch-Ignite for distributed training of neural networks.',
            'Web applications with modern tooling: TailwindCSS, React etc.',
            '',  // This empty string was causing [object Object]
            {}   // Or this empty object
          ]
        }
      ],
      projects: [
        {
          name: 'Agentic conversion to NWB',
          description: 'Led the design and implementation',
          highlights: [''],
          keywords: ['']  // This empty string was causing [object Object]
        }
      ]
    };

    const result = normalizeResumeData(input);
    
    // Should have cleaned up the work highlights
    expect(result.work[0].highlights).toEqual([
      'Built pipelines for extracting scientific transparency metrics from public sources.',
      'Contributed improvements to PyTorch-Ignite for distributed training of neural networks.',
      'Web applications with modern tooling: TailwindCSS, React etc.'
    ]);
    
    // Should have cleaned up the project keywords
    expect(result.projects[0].keywords).toEqual([]);
    expect(result.projects[0].highlights).toEqual([]);
  });
});