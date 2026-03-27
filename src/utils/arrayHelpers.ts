/**
 * Helper functions to clean up array data and prevent [object Object] display issues
 */

import { Highlight, Keyword, Course, Role } from '@/types/resume';

type TextObject = {
  content?: string;
  name?: string;
  visible?: boolean;
};

type CleanArrayOptions = {
  preservePlaceholders?: boolean;
};

function isEditorPlaceholder(item: TextObject): boolean {
  return (
    Object.prototype.hasOwnProperty.call(item, 'visible') &&
    (
      Object.prototype.hasOwnProperty.call(item, 'content') ||
      Object.prototype.hasOwnProperty.call(item, 'name')
    )
  );
}

function getObjectTextValue(item: TextObject): string | null {
  if (typeof item.content === 'string') {
    return item.content.trim();
  }

  if (typeof item.name === 'string') {
    return item.name.trim();
  }

  return null;
}

/**
 * Filters out empty strings and empty objects from an array of strings or objects
 */
export function cleanArray<T extends string | TextObject>(
  items: T[] | undefined,
  options: CleanArrayOptions = {}
): T[] {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  return items.filter(item => {
    // Filter out null/undefined
    if (item == null) return false;
    
    // Handle string items
    if (typeof item === 'string') {
      // Filter out empty strings
      return item.trim().length > 0;
    }
    
    // Handle object items
    if (typeof item === 'object') {
      const keys = Object.keys(item);
      if (keys.length === 0) return false;

      // Preserve editor-created placeholders so users can add a blank sub-item
      // and then type into it without normalization removing it immediately.
      if (options.preservePlaceholders && isEditorPlaceholder(item as TextObject)) {
        return true;
      }

      // These list items are expected to render from either `content` or `name`.
      return (getObjectTextValue(item as TextObject)?.length ?? 0) > 0;
    }
    
    return false;
  }) as T[];
}

/**
 * Clean highlights array - removes empty strings and invalid objects
 */
export function cleanHighlights(
  highlights: (string | Highlight)[] | undefined,
  options: CleanArrayOptions = {}
): (string | Highlight)[] {
  return cleanArray(highlights, options);
}

/**
 * Clean keywords array - removes empty strings and invalid objects
 */
export function cleanKeywords(
  keywords: (string | Keyword)[] | undefined,
  options: CleanArrayOptions = {}
): (string | Keyword)[] {
  return cleanArray(keywords, options);
}

/**
 * Clean courses array - removes empty strings and invalid objects
 */
export function cleanCourses(
  courses: (string | Course)[] | undefined,
  options: CleanArrayOptions = {}
): (string | Course)[] {
  return cleanArray(courses, options);
}

/**
 * Clean roles array - removes empty strings and invalid objects
 */
export function cleanRoles(
  roles: (string | Role)[] | undefined,
  options: CleanArrayOptions = {}
): (string | Role)[] {
  return cleanArray(roles, options);
}

/**
 * Converts any problematic data (empty strings, empty objects) to proper format
 */
export function sanitizeArrayItem<T extends string | TextObject>(
  item: unknown,
  options: CleanArrayOptions = {}
): T | null {
  // Handle null/undefined
  if (item == null) return null;
  
  // Handle strings
  if (typeof item === 'string') {
    const trimmed = item.trim();
    return trimmed.length > 0 ? trimmed as T : null;
  }
  
  // Handle objects
  if (typeof item === 'object') {
    // Check for empty object
    const keys = Object.keys(item);
    if (keys.length === 0) return null;

    if (options.preservePlaceholders && isEditorPlaceholder(item as TextObject)) {
      return item as T;
    }

    if ((getObjectTextValue(item as TextObject)?.length ?? 0) === 0) {
      return null;
    }

    return item as T;
  }
  
  // For any other type, return null
  return null;
}
