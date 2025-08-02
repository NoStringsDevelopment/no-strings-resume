
import { describe, it, expect } from 'vitest';
import { normalizeResumeData } from './dataHelpers';

describe('normalizeResumeData', () => {
  describe('basics normalization', () => {
    it('should ensure basics.profiles is always an array', () => {
      const data1: unknown = { basics: { profiles: null } };
      const normalized1 = normalizeResumeData(data1);
      expect(Array.isArray(normalized1.basics.profiles)).toBe(true);
      expect(normalized1.basics.profiles.length).toBe(0);

      const data2: unknown = { basics: {} };
      const normalized2 = normalizeResumeData(data2);
      expect(Array.isArray(normalized2.basics.profiles)).toBe(true);
      expect(normalized2.basics.profiles.length).toBe(0);
    });
  });

  describe('work normalization', () => {
    it('should ensure work is always an array', () => {
      const data1: unknown = { work: null };
      const normalized1 = normalizeResumeData(data1);
      expect(Array.isArray(normalized1.work)).toBe(true);
      expect(normalized1.work.length).toBe(0);

      const data2: unknown = {};
      const normalized2 = normalizeResumeData(data2);
      expect(Array.isArray(normalized2.work)).toBe(true);
      expect(normalized2.work.length).toBe(0);
    });

    it('should add visible: true to work items without it', () => {
      const data: unknown = { work: [{ name: 'Company A' }] };
      const normalized = normalizeResumeData(data);
      expect(normalized.work[0].visible).toBe(true);
    });
  });

  describe('education normalization', () => {
    it('should ensure education is always an array', () => {
      const data1: unknown = { education: null };
      const normalized1 = normalizeResumeData(data1);
      expect(Array.isArray(normalized1.education)).toBe(true);
      expect(normalized1.education.length).toBe(0);

      const data2: unknown = {};
      const normalized2 = normalizeResumeData(data2);
      expect(Array.isArray(normalized2.education)).toBe(true);
      expect(normalized2.education.length).toBe(0);
    });

    it('should add visible: true to education items without it', () => {
      const data: unknown = { education: [{ institution: 'University A' }] };
      const normalized = normalizeResumeData(data);
      expect(normalized.education[0].visible).toBe(true);
    });
  });

  describe('skills normalization', () => {
    it('should ensure skills is always an array', () => {
      const data1: unknown = { skills: null };
      const normalized1 = normalizeResumeData(data1);
      expect(Array.isArray(normalized1.skills)).toBe(true);
      expect(normalized1.skills.length).toBe(0);

      const data2: unknown = {};
      const normalized2 = normalizeResumeData(data2);
      expect(Array.isArray(normalized2.skills)).toBe(true);
      expect(normalized2.skills.length).toBe(0);
    });

    it('should add visible: true to skills items without it', () => {
      const data: unknown = { skills: [{ name: 'JavaScript' }] };
      const normalized = normalizeResumeData(data);
      expect(normalized.skills[0].visible).toBe(true);
    });
  });
});
