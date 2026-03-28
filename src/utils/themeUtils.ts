import { Theme } from '@/types/resume';
import { getDefaultThemes } from '@/utils/defaultThemes';

function sanitizeIdentifier(value: string): string {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return sanitized || 'custom-theme';
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function normalizeThemeInput(input: unknown): Theme {
  const defaultTheme = getDefaultThemes()[0];
  const candidate = (input && typeof input === 'object' ? input : {}) as Partial<Theme>;
  const name = asString(candidate.name, defaultTheme.name);
  const fontFamily = asString(candidate.typography?.fontFamily, defaultTheme.typography.fontFamily);

  return {
    id: sanitizeIdentifier(asString(candidate.id, name)),
    name,
    colors: {
      primary: asString(candidate.colors?.primary, defaultTheme.colors.primary),
      secondary: asString(candidate.colors?.secondary, defaultTheme.colors.secondary),
      accent: asString(candidate.colors?.accent, defaultTheme.colors.accent),
      text: asString(candidate.colors?.text, defaultTheme.colors.text),
      textSecondary: asString(candidate.colors?.textSecondary, defaultTheme.colors.textSecondary),
      background: asString(candidate.colors?.background, defaultTheme.colors.background),
      border: asString(candidate.colors?.border, defaultTheme.colors.border),
    },
    typography: {
      fontFamily,
      fontSize: asNumber(candidate.typography?.fontSize, defaultTheme.typography.fontSize),
      lineHeight: asNumber(candidate.typography?.lineHeight, defaultTheme.typography.lineHeight),
    },
    fonts: {
      heading: asString(candidate.fonts?.heading, fontFamily),
      body: asString(candidate.fonts?.body, fontFamily),
    },
    spacing: {
      section: asString(candidate.spacing?.section, defaultTheme.spacing.section),
      item: asString(candidate.spacing?.item, defaultTheme.spacing.item),
    },
  };
}

export function parseImportedTheme(jsonString: string): Theme {
  let parsedTheme: unknown;

  try {
    parsedTheme = JSON.parse(jsonString);
  } catch {
    throw new Error('Theme file is not valid JSON.');
  }

  return normalizeThemeInput(parsedTheme);
}

export function serializeTheme(theme: Theme): string {
  return JSON.stringify(theme, null, 2);
}

export function generateThemeFilename(theme: Theme): string {
  return `${sanitizeIdentifier(theme.name || theme.id)}-theme.json`;
}
