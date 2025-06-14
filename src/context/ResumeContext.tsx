import { createContext, useContext, useReducer, ReactNode } from 'react';
import { ResumeData, Theme, Basics, SectionVisibility, WorkExperience, Education, Skill, Project, Award, Language, Certificate, Publication, Volunteer, Interest, Reference } from '@/types/resume';

export interface ResumeState {
  resumeData: ResumeData;
  currentTheme: Theme;
  isLoading: boolean;
  isSaved: boolean;
  history: ResumeData[];
  historyIndex: number;
}

export type ResumeAction = 
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'UPDATE_BASICS'; payload: Partial<Basics> }
  | { type: 'UPDATE_SECTION_VISIBILITY'; payload: Partial<SectionVisibility> }
  | { type: 'ADD_WORK_EXPERIENCE'; payload: WorkExperience }
  | { type: 'UPDATE_WORK_EXPERIENCE'; payload: { index: number; data: Partial<WorkExperience> } }
  | { type: 'REMOVE_WORK_EXPERIENCE'; payload: number }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { index: number; data: Partial<Education> } }
  | { type: 'REMOVE_EDUCATION'; payload: number }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: { index: number; data: Partial<Skill> } }
  | { type: 'UPDATE_SKILLS'; payload: Skill[] }
  | { type: 'REMOVE_SKILL'; payload: number }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { index: number; data: Partial<Project> } }
  | { type: 'REMOVE_PROJECT'; payload: number }
  | { type: 'ADD_AWARD'; payload: Award }
  | { type: 'UPDATE_AWARD'; payload: { index: number; data: Partial<Award> } }
  | { type: 'REMOVE_AWARD'; payload: number }
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_LANGUAGE'; payload: { index: number; data: Partial<Language> } }
  | { type: 'REMOVE_LANGUAGE'; payload: number }
  | { type: 'ADD_CERTIFICATE'; payload: Certificate }
  | { type: 'UPDATE_CERTIFICATE'; payload: { index: number; data: Partial<Certificate> } }
  | { type: 'REMOVE_CERTIFICATE'; payload: number }
  | { type: 'ADD_PUBLICATION'; payload: Publication }
  | { type: 'UPDATE_PUBLICATION'; payload: { index: number; data: Partial<Publication> } }
  | { type: 'REMOVE_PUBLICATION'; payload: number }
  | { type: 'ADD_VOLUNTEER'; payload: Volunteer }
  | { type: 'UPDATE_VOLUNTEER'; payload: { index: number; data: Partial<Volunteer> } }
  | { type: 'REMOVE_VOLUNTEER'; payload: number }
  | { type: 'ADD_INTEREST'; payload: Interest }
  | { type: 'UPDATE_INTEREST'; payload: { index: number; data: Partial<Interest> } }
  | { type: 'REMOVE_INTEREST'; payload: number }
  | { type: 'ADD_REFERENCE'; payload: Reference }
  | { type: 'UPDATE_REFERENCE'; payload: { index: number; data: Partial<Reference> } }
  | { type: 'REMOVE_REFERENCE'; payload: number }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'MARK_SAVED' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_ALL' }
  | { type: 'RESET_TO_DEFAULT' };

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
  volunteer: [],
  education: [],
  skills: [],
  projects: [],
  awards: [],
  certificates: [],
  publications: [],
  languages: [],
  interests: [],
  references: [],
  sectionVisibility: {
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
  }
};

const defaultThemes: Theme[] = [
  {
    id: 'modern',
    name: 'Modern',
    colors: {
      primary: '#3B82F6',
      secondary: '#6B7280',
      accent: '#EF4444',
      text: '#111827',
      textSecondary: '#6B7280',
      background: '#FFFFFF',
      border: '#E5E7EB'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    },
    spacing: {
      section: '2rem',
      item: '1rem'
    }
  }
];

const initialState: ResumeState = {
  resumeData: defaultResumeData,
  currentTheme: defaultThemes[0],
  isLoading: false,
  isSaved: true,
  history: [defaultResumeData],
  historyIndex: 0,
};

const resumeReducer = (state: ResumeState, action: ResumeAction): ResumeState => {
  const addToHistory = (newResumeData: ResumeData) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(newResumeData);
    // Keep history size reasonable (max 50 entries)
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  };

  switch (action.type) {
    case 'SET_RESUME_DATA':
      const historyUpdate = addToHistory(action.payload);
      return {
        ...state,
        resumeData: action.payload,
        isSaved: false,
        ...historyUpdate,
      };

    case 'UPDATE_SKILLS':
      const updatedSkillsData = {
        ...state.resumeData,
        skills: action.payload
      };
      const updateSkillsHistoryUpdate = addToHistory(updatedSkillsData);
      return {
        ...state,
        resumeData: updatedSkillsData,
        isSaved: false,
        ...updateSkillsHistoryUpdate,
      };

    case 'UNDO':
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          resumeData: state.history[newIndex],
          historyIndex: newIndex,
          isSaved: false,
        };
      }
      return state;

    case 'REDO':
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          resumeData: state.history[newIndex],
          historyIndex: newIndex,
          isSaved: false,
        };
      }
      return state;

    case 'CLEAR_ALL':
      const clearedData = {
        ...defaultResumeData,
        basics: {
          ...defaultResumeData.basics,
          name: '',
          email: '',
          phone: '',
          url: '',
          summary: '',
          label: '',
          image: '',
          location: {
            address: '',
            postalCode: '',
            city: '',
            countryCode: '',
            region: '',
          },
          profiles: [],
        },
        work: [],
        volunteer: [],
        education: [],
        skills: [],
        projects: [],
        awards: [],
        certificates: [],
        publications: [],
        languages: [],
        interests: [],
        references: [],
      };
      const clearHistoryUpdate = addToHistory(clearedData);
      return {
        ...state,
        resumeData: clearedData,
        isSaved: false,
        ...clearHistoryUpdate,
      };

    case 'RESET_TO_DEFAULT':
      const resetHistoryUpdate = addToHistory(defaultResumeData);
      return {
        ...state,
        resumeData: defaultResumeData,
        isSaved: false,
        ...resetHistoryUpdate,
      };

    case 'UPDATE_BASICS':
      const updatedBasics = {
        ...state.resumeData,
        basics: {
          ...state.resumeData.basics,
          ...action.payload
        }
      };
      const basicsHistoryUpdate = addToHistory(updatedBasics);
      return {
        ...state,
        resumeData: updatedBasics,
        isSaved: false,
        ...basicsHistoryUpdate,
      };

    case 'UPDATE_SECTION_VISIBILITY':
      const updatedVisibility = {
        ...state.resumeData,
        sectionVisibility: {
          ...state.resumeData.sectionVisibility,
          ...action.payload
        }
      };
      return {
        ...state,
        resumeData: updatedVisibility,
        isSaved: false,
      };

    case 'ADD_WORK_EXPERIENCE':
      const updatedWorkExperiences = {
        ...state.resumeData,
        work: [...state.resumeData.work, action.payload]
      };
      const workHistoryUpdate = addToHistory(updatedWorkExperiences);
      return {
        ...state,
        resumeData: updatedWorkExperiences,
        isSaved: false,
        ...workHistoryUpdate,
      };

    case 'UPDATE_WORK_EXPERIENCE':
      const updatedWork = state.resumeData.work.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedWorkData = {
        ...state.resumeData,
        work: updatedWork
      };
      const updateWorkHistoryUpdate = addToHistory(updatedWorkData);
      return {
        ...state,
        resumeData: updatedWorkData,
        isSaved: false,
        ...updateWorkHistoryUpdate,
      };

    case 'REMOVE_WORK_EXPERIENCE':
      const filteredWork = state.resumeData.work.filter((_, index) => index !== action.payload);
      const removedWorkData = {
        ...state.resumeData,
        work: filteredWork
      };
      const removeWorkHistoryUpdate = addToHistory(removedWorkData);
      return {
        ...state,
        resumeData: removedWorkData,
        isSaved: false,
        ...removeWorkHistoryUpdate,
      };

    case 'ADD_EDUCATION':
      const updatedEducation = {
        ...state.resumeData,
        education: [...state.resumeData.education, action.payload]
      };
      const educationHistoryUpdate = addToHistory(updatedEducation);
      return {
        ...state,
        resumeData: updatedEducation,
        isSaved: false,
        ...educationHistoryUpdate,
      };

    case 'UPDATE_EDUCATION':
      const updatedEducationItems = state.resumeData.education.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedEducationData = {
        ...state.resumeData,
        education: updatedEducationItems
      };
      const updateEducationHistoryUpdate = addToHistory(updatedEducationData);
      return {
        ...state,
        resumeData: updatedEducationData,
        isSaved: false,
        ...updateEducationHistoryUpdate,
      };

    case 'REMOVE_EDUCATION':
      const filteredEducation = state.resumeData.education.filter((_, index) => index !== action.payload);
      const removedEducationData = {
        ...state.resumeData,
        education: filteredEducation
      };
      const removeEducationHistoryUpdate = addToHistory(removedEducationData);
      return {
        ...state,
        resumeData: removedEducationData,
        isSaved: false,
        ...removeEducationHistoryUpdate,
      };

    case 'ADD_SKILL':
      const updatedSkills = {
        ...state.resumeData,
        skills: [...state.resumeData.skills, action.payload]
      };
      const addSkillHistoryUpdate = addToHistory(updatedSkills);
      return {
        ...state,
        resumeData: updatedSkills,
        isSaved: false,
        ...addSkillHistoryUpdate,
      };

    case 'UPDATE_SKILL':
      const updatedSkillItems = state.resumeData.skills.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedSkillData = {
        ...state.resumeData,
        skills: updatedSkillItems
      };
      const updateSkillHistoryUpdate = addToHistory(updatedSkillData);
      return {
        ...state,
        resumeData: updatedSkillData,
        isSaved: false,
        ...updateSkillHistoryUpdate,
      };

    case 'REMOVE_SKILL':
      const filteredSkills = state.resumeData.skills.filter((_, index) => index !== action.payload);
      const removedSkillData = {
        ...state.resumeData,
        skills: filteredSkills
      };
      const removeSkillHistoryUpdate = addToHistory(removedSkillData);
      return {
        ...state,
        resumeData: removedSkillData,
        isSaved: false,
        ...removeSkillHistoryUpdate,
      };

    case 'ADD_PROJECT':
      const updatedProjects = {
        ...state.resumeData,
        projects: [...state.resumeData.projects, action.payload]
      };
      const projectsHistoryUpdate = addToHistory(updatedProjects);
      return {
        ...state,
        resumeData: updatedProjects,
        isSaved: false,
        ...projectsHistoryUpdate,
      };

    case 'UPDATE_PROJECT':
      const updatedProjectItems = state.resumeData.projects.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedProjectData = {
        ...state.resumeData,
        projects: updatedProjectItems
      };
      const updateProjectHistoryUpdate = addToHistory(updatedProjectData);
      return {
        ...state,
        resumeData: updatedProjectData,
        isSaved: false,
        ...updateProjectHistoryUpdate,
      };

    case 'REMOVE_PROJECT':
      const filteredProjects = state.resumeData.projects.filter((_, index) => index !== action.payload);
      const removedProjectData = {
        ...state.resumeData,
        projects: filteredProjects
      };
      const removeProjectHistoryUpdate = addToHistory(removedProjectData);
      return {
        ...state,
        resumeData: removedProjectData,
        isSaved: false,
        ...removeProjectHistoryUpdate,
      };

    case 'ADD_AWARD':
      const updatedAwards = {
        ...state.resumeData,
        awards: [...state.resumeData.awards, action.payload]
      };
      const awardsHistoryUpdate = addToHistory(updatedAwards);
      return {
        ...state,
        resumeData: updatedAwards,
        isSaved: false,
        ...awardsHistoryUpdate,
      };

    case 'UPDATE_AWARD':
      const updatedAwardItems = state.resumeData.awards.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedAwardData = {
        ...state.resumeData,
        awards: updatedAwardItems
      };
      const updateAwardHistoryUpdate = addToHistory(updatedAwardData);
      return {
        ...state,
        resumeData: updatedAwardData,
        isSaved: false,
        ...updateAwardHistoryUpdate,
      };

    case 'REMOVE_AWARD':
      const filteredAwards = state.resumeData.awards.filter((_, index) => index !== action.payload);
      const removedAwardData = {
        ...state.resumeData,
        awards: filteredAwards
      };
      const removeAwardHistoryUpdate = addToHistory(removedAwardData);
      return {
        ...state,
        resumeData: removedAwardData,
        isSaved: false,
        ...removeAwardHistoryUpdate,
      };

    case 'ADD_LANGUAGE':
      const updatedLanguages = {
        ...state.resumeData,
        languages: [...state.resumeData.languages, action.payload]
      };
      const languagesHistoryUpdate = addToHistory(updatedLanguages);
      return {
        ...state,
        resumeData: updatedLanguages,
        isSaved: false,
        ...languagesHistoryUpdate,
      };

    case 'UPDATE_LANGUAGE':
      const updatedLanguageItems = state.resumeData.languages.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedLanguageData = {
        ...state.resumeData,
        languages: updatedLanguageItems
      };
      const updateLanguageHistoryUpdate = addToHistory(updatedLanguageData);
      return {
        ...state,
        resumeData: updatedLanguageData,
        isSaved: false,
        ...updateLanguageHistoryUpdate,
      };

    case 'REMOVE_LANGUAGE':
      const filteredLanguages = state.resumeData.languages.filter((_, index) => index !== action.payload);
      const removedLanguageData = {
        ...state.resumeData,
        languages: filteredLanguages
      };
      const removeLanguageHistoryUpdate = addToHistory(removedLanguageData);
      return {
        ...state,
        resumeData: removedLanguageData,
        isSaved: false,
        ...removeLanguageHistoryUpdate,
      };

    case 'ADD_CERTIFICATE':
      const updatedCertificates = {
        ...state.resumeData,
        certificates: [...state.resumeData.certificates, action.payload]
      };
      const certificatesHistoryUpdate = addToHistory(updatedCertificates);
      return {
        ...state,
        resumeData: updatedCertificates,
        isSaved: false,
        ...certificatesHistoryUpdate,
      };

    case 'UPDATE_CERTIFICATE':
      const updatedCertificateItems = state.resumeData.certificates.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedCertificateData = {
        ...state.resumeData,
        certificates: updatedCertificateItems
      };
      const updateCertificateHistoryUpdate = addToHistory(updatedCertificateData);
      return {
        ...state,
        resumeData: updatedCertificateData,
        isSaved: false,
        ...updateCertificateHistoryUpdate,
      };

    case 'REMOVE_CERTIFICATE':
      const filteredCertificates = state.resumeData.certificates.filter((_, index) => index !== action.payload);
      const removedCertificateData = {
        ...state.resumeData,
        certificates: filteredCertificates
      };
      const removeCertificateHistoryUpdate = addToHistory(removedCertificateData);
      return {
        ...state,
        resumeData: removedCertificateData,
        isSaved: false,
        ...removeCertificateHistoryUpdate,
      };

    case 'ADD_PUBLICATION':
      const updatedPublications = {
        ...state.resumeData,
        publications: [...state.resumeData.publications, action.payload]
      };
      const publicationsHistoryUpdate = addToHistory(updatedPublications);
      return {
        ...state,
        resumeData: updatedPublications,
        isSaved: false,
        ...publicationsHistoryUpdate,
      };

    case 'UPDATE_PUBLICATION':
      const updatedPublicationItems = state.resumeData.publications.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedPublicationData = {
        ...state.resumeData,
        publications: updatedPublicationItems
      };
      const updatePublicationHistoryUpdate = addToHistory(updatedPublicationData);
      return {
        ...state,
        resumeData: updatedPublicationData,
        isSaved: false,
        ...updatePublicationHistoryUpdate,
      };

    case 'REMOVE_PUBLICATION':
      const filteredPublications = state.resumeData.publications.filter((_, index) => index !== action.payload);
      const removedPublicationData = {
        ...state.resumeData,
        publications: filteredPublications
      };
      const removePublicationHistoryUpdate = addToHistory(removedPublicationData);
      return {
        ...state,
        resumeData: removedPublicationData,
        isSaved: false,
        ...removePublicationHistoryUpdate,
      };

    case 'ADD_VOLUNTEER':
      const updatedVolunteers = {
        ...state.resumeData,
        volunteer: [...state.resumeData.volunteer, action.payload]
      };
      const volunteersHistoryUpdate = addToHistory(updatedVolunteers);
      return {
        ...state,
        resumeData: updatedVolunteers,
        isSaved: false,
        ...volunteersHistoryUpdate,
      };

    case 'UPDATE_VOLUNTEER':
      const updatedVolunteerItems = state.resumeData.volunteer.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedVolunteerData = {
        ...state.resumeData,
        volunteer: updatedVolunteerItems
      };
      const updateVolunteerHistoryUpdate = addToHistory(updatedVolunteerData);
      return {
        ...state,
        resumeData: updatedVolunteerData,
        isSaved: false,
        ...updateVolunteerHistoryUpdate,
      };

    case 'REMOVE_VOLUNTEER':
      const filteredVolunteers = state.resumeData.volunteer.filter((_, index) => index !== action.payload);
      const removedVolunteerData = {
        ...state.resumeData,
        volunteer: filteredVolunteers
      };
      const removeVolunteerHistoryUpdate = addToHistory(removedVolunteerData);
      return {
        ...state,
        resumeData: removedVolunteerData,
        isSaved: false,
        ...removeVolunteerHistoryUpdate,
      };

    case 'ADD_INTEREST':
      const updatedInterests = {
        ...state.resumeData,
        interests: [...state.resumeData.interests, action.payload]
      };
      const interestsHistoryUpdate = addToHistory(updatedInterests);
      return {
        ...state,
        resumeData: updatedInterests,
        isSaved: false,
        ...interestsHistoryUpdate,
      };

    case 'UPDATE_INTEREST':
      const updatedInterestItems = state.resumeData.interests.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedInterestData = {
        ...state.resumeData,
        interests: updatedInterestItems
      };
      const updateInterestHistoryUpdate = addToHistory(updatedInterestData);
      return {
        ...state,
        resumeData: updatedInterestData,
        isSaved: false,
        ...updateInterestHistoryUpdate,
      };

    case 'REMOVE_INTEREST':
      const filteredInterests = state.resumeData.interests.filter((_, index) => index !== action.payload);
      const removedInterestData = {
        ...state.resumeData,
        interests: filteredInterests
      };
      const removeInterestHistoryUpdate = addToHistory(removedInterestData);
      return {
        ...state,
        resumeData: removedInterestData,
        isSaved: false,
        ...removeInterestHistoryUpdate,
      };

    case 'ADD_REFERENCE':
      const updatedReferences = {
        ...state.resumeData,
        references: [...state.resumeData.references, action.payload]
      };
      const referencesHistoryUpdate = addToHistory(updatedReferences);
      return {
        ...state,
        resumeData: updatedReferences,
        isSaved: false,
        ...referencesHistoryUpdate,
      };

    case 'UPDATE_REFERENCE':
      const updatedReferenceItems = state.resumeData.references.map((item, index) => 
        index === action.payload.index ? { ...item, ...action.payload.data } : item
      );
      const updatedReferenceData = {
        ...state.resumeData,
        references: updatedReferenceItems
      };
      const updateReferenceHistoryUpdate = addToHistory(updatedReferenceData);
      return {
        ...state,
        resumeData: updatedReferenceData,
        isSaved: false,
        ...updateReferenceHistoryUpdate,
      };

    case 'REMOVE_REFERENCE':
      const filteredReferences = state.resumeData.references.filter((_, index) => index !== action.payload);
      const removedReferenceData = {
        ...state.resumeData,
        references: filteredReferences
      };
      const removeReferenceHistoryUpdate = addToHistory(removedReferenceData);
      return {
        ...state,
        resumeData: removedReferenceData,
        isSaved: false,
        ...removeReferenceHistoryUpdate,
      };

    case 'SET_THEME':
      return {
        ...state,
        currentTheme: action.payload,
        isSaved: false,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'MARK_SAVED':
      return {
        ...state,
        isSaved: true,
      };

    default:
      return state;
  }
};

interface ResumeContextType {
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
