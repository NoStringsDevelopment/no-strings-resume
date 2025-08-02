import { ResumeData } from '@/types/resume';
import { 
  ExtendedResumeData, 
  Extensions,
  getDefaultExtensions,
  validateExtendedResumeData,
  isExtendedResumeFormat,
  ItemVisibility,
  SubItemVisibility,
  EXTENDED_RESUME_SCHEMA_VERSION,
  getAppVersion
} from '@/schemas/extendedResume';
import { downloadFile } from '@/utils/importExport';
import { generateExportFilename } from '@/utils/exportUtils';
import { 
  getHighlightContent,
  getKeywordName,
  getRoleName,
  getCourseName,
  isHighlightVisible,
  isKeywordVisible,
  isRoleVisible,
  isCourseVisible
} from '@/utils/visibilityHelpers';

/**
 * Converts app ResumeData to ExtendedResumeData format for backup
 * Extracts visibility information from embedded properties and puts it in extensions
 */
export function convertToExtendedFormat(resumeData: ResumeData): ExtendedResumeData {
  const now = new Date().toISOString();
  
  // Extract visibility information from the app's current format
  const itemVisibility: ItemVisibility = {};
  const subItemVisibility: SubItemVisibility = {};
  
  // Extract profile visibility
  if (resumeData.basics.profiles.length > 0) {
    itemVisibility.profiles = resumeData.basics.profiles.map(p => p.visible !== false);
  }
  
  // Extract work visibility
  if (resumeData.work.length > 0) {
    itemVisibility.work = resumeData.work.map(w => w.visible !== false);
    
    // Extract work highlights visibility
    subItemVisibility.work = {};
    resumeData.work.forEach((work, workIndex) => {
      if (work.highlights.length > 0) {
        subItemVisibility.work![workIndex] = {
          highlights: work.highlights.map(h => isHighlightVisible(h))
        };
      }
    });
  }
  
  // Extract volunteer visibility
  if (resumeData.volunteer.length > 0) {
    itemVisibility.volunteer = resumeData.volunteer.map(v => v.visible !== false);
    
    // Extract volunteer highlights visibility
    subItemVisibility.volunteer = {};
    resumeData.volunteer.forEach((volunteer, volIndex) => {
      if (volunteer.highlights.length > 0) {
        subItemVisibility.volunteer![volIndex] = {
          highlights: volunteer.highlights.map(h => isHighlightVisible(h))
        };
      }
    });
  }
  
  // Extract education visibility
  if (resumeData.education.length > 0) {
    itemVisibility.education = resumeData.education.map(e => e.visible !== false);
    
    // Extract courses visibility
    subItemVisibility.education = {};
    resumeData.education.forEach((edu, eduIndex) => {
      if (edu.courses.length > 0) {
        subItemVisibility.education![eduIndex] = {
          courses: edu.courses.map(c => isCourseVisible(c))
        };
      }
    });
  }
  
  // Extract skills visibility
  if (resumeData.skills.length > 0) {
    itemVisibility.skills = resumeData.skills.map(s => s.visible !== false);
    
    // Extract keywords visibility
    subItemVisibility.skills = {};
    resumeData.skills.forEach((skill, skillIndex) => {
      if (skill.keywords.length > 0) {
        subItemVisibility.skills![skillIndex] = {
          keywords: skill.keywords.map(k => isKeywordVisible(k))
        };
      }
    });
  }
  
  // Extract projects visibility
  if (resumeData.projects.length > 0) {
    itemVisibility.projects = resumeData.projects.map(p => p.visible !== false);
    
         // Extract project sub-items visibility
     subItemVisibility.projects = {};
     resumeData.projects.forEach((project, projIndex) => {
       const projectSubItems: { highlights?: boolean[]; keywords?: boolean[]; roles?: boolean[]; } = {};
       
       if (project.highlights.length > 0) {
         projectSubItems.highlights = project.highlights.map(h => isHighlightVisible(h));
       }
       if (project.keywords.length > 0) {
         projectSubItems.keywords = project.keywords.map(k => isKeywordVisible(k));
       }
       if (project.roles.length > 0) {
         projectSubItems.roles = project.roles.map(r => isRoleVisible(r));
       }
       
       if (Object.keys(projectSubItems).length > 0) {
         subItemVisibility.projects![projIndex] = projectSubItems;
       }
     });
  }
  
  // Extract other sections visibility
  if (resumeData.awards.length > 0) {
    itemVisibility.awards = resumeData.awards.map(a => a.visible !== false);
  }
  if (resumeData.certificates.length > 0) {
    itemVisibility.certificates = resumeData.certificates.map(c => c.visible !== false);
  }
  if (resumeData.publications.length > 0) {
    itemVisibility.publications = resumeData.publications.map(p => p.visible !== false);
  }
  if (resumeData.languages.length > 0) {
    itemVisibility.languages = resumeData.languages.map(l => l.visible !== false);
  }
  if (resumeData.references.length > 0) {
    itemVisibility.references = resumeData.references.map(r => r.visible !== false);
  }
  
  // Extract interests visibility
  if (resumeData.interests.length > 0) {
    itemVisibility.interests = resumeData.interests.map(i => i.visible !== false);
    
    // Extract interest keywords visibility
    subItemVisibility.interests = {};
    resumeData.interests.forEach((interest, interestIndex) => {
      if (interest.keywords.length > 0) {
        subItemVisibility.interests![interestIndex] = {
          keywords: interest.keywords.map(k => isKeywordVisible(k))
        };
      }
    });
  }
  
  // Create clean JSON Resume data (strip all visibility properties)
  const cleanJsonResumeData = {
    basics: {
      ...resumeData.basics,
      profiles: resumeData.basics.profiles.map(({ visible, ...profile }) => profile)
    },
    work: resumeData.work.map(({ visible, ...work }) => ({
      ...work,
      highlights: work.highlights.map(h => getHighlightContent(h))
    })),
    volunteer: resumeData.volunteer.map(({ visible, ...volunteer }) => ({
      ...volunteer,
      highlights: volunteer.highlights.map(h => getHighlightContent(h))
    })),
    education: resumeData.education.map(({ visible, ...education }) => ({
      ...education,
      courses: education.courses.map(c => getCourseName(c))
    })),
    skills: resumeData.skills.map(({ visible, ...skill }) => ({
      ...skill,
      keywords: skill.keywords.map(k => getKeywordName(k))
    })),
    projects: resumeData.projects.map(({ visible, ...project }) => ({
      ...project,
      highlights: project.highlights.map(h => getHighlightContent(h)),
      keywords: project.keywords.map(k => getKeywordName(k)),
      roles: project.roles.map(r => getRoleName(r))
    })),
    awards: resumeData.awards.map(({ visible, ...award }) => award),
    certificates: resumeData.certificates.map(({ visible, ...certificate }) => certificate),
    publications: resumeData.publications.map(({ visible, ...publication }) => publication),
    languages: resumeData.languages.map(({ visible, ...language }) => language),
    interests: resumeData.interests.map(({ visible, ...interest }) => ({
      ...interest,
      keywords: interest.keywords.map(k => getKeywordName(k))
    })),
    references: resumeData.references.map(({ visible, ...reference }) => reference),
    meta: resumeData.meta
  };
  
  // Create extensions with extracted visibility data
  const extensions: Extensions = {
    $schemaVersion: EXTENDED_RESUME_SCHEMA_VERSION,
    $extendedSchema: "https://github.com/yourusername/no-strings-resume/schemas/extended-resume-v1.json",
    
    visibility: {
      sections: { ...resumeData.sectionVisibility },
      items: itemVisibility,
      subItems: subItemVisibility
    },
    
    backup: {
      exportedAt: now,
      exportedBy: "No Strings Resume Builder",
      appVersion: getAppVersion(),
      format: "extended",
      preservesVisibility: true,
      preservesAppData: true
    },
    
    nonConforming: resumeData.nonConformingData,
    
    app: {
      lastSaved: now,
      editCount: 0, // Would need to track this in state
      templateVersion: "1.0.0"
    }
  };
  
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    ...cleanJsonResumeData,
    $extensions: extensions
  };
}

/**
 * Converts ExtendedResumeData back to app ResumeData format
 * Merges visibility information back into the data structures
 */
export function convertFromExtendedFormat(extendedData: ExtendedResumeData): ResumeData {
  const extensions = extendedData.$extensions;
  const visibility = extensions.visibility;
  
  // Helper to get item visibility with fallback
  const getItemVisibility = (section: keyof ItemVisibility, index: number): boolean => {
    return visibility.items[section]?.[index] ?? true;
  };
  
     // Helper to get sub-item visibility with fallback
   const getSubItemVisibility = (section: keyof SubItemVisibility, itemIndex: number, subType: string, subIndex: number): boolean => {
     const sectionData = visibility.subItems[section];
     if (!sectionData || typeof sectionData !== 'object') return true;
     
     const itemData = (sectionData as Record<number, Record<string, boolean[]>>)[itemIndex];
     if (!itemData || typeof itemData !== 'object') return true;
     
     const subTypeData = itemData[subType];
     if (!Array.isArray(subTypeData)) return true;
     
     return subTypeData[subIndex] ?? true;
   };
  
  return {
    basics: {
      ...extendedData.basics,
      profiles: extendedData.basics.profiles.map((profile, index) => ({
        ...profile,
        visible: getItemVisibility('profiles', index)
      }))
    },
    
         work: extendedData.work.map((work, workIndex) => ({
       ...work,
       highlights: work.highlights.map((highlight, hIndex) => ({
         content: typeof highlight === 'string' ? highlight : highlight,
         visible: getSubItemVisibility('work', workIndex, 'highlights', hIndex)
       })) as (string | { content: string; visible?: boolean })[],
       visible: getItemVisibility('work', workIndex)
     })),
     
     volunteer: extendedData.volunteer.map((volunteer, volIndex) => ({
       ...volunteer,
       highlights: volunteer.highlights.map((highlight, hIndex) => ({
         content: typeof highlight === 'string' ? highlight : highlight,
         visible: getSubItemVisibility('volunteer', volIndex, 'highlights', hIndex)
       })) as (string | { content: string; visible?: boolean })[],
       visible: getItemVisibility('volunteer', volIndex)
     })),
     
     education: extendedData.education.map((edu, eduIndex) => ({
       ...edu,
       courses: edu.courses.map((course, cIndex) => ({
         name: typeof course === 'string' ? course : course,
         visible: getSubItemVisibility('education', eduIndex, 'courses', cIndex)
       })) as (string | { name: string; visible?: boolean })[],
       visible: getItemVisibility('education', eduIndex)
     })),
     
     skills: extendedData.skills.map((skill, skillIndex) => ({
       ...skill,
       keywords: skill.keywords.map((keyword, kIndex) => ({
         name: typeof keyword === 'string' ? keyword : keyword,
         visible: getSubItemVisibility('skills', skillIndex, 'keywords', kIndex)
       })) as (string | { name: string; visible?: boolean })[],
       visible: getItemVisibility('skills', skillIndex)
     })),
     
     projects: extendedData.projects.map((project, projIndex) => ({
       ...project,
       highlights: project.highlights.map((highlight, hIndex) => ({
         content: typeof highlight === 'string' ? highlight : highlight,
         visible: getSubItemVisibility('projects', projIndex, 'highlights', hIndex)
       })) as (string | { content: string; visible?: boolean })[],
       keywords: project.keywords.map((keyword, kIndex) => ({
         name: typeof keyword === 'string' ? keyword : keyword,
         visible: getSubItemVisibility('projects', projIndex, 'keywords', kIndex)
       })) as (string | { name: string; visible?: boolean })[],
       roles: project.roles.map((role, rIndex) => ({
         name: typeof role === 'string' ? role : role,
         visible: getSubItemVisibility('projects', projIndex, 'roles', rIndex)
       })) as (string | { name: string; visible?: boolean })[],
       visible: getItemVisibility('projects', projIndex)
     })),
    
    awards: extendedData.awards.map((award, index) => ({
      ...award,
      visible: getItemVisibility('awards', index)
    })),
    
    certificates: extendedData.certificates.map((cert, index) => ({
      ...cert,
      visible: getItemVisibility('certificates', index)
    })),
    
    publications: extendedData.publications.map((pub, index) => ({
      ...pub,
      visible: getItemVisibility('publications', index)
    })),
    
    languages: extendedData.languages.map((lang, index) => ({
      ...lang,
      visible: getItemVisibility('languages', index)
    })),
    
         interests: extendedData.interests.map((interest, interestIndex) => ({
       ...interest,
       keywords: interest.keywords.map((keyword, kIndex) => ({
         name: typeof keyword === 'string' ? keyword : keyword,
         visible: getSubItemVisibility('interests', interestIndex, 'keywords', kIndex)
       })) as (string | { name: string; visible?: boolean })[],
       visible: getItemVisibility('interests', interestIndex)
     })),
    
    references: extendedData.references.map((ref, index) => ({
      ...ref,
      visible: getItemVisibility('references', index)
    })),
    
    meta: extendedData.meta,
    sectionVisibility: { ...visibility.sections },
    nonConformingData: extensions.nonConforming
  };
}

/**
 * Creates a backup file with all app data preserved in clean format
 */
export function exportAsBackup(resumeData: ResumeData) {
  const extendedData = convertToExtendedFormat(resumeData);
  const jsonContent = JSON.stringify(extendedData, null, 2);
  const filename = generateExportFilename(resumeData, 'json', 'backup', true);
  downloadFile(jsonContent, filename, 'application/json');
}

/**
 * Import result for backup format
 */
export interface BackupImportResult {
  resumeData: ResumeData | null;
  isValid: boolean;
  isExtended: boolean;
  schemaVersion: string | null;
  errors: string[];
  warnings: string[];
}

/**
 * Attempts to import from backup format
 */
export function importFromBackup(jsonString: string): BackupImportResult {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Check if it's our extended format
    if (isExtendedResumeFormat(parsed)) {
      const validation = validateExtendedResumeData(parsed);
      
      if (!validation.isValid) {
        return {
          resumeData: null,
          isValid: false,
          isExtended: true,
          schemaVersion: validation.schemaVersion,
          errors: validation.errors,
          warnings: validation.warnings
        };
      }
      
      if (!validation.isSupported) {
        return {
          resumeData: null,
          isValid: false,
          isExtended: true,
          schemaVersion: validation.schemaVersion,
          errors: [`Unsupported backup version: ${validation.schemaVersion}`],
          warnings: validation.warnings
        };
      }
      
      // Convert back to app format
      const resumeData = convertFromExtendedFormat(parsed as ExtendedResumeData);
      
      return {
        resumeData,
        isValid: true,
        isExtended: true,
        schemaVersion: validation.schemaVersion,
        errors: [],
        warnings: validation.warnings
      };
    }
    
    // Not extended format
    return {
      resumeData: null,
      isValid: false,
      isExtended: false,
      schemaVersion: null,
      errors: ['Not a backup file - use regular import for JSON Resume or HR-Open formats'],
      warnings: []
    };
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
    return {
      resumeData: null,
      isValid: false,
      isExtended: false,
      schemaVersion: null,
      errors: [errorMessage],
      warnings: []
    };
  }
} 