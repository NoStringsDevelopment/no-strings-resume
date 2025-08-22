import { ResumeData, WorkExperience, Education, Skill, Project, Award, Language, Certificate, Publication, Volunteer, Interest, Reference, Basics, SectionVisibility, NamedSummary } from '@/types/resume';
import { cleanHighlights, cleanKeywords, cleanCourses, cleanRoles } from './arrayHelpers';

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
function ensureItemsHaveVisibility<T extends { visible?: boolean }>(items: T[]): T[] {
  return items.map(item => {
    // Clean up nested arrays if they exist
    const cleaned = { ...item } as Record<string, unknown>;
    
    // Clean highlights array if present
    if ('highlights' in cleaned && Array.isArray(cleaned.highlights)) {
      cleaned.highlights = cleanHighlights(cleaned.highlights);
    }
    
    // Clean keywords array if present
    if ('keywords' in cleaned && Array.isArray(cleaned.keywords)) {
      cleaned.keywords = cleanKeywords(cleaned.keywords);
    }
    
    // Clean courses array if present
    if ('courses' in cleaned && Array.isArray(cleaned.courses)) {
      cleaned.courses = cleanCourses(cleaned.courses);
    }
    
    // Clean roles array if present
    if ('roles' in cleaned && Array.isArray(cleaned.roles)) {
      cleaned.roles = cleanRoles(cleaned.roles);
    }
    
    return {
      ...cleaned,
      visible: cleaned.visible !== false
    } as T;
  });
}

type UnknownRecord = Record<string, unknown>;

/**
 * Safely coerce a value to an array of T
 */
function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/**
 * Ensures all required arrays exist and are properly typed
 */
function ensureArraysExist(data: UnknownRecord): ResumeData {
  const d = data as Partial<ResumeData>;
  return {
    ...(data as object),
    work: toArray<WorkExperience>(d.work),
    education: toArray<Education>(d.education),
    skills: toArray<Skill>(d.skills),
    projects: toArray<Project>(d.projects),
    awards: toArray<Award>(d.awards),
    certificates: toArray<Certificate>(d.certificates),
    publications: toArray<Publication>(d.publications),
    languages: toArray<Language>(d.languages),
    interests: toArray<Interest>(d.interests),
    references: toArray<Reference>(d.references),
    volunteer: toArray<Volunteer>(d.volunteer)
  } as ResumeData;
}

/**
 * Migrates old icon structure (with width/height) to new structure (with single size)
 */
interface LegacyIconPosition { top?: number; right?: number }
interface LegacyIconSize { width?: number; height?: number }
interface LegacyIcon {
  data?: string;
  position?: LegacyIconPosition;
  size?: number | LegacyIconSize;
}

function migrateIconStructure<T extends object>(inputData: T): T {
  const icon = (inputData as { icon?: LegacyIcon }).icon;
  if (!icon) return inputData;

  if (typeof icon.size === 'number') {
    return inputData;
  }

  if (icon.size && typeof icon.size === 'object' && ('width' in icon.size || 'height' in icon.size)) {
    const legacySize = icon.size as LegacyIconSize;
    const newSize = legacySize.width || legacySize.height || 60;
    const updated = {
      ...(inputData as object),
      icon: {
        data: icon.data ?? '',
        position: icon.position || { top: 20, right: 20 },
        size: newSize
      }
    } as unknown as T;
    return updated;
  }
  return inputData;
}

/**
 * Ensures basics object exists with all required properties
 */
function ensureBasicsExist(data: UnknownRecord): ResumeData {
  const d = data as UnknownRecord;
  const basics = (d.basics as UnknownRecord) || {};
  const location = (basics.location as UnknownRecord) || {};

  return {
    ...(data as object),
    basics: {
      name: (basics.name as string) || '',
      label: (basics.label as string) || '',
      image: (basics.image as string) || '',
      email: (basics.email as string) || '',
      phone: (basics.phone as string) || '',
      url: (basics.url as string) || '',
      summary: (basics.summary as string) || '',
      location: {
        address: (location.address as string) || '',
        postalCode: (location.postalCode as string) || '',
        city: (location.city as string) || '',
        countryCode: (location.countryCode as string) || '',
        region: (location.region as string) || ''
      },
      profiles: Array.isArray(basics.profiles)
        ? ensureItemsHaveVisibility(basics.profiles as Array<{ visible?: boolean }>)
        : []
    }
  } as ResumeData;
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
  let normalized = ensureBasicsExist(data as UnknownRecord);
  normalized = ensureArraysExist(normalized as unknown as UnknownRecord);
  
  // Migrate old icon structure if present
  normalized = migrateIconStructure(normalized);

  // Normalize all arrays to ensure visibility properties
  const normalizedData: ResumeData = {
    ...(normalized as object as ResumeData),
    work: ensureItemsHaveVisibility(normalized.work) as WorkExperience[],
    education: ensureItemsHaveVisibility(normalized.education) as Education[],
    skills: ensureItemsHaveVisibility(normalized.skills).map(skill => ({
      ...skill,
      keywords: cleanKeywords(skill.keywords)
    })) as Skill[],
    projects: ensureItemsHaveVisibility(normalized.projects) as Project[],
    awards: ensureItemsHaveVisibility(normalized.awards) as Award[],
    certificates: ensureItemsHaveVisibility(normalized.certificates) as Certificate[],
    publications: ensureItemsHaveVisibility(normalized.publications) as Publication[],
    languages: ensureItemsHaveVisibility(normalized.languages) as Language[],
    interests: ensureItemsHaveVisibility(normalized.interests).map(interest => ({
      ...interest,
      keywords: cleanKeywords(interest.keywords)
    })) as Interest[],
    references: ensureItemsHaveVisibility(normalized.references) as Reference[],
    volunteer: ensureItemsHaveVisibility(normalized.volunteer) as Volunteer[],
    
    // Ensure sectionVisibility exists with all required properties
    sectionVisibility: {
      ...DEFAULT_SECTION_VISIBILITY,
      ...((data as Partial<ResumeData>).sectionVisibility || {})
    },
    
    // Preserve non-conforming data if it exists
    nonConformingData: (data as Partial<ResumeData>).nonConformingData,
    meta: (data as Partial<ResumeData>).meta
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
  const d = data as Partial<ResumeData>;
  if (!d.basics || typeof d.basics !== 'object') {
    errors.push('basics section is required and must be an object');
  }

  // Check array fields
  const arrayFields = ['work', 'education', 'skills', 'projects', 'awards', 'certificates', 'publications', 'languages', 'interests', 'references', 'volunteer'] as const;
  for (const field of arrayFields) {
    const value = d[field] as unknown;
    if (value !== undefined && !Array.isArray(value)) {
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