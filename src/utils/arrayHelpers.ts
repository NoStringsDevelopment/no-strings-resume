/**
 * Helper functions to clean up array data and prevent [object Object] display issues
 */

import { Highlight, Keyword, Course, Role } from '@/types/resume';

type TextObject = {
  content?: string;
  name?: string;
  visible?: boolean;
};

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
  items: T[] | undefined
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

      // These list items are expected to render from either `content` or `name`.
      // Keep only objects with a non-empty display value.
      return (getObjectTextValue(item as TextObject)?.length ?? 0) > 0;
    }
    
    return false;
  }) as T[];
}

/**
 * Clean highlights array - removes empty strings and invalid objects
 */
export function cleanHighlights(highlights: (string | Highlight)[] | undefined): (string | Highlight)[] {
  return cleanArray(highlights);
}

/**
 * Clean keywords array - removes empty strings and invalid objects
 */
export function cleanKeywords(keywords: (string | Keyword)[] | undefined): (string | Keyword)[] {
  return cleanArray(keywords);
}

/**
 * Clean courses array - removes empty strings and invalid objects
 */
export function cleanCourses(courses: (string | Course)[] | undefined): (string | Course)[] {
  return cleanArray(courses);
}

/**
 * Clean roles array - removes empty strings and invalid objects
 */
export function cleanRoles(roles: (string | Role)[] | undefined): (string | Role)[] {
  return cleanArray(roles);
}

/**
 * Converts any problematic data (empty strings, empty objects) to proper format
 */
export function sanitizeArrayItem<T extends string | TextObject>(
  item: unknown
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

    if ((getObjectTextValue(item as TextObject)?.length ?? 0) === 0) {
      return null;
    }

    return item as T;
  }
  
  // For any other type, return null
  return null;
}
