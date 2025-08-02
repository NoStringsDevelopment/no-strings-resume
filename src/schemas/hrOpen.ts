// HR Open LER-RS schema mapping utilities
import { ResumeData } from '../types/resume';

export interface HROpenResume {
  type: string;
  narratives?: Narrative[];
  job?: JobType;
  certifications?: ResumeCertification[];
  person?: ResumePersonBase;
  educationAndLearnings?: EducationAndLearning[];
  employmentHistories?: EmploymentHistory[];
  licenses?: ResumeLicense[];
  skills?: HROpenSkill[];
  employmentPreferences?: EmployerPreference[];
  positionPreferences?: PositionPreference[];
  communication?: Communication;
  attachments?: Attachment[];
}

export interface Narrative {
  type?: string;
  content?: string;
}

export interface JobType {
  JDXjobDescription?: unknown;
  positionOpening?: unknown;
}

export interface ResumePersonBase {
  name?: {
    given?: string;
    family?: string;
    formatted?: string;
  };
  communication?: {
    email?: string;
    phone?: string;
    web?: string;
  };
  location?: {
    address?: {
      line?: string;
      city?: string;
      postalCode?: string;
      countrySubDivisions?: string;
      country?: string;
    };
  };
}

export interface EducationAndLearning {
  institution?: {
    name?: string;
    url?: string;
  };
  program?: {
    name?: string;
    type?: string;
  };
  dates?: {
    start?: string;
    end?: string;
  };
  score?: string;
  courses?: string[];
}

export interface EmploymentHistory {
  organization?: {
    name?: string;
    website?: string;
    location?: string;
    description?: string;
  };
  position?: {
    title?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    highlights?: string[];
  };
}

export interface ResumeCertification {
  name?: string;
  issuingAuthority?: string;
  date?: string;
  url?: string;
}

export interface ResumeLicense {
  name?: string;
  issuingAuthority?: string;
  date?: string;
  url?: string;
}

export interface HROpenSkill {
  name?: string;
  proficiencyLevel?: string;
  keywords?: string[];
}

export interface EmployerPreference {
  name?: string;
  preference?: string;
}

export interface PositionPreference {
  title?: string;
  preference?: string;
}

export interface Communication {
  email?: string;
  phone?: string;
  web?: string;
}

export interface Attachment {
  content?: string;
  filename?: string;
  mimeType?: string;
}

export function convertHROpenToJsonResume(hrOpen: HROpenResume): ResumeData {
  const person = hrOpen.person;
  const name = person?.name?.formatted || 
               `${person?.name?.given || ''} ${person?.name?.family || ''}`.trim();
  
  return {
    basics: {
      name: name || '',
      email: person?.communication?.email || hrOpen.communication?.email || '',
      phone: person?.communication?.phone || hrOpen.communication?.phone || '',
      url: person?.communication?.web || hrOpen.communication?.web || '',
      location: {
        address: person?.location?.address?.line || '',
        city: person?.location?.address?.city || '',
        postalCode: person?.location?.address?.postalCode || '',
        region: person?.location?.address?.countrySubDivisions || '',
        countryCode: person?.location?.address?.country || ''
      },
      summary: hrOpen.narratives?.find(n => n.type === 'summary')?.content || '',
      label: '',
      image: '',
      profiles: []
    },
    work: hrOpen.employmentHistories?.map(emp => ({
      name: emp.organization?.name || '',
      location: emp.organization?.location || '',
      description: emp.organization?.description || '',
      position: emp.position?.title || '',
      url: emp.organization?.website || '',
      startDate: emp.position?.startDate || '',
      endDate: emp.position?.endDate || '',
      summary: emp.position?.description || '',
      highlights: emp.position?.highlights || [],
      visible: true
    })) || [],
    education: hrOpen.educationAndLearnings?.map(edu => ({
      institution: edu.institution?.name || '',
      url: edu.institution?.url || '',
      area: edu.program?.name || '',
      studyType: edu.program?.type || '',
      startDate: edu.dates?.start || '',
      endDate: edu.dates?.end || '',
      score: edu.score || '',
      courses: edu.courses || [],
      visible: true
    })) || [],
    skills: hrOpen.skills?.map(skill => ({
      name: skill.name || '',
      level: skill.proficiencyLevel || '',
      keywords: skill.keywords || [],
      visible: true
    })) || [],
    projects: [],
    awards: [],
    certificates: hrOpen.certifications?.map(cert => ({
      name: cert.name || '',
      date: cert.date || '',
      issuer: cert.issuingAuthority || '',
      url: cert.url || '',
      visible: true
    })) || [],
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
    }
  };
}
