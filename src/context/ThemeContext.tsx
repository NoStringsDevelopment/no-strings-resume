
import React, { createContext, useContext, useState, useCallback } from 'react';
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

const THEME_STORAGE_KEY = 'nostrings-resume-theme';
const CUSTOM_THEMES_STORAGE_KEY = 'nostrings-resume-custom-themes';

function isTheme(value: unknown): value is Theme {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Theme>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.colors?.primary === 'string' &&
    typeof candidate.colors?.secondary === 'string' &&
    typeof candidate.colors?.accent === 'string' &&
    typeof candidate.colors?.text === 'string' &&
    typeof candidate.colors?.textSecondary === 'string' &&
    typeof candidate.colors?.background === 'string' &&
    typeof candidate.colors?.border === 'string' &&
    typeof candidate.typography?.fontFamily === 'string' &&
    typeof candidate.typography?.fontSize === 'number' &&
    typeof candidate.typography?.lineHeight === 'number' &&
    typeof candidate.fonts?.heading === 'string' &&
    typeof candidate.fonts?.body === 'string' &&
    typeof candidate.spacing?.section === 'string' &&
    typeof candidate.spacing?.item === 'string'
  );
}

function parseStoredCustomThemes(): Theme[] {
  const rawValue = localStorage.getItem(CUSTOM_THEMES_STORAGE_KEY);
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return Array.isArray(parsedValue) ? parsedValue.filter(isTheme) : [];
  } catch {
    return [];
  }
}

function parseStoredTheme(availableThemes: Theme[]): Theme | null {
  const rawValue = localStorage.getItem(THEME_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue);
    return isTheme(parsedValue) ? parsedValue : null;
  } catch {
    return availableThemes.find((theme) => theme.id === rawValue) ?? null;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    const defaultThemes = getDefaultThemes();
    const customThemes = parseStoredCustomThemes();
    const availableThemes = [...defaultThemes, ...customThemes.filter((theme) => !defaultThemes.some((defaultTheme) => defaultTheme.id === theme.id))];

    return {
      currentTheme: parseStoredTheme(availableThemes) ?? availableThemes[0],
      availableThemes
    };
  });

  const setTheme = useCallback((theme: Theme) => {
    const defaultThemeIds = new Set(getDefaultThemes().map((defaultTheme) => defaultTheme.id));

    setThemeState((prev) => {
      const shouldPersistAsCustomTheme = !defaultThemeIds.has(theme.id);
      const availableThemes = shouldPersistAsCustomTheme
        ? (() => {
            const existingIndex = prev.availableThemes.findIndex((availableTheme) => availableTheme.id === theme.id);
            if (existingIndex === -1) {
              return [...prev.availableThemes, theme];
            }

            return prev.availableThemes.map((availableTheme, index) =>
              index === existingIndex ? theme : availableTheme,
            );
          })()
        : prev.availableThemes;

      const customThemes = availableThemes.filter((availableTheme) => !defaultThemeIds.has(availableTheme.id));

      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
      localStorage.setItem(CUSTOM_THEMES_STORAGE_KEY, JSON.stringify(customThemes));

      return { currentTheme: theme, availableThemes };
    });
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
