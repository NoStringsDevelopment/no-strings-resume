import React, { createContext, useReducer, useEffect, ReactNode, useContext } from 'react';
import { ResumeData, WorkExperience, Education, Skill, Project, Award, Language, Certificate, Publication, Volunteer, Interest, Reference } from '@/types/resume';
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
  // Skills actions
  | { type: 'UPDATE_SKILLS'; payload: Skill[] }
  // Education actions
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'REMOVE_EDUCATION'; payload: number }
  // Project actions  
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'REMOVE_PROJECT'; payload: number }
  // Work actions
  | { type: 'ADD_WORK_EXPERIENCE'; payload: WorkExperience }
  | { type: 'REMOVE_WORK_EXPERIENCE'; payload: number }
  // Certificate actions
  | { type: 'ADD_CERTIFICATE'; payload: Certificate }
  | { type: 'REMOVE_CERTIFICATE'; payload: number }
  // Publication actions
  | { type: 'ADD_PUBLICATION'; payload: Publication }
  | { type: 'REMOVE_PUBLICATION'; payload: number }
  // Volunteer actions
  | { type: 'ADD_VOLUNTEER'; payload: Volunteer }
  | { type: 'REMOVE_VOLUNTEER'; payload: number }
  // Interest actions
  | { type: 'ADD_INTEREST'; payload: Interest }
  | { type: 'REMOVE_INTEREST'; payload: number }
  // Reference actions
  | { type: 'ADD_REFERENCE'; payload: Reference }
  | { type: 'REMOVE_REFERENCE'; payload: number }
  // Language actions
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'REMOVE_LANGUAGE'; payload: number }
  // Award actions
  | { type: 'ADD_AWARD'; payload: Award }
  | { type: 'REMOVE_AWARD'; payload: number };

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
