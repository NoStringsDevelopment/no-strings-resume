import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResumeData } from '@/types/resume';
import { 
  convertToExtendedFormat, 
  convertFromExtendedFormat, 
  exportAsBackup,
  importFromBackup,
  BackupImportResult 
} from './backupUtils';
import { 
  validateExtendedResumeData, 
  isExtendedResumeFormat,
  EXTENDED_RESUME_SCHEMA_VERSION 
} from '@/schemas/extendedResume';
import * as importExportUtils from './importExport';

// Mock the downloadFile function
vi.mock('./importExport', () => ({
  downloadFile: vi.fn()
}));

describe('backupUtils', () => {
  let mockResumeData: ResumeData;

  beforeEach(() => {
    // Create comprehensive test data with all visibility scenarios
    mockResumeData = {
      basics: {
        name: "John Doe",
        label: "Software Engineer",
        image: "",
        email: "john@example.com",
        phone: "+1-555-0123",
        url: "https://johndoe.dev",
        summary: "Experienced software engineer",
        location: {
          address: "123 Main St",
          postalCode: "12345",
          city: "San Francisco",
          countryCode: "US",
          region: "CA"
        },
        profiles: [
          { network: "GitHub", username: "johndoe", url: "https://github.com/johndoe", visible: true },
          { network: "LinkedIn", username: "johndoe", url: "https://linkedin.com/in/johndoe", visible: false }
        ]
      },
      work: [
        {
          name: "Tech Corp",
          position: "Senior Engineer",
          location: "San Francisco, CA",
          description: "Leading tech company",
          url: "https://techcorp.com",
          startDate: "2020-01-01",
          endDate: "2023-12-31",
          summary: "Led development teams",
          highlights: [
            { content: "Built scalable systems", visible: true },
            { content: "Mentored junior developers", visible: false },
            { content: "Improved performance by 50%", visible: true }
          ],
          visible: true
        },
        {
          name: "Startup Inc",
          position: "Full Stack Developer",
          url: "https://startup.com",
          startDate: "2018-06-01",
          endDate: "2019-12-31",
          summary: "Full stack development",
          highlights: [
            { content: "Built MVP from scratch", visible: true }
          ],
          visible: false
        }
      ],
      volunteer: [
        {
          organization: "Code for Good",
          position: "Volunteer Developer",
          url: "https://codeforgood.org",
          startDate: "2019-01-01",
          endDate: "2020-01-01",
          summary: "Volunteered for non-profits",
          highlights: [
            { content: "Built website for local charity", visible: true },
            { content: "Organized coding workshops", visible: false }
          ],
          visible: true
        }
      ],
      education: [
        {
          institution: "State University",
          url: "https://state.edu",
          area: "Computer Science",
          studyType: "Bachelor",
          startDate: "2014-09-01",
          endDate: "2018-05-01",
          score: "3.8 GPA",
          courses: [
            { name: "Data Structures", visible: true },
            { name: "Algorithms", visible: true },
            { name: "Database Systems", visible: false }
          ],
          visible: true
        }
      ],
      skills: [
        {
          name: "Programming Languages",
          level: "Expert",
          keywords: [
            { name: "JavaScript", visible: true },
            { name: "TypeScript", visible: true },
            { name: "Python", visible: false }
          ],
          visible: true
        },
        {
          name: "Frameworks",
          level: "Advanced",
          keywords: [
            { name: "React", visible: true },
            { name: "Node.js", visible: true }
          ],
          visible: false
        }
      ],
      projects: [
        {
          name: "Resume Builder",
          description: "A modern resume builder app",
          highlights: [
            { content: "Built with React and TypeScript", visible: true },
            { content: "Implemented PDF export", visible: false }
          ],
          keywords: [
            { name: "React", visible: true },
            { name: "TypeScript", visible: true },
            { name: "PDF", visible: false }
          ],
          startDate: "2023-01-01",
          endDate: "2023-12-31",
          url: "https://github.com/johndoe/resume-builder",
          roles: [
            { name: "Lead Developer", visible: true },
            { name: "UI Designer", visible: false }
          ],
          entity: "Personal Project",
          type: "Web Application",
          visible: true
        }
      ],
      awards: [
        {
          title: "Employee of the Year",
          date: "2022-12-01",
          awarder: "Tech Corp",
          summary: "Recognized for outstanding performance",
          visible: true
        },
        {
          title: "Innovation Award",
          date: "2021-06-01",
          awarder: "Tech Corp",
          summary: "For innovative project solution",
          visible: false
        }
      ],
      certificates: [
        {
          name: "AWS Certified Developer",
          date: "2023-03-01",
          issuer: "Amazon Web Services",
          url: "https://aws.amazon.com/certification",
          visible: true
        }
      ],
      publications: [
        {
          name: "Modern Web Development",
          publisher: "Tech Magazine",
          releaseDate: "2023-06-01",
          url: "https://techmagazine.com/article",
          summary: "Article about modern web practices",
          visible: true
        }
      ],
      languages: [
        {
          language: "English",
          fluency: "Native",
          visible: true
        },
        {
          language: "Spanish",
          fluency: "Conversational",
          visible: false
        }
      ],
      interests: [
        {
          name: "Technology",
          keywords: [
            { name: "Machine Learning", visible: true },
            { name: "Blockchain", visible: false }
          ],
          visible: true
        }
      ],
      references: [
        {
          name: "Jane Smith",
          reference: "John is an excellent developer",
          visible: true
        }
      ],
      sectionVisibility: {
        basics: true,
        work: true,
        volunteer: false,
        education: true,
        skills: true,
        projects: true,
        awards: false,
        certificates: true,
        publications: true,
        languages: false,
        interests: true,
        references: true
      },
      nonConformingData: {
        rawText: "some raw data",
        parsingErrors: ["Minor parsing issue"],
        originalData: { someField: "someValue" }
      }
    };
  });

  describe('convertToExtendedFormat', () => {
    it('should convert resume data to extended format', () => {
      const result = convertToExtendedFormat(mockResumeData);

      // Check basic structure
      expect(result).toHaveProperty('$schema');
      expect(result).toHaveProperty('$extensions');
      expect(result.$extensions.$schemaVersion).toBe(EXTENDED_RESUME_SCHEMA_VERSION);

      // Check that JSON Resume data is clean (no visibility properties)
      expect(result.basics.profiles[0]).not.toHaveProperty('visible');
      expect(result.work[0]).not.toHaveProperty('visible');
      expect(result.work[0].highlights).toEqual([
        "Built scalable systems",
        "Mentored junior developers", 
        "Improved performance by 50%"
      ]);

      // Check that visibility data is extracted to extensions
      expect(result.$extensions.visibility.sections).toEqual(mockResumeData.sectionVisibility);
      expect(result.$extensions.visibility.items.profiles).toEqual([true, false]);
      expect(result.$extensions.visibility.items.work).toEqual([true, false]);
      expect(result.$extensions.visibility.subItems.work?.[0]?.highlights).toEqual([true, false, true]);

      // Check education courses
      expect(result.education[0].courses).toEqual(["Data Structures", "Algorithms", "Database Systems"]);
      expect(result.$extensions.visibility.subItems.education?.[0]?.courses).toEqual([true, true, false]);

      // Check skills keywords
      expect(result.skills[0].keywords).toEqual(["JavaScript", "TypeScript", "Python"]);
      expect(result.$extensions.visibility.subItems.skills?.[0]?.keywords).toEqual([true, true, false]);

      // Check projects
      expect(result.$extensions.visibility.subItems.projects?.[0]?.highlights).toEqual([true, false]);
      expect(result.$extensions.visibility.subItems.projects?.[0]?.keywords).toEqual([true, true, false]);
      expect(result.$extensions.visibility.subItems.projects?.[0]?.roles).toEqual([true, false]);

      // Check metadata
      expect(result.$extensions.backup.format).toBe("extended");
      expect(result.$extensions.backup.preservesVisibility).toBe(true);
      expect(result.$extensions.nonConforming).toEqual(mockResumeData.nonConformingData);
    });

    it('should handle empty arrays gracefully', () => {
      const emptyResumeData: ResumeData = {
        ...mockResumeData,
        work: [],
        education: [],
        skills: [],
        projects: []
      };

      const result = convertToExtendedFormat(emptyResumeData);
      
      expect(result.$extensions.visibility.items.work).toBeUndefined();
      expect(result.$extensions.visibility.subItems.work).toBeUndefined();
      expect(result.work).toEqual([]);
    });
  });

  describe('convertFromExtendedFormat', () => {
    it('should convert extended format back to resume data', () => {
      // First convert to extended format
      const extendedData = convertToExtendedFormat(mockResumeData);
      
      // Then convert back
      const result = convertFromExtendedFormat(extendedData);

      // Check that visibility is restored
      expect(result.basics.profiles[0].visible).toBe(true);
      expect(result.basics.profiles[1].visible).toBe(false);
      expect(result.work[0].visible).toBe(true);
      expect(result.work[1].visible).toBe(false);
      
      // Check highlights visibility
      expect(result.work[0].highlights[0]).toEqual({ content: "Built scalable systems", visible: true });
      expect(result.work[0].highlights[1]).toEqual({ content: "Mentored junior developers", visible: false });
      expect(result.work[0].highlights[2]).toEqual({ content: "Improved performance by 50%", visible: true });

      // Check courses visibility
      expect(result.education[0].courses[0]).toEqual({ name: "Data Structures", visible: true });
      expect(result.education[0].courses[1]).toEqual({ name: "Algorithms", visible: true });
      expect(result.education[0].courses[2]).toEqual({ name: "Database Systems", visible: false });

      // Check section visibility
      expect(result.sectionVisibility).toEqual(mockResumeData.sectionVisibility);
      
      // Check non-conforming data
      expect(result.nonConformingData).toEqual(mockResumeData.nonConformingData);
    });

    it('should use defaults when visibility data is missing', () => {
      const extendedData = convertToExtendedFormat(mockResumeData);
      
      // Remove some visibility data
      delete extendedData.$extensions.visibility.items.work;
      delete extendedData.$extensions.visibility.subItems.work;

      const result = convertFromExtendedFormat(extendedData);

      // Should default to visible
      expect(result.work[0].visible).toBe(true);
      expect(result.work[1].visible).toBe(true);
      expect(result.work[0].highlights[0]).toEqual({ content: "Built scalable systems", visible: true });
    });
  });

  describe('round-trip fidelity', () => {
    it('should maintain data integrity through backup and restore cycle', () => {
      // Convert to extended format and back
      const extendedData = convertToExtendedFormat(mockResumeData);
      const restoredData = convertFromExtendedFormat(extendedData);

      // Should be identical to original (modulo any cleanup/normalization)
      expect(restoredData.basics.name).toBe(mockResumeData.basics.name);
      expect(restoredData.work.length).toBe(mockResumeData.work.length);
      expect(restoredData.sectionVisibility).toEqual(mockResumeData.sectionVisibility);
      
      // Verify specific visibility preservation
      expect(restoredData.basics.profiles[1].visible).toBe(false);
      expect(restoredData.work[1].visible).toBe(false);
      expect(restoredData.skills[1].visible).toBe(false);
    });
  });

  describe('exportAsBackup', () => {
    it('should call downloadFile with correct parameters', () => {
      const mockDownloadFile = vi.mocked(importExportUtils.downloadFile);
      
      exportAsBackup(mockResumeData);

      expect(mockDownloadFile).toHaveBeenCalledOnce();
      const [content, filename, mimeType] = mockDownloadFile.mock.calls[0];
      
      expect(filename).toMatch(/^[\w-]+-resume-backup-\d{4}-\d{2}-\d{2}-\d{6}\.json$/);
      expect(mimeType).toBe('application/json');
      
      // Verify content is valid JSON and extended format
      const parsedContent = JSON.parse(content);
      expect(parsedContent).toHaveProperty('$extensions');
      expect(parsedContent.$extensions.$schemaVersion).toBe(EXTENDED_RESUME_SCHEMA_VERSION);
    });
  });

  describe('importFromBackup', () => {
    it('should successfully import valid backup data', () => {
      const extendedData = convertToExtendedFormat(mockResumeData);
      const jsonString = JSON.stringify(extendedData, null, 2);

      const result = importFromBackup(jsonString);

      expect(result.isValid).toBe(true);
      expect(result.isExtended).toBe(true);
      expect(result.schemaVersion).toBe(EXTENDED_RESUME_SCHEMA_VERSION);
      expect(result.errors).toEqual([]);
      expect(result.resumeData).toBeTruthy();
      
      if (result.resumeData) {
        expect(result.resumeData.basics.name).toBe(mockResumeData.basics.name);
        expect(result.resumeData.sectionVisibility).toEqual(mockResumeData.sectionVisibility);
      }
    });

    it('should reject invalid backup data', () => {
      const invalidData = {
        $extensions: {
          $schemaVersion: "999.0.0", // unsupported version
          visibility: {},
          backup: {}
        }
      };
      const jsonString = JSON.stringify(invalidData);

      const result = importFromBackup(jsonString);

      expect(result.isValid).toBe(false);
      expect(result.isExtended).toBe(true);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.resumeData).toBeNull();
    });

    it('should reject non-backup files', () => {
      const regularResumeData = {
        basics: { name: "John Doe" },
        work: [],
        education: []
      };
      const jsonString = JSON.stringify(regularResumeData);

      const result = importFromBackup(jsonString);

      expect(result.isExtended).toBe(false);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(['Not a backup file - use regular import for JSON Resume or HR-Open formats']);
    });

    it('should handle malformed JSON', () => {
      const result = importFromBackup('invalid json');

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      // Check for common JSON parsing error patterns that occur across different environments
      expect(result.errors[0]).toMatch(/Unexpected token|Invalid JSON|not valid JSON|JSON/i);
    });
  });

  describe('schema validation', () => {
    it('should validate correct extended resume data', () => {
      const extendedData = convertToExtendedFormat(mockResumeData);
      const result = validateExtendedResumeData(extendedData);

      expect(result.isValid).toBe(true);
      expect(result.isSupported).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.schemaVersion).toBe(EXTENDED_RESUME_SCHEMA_VERSION);
    });

    it('should detect extended resume format', () => {
      const extendedData = convertToExtendedFormat(mockResumeData);
      expect(isExtendedResumeFormat(extendedData)).toBe(true);

      const regularData = { basics: { name: "John" } };
      expect(isExtendedResumeFormat(regularData)).toBe(false);
    });
  });
}); 