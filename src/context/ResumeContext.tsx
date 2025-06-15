import React, { createContext, useReducer, useEffect, ReactNode, useContext } from 'react';
import { ResumeData, WorkExperience, Education, Skill, Project, Award, Language, Certificate, Publication, Volunteer, Interest, Reference, Basics, SectionVisibility } from '@/types/resume';
import { getDefaultResumeData } from '@/utils/defaultData';
import { normalizeResumeData, normalizeStoredData } from '@/utils/dataHelpers';

interface ResumeState {
  resumeData: ResumeData;
  history: ResumeData[];
  currentHistoryIndex: number;
  historyIndex: number; // Added for backward compatibility
  isLoading: boolean;
}

type ResumeAction =
  | { type: 'UPDATE_RESUME'; payload: ResumeData }
  | { type: 'LOAD_RESUME'; payload: ResumeData }
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'CLEAR_ALL' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_LOADING'; payload: boolean }
  // Basics actions
  | { type: 'UPDATE_BASICS'; payload: Partial<Basics> }
  // Skills actions
  | { type: 'UPDATE_SKILLS'; payload: Skill[] }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: { index: number; data: Partial<Skill> } }
  | { type: 'REMOVE_SKILL'; payload: number }
  // Education actions
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { index: number; data: Partial<Education> } }
  | { type: 'REMOVE_EDUCATION'; payload: number }
  // Project actions  
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { index: number; data: Partial<Project> } }
  | { type: 'REMOVE_PROJECT'; payload: number }
  // Work actions
  | { type: 'ADD_WORK_EXPERIENCE'; payload: WorkExperience }
  | { type: 'UPDATE_WORK_EXPERIENCE'; payload: { index: number; data: Partial<WorkExperience> } }
  | { type: 'REMOVE_WORK_EXPERIENCE'; payload: number }
  // Certificate actions
  | { type: 'ADD_CERTIFICATE'; payload: Certificate }
  | { type: 'UPDATE_CERTIFICATE'; payload: { index: number; data: Partial<Certificate> } }
  | { type: 'REMOVE_CERTIFICATE'; payload: number }
  // Publication actions
  | { type: 'ADD_PUBLICATION'; payload: Publication }
  | { type: 'UPDATE_PUBLICATION'; payload: { index: number; data: Partial<Publication> } }
  | { type: 'REMOVE_PUBLICATION'; payload: number }
  // Volunteer actions
  | { type: 'ADD_VOLUNTEER'; payload: Volunteer }
  | { type: 'UPDATE_VOLUNTEER'; payload: { index: number; data: Partial<Volunteer> } }
  | { type: 'REMOVE_VOLUNTEER'; payload: number }
  // Interest actions
  | { type: 'ADD_INTEREST'; payload: Interest }
  | { type: 'UPDATE_INTEREST'; payload: { index: number; data: Partial<Interest> } }
  | { type: 'REMOVE_INTEREST'; payload: number }
  // Reference actions
  | { type: 'ADD_REFERENCE'; payload: Reference }
  | { type: 'UPDATE_REFERENCE'; payload: { index: number; data: Partial<Reference> } }
  | { type: 'REMOVE_REFERENCE'; payload: number }
  // Language actions
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_LANGUAGE'; payload: { index: number; data: Partial<Language> } }
  | { type: 'REMOVE_LANGUAGE'; payload: number }
  // Award actions
  | { type: 'ADD_AWARD'; payload: Award }
  | { type: 'UPDATE_AWARD'; payload: { index: number; data: Partial<Award> } }
  | { type: 'REMOVE_AWARD'; payload: number }
  // Section visibility actions
  | { type: 'UPDATE_SECTION_VISIBILITY'; payload: Partial<SectionVisibility> };

const addToHistory = (state: ResumeState, newResumeData: ResumeData) => {
  const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
  newHistory.push(newResumeData);
  // Keep history size reasonable (max 50 entries)
  if (newHistory.length > 50) {
    newHistory.shift();
  }
  return {
    history: newHistory,
    currentHistoryIndex: newHistory.length - 1,
    historyIndex: newHistory.length - 1,
  };
};

const resumeReducer = (state: ResumeState, action: ResumeAction): ResumeState => {
  switch (action.type) {
    case 'UPDATE_RESUME':
    case 'SET_RESUME_DATA': {
      // Normalize data before storing
      const normalizedData = normalizeResumeData(action.payload);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'LOAD_RESUME': {
      // Normalize data before loading
      const normalizedData = normalizeResumeData(action.payload);
      return {
        ...state,
        resumeData: normalizedData,
        history: [normalizedData],
        currentHistoryIndex: 0,
        historyIndex: 0
      };
    }
    case 'CLEAR_ALL': {
      const defaultData = getDefaultResumeData();
      // Clear all data but keep the structure
      const clearedData = {
        ...defaultData,
        basics: {
          ...defaultData.basics,
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
      // Normalize cleared data to ensure consistency
      const normalizedData = normalizeResumeData(clearedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_SKILLS': {
      const updatedData = {
        ...state.resumeData,
        skills: action.payload
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_EDUCATION': {
      const updatedData = {
        ...state.resumeData,
        education: [...state.resumeData.education, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_EDUCATION': {
      const updatedData = {
        ...state.resumeData,
        education: state.resumeData.education.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_PROJECT': {
      const updatedData = {
        ...state.resumeData,
        projects: [...state.resumeData.projects, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_PROJECT': {
      const updatedData = {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_WORK_EXPERIENCE': {
      const updatedData = {
        ...state.resumeData,
        work: [...state.resumeData.work, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_WORK_EXPERIENCE': {
      const updatedData = {
        ...state.resumeData,
        work: state.resumeData.work.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_CERTIFICATE': {
      const updatedData = {
        ...state.resumeData,
        certificates: [...state.resumeData.certificates, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_CERTIFICATE': {
      const updatedData = {
        ...state.resumeData,
        certificates: state.resumeData.certificates.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_PUBLICATION': {
      const updatedData = {
        ...state.resumeData,
        publications: [...state.resumeData.publications, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_PUBLICATION': {
      const updatedData = {
        ...state.resumeData,
        publications: state.resumeData.publications.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_VOLUNTEER': {
      const updatedData = {
        ...state.resumeData,
        volunteer: [...state.resumeData.volunteer, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_VOLUNTEER': {
      const updatedData = {
        ...state.resumeData,
        volunteer: state.resumeData.volunteer.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_INTEREST': {
      const updatedData = {
        ...state.resumeData,
        interests: [...state.resumeData.interests, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_INTEREST': {
      const updatedData = {
        ...state.resumeData,
        interests: state.resumeData.interests.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_REFERENCE': {
      const updatedData = {
        ...state.resumeData,
        references: [...state.resumeData.references, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_REFERENCE': {
      const updatedData = {
        ...state.resumeData,
        references: state.resumeData.references.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_LANGUAGE': {
      const updatedData = {
        ...state.resumeData,
        languages: [...state.resumeData.languages, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_LANGUAGE': {
      const updatedData = {
        ...state.resumeData,
        languages: state.resumeData.languages.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_AWARD': {
      const updatedData = {
        ...state.resumeData,
        awards: [...state.resumeData.awards, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_AWARD': {
      const updatedData = {
        ...state.resumeData,
        awards: state.resumeData.awards.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_BASICS': {
      const updatedData = {
        ...state.resumeData,
        basics: { ...state.resumeData.basics, ...action.payload }
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'ADD_SKILL': {
      const updatedData = {
        ...state.resumeData,
        skills: [...state.resumeData.skills, action.payload]
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_SKILL': {
      const updatedData = {
        ...state.resumeData,
        skills: state.resumeData.skills.map((skill, index) => 
          index === action.payload.index ? { ...skill, ...action.payload.data } : skill
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'REMOVE_SKILL': {
      const updatedData = {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((_, index) => index !== action.payload)
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_EDUCATION': {
      const updatedData = {
        ...state.resumeData,
        education: state.resumeData.education.map((edu, index) => 
          index === action.payload.index ? { ...edu, ...action.payload.data } : edu
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_PROJECT': {
      const updatedData = {
        ...state.resumeData,
        projects: state.resumeData.projects.map((project, index) => 
          index === action.payload.index ? { ...project, ...action.payload.data } : project
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_WORK_EXPERIENCE': {
      const updatedData = {
        ...state.resumeData,
        work: state.resumeData.work.map((work, index) => 
          index === action.payload.index ? { ...work, ...action.payload.data } : work
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_CERTIFICATE': {
      const updatedData = {
        ...state.resumeData,
        certificates: state.resumeData.certificates.map((cert, index) => 
          index === action.payload.index ? { ...cert, ...action.payload.data } : cert
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_PUBLICATION': {
      const updatedData = {
        ...state.resumeData,
        publications: state.resumeData.publications.map((pub, index) => 
          index === action.payload.index ? { ...pub, ...action.payload.data } : pub
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_VOLUNTEER': {
      const updatedData = {
        ...state.resumeData,
        volunteer: state.resumeData.volunteer.map((vol, index) => 
          index === action.payload.index ? { ...vol, ...action.payload.data } : vol
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_INTEREST': {
      const updatedData = {
        ...state.resumeData,
        interests: state.resumeData.interests.map((interest, index) => 
          index === action.payload.index ? { ...interest, ...action.payload.data } : interest
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_REFERENCE': {
      const updatedData = {
        ...state.resumeData,
        references: state.resumeData.references.map((ref, index) => 
          index === action.payload.index ? { ...ref, ...action.payload.data } : ref
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_LANGUAGE': {
      const updatedData = {
        ...state.resumeData,
        languages: state.resumeData.languages.map((lang, index) => 
          index === action.payload.index ? { ...lang, ...action.payload.data } : lang
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_AWARD': {
      const updatedData = {
        ...state.resumeData,
        awards: state.resumeData.awards.map((award, index) => 
          index === action.payload.index ? { ...award, ...action.payload.data } : award
        )
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UPDATE_SECTION_VISIBILITY': {
      const updatedData = {
        ...state.resumeData,
        sectionVisibility: { ...state.resumeData.sectionVisibility, ...action.payload }
      };
      const normalizedData = normalizeResumeData(updatedData);
      const historyUpdate = addToHistory(state, normalizedData);
      return {
        ...state,
        resumeData: normalizedData,
        ...historyUpdate
      };
    }
    case 'UNDO': {
      if (state.currentHistoryIndex <= 0) return state;
      const newIndex = state.currentHistoryIndex - 1;
      return {
        ...state,
        resumeData: state.history[newIndex],
        currentHistoryIndex: newIndex,
        historyIndex: newIndex
      };
    }
    case 'REDO': {
      if (state.currentHistoryIndex >= state.history.length - 1) return state;
      const newIndex = state.currentHistoryIndex + 1;
      return {
        ...state,
        resumeData: state.history[newIndex],
        currentHistoryIndex: newIndex,
        historyIndex: newIndex
      };
    }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

const initialState: ResumeState = {
  resumeData: getDefaultResumeData(),
  history: [],
  currentHistoryIndex: -1,
  historyIndex: -1,
  isLoading: false
};

export const ResumeContext = createContext<{
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
} | null>(null);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  // Load from localStorage first, then try to load resume.json if no localStorage data
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // First try localStorage with safe normalization
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
          const normalizedData = normalizeStoredData(savedData);
          if (normalizedData) {
            dispatch({ type: 'LOAD_RESUME', payload: normalizedData });
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
          }
          // If normalization failed, clear localStorage and continue
          localStorage.removeItem('resumeData');
          console.warn('Removed invalid data from localStorage');
        }

        // If no localStorage data or it was invalid, try to load resume.json
        try {
          const response = await fetch('/resume.json');
          if (response.ok) {
            const defaultData = await response.json();
            const normalizedData = normalizeResumeData(defaultData);
            dispatch({ type: 'LOAD_RESUME', payload: normalizedData });
            dispatch({ type: 'SET_LOADING', payload: false });
            return;
          }
        } catch (fetchError) {
          console.log('Resume.json not available, using fallback data');
        }
        
        // If resume.json is not available, use the default data
        console.log('Using fallback default resume data');
        const defaultData = getDefaultResumeData();
        dispatch({ type: 'LOAD_RESUME', payload: defaultData });
        
      } catch (error) {
        console.error('Error loading resume data:', error);
        // Keep the fallback default data
        const defaultData = getDefaultResumeData();
        dispatch({ type: 'LOAD_RESUME', payload: defaultData });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever resumeData changes (but not on initial load)
  useEffect(() => {
    if (state.resumeData && Object.keys(state.resumeData).length > 0 && state.currentHistoryIndex >= 0) {
      localStorage.setItem('resumeData', JSON.stringify(state.resumeData));
    }
  }, [state.resumeData, state.currentHistoryIndex]);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
};

// Add back the useResume hook that components are expecting
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === null) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
