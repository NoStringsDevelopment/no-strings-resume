
import { Theme } from '../types/resume';

export function getDefaultThemes(): Theme[] {
  return [
    {
      id: 'professional',
      name: 'Professional Blue',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9',
        text: '#1e293b',
        textSecondary: '#64748b',
        background: '#ffffff',
        border: '#e2e8f0'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        section: '2rem',
        item: '1rem'
      }
    },
    {
      id: 'modern',
      name: 'Modern Gray',
      colors: {
        primary: '#374151',
        secondary: '#6b7280',
        accent: '#10b981',
        text: '#111827',
        textSecondary: '#6b7280',
        background: '#ffffff',
        border: '#d1d5db'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: {
        section: '2rem',
        item: '1rem'
      }
    },
    {
      id: 'elegant',
      name: 'Elegant Purple',
      colors: {
        primary: '#7c3aed',
        secondary: '#6b7280',
        accent: '#a855f7',
        text: '#1f2937',
        textSecondary: '#6b7280',
        background: '#ffffff',
        border: '#e5e7eb'
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
}
