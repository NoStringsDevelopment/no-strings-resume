import { describe, it, expect } from 'vitest';
import { 
  cleanArray, 
  cleanHighlights, 
  cleanKeywords,
  sanitizeArrayItem 
} from './arrayHelpers';

describe('arrayHelpers', () => {
  describe('cleanArray', () => {
    it('should filter out empty strings', () => {
      const input = ['valid', '', '  ', 'another'];
      const result = cleanArray(input);
      expect(result).toEqual(['valid', 'another']);
    });

    it('should filter out empty objects', () => {
      const input = [
        { name: 'valid', visible: true },
        {},
        { name: '', visible: true },
        { name: 'another' }
      ];
      const result = cleanArray(input);
      expect(result).toEqual([
        { name: 'valid', visible: true },
        { name: 'another' }
      ]);
    });

    it('should handle mixed strings and objects', () => {
      const input = [
        'string',
        { name: 'object' },
        '',
        {},
        { name: '' },
        'another string'
      ];
      const result = cleanArray(input);
      expect(result).toEqual([
        'string',
        { name: 'object' },
        'another string'
      ]);
    });

    it('should remove objects without a usable display value', () => {
      const input = [
        { visible: true },
        { content: '', visible: true },
        { content: 'Valid highlight', visible: false },
        { name: 'Valid keyword', visible: true }
      ];

      const result = cleanArray(input);

      expect(result).toEqual([
        { content: 'Valid highlight', visible: false },
        { name: 'Valid keyword', visible: true }
      ]);
    });

    it('should handle null and undefined', () => {
      const input = ['valid', null, undefined, 'another'];
      const result = cleanArray(input);
      expect(result).toEqual(['valid', 'another']);
    });

    it('should return empty array for undefined input', () => {
      const result = cleanArray(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('cleanHighlights', () => {
    it('should clean highlights array', () => {
      const input = [
        'Valid highlight',
        '',
        { content: 'Object highlight', visible: true },
        {},
        { content: '' }
      ];
      const result = cleanHighlights(input);
      expect(result).toEqual([
        'Valid highlight',
        { content: 'Object highlight', visible: true }
      ]);
    });
  });

  describe('cleanKeywords', () => {
    it('should clean keywords array', () => {
      const input = [
        'React',
        '',
        { name: 'TypeScript', visible: true },
        {},
        { name: '' },
        'Node.js'
      ];
      const result = cleanKeywords(input);
      expect(result).toEqual([
        'React',
        { name: 'TypeScript', visible: true },
        'Node.js'
      ]);
    });
  });

  describe('sanitizeArrayItem', () => {
    it('should return null for empty strings', () => {
      expect(sanitizeArrayItem('')).toBeNull();
      expect(sanitizeArrayItem('  ')).toBeNull();
    });

    it('should return trimmed string for valid strings', () => {
      expect(sanitizeArrayItem('  valid  ')).toBe('valid');
    });

    it('should return null for empty objects', () => {
      expect(sanitizeArrayItem({})).toBeNull();
    });

    it('should return null for objects with empty name', () => {
      expect(sanitizeArrayItem({ name: '' })).toBeNull();
      expect(sanitizeArrayItem({ name: '  ' })).toBeNull();
    });

    it('should return null for highlight objects with empty content', () => {
      expect(sanitizeArrayItem({ content: '' })).toBeNull();
      expect(sanitizeArrayItem({ content: '  ', visible: true })).toBeNull();
    });

    it('should return object for valid objects', () => {
      const obj = { name: 'valid', visible: true };
      expect(sanitizeArrayItem(obj)).toEqual(obj);
    });

    it('should return object for valid highlight objects', () => {
      const obj = { content: 'valid highlight', visible: false };
      expect(sanitizeArrayItem(obj)).toEqual(obj);
    });

    it('should return null for null/undefined', () => {
      expect(sanitizeArrayItem(null)).toBeNull();
      expect(sanitizeArrayItem(undefined)).toBeNull();
    });
  });
});
