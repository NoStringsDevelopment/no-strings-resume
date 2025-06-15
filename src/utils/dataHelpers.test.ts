import { normalizeResumeData, validateResumeData, normalizeStoredData } from './dataHelpers';
import { ResumeData } from '@/types/resume';

describe('dataHelpers', () => {
  describe('validateResumeData', () => {
    it('should validate correct resume data structure', () => {
      const validData = {
        basics: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        work: [],
        education: []
      };

      const result = validateResumeData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject data without basics section', () => {
      const invalidData = {
        work: [],
        education: []
      };

      const result = validateResumeData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('basics section is required and must be an object');
    });

    it('should reject data with non-array fields', () => {
      const invalidData = {
        basics: { name: 'John' },
        work: 'not an array',
        education: []
      };

      const result = validateResumeData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('work must be an array if present');
    });

    it('should reject null or non-object data', () => {
      const result1 = validateResumeData(null);
      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain('Resume data must be an object');

      const result2 = validateResumeData('string');
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toContain('Resume data must be an object');
    });
  });

  describe('normalizeResumeData', () => {
    it('should add missing sectionVisibility with defaults', () => {
      const inputData = {
        basics: { name: 'John Doe' }
      };

      const result = normalizeResumeData(inputData);
      
      expect(result.sectionVisibility).toBeDefined();
      expect(result.sectionVisibility.basics).toBe(true);
      expect(result.sectionVisibility.work).toBe(true);
      expect(result.sectionVisibility.education).toBe(true);
      expect(result.sectionVisibility.skills).toBe(true);
    });

    it('should preserve existing sectionVisibility settings', () => {
      const inputData = {
        basics: { name: 'John Doe' },
        sectionVisibility: {
          basics: true,
          work: false,
          education: true
        }
      };

      const result = normalizeResumeData(inputData);
      
      expect(result.sectionVisibility.basics).toBe(true);
      expect(result.sectionVisibility.work).toBe(false);
      expect(result.sectionVisibility.education).toBe(true);
      expect(result.sectionVisibility.skills).toBe(true); // filled in with default
    });

    it('should add visible:true to items missing the property', () => {
      const inputData = {
        basics: { name: 'John Doe' },
        work: [
          { name: 'Company A', position: 'Developer' },
          { name: 'Company B', position: 'Manager', visible: false }
        ],
        education: [
          { institution: 'University A' }
        ]
      };

      const result = normalizeResumeData(inputData);
      
      expect(result.work[0].visible).toBe(true);
      expect(result.work[1].visible).toBe(false);
      expect(result.education[0].visible).toBe(true);
    });

    it('should ensure all required arrays exist', () => {
      const inputData = {
        basics: { name: 'John Doe' },
        work: [{ name: 'Company A' }]
        // missing other arrays
      };

      const result = normalizeResumeData(inputData);
      
      expect(Array.isArray(result.work)).toBe(true);
      expect(Array.isArray(result.education)).toBe(true);
      expect(Array.isArray(result.skills)).toBe(true);
      expect(Array.isArray(result.projects)).toBe(true);
      expect(Array.isArray(result.awards)).toBe(true);
      expect(Array.isArray(result.certificates)).toBe(true);
      expect(Array.isArray(result.publications)).toBe(true);
      expect(Array.isArray(result.languages)).toBe(true);
      expect(Array.isArray(result.interests)).toBe(true);
      expect(Array.isArray(result.references)).toBe(true);
      expect(Array.isArray(result.volunteer)).toBe(true);
      
      expect(result.work).toHaveLength(1);
      expect(result.education).toHaveLength(0);
    });

    it('should ensure basics object exists with all required properties', () => {
      const inputData = {
        basics: {
          name: 'John Doe'
          // missing other properties
        }
      };

      const result = normalizeResumeData(inputData);
      
      expect(result.basics.name).toBe('John Doe');
      expect(result.basics.email).toBe('');
      expect(result.basics.phone).toBe('');
      expect(result.basics.url).toBe('');
      expect(result.basics.summary).toBe('');
      expect(result.basics.label).toBe('');
      expect(result.basics.image).toBe('');
      expect(result.basics.location).toBeDefined();
      expect(result.basics.location.city).toBe('');
      expect(result.basics.location.region).toBe('');
      expect(Array.isArray(result.basics.profiles)).toBe(true);
    });

    it('should handle missing basics entirely', () => {
      const inputData = {
        work: [{ name: 'Company A' }]
      };

      const result = normalizeResumeData(inputData);
      
      expect(result.basics).toBeDefined();
      expect(result.basics.name).toBe('');
      expect(result.basics.location).toBeDefined();
      expect(Array.isArray(result.basics.profiles)).toBe(true);
    });

    it('should add visible property to profiles', () => {
      const inputData = {
        basics: {
          name: 'John Doe',
          profiles: [
            { network: 'LinkedIn', username: 'john' },
            { network: 'GitHub', username: 'john', visible: false }
          ]
        }
      };

      const result = normalizeResumeData(inputData);
      
      expect(result.basics.profiles[0].visible).toBe(true);
      expect(result.basics.profiles[1].visible).toBe(false);
    });

    it('should preserve non-conforming data and meta', () => {
      const inputData = {
        basics: { name: 'John Doe' },
        nonConformingData: { errors: ['some error'] },
        meta: { version: '1.0' }
      };

      const result = normalizeResumeData(inputData);
      
      expect(result.nonConformingData).toEqual({ errors: ['some error'] });
      expect(result.meta).toEqual({ version: '1.0' });
    });

    it('should throw error for invalid input', () => {
      expect(() => normalizeResumeData(null)).toThrow('Invalid resume data: expected object');
      expect(() => normalizeResumeData('string')).toThrow('Invalid resume data: expected object');
      expect(() => normalizeResumeData(123)).toThrow('Invalid resume data: expected object');
    });
  });

  describe('normalizeStoredData', () => {
    it('should successfully normalize valid JSON string', () => {
      const validJson = JSON.stringify({
        basics: { name: 'John Doe' },
        work: [{ name: 'Company A' }]
      });

      const result = normalizeStoredData(validJson);
      
      expect(result).not.toBeNull();
      expect(result!.basics.name).toBe('John Doe');
      expect(result!.sectionVisibility).toBeDefined();
      expect(result!.work[0].visible).toBe(true);
    });

    it('should return null for invalid JSON', () => {
      const invalidJson = '{ invalid json }';
      
      const result = normalizeStoredData(invalidJson);
      
      expect(result).toBeNull();
    });

    it('should return null for data that fails validation', () => {
      const invalidData = JSON.stringify({
        // missing basics
        work: 'not an array'
      });
      
      const result = normalizeStoredData(invalidData);
      
      expect(result).toBeNull();
    });

    it('should handle empty string', () => {
      const result = normalizeStoredData('');
      expect(result).toBeNull();
    });
  });

  describe('integration with ResumeData type', () => {
    it('should produce data that satisfies ResumeData interface', () => {
      const inputData = {
        basics: { name: 'John Doe' },
        work: [{ name: 'Company A', position: 'Developer' }]
      };

      const result = normalizeResumeData(inputData);
      
      // Test that result satisfies ResumeData interface
      const resumeData: ResumeData = result;
      
      expect(resumeData.basics).toBeDefined();
      expect(resumeData.sectionVisibility).toBeDefined();
      expect(Array.isArray(resumeData.work)).toBe(true);
      expect(Array.isArray(resumeData.education)).toBe(true);
      expect(Array.isArray(resumeData.skills)).toBe(true);
      expect(Array.isArray(resumeData.projects)).toBe(true);
      expect(Array.isArray(resumeData.awards)).toBe(true);
      expect(Array.isArray(resumeData.certificates)).toBe(true);
      expect(Array.isArray(resumeData.publications)).toBe(true);
      expect(Array.isArray(resumeData.languages)).toBe(true);
      expect(Array.isArray(resumeData.interests)).toBe(true);
      expect(Array.isArray(resumeData.references)).toBe(true);
      expect(Array.isArray(resumeData.volunteer)).toBe(true);
    });
  });
}); 