
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Theme } from '../types/resume';
import { getDefaultThemes } from '../utils/defaultThemes';

interface ThemeState {
  currentTheme: Theme;
  availableThemes: Theme[];
}

const ThemeContext = createContext<{
  themeState: ThemeState;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    const availableThemes = getDefaultThemes();
    return {
      currentTheme: availableThemes[0],
      availableThemes
    };
  });

  // Load theme from localStorage on mount only
  useEffect(() => {
    const savedThemeId = localStorage.getItem('nostrings-resume-theme');
    if (savedThemeId) {
      const savedTheme = themeState.availableThemes.find(t => t.id === savedThemeId);
      if (savedTheme) {
        setThemeState(prev => ({ ...prev, currentTheme: savedTheme }));
      }
    }
  }, []); // Empty dependency array - only run on mount

  // Memoize setTheme to prevent unnecessary re-renders
  const setTheme = useCallback((theme: Theme) => {
    setThemeState(prev => ({ ...prev, currentTheme: theme }));
    localStorage.setItem('nostrings-resume-theme', theme.id);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeState, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
