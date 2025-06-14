
import { ResumeData } from '@/types/resume';
import { convertHROpenToJsonResume, HROpenResume } from '@/schemas/hrOpen';

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

export function exportResumeWithExtensions(resumeData: ResumeData): string {
  // Export with all our custom fields for backup/restore
  return JSON.stringify(resumeData, null, 2);
}

export function importResumeData(jsonString: string): ResumeData {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Check if it's HR Open format
    if (parsed.person && parsed.employment) {
      console.log('Detected HR Open format, converting...');
      return convertHROpenToJsonResume(parsed as HROpenResume);
    }
    
    // It's JSON Resume format, add our extensions if missing
    const resumeData: ResumeData = {
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
        profiles: [],
        ...parsed.basics
      },
      work: parsed.work?.map((work: any) => ({ ...work, visible: work.visible !== false })) || [],
      education: parsed.education?.map((edu: any) => ({ ...edu, visible: edu.visible !== false })) || [],
      skills: parsed.skills?.map((skill: any) => ({ ...skill, visible: skill.visible !== false })) || [],
      projects: parsed.projects?.map((project: any) => ({ ...project, visible: project.visible !== false })) || [],
      awards: parsed.awards?.map((award: any) => ({ ...award, visible: award.visible !== false })) || [],
      certificates: parsed.certificates?.map((cert: any) => ({ ...cert, visible: cert.visible !== false })) || [],
      publications: parsed.publications?.map((pub: any) => ({ ...pub, visible: pub.visible !== false })) || [],
      languages: parsed.languages?.map((lang: any) => ({ ...lang, visible: lang.visible !== false })) || [],
      interests: parsed.interests?.map((interest: any) => ({ ...interest, visible: interest.visible !== false })) || [],
      references: parsed.references?.map((ref: any) => ({ ...ref, visible: ref.visible !== false })) || [],
      volunteer: parsed.volunteer?.map((vol: any) => ({ ...vol, visible: vol.visible !== false })) || [],
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

    // Ensure profiles have visible property
    if (resumeData.basics.profiles) {
      resumeData.basics.profiles = resumeData.basics.profiles.map(profile => ({
        ...profile,
        visible: profile.visible !== false
      }));
    }

    return resumeData;
  } catch (error) {
    console.error('Error importing resume data:', error);
    throw new Error('Invalid JSON format');
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
