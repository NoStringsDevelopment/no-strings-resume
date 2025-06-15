// JSON Resume Schema v1.2.1 with extensions for visibility toggles
export interface ResumeData {
  basics: Basics;
  work: WorkExperience[];
  volunteer: Volunteer[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  awards: Award[];
  certificates: Certificate[];
  publications: Publication[];
  languages: Language[];
  interests: Interest[];
  references: Reference[];
  meta?: Meta;
  
  // Extension: section visibility toggles
  sectionVisibility: SectionVisibility;
  
  // Extension: non-conforming data that needs manual review
  nonConformingData?: NonConformingData;
}

export interface NonConformingData {
  rawText?: string;
  invalidFields?: InvalidField[];
  parsingErrors?: string[];
  originalData?: any;
}

export interface InvalidField {
  section: string;
  field: string;
  value: any;
  reason: string;
}

export interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: Location;
  profiles: Profile[];
}

export interface Location {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}

export interface Profile {
  network: string;
  username: string;
  url: string;
  visible?: boolean;
}

export interface WorkExperience {
  name: string;
  location?: string;
  description?: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  visible?: boolean;
}

export interface Volunteer {
  organization: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  visible?: boolean;
}

export interface Education {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  courses: string[];
  visible?: boolean;
}

export interface Skill {
  name: string;
  level: string;
  keywords: string[];
  visible?: boolean;
}

export interface Project {
  name: string;
  description: string;
  highlights: string[];
  keywords: string[];
  startDate: string;
  endDate: string;
  url: string;
  roles: string[];
  entity: string;
  type: string;
  visible?: boolean;
}

export interface Award {
  title: string;
  date: string;
  awarder: string;
  summary: string;
  visible?: boolean;
}

export interface Certificate {
  name: string;
  date: string;
  issuer: string;
  url: string;
  visible?: boolean;
}

export interface Publication {
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
  visible?: boolean;
}

export interface Language {
  language: string;
  fluency: string;
  visible?: boolean;
}

export interface Interest {
  name: string;
  keywords: string[];
  visible?: boolean;
}

export interface Reference {
  name: string;
  reference: string;
  visible?: boolean;
}

export interface Meta {
  canonical?: string;
  version?: string;
  lastModified?: string;
}

export interface SectionVisibility {
  basics: boolean;
  work: boolean;
  volunteer: boolean;
  education: boolean;
  skills: boolean;
  projects: boolean;
  awards: boolean;
  certificates: boolean;
  publications: boolean;
  languages: boolean;
  interests: boolean;
  references: boolean;
}

// Theme types
export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    background: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    section: string;
    item: string;
  };
}
