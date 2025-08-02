
import { ResumeData, NonConformingData, InvalidField } from '@/types/resume';
import { convertHROpenToJsonResume, HROpenResume } from '@/schemas/hrOpen';

export interface ImportResult {
  resumeData: ResumeData;
  hasErrors: boolean;
  validationErrors: string[];
  nonConformingData?: NonConformingData;
}

export function exportResumeAsJson(resumeData: ResumeData): string {
  // Create a clean copy without our custom extensions for JSON Resume export
  const cleanData = {
    basics: {
      ...resumeData.basics,
      profiles: resumeData.basics.profiles.map(({ visible, ...profile }) => profile)
    },
    work: resumeData.work.map(({ visible, ...work }) => work),
    education: resumeData.education.map(({ visible, ...education }) => education),
    skills: resumeData.skills.map(({ visible, ...skill }) => skill),
    projects: resumeData.projects.map(({ visible, ...project }) => project),
    awards: resumeData.awards.map(({ visible, ...award }) => award),
    certificates: resumeData.certificates.map(({ visible, ...certificate }) => certificate),
    publications: resumeData.publications.map(({ visible, ...publication }) => publication),
    languages: resumeData.languages.map(({ visible, ...language }) => language),
    interests: resumeData.interests.map(({ visible, ...interest }) => interest),
    references: resumeData.references.map(({ visible, ...reference }) => reference),
    volunteer: resumeData.volunteer.map(({ visible, ...volunteer }) => volunteer)
  };

  return JSON.stringify(cleanData, null, 2);
}

function safeArrayEnsure(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return [];
  return [value];
}

function safeStringEnsure(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  return String(value);
}

function validateAndCleanWorkExperience(work: unknown, invalidFields: InvalidField[]): unknown {
  const cleaned = {
    name: safeStringEnsure(work.name),
    location: safeStringEnsure(work.location),
    description: safeStringEnsure(work.description),
    position: safeStringEnsure(work.position),
    url: safeStringEnsure(work.url),
    startDate: safeStringEnsure(work.startDate),
    endDate: safeStringEnsure(work.endDate),
    summary: safeStringEnsure(work.summary),
    highlights: safeArrayEnsure(work.highlights).map(h => safeStringEnsure(h)),
    visible: work.visible !== false
  };

  // Track invalid fields
  if (work.highlights && !Array.isArray(work.highlights)) {
    invalidFields.push({
      section: 'work',
      field: 'highlights',
      value: work.highlights,
      reason: 'Expected array, got ' + typeof work.highlights
    });
  }

  return cleaned;
}

function validateAndCleanEducation(education: unknown, invalidFields: InvalidField[]): unknown {
  const cleaned = {
    institution: safeStringEnsure(education.institution),
    url: safeStringEnsure(education.url),
    area: safeStringEnsure(education.area),
    studyType: safeStringEnsure(education.studyType),
    startDate: safeStringEnsure(education.startDate),
    endDate: safeStringEnsure(education.endDate),
    score: safeStringEnsure(education.score),
    courses: safeArrayEnsure(education.courses).map(c => safeStringEnsure(c)),
    visible: education.visible !== false
  };

  if (education.courses && !Array.isArray(education.courses)) {
    invalidFields.push({
      section: 'education',
      field: 'courses',
      value: education.courses,
      reason: 'Expected array, got ' + typeof education.courses
    });
  }

  return cleaned;
}

function validateAndCleanSkills(skill: unknown, invalidFields: InvalidField[]): unknown {
  const cleaned = {
    name: safeStringEnsure(skill.name),
    level: safeStringEnsure(skill.level),
    keywords: safeArrayEnsure(skill.keywords).map(k => safeStringEnsure(k)),
    visible: skill.visible !== false
  };

  if (skill.keywords && !Array.isArray(skill.keywords)) {
    invalidFields.push({
      section: 'skills',
      field: 'keywords',
      value: skill.keywords,
      reason: 'Expected array, got ' + typeof skill.keywords
    });
  }

  return cleaned;
}

function validateJsonResumeStructure(data: unknown): boolean {
  // Basic validation for JSON Resume format
  if (!data || typeof data !== 'object') return false;
  
  // Check if it has basics section (required in JSON Resume)
  if (!data.basics || typeof data.basics !== 'object') return false;
  
  // Check if arrays are actually arrays
  const arrayFields = ['work', 'education', 'skills', 'projects', 'awards', 'certificates', 'publications', 'languages', 'interests', 'references', 'volunteer'];
  for (const field of arrayFields) {
    if (data[field] && !Array.isArray(data[field])) {
      return false;
    }
  }
  
  return true;
}

function validateHROpenStructure(data: unknown): boolean {
  // Basic validation for HR Open format
  if (!data || typeof data !== 'object') return false;
  
  // Check for HR Open specific structure
  return !!(data.person && data.person.name);
}

export function importResumeData(jsonString: string): ImportResult {
  const validationErrors: string[] = [];
  const invalidFields: InvalidField[] = [];
  let hasErrors = false;

  try {
    const parsed = JSON.parse(jsonString);
    
    // Check if it's HR Open format
    if (validateHROpenStructure(parsed)) {
      console.log('Detected HR Open format, converting...');
      const convertedData = convertHROpenToJsonResume(parsed as HROpenResume);
      return {
        resumeData: convertedData,
        hasErrors: false,
        validationErrors: ['Successfully converted from HR Open format']
      };
    }
    
    // Validate JSON Resume structure
    if (!validateJsonResumeStructure(parsed)) {
      validationErrors.push('Invalid resume format. Expected JSON Resume v1.2.1 or HR Open format.');
      hasErrors = true;
    }
    
    // It's JSON Resume format, add our extensions if missing and clean data
    const resumeData: ResumeData = {
      basics: {
        name: safeStringEnsure(parsed.basics?.name),
        label: safeStringEnsure(parsed.basics?.label),
        image: safeStringEnsure(parsed.basics?.image),
        email: safeStringEnsure(parsed.basics?.email),
        phone: safeStringEnsure(parsed.basics?.phone),
        url: safeStringEnsure(parsed.basics?.url),
        summary: safeStringEnsure(parsed.basics?.summary),
        location: {
          address: safeStringEnsure(parsed.basics?.location?.address),
          postalCode: safeStringEnsure(parsed.basics?.location?.postalCode),
          city: safeStringEnsure(parsed.basics?.location?.city),
          countryCode: safeStringEnsure(parsed.basics?.location?.countryCode),
          region: safeStringEnsure(parsed.basics?.location?.region)
        },
        profiles: safeArrayEnsure(parsed.basics?.profiles).map(profile => ({
          network: safeStringEnsure(profile.network),
          username: safeStringEnsure(profile.username),
          url: safeStringEnsure(profile.url),
          visible: profile.visible !== false
        }))
      },
          work: safeArrayEnsure(parsed.work).map((work: unknown) => validateAndCleanWorkExperience(work, invalidFields)),
    education: safeArrayEnsure(parsed.education).map((edu: unknown) => validateAndCleanEducation(edu, invalidFields)),
    skills: safeArrayEnsure(parsed.skills).map((skill: unknown) => validateAndCleanSkills(skill, invalidFields)),
    projects: safeArrayEnsure(parsed.projects).map((project: unknown) => ({
        name: safeStringEnsure(project.name),
        description: safeStringEnsure(project.description),
        highlights: safeArrayEnsure(project.highlights).map(h => safeStringEnsure(h)),
        keywords: safeArrayEnsure(project.keywords).map(k => safeStringEnsure(k)),
        startDate: safeStringEnsure(project.startDate),
        endDate: safeStringEnsure(project.endDate),
        url: safeStringEnsure(project.url),
        roles: safeArrayEnsure(project.roles).map(r => safeStringEnsure(r)),
        entity: safeStringEnsure(project.entity),
        type: safeStringEnsure(project.type),
        visible: project.visible !== false
      })),
      awards: safeArrayEnsure(parsed.awards).map((award: unknown) => ({
        title: safeStringEnsure(award.title),
        date: safeStringEnsure(award.date),
        awarder: safeStringEnsure(award.awarder),
        summary: safeStringEnsure(award.summary),
        visible: award.visible !== false
      })),
      certificates: safeArrayEnsure(parsed.certificates).map((cert: unknown) => ({
        name: safeStringEnsure(cert.name),
        date: safeStringEnsure(cert.date),
        issuer: safeStringEnsure(cert.issuer),
        url: safeStringEnsure(cert.url),
        visible: cert.visible !== false
      })),
      publications: safeArrayEnsure(parsed.publications).map((pub: unknown) => ({
        name: safeStringEnsure(pub.name),
        publisher: safeStringEnsure(pub.publisher),
        releaseDate: safeStringEnsure(pub.releaseDate),
        url: safeStringEnsure(pub.url),
        summary: safeStringEnsure(pub.summary),
        visible: pub.visible !== false
      })),
      languages: safeArrayEnsure(parsed.languages).map((lang: unknown) => ({
        language: safeStringEnsure(lang.language),
        fluency: safeStringEnsure(lang.fluency),
        visible: lang.visible !== false
      })),
      interests: safeArrayEnsure(parsed.interests).map((interest: unknown) => ({
        name: safeStringEnsure(interest.name),
        keywords: safeArrayEnsure(interest.keywords).map(k => safeStringEnsure(k)),
        visible: interest.visible !== false
      })),
      references: safeArrayEnsure(parsed.references).map((ref: unknown) => ({
        name: safeStringEnsure(ref.name),
        reference: safeStringEnsure(ref.reference),
        visible: ref.visible !== false
      })),
      volunteer: safeArrayEnsure(parsed.volunteer).map((vol: unknown) => ({
        organization: safeStringEnsure(vol.organization),
        position: safeStringEnsure(vol.position),
        url: safeStringEnsure(vol.url),
        startDate: safeStringEnsure(vol.startDate),
        endDate: safeStringEnsure(vol.endDate),
        summary: safeStringEnsure(vol.summary),
        highlights: safeArrayEnsure(vol.highlights).map(h => safeStringEnsure(h)),
        visible: vol.visible !== false
      })),
      sectionVisibility: {
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
        volunteer: true,
        ...parsed.sectionVisibility
      }
    };

    // Add non-conforming data if there were issues
    if (invalidFields.length > 0) {
      hasErrors = true;
      resumeData.nonConformingData = {
        invalidFields,
        parsingErrors: validationErrors,
        originalData: parsed
      };
    }

    return {
      resumeData,
      hasErrors,
      validationErrors,
      nonConformingData: resumeData.nonConformingData
    };
  } catch (error) {
    console.error('Error importing resume data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format or unsupported file structure';
    
    // Return a minimal resume structure with error information
    const defaultResumeData: ResumeData = {
      basics: {
        name: '',
        label: '',
        image: '',
        email: '',
        phone: '',
        url: '',
        summary: '',
        location: {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        },
        profiles: []
      },
      work: [],
      education: [],
      skills: [],
      projects: [],
      awards: [],
      certificates: [],
      publications: [],
      languages: [],
      interests: [],
      references: [],
      volunteer: [],
      sectionVisibility: {
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
      },
      nonConformingData: {
        rawText: jsonString,
        parsingErrors: [errorMessage],
        originalData: null
      }
    };

    return {
      resumeData: defaultResumeData,
      hasErrors: true,
      validationErrors: [errorMessage]
    };
  }
}

export function downloadFile(content: string, filename: string, mimeType: string = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
