// Extended Resume Schema with clean separation between standard JSON Resume and extensions
// This schema preserves JSON Resume v1.2.1 compatibility while adding app-specific extensions

export const EXTENDED_RESUME_SCHEMA_VERSION = "1.1.0";
export const SUPPORTED_SCHEMA_VERSIONS = ["1.0.0", "1.1.0"];

// Standard JSON Resume Schema (unchanged, for reference)
import { 
  ResumeData as JsonResumeData,
  SectionVisibility,
  NonConformingData 
} from '@/types/resume';

/**
 * Schema Evolution Strategy:
 * 
 * PRINCIPLES:
 * 1. Never modify existing fields - always add new ones
 * 2. All new fields must have sensible defaults
 * 3. Use semantic versioning: MAJOR.MINOR.PATCH
 *    - MAJOR: Breaking changes (can't read old backups)
 *    - MINOR: New features (old backups still work)  
 *    - PATCH: Bug fixes, clarifications
 * 
 * GUIDELINES:
 * - Add new optional fields to Extensions interface
 * - Add version migration functions for MAJOR bumps
 * - Document all changes in CHANGELOG
 * - Test backwards compatibility rigorously
 * 
 * EXAMPLE MIGRATIONS:
 * v1.0.0 -> v1.1.0: Add new optional field (backwards compatible)
 * v1.1.0 -> v2.0.0: Change data structure (need migration function)
 * 
 * CHANGELOG:
 * v1.1.0: Added summaries collection for multiple named summaries
 */

/**
 * Named summary for different target roles/companies
 */
export interface NamedSummary {
  id: string;
  target: string;
  summary: string;
  createdAt: string;
  lastUsed?: string;
}

/**
 * Extended Resume format that preserves JSON Resume compatibility
 * while adding app-specific extensions in a separate namespace
 */
export interface ExtendedResumeData {
  // Standard JSON Resume Schema (completely unchanged)
  $schema?: string;
  basics: JsonResumeData['basics'];
  work: JsonResumeData['work'];
  volunteer: JsonResumeData['volunteer'];
  education: JsonResumeData['education'];
  skills: JsonResumeData['skills'];
  projects: JsonResumeData['projects'];
  awards: JsonResumeData['awards'];
  certificates: JsonResumeData['certificates'];
  publications: JsonResumeData['publications'];
  languages: JsonResumeData['languages'];
  interests: JsonResumeData['interests'];
  references: JsonResumeData['references'];
  meta?: JsonResumeData['meta'];
  
  // App-specific extensions in separate namespace
  $extensions: Extensions;
}

/**
 * All app-specific data lives here, separate from JSON Resume standard
 */
export interface Extensions {
  $schemaVersion: string;
  $extendedSchema: string; // URL to our schema definition
  
  // Visibility control for sections and items
  visibility: VisibilityExtensions;
  
  // Backup and restore metadata
  backup: BackupMetadata;
  
  // Non-conforming data from imports that need manual review
  nonConforming?: NonConformingData;
  
  // App metadata (edit counts, last saved, etc.)
  app?: AppMetadata;
  
  // Multiple named summaries (v1.1.0+)
  summaries?: NamedSummary[];
  
  // Current active summary ID for display
  activeSummaryId?: string;
  
  // Future extensions can be added here without breaking changes
  // theme?: ThemeExtensions;
  // collaboration?: CollaborationExtensions;
  // analytics?: AnalyticsExtensions;
}

/**
 * Visibility control system - tracks what's shown/hidden
 */
export interface VisibilityExtensions {
  // Section-level visibility (show/hide entire sections)
  sections: SectionVisibility;
  
  // Item-level visibility (show/hide individual entries within sections)
  items: ItemVisibility;
  
  // Sub-item visibility (highlights, keywords, courses, etc.)
  subItems: SubItemVisibility;
}

/**
 * Controls visibility of individual items within each section
 * Arrays are indexed by position in the corresponding JSON Resume array
 */
export interface ItemVisibility {
  profiles?: boolean[];          // basics.profiles[i].visible
  work?: boolean[];              // work[i].visible  
  volunteer?: boolean[];         // volunteer[i].visible
  education?: boolean[];         // education[i].visible
  skills?: boolean[];            // skills[i].visible
  projects?: boolean[];          // projects[i].visible
  awards?: boolean[];            // awards[i].visible
  certificates?: boolean[];      // certificates[i].visible
  publications?: boolean[];      // publications[i].visible
  languages?: boolean[];         // languages[i].visible
  interests?: boolean[];         // interests[i].visible
  references?: boolean[];        // references[i].visible
}

/**
 * Controls visibility of sub-items (highlights, keywords, etc.)
 * Nested structure: section -> itemIndex -> subItemType -> subItemIndex -> visible
 */
export interface SubItemVisibility {
  work?: Record<number, WorkSubItemVisibility>;
  volunteer?: Record<number, VolunteerSubItemVisibility>;
  education?: Record<number, EducationSubItemVisibility>;
  skills?: Record<number, SkillSubItemVisibility>;
  projects?: Record<number, ProjectSubItemVisibility>;
  interests?: Record<number, InterestSubItemVisibility>;
}

export interface WorkSubItemVisibility {
  highlights?: boolean[];
}

export interface VolunteerSubItemVisibility {
  highlights?: boolean[];
}

export interface EducationSubItemVisibility {
  courses?: boolean[];
}

export interface SkillSubItemVisibility {
  keywords?: boolean[];
}

export interface ProjectSubItemVisibility {
  highlights?: boolean[];
  keywords?: boolean[];
  roles?: boolean[];
}

export interface InterestSubItemVisibility {
  keywords?: boolean[];
}

/**
 * Metadata about the backup itself
 */
export interface BackupMetadata {
  exportedAt: string;           // ISO timestamp
  exportedBy: string;           // "No Strings Resume Builder"
  appVersion: string;           // App version that created backup
  format: "extended";           // Always "extended" for this format
  preservesVisibility: true;    // Always true for extended format
  preservesAppData: true;       // Always true for extended format
}

/**
 * App-specific metadata for power user features
 */
export interface AppMetadata {
  lastSaved?: string;           // ISO timestamp
  editCount?: number;           // Number of edits made
  templateVersion?: string;     // Template version used
  exportHistory?: ExportRecord[]; // Track export history
}

export interface ExportRecord {
  timestamp: string;
  format: 'pdf' | 'docx' | 'html' | 'json' | 'hropen';
  theme?: string;
}

/**
 * Validation result for extended resume data
 */
export interface ExtendedResumeValidationResult {
  isValid: boolean;
  schemaVersion: string | null;
  isSupported: boolean;
  errors: string[];
  warnings: string[];
  migrationNeeded?: boolean;
}

/**
 * Default extensions for new resumes
 */
export function getDefaultExtensions(): Extensions {
  return {
    $schemaVersion: EXTENDED_RESUME_SCHEMA_VERSION,
    $extendedSchema: "https://github.com/yourusername/no-strings-resume/schemas/extended-resume-v1.json",
    
    visibility: {
      sections: {
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
      },
      items: {},
      subItems: {}
    },
    
    backup: {
      exportedAt: new Date().toISOString(),
      exportedBy: "No Strings Resume Builder",
      appVersion: getAppVersion(),
      format: "extended",
      preservesVisibility: true,
      preservesAppData: true
    },
    
    app: {
      editCount: 0,
      templateVersion: "1.0.0"
    },
    
    summaries: [],
    activeSummaryId: undefined
  };
}

/**
 * Validates an extended resume data object
 */
export function validateExtendedResumeData(data: unknown): ExtendedResumeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data: expected object');
    return {
      isValid: false,
      schemaVersion: null,
      isSupported: false,
      errors,
      warnings
    };
  }
  
  const dataObj = data as Record<string, unknown>;
  
  // Check for extensions
  if (!dataObj.$extensions || typeof dataObj.$extensions !== 'object') {
    errors.push('Missing $extensions object');
    return {
      isValid: false,
      schemaVersion: null,
      isSupported: false,
      errors,
      warnings
    };
  }
  
  const extensions = dataObj.$extensions as Record<string, unknown>;
  const schemaVersion = extensions.$schemaVersion as string;
  
  if (!schemaVersion || typeof schemaVersion !== 'string') {
    errors.push('Missing $extensions.$schemaVersion');
    return {
      isValid: false,
      schemaVersion: null,
      isSupported: false,
      errors,
      warnings
    };
  }
  
  const isSupported = SUPPORTED_SCHEMA_VERSIONS.includes(schemaVersion);
  if (!isSupported) {
    errors.push(`Unsupported schema version: ${schemaVersion}. Supported: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')}`);
  }
  
  // Check required top-level JSON Resume fields
  const requiredProps = ['basics'];
  for (const prop of requiredProps) {
    if (!(prop in dataObj)) {
      errors.push(`Missing required JSON Resume property: ${prop}`);
    }
  }
  
  // Validate extensions structure
  if (!extensions.visibility) {
    warnings.push('Missing visibility extensions - will use defaults');
  }
  
  if (!extensions.backup) {
    warnings.push('Missing backup metadata');
  }
  
  // Check array sections are actually arrays
  const arrayFields = ['work', 'education', 'skills', 'projects', 'awards', 'certificates', 'publications', 'languages', 'interests', 'references', 'volunteer'];
  for (const field of arrayFields) {
    if (dataObj[field] && !Array.isArray(dataObj[field])) {
      errors.push(`${field} should be an array`);
    }
  }
  
  const isValid = errors.length === 0;
  
  return {
    isValid,
    schemaVersion,
    isSupported,
    errors,
    warnings,
    migrationNeeded: isValid && !isSupported // Valid but needs migration
  };
}

/**
 * Checks if data appears to be in extended resume format
 */
export function isExtendedResumeFormat(data: unknown): boolean {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const dataObj = data as Record<string, unknown>;
  return !!(dataObj.$extensions && 
           typeof dataObj.$extensions === 'object' &&
           (dataObj.$extensions as Record<string, unknown>).$schemaVersion);
}

/**
 * Gets the current app version for backup metadata
 */
export function getAppVersion(): string {
  // Use import.meta.env for Vite, with fallback
  try {
    return import.meta.env.VITE_APP_VERSION || "1.0.0";
  } catch {
    return "1.0.0";
  }
}
