
// HR Open schema mapping utilities
export interface HROpenResume {
  person: {
    name: {
      given: string;
      family: string;
    };
    communication: {
      email: string;
      phone: string;
      web: string;
    };
    location: {
      address: {
        line: string;
        city: string;
        postalCode: string;
        countrySubDivisions: string;
        country: string;
      };
    };
  };
  employment: Array<{
    organization: {
      name: string;
      website: string;
    };
    position: {
      title: string;
      startDate: string;
      endDate: string;
      description: string;
    };
  }>;
  education: Array<{
    institution: {
      name: string;
    };
    program: {
      name: string;
      type: string;
    };
    dates: {
      start: string;
      end: string;
    };
  }>;
  skills: Array<{
    name: string;
    proficiencyLevel: string;
  }>;
}

export function convertHROpenToJsonResume(hrOpen: HROpenResume): any {
  const nameParts = hrOpen.person.name.given.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = hrOpen.person.name.family || nameParts.slice(1).join(' ') || '';
  
  return {
    basics: {
      name: `${firstName} ${lastName}`.trim(),
      email: hrOpen.person.communication.email || '',
      phone: hrOpen.person.communication.phone || '',
      url: hrOpen.person.communication.web || '',
      location: {
        address: hrOpen.person.location.address.line || '',
        city: hrOpen.person.location.address.city || '',
        postalCode: hrOpen.person.location.address.postalCode || '',
        region: hrOpen.person.location.address.countrySubDivisions || '',
        countryCode: hrOpen.person.location.address.country || ''
      },
      summary: '',
      label: '',
      image: '',
      profiles: []
    },
    work: hrOpen.employment?.map(emp => ({
      name: emp.organization.name,
      position: emp.position.title,
      url: emp.organization.website || '',
      startDate: emp.position.startDate,
      endDate: emp.position.endDate,
      summary: emp.position.description,
      highlights: [],
      visible: true
    })) || [],
    education: hrOpen.education?.map(edu => ({
      institution: edu.institution.name,
      area: edu.program.name,
      studyType: edu.program.type,
      startDate: edu.dates.start,
      endDate: edu.dates.end,
      url: '',
      score: '',
      courses: [],
      visible: true
    })) || [],
    skills: hrOpen.skills?.map(skill => ({
      name: skill.name,
      level: skill.proficiencyLevel,
      keywords: [],
      visible: true
    })) || [],
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
