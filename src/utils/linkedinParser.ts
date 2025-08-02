import { unzip } from 'fflate';
import { ResumeData } from '@/types/resume';

export interface LinkedInImportResult {
  resumeData: ResumeData;
  hasErrors: boolean;
  validationErrors: string[];
  processedFiles: string[];
}

interface LinkedInProfile {
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  emailAddress?: string;
  geoLocation?: string;
  industry?: string;
}

interface LinkedInPosition {
  title?: string;
  companyName?: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
}

interface LinkedInEducation {
  schoolName?: string;
  degreeName?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface LinkedInSkill {
  name?: string;
  endorsementCount?: number;
}

interface LinkedInLanguage {
  name?: string;
  proficiency?: string;
}

interface LinkedInCertification {
  name?: string;
  authority?: string;
  startDate?: string;
  endDate?: string;
  url?: string;
}

function parseCSV(csvContent: string): any[] {
  const lines = csvContent.split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',').map(v => v.replace(/"/g, '').trim());
    const row: any = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    results.push(row);
  }
  
  return results;
}

function convertLinkedInDate(linkedinDate: string): string {
  if (!linkedinDate) return '';
  
  // LinkedIn dates can be in various formats: "Jan 2020", "2020", "Jan 1, 2020"
  try {
    // Handle "Jan 2020" format
    if (/^\w{3}\s\d{4}$/.test(linkedinDate)) {
      const date = new Date(linkedinDate + ' 01');
      return date.toISOString().split('T')[0];
    }
    
    // Handle "2020" format
    if (/^\d{4}$/.test(linkedinDate)) {
      return `${linkedinDate}-01-01`;
    }
    
    // Handle full date formats
    const date = new Date(linkedinDate);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return '';
  } catch {
    return '';
  }
}

function estimateSkillLevel(endorsementCount: number): string {
  if (endorsementCount >= 50) return 'Expert';
  if (endorsementCount >= 20) return 'Advanced';
  if (endorsementCount >= 5) return 'Intermediate';
  return 'Beginner';
}

function detectLinkedInFiles(files: { [filename: string]: Uint8Array }): boolean {
  const fileNames = Object.keys(files);
  
  // Look for common LinkedIn export files
  const linkedinFiles = [
    'Profile.csv',
    'Positions.csv', 
    'Education.csv',
    'Skills.csv',
    'Connections.csv'
  ];
  
  return linkedinFiles.some(file => 
    fileNames.some(name => name.toLowerCase().includes(file.toLowerCase()))
  );
}

export async function parseLinkedInZip(zipFile: File): Promise<LinkedInImportResult> {
  const validationErrors: string[] = [];
  const processedFiles: string[] = [];
  let hasErrors = false;
  
  try {
    const zipBuffer = new Uint8Array(await zipFile.arrayBuffer());
    
    return new Promise((resolve) => {
      unzip(zipBuffer, (err, files) => {
        if (err) {
          resolve({
            resumeData: createEmptyResumeData(),
            hasErrors: true,
            validationErrors: ['Failed to extract ZIP file'],
            processedFiles: []
          });
          return;
        }
        
        // Check if this looks like a LinkedIn export
        if (!detectLinkedInFiles(files)) {
          resolve({
            resumeData: createEmptyResumeData(),
            hasErrors: true,
            validationErrors: ['ZIP file does not appear to contain LinkedIn export data'],
            processedFiles: []
          });
          return;
        }
        
        const resumeData = createEmptyResumeData();
        
        // Process each file
        Object.entries(files).forEach(([filename, data]) => {
          try {
            const content = new TextDecoder().decode(data);
            const lowerFilename = filename.toLowerCase();
            
            if (lowerFilename.includes('profile.csv')) {
              processProfileData(content, resumeData, validationErrors);
              processedFiles.push(filename);
            } else if (lowerFilename.includes('positions.csv')) {
              processPositionsData(content, resumeData, validationErrors);
              processedFiles.push(filename);
            } else if (lowerFilename.includes('education.csv')) {
              processEducationData(content, resumeData, validationErrors);
              processedFiles.push(filename);
            } else if (lowerFilename.includes('skills.csv')) {
              processSkillsData(content, resumeData, validationErrors);
              processedFiles.push(filename);
            } else if (lowerFilename.includes('languages.csv')) {
              processLanguagesData(content, resumeData, validationErrors);
              processedFiles.push(filename);
            } else if (lowerFilename.includes('certifications.csv')) {
              processCertificationsData(content, resumeData, validationErrors);
              processedFiles.push(filename);
            }
          } catch (error) {
            validationErrors.push(`Error processing ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            hasErrors = true;
          }
        });
        
        if (processedFiles.length === 0) {
          validationErrors.push('No recognizable LinkedIn data files found in ZIP');
          hasErrors = true;
        }
        
        resolve({
          resumeData,
          hasErrors: hasErrors || validationErrors.length > 0,
          validationErrors,
          processedFiles
        });
      });
    });
  } catch (error) {
    return {
      resumeData: createEmptyResumeData(),
      hasErrors: true,
      validationErrors: [`Failed to process ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}`],
      processedFiles: []
    };
  }
}

function createEmptyResumeData(): ResumeData {
  return {
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
    }
  };
}

function processProfileData(csvContent: string, resumeData: ResumeData, errors: string[]): void {
  try {
    const profiles = parseCSV(csvContent) as LinkedInProfile[];
    if (profiles.length === 0) return;
    
    const profile = profiles[0];
    
    if (profile.firstName || profile.lastName) {
      resumeData.basics.name = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
    }
    
    if (profile.headline) {
      resumeData.basics.label = profile.headline;
    }
    
    if (profile.summary) {
      resumeData.basics.summary = profile.summary;
    }
    
    if (profile.emailAddress) {
      resumeData.basics.email = profile.emailAddress;
    }
    
    if (profile.geoLocation) {
      resumeData.basics.location.city = profile.geoLocation;
    }
  } catch (error) {
    errors.push(`Error processing profile data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function processPositionsData(csvContent: string, resumeData: ResumeData, errors: string[]): void {
  try {
    const positions = parseCSV(csvContent) as LinkedInPosition[];
    
    resumeData.work = positions.map(position => ({
      name: position.companyName || '',
      location: position.location || '',
      description: '',
      position: position.title || '',
      url: '',
      startDate: convertLinkedInDate(position.startDate || ''),
      endDate: convertLinkedInDate(position.endDate || ''),
      summary: position.description || '',
      highlights: [],
      visible: true
    }));
  } catch (error) {
    errors.push(`Error processing positions data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function processEducationData(csvContent: string, resumeData: ResumeData, errors: string[]): void {
  try {
    const education = parseCSV(csvContent) as LinkedInEducation[];
    
    resumeData.education = education.map(edu => ({
      institution: edu.schoolName || '',
      url: '',
      area: edu.fieldOfStudy || '',
      studyType: edu.degreeName || '',
      startDate: convertLinkedInDate(edu.startDate || ''),
      endDate: convertLinkedInDate(edu.endDate || ''),
      score: '',
      courses: [],
      visible: true
    }));
  } catch (error) {
    errors.push(`Error processing education data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function processSkillsData(csvContent: string, resumeData: ResumeData, errors: string[]): void {
  try {
    const skills = parseCSV(csvContent) as LinkedInSkill[];
    
    resumeData.skills = skills
      .filter(skill => skill.name)
      .map(skill => ({
        name: skill.name || '',
        level: estimateSkillLevel(skill.endorsementCount || 0),
        keywords: [],
        visible: true
      }));
  } catch (error) {
    errors.push(`Error processing skills data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function processLanguagesData(csvContent: string, resumeData: ResumeData, errors: string[]): void {
  try {
    const languages = parseCSV(csvContent) as LinkedInLanguage[];
    
    resumeData.languages = languages
      .filter(lang => lang.name)
      .map(lang => ({
        language: lang.name || '',
        fluency: lang.proficiency || 'Native speaker',
        visible: true
      }));
  } catch (error) {
    errors.push(`Error processing languages data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function processCertificationsData(csvContent: string, resumeData: ResumeData, errors: string[]): void {
  try {
    const certifications = parseCSV(csvContent) as LinkedInCertification[];
    
    resumeData.certificates = certifications
      .filter(cert => cert.name)
      .map(cert => ({
        name: cert.name || '',
        date: convertLinkedInDate(cert.startDate || ''),
        issuer: cert.authority || '',
        url: cert.url || '',
        visible: true
      }));
  } catch (error) {
    errors.push(`Error processing certifications data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}