import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { ResumeData } from '@/types/resume';
import { getDefaultResumeData } from '@/utils/defaultData';

interface ResumeState {
  resumeData: ResumeData;
  history: ResumeData[];
  currentHistoryIndex: number;
  isLoading: boolean;
}

type ResumeAction =
  | { type: 'UPDATE_RESUME'; payload: ResumeData }
  | { type: 'LOAD_RESUME'; payload: ResumeData }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_LOADING'; payload: boolean };

const resumeReducer = (state: ResumeState, action: ResumeAction): ResumeState => {
  switch (action.type) {
    case 'UPDATE_RESUME': {
      const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
      newHistory.push(action.payload);
      
      return {
        ...state,
        resumeData: action.payload,
        history: newHistory,
        currentHistoryIndex: newHistory.length - 1
      };
    }
    case 'LOAD_RESUME':
      return {
        ...state,
        resumeData: action.payload,
        history: [action.payload],
        currentHistoryIndex: 0
      };
    case 'UNDO': {
      if (state.currentHistoryIndex <= 0) return state;
      const newIndex = state.currentHistoryIndex - 1;
      return {
        ...state,
        resumeData: state.history[newIndex],
        currentHistoryIndex: newIndex
      };
    }
    case 'REDO': {
      if (state.currentHistoryIndex >= state.history.length - 1) return state;
      const newIndex = state.currentHistoryIndex + 1;
      return {
        ...state,
        resumeData: state.history[newIndex],
        currentHistoryIndex: newIndex
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
  isLoading: false
};

export const ResumeContext = createContext<{
  state: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
} | null>(null);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(resumeReducer, initialState);

  // Load default resume data on mount
  useEffect(() => {
    const loadDefaultData = async () => {
      try {
        const response = await fetch('/resume.json');
        if (response.ok) {
          const defaultData = await response.json();
          dispatch({ type: 'LOAD_RESUME', payload: defaultData });
        } else {
          // If resume.json is not available, keep the fallback default data
          console.log('Using fallback default resume data');
        }
      } catch (error) {
        console.error('Error loading default resume data:', error);
        // Keep the fallback default data
      }
    };

    loadDefaultData();
  }, []);

  // Save to localStorage whenever resumeData changes
  useEffect(() => {
    if (state.resumeData && Object.keys(state.resumeData).length > 0) {
      localStorage.setItem('resumeData', JSON.stringify(state.resumeData));
    }
  }, [state.resumeData]);

  // Load from localStorage on initial mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_RESUME', payload: parsedData });
      } catch (e) {
        console.error('Error parsing saved resume data', e);
      }
    }
  }, []);

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      {children}
    </ResumeContext.Provider>
  );
};
