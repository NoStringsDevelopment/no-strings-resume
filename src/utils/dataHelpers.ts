import { ResumeData, WorkExperience, Education, Skill, Project, Award, Language, Certificate, Publication, Volunteer, Interest, Reference, Basics, SectionVisibility, NamedSummary, IconSettings } from '@/types/resume';

/**
 * Default section visibility configuration
 */
const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
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
};

/**
 * Ensures all array items have a 'visible' property, defaults to true if missing
 */
function ensureItemsHaveVisibility<T extends Record<string, unknown>>(items: T[]): Array<T & { visible: boolean }> {
  return items.map(item => ({
    ...item,
    visible: item.visible !== false // defaults to true unless explicitly false
  }));
}

/**
 * Ensures all required arrays exist and are properly typed
 */
function ensureArraysExist(data: unknown): ResumeData {
  return {
    ...data,
    work: Array.isArray(data.work) ? data.work : [],
    education: Array.isArray(data.education) ? data.education : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    awards: Array.isArray(data.awards) ? data.awards : [],
    certificates: Array.isArray(data.certificates) ? data.certificates : [],
    publications: Array.isArray(data.publications) ? data.publications : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    interests: Array.isArray(data.interests) ? data.interests : [],
    references: Array.isArray(data.references) ? data.references : [],
    volunteer: Array.isArray(data.volunteer) ? data.volunteer : []
  };
}

/**
 * Migrates old icon structure (with width/height) to new structure (with single size)
 */
function migrateIconStructure(data: any): any {
  if (!data.icon) return data;
  
  const icon = data.icon;
  
  // If icon already has the new structure, return as is
  if (typeof icon.size === 'number') {
    return data;
  }
  
  // Migrate from old structure to new
  if (icon.size && typeof icon.size === 'object' && (icon.size.width || icon.size.height)) {
    // Use the average of width and height, or the width if only one is present
    const newSize = icon.size.width || icon.size.height || 60;
    
    return {
      ...data,
      icon: {
        data: icon.data,
        position: icon.position || { top: 20, right: 20 },
        size: newSize
      }
    };
  }
  
  return data;
}

/**
 * Ensures basics object exists with all required properties
 */
function ensureBasicsExist(data: unknown): ResumeData {
  const basics = data.basics || {};
  const location = basics.location || {};
  
  return {
    ...data,
    basics: {
      name: basics.name || '',
      label: basics.label || '',
      image: basics.image || '',
      email: basics.email || '',
      phone: basics.phone || '',
      url: basics.url || '',
      summary: basics.summary || '',
      location: {
        address: location.address || '',
        postalCode: location.postalCode || '',
        city: location.city || '',
        countryCode: location.countryCode || '',
        region: location.region || ''
      },
      profiles: Array.isArray(basics.profiles) ? 
        ensureItemsHaveVisibility(basics.profiles) : []
    }
  };
}

/**
 * Normalizes resume data to ensure all required properties exist and are properly typed
 * This is the central function that should be called whenever data is loaded from any source
 */
export function normalizeResumeData(data: unknown): ResumeData {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid resume data: expected object');
  }

  // Start with ensuring basic structure exists
  let normalized = ensureBasicsExist(data);
  normalized = ensureArraysExist(normalized);
  
  // Migrate old icon structure if present
  normalized = migrateIconStructure(normalized);

  // Normalize all arrays to ensure visibility properties
  const normalizedData: ResumeData = {
    ...normalized,
    work: ensureItemsHaveVisibility(normalized.work),
    education: ensureItemsHaveVisibility(normalized.education),
    skills: ensureItemsHaveVisibility(normalized.skills),
    projects: ensureItemsHaveVisibility(normalized.projects),
    awards: ensureItemsHaveVisibility(normalized.awards),
    certificates: ensureItemsHaveVisibility(normalized.certificates),
    publications: ensureItemsHaveVisibility(normalized.publications),
    languages: ensureItemsHaveVisibility(normalized.languages),
    interests: ensureItemsHaveVisibility(normalized.interests),
    references: ensureItemsHaveVisibility(normalized.references),
    volunteer: ensureItemsHaveVisibility(normalized.volunteer),
    
    // Ensure sectionVisibility exists with all required properties
    sectionVisibility: {
      ...DEFAULT_SECTION_VISIBILITY,
      ...(data.sectionVisibility || {})
    },
    
    // Preserve non-conforming data if it exists
    nonConformingData: data.nonConformingData,
    meta: data.meta
  };

  return normalizedData;
}

/**
 * Validates that the data structure is compatible with our resume format
 */
export function validateResumeData(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Resume data must be an object');
    return { isValid: false, errors };
  }

  // Check if basics exists
  if (!data.basics || typeof data.basics !== 'object') {
    errors.push('basics section is required and must be an object');
  }

  // Check array fields
  const arrayFields = ['work', 'education', 'skills', 'projects', 'awards', 'certificates', 'publications', 'languages', 'interests', 'references', 'volunteer'];
  for (const field of arrayFields) {
    if (data[field] && !Array.isArray(data[field])) {
      errors.push(`${field} must be an array if present`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Safe function to normalize data from localStorage
 */
export function normalizeStoredData(jsonString: string): ResumeData | null {
  try {
    const parsed = JSON.parse(jsonString);
    const validation = validateResumeData(parsed);
    
    if (!validation.isValid) {
      console.warn('Stored data validation failed:', validation.errors);
      return null;
    }
    
    return normalizeResumeData(parsed);
  } catch (error) {
    console.error('Failed to parse stored data:', error);
    return null;
  }
}

/**
 * Cleans up duplicate summaries by merging them based on target (case-insensitive)
 * Keeps the most recently used version
 */
export function deduplicateSummaries(summaries: NamedSummary[]): NamedSummary[] {
  if (!summaries || summaries.length === 0) return [];

  const uniqueSummaries = new Map<string, NamedSummary>();
  
  summaries.forEach(summary => {
    const normalizedTarget = summary.target.toLowerCase();
    const existing = uniqueSummaries.get(normalizedTarget);
    
    if (!existing) {
      uniqueSummaries.set(normalizedTarget, summary);
    } else {
      // Keep the one with the most recent lastUsed timestamp
      const existingDate = new Date(existing.lastUsed || existing.createdAt).getTime();
      const currentDate = new Date(summary.lastUsed || summary.createdAt).getTime();
      
      if (currentDate > existingDate) {
        uniqueSummaries.set(normalizedTarget, {
          ...summary,
          target: existing.target // Preserve original casing from first entry
        });
      }
    }
  });
  
  return Array.from(uniqueSummaries.values());
} 