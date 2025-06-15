
import { describe, it, expect } from 'vitest';
import { exportResumeAsJson, importResumeData } from './importExport';
import { ResumeData } from '@/types/resume';

describe('importExport utils', () => {
  const mockResumeData: ResumeData = {
    basics: {
      name: 'John Doe',
      label: 'Software Developer',
      email: 'john@example.com',
      phone: '+1234567890',
      url: 'https://johndoe.dev',
      summary: 'Experienced developer',
      location: {
        address: '123 Main St',
        postalCode: '12345',
        city: 'Anytown',
        countryCode: 'US',
        region: 'State'
      },
      profiles: [],
      image: ''
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

  describe('exportResumeAsJson', () => {
    it('should export resume data as JSON string', () => {
      const result = exportResumeAsJson(mockResumeData);
      
      expect(typeof result).toBe('string');
      expect(() => JSON.parse(result)).not.toThrow();
      
      const parsed = JSON.parse(result);
      expect(parsed.basics.name).toBe('John Doe');
      expect(parsed.basics.email).toBe('john@example.com');
    });

    it('should exclude internal visibility flags from export', () => {
      const result = exportResumeAsJson(mockResumeData);
      const parsed = JSON.parse(result);
      
      // Should not include sectionVisibility in export
      expect(parsed.sectionVisibility).toBeUndefined();
      
      // Should not include visible flags on individual items
      if (parsed.work && parsed.work.length > 0) {
        expect(parsed.work[0].visible).toBeUndefined();
      }
    });
  });

  describe('importResumeData', () => {
    it('should successfully import valid JSON Resume data', () => {
      const validJson = JSON.stringify({
        basics: {
          name: 'Jane Smith',
          email: 'jane@example.com'
        },
        work: [
          {
            name: 'Company A',
            position: 'Developer',
            startDate: '2020-01-01'
          }
        ]
      });

      const result = importResumeData(validJson);
      
      expect(result.hasErrors).toBe(false);
      expect(result.resumeData.basics.name).toBe('Jane Smith');
      expect(result.resumeData.work).toHaveLength(1);
      expect(result.validationErrors).toHaveLength(0);
    });

    it('should handle invalid JSON gracefully', () => {
      const invalidJson = '{ invalid json }';
      
      const result = importResumeData(invalidJson);
      
      expect(result.hasErrors).toBe(true);
      expect(result.validationErrors).toHaveLength(1);
      expect(result.validationErrors[0]).toMatch(/JSON|parse|format/i);
      expect(result.resumeData).toBeDefined();
    });

    it('should preserve non-conforming data for manual review', () => {
      const jsonWithExtraFields = JSON.stringify({
        basics: { name: 'Test User' },
        work: [{ 
          name: 'Company',
          position: 'Developer'
        }]
      });

      const result = importResumeData(jsonWithExtraFields);
      
      expect(result.hasErrors).toBe(false);
      expect(result.resumeData.basics.name).toBe('Test User');
      expect(result.resumeData.work).toHaveLength(1);
    });
  });
});
