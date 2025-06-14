import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ResumeData } from '../types/resume';
import { getDefaultResumeData } from '../utils/defaultData';

interface ResumeState {
  resumeData: ResumeData;
  isLoading: boolean;
  lastSaved: Date | null;
}

type ResumeAction = 
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'UPDATE_BASICS'; payload: Partial<ResumeData['basics']> }
  | { type: 'UPDATE_SECTION_VISIBILITY'; payload: { section: keyof ResumeData['sectionVisibility']; visible: boolean } }
  | { type: 'ADD_WORK_EXPERIENCE'; payload: ResumeData['work'][0] }
  | { type: 'UPDATE_WORK_EXPERIENCE'; payload: { index: number; data: Partial<ResumeData['work'][0]> } }
  | { type: 'REMOVE_WORK_EXPERIENCE'; payload: number }
  | { type: 'ADD_EDUCATION'; payload: ResumeData['education'][0] }
  | { type: 'UPDATE_EDUCATION'; payload: { index: number; data: Partial<ResumeData['education'][0]> } }
  | { type: 'REMOVE_EDUCATION'; payload: number }
  | { type: 'UPDATE_SKILLS'; payload: ResumeData['skills'] }
  | { type: 'ADD_PROJECT'; payload: ResumeData['projects'][0] }
  | { type: 'UPDATE_PROJECT'; payload: { index: number; data: Partial<ResumeData['projects'][0]> } }
  | { type: 'REMOVE_PROJECT'; payload: number }
  | { type: 'ADD_AWARD'; payload: ResumeData['awards'][0] }
  | { type: 'UPDATE_AWARD'; payload: { index: number; data: Partial<ResumeData['awards'][0]> } }
  | { type: 'REMOVE_AWARD'; payload: number }
  | { type: 'ADD_CERTIFICATE'; payload: ResumeData['certificates'][0] }
  | { type: 'UPDATE_CERTIFICATE'; payload: { index: number; data: Partial<ResumeData['certificates'][0]> } }
  | { type: 'REMOVE_CERTIFICATE'; payload: number }
  | { type: 'ADD_LANGUAGE'; payload: ResumeData['languages'][0] }
  | { type: 'UPDATE_LANGUAGE'; payload: { index: number; data: Partial<ResumeData['languages'][0]> } }
  | { type: 'REMOVE_LANGUAGE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'MARK_SAVED' };

const initialState: ResumeState = {
  resumeData: getDefaultResumeData(),
  isLoading: false,
  lastSaved: null,
};

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'SET_RESUME_DATA':
      return { ...state, resumeData: action.payload };
    
    case 'UPDATE_BASICS':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          basics: { ...state.resumeData.basics, ...action.payload }
        }
      };
    
    case 'UPDATE_SECTION_VISIBILITY':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          sectionVisibility: {
            ...state.resumeData.sectionVisibility,
            [action.payload.section]: action.payload.visible
          }
        }
      };
    
    case 'ADD_WORK_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          work: [...state.resumeData.work, action.payload]
        }
      };
    
    case 'UPDATE_WORK_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          work: state.resumeData.work.map((exp, index) => 
            index === action.payload.index 
              ? { ...exp, ...action.payload.data }
              : exp
          )
        }
      };
    
    case 'REMOVE_WORK_EXPERIENCE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          work: state.resumeData.work.filter((_, index) => index !== action.payload)
        }
      };
    
    case 'ADD_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: [...state.resumeData.education, action.payload]
        }
      };
    
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.map((edu, index) => 
            index === action.payload.index 
              ? { ...edu, ...action.payload.data }
              : edu
          )
        }
      };
    
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          education: state.resumeData.education.filter((_, index) => index !== action.payload)
        }
      };
    
    case 'UPDATE_SKILLS':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          skills: action.payload
        }
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: [...state.resumeData.projects, action.payload]
        }
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: state.resumeData.projects.map((project, index) =>
            index === action.payload.index
              ? { ...project, ...action.payload.data }
              : project
          )
        }
      };

    case 'REMOVE_PROJECT':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          projects: state.resumeData.projects.filter((_, index) => index !== action.payload)
        }
      };

      case 'ADD_AWARD':
        return {
          ...state,
          resumeData: {
            ...state.resumeData,
            awards: [...state.resumeData.awards, action.payload]
          }
        };
  
      case 'UPDATE_AWARD':
        return {
          ...state,
          resumeData: {
            ...state.resumeData,
            awards: state.resumeData.awards.map((award, index) =>
              index === action.payload.index
                ? { ...award, ...action.payload.data }
                : award
            )
          }
        };
  
      case 'REMOVE_AWARD':
        return {
          ...state,
          resumeData: {
            ...state.resumeData,
            awards: state.resumeData.awards.filter((_, index) => index !== action.payload)
          }
        };

    case 'ADD_CERTIFICATE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          certificates: [...state.resumeData.certificates, action.payload]
        }
      };

    case 'UPDATE_CERTIFICATE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          certificates: state.resumeData.certificates.map((certificate, index) =>
            index === action.payload.index
              ? { ...certificate, ...action.payload.data }
              : certificate
          )
        }
      };

    case 'REMOVE_CERTIFICATE':
      return {
        ...state,
        resumeData: {
          ...state.resumeData,
          certificates: state.resumeData.certificates.filter((_, index) => index !== action.payload)
        }
      };

      case 'ADD_LANGUAGE':
        return {
          ...state,
          resumeData: {
            ...state.resumeData,
            languages: [...state.resumeData.languages, action.payload]
          }
        };
  
      case 'UPDATE_LANGUAGE':
        return {
          ...state,
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.map((language, index) =>
              index === action.payload.index
                ? { ...language, ...action.payload.data }
                : language
            )
          }
        };
  
      case 'REMOVE_LANGUAGE':
        return {
          ...state,
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.filter((_, index) => index !== action.payload)
          }
        };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'MARK_SAVED':
      return { ...state, lastSaved: new Date() };
    
    default:
      return state;
  }
}

const ResumeContext = createContext<{
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
} | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('nostrings-resume-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'SET_RESUME_DATA', payload: parsed });
        console.log('Loaded resume data from localStorage');
      } catch (error) {
        console.error('Failed to parse saved resume data:', error);
      }
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (state.lastSaved !== null || state.resumeData !== getDefaultResumeData()) {
      localStorage.setItem('nostrings-resume-data', JSON.stringify(state.resumeData));
      dispatch({ type: 'MARK_SAVED' });
      console.log('Saved resume data to localStorage');
    }
  }, [state.resumeData]);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
