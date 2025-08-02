
import { Theme } from '../types/resume';

export function getDefaultThemes(): Theme[] {
  return [
    {
      id: 'professional',
      name: 'Professional Blue',
      colors: {
        primary: '#1e40af',        // Name & Headings - Strong blue for impact
        secondary: '#3b82f6',      // Professional Title - Complementary blue
        accent: '#0ea5e9',         // Companies & Organizations - Bright blue for emphasis
        text: '#1e293b',           // Body Text - Dark gray for readability
        textSecondary: '#64748b',  // Secondary Text - Medium gray for dates/locations
        background: '#ffffff',     // Background - Clean white
        border: '#e2e8f0'          // Borders & Lines - Light gray for subtle structure
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5
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
      name: 'Modern Teal',
      colors: {
        primary: '#0f172a',        // Name & Headings - Deep charcoal for authority
        secondary: '#0d9488',      // Professional Title - Modern teal accent
        accent: '#14b8a6',         // Companies & Organizations - Bright teal for distinction
        text: '#334155',           // Body Text - Balanced dark gray
        textSecondary: '#64748b',  // Secondary Text - Medium gray
        background: '#ffffff',     // Background - Pure white
        border: '#cbd5e1'          // Borders & Lines - Soft gray structure
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5
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
        primary: '#581c87',        // Name & Headings - Rich purple for sophistication
        secondary: '#7c3aed',      // Professional Title - Vibrant purple
        accent: '#a855f7',         // Companies & Organizations - Lighter purple highlight
        text: '#1f2937',           // Body Text - Charcoal for excellent readability
        textSecondary: '#6b7280',  // Secondary Text - Warm gray
        background: '#ffffff',     // Background - Clean white
        border: '#e5e7eb'          // Borders & Lines - Soft gray framework
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5
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
      id: 'executive',
      name: 'Executive Black',
      colors: {
        primary: '#000000',        // Name & Headings - Bold black for executive presence
        secondary: '#374151',      // Professional Title - Professional gray
        accent: '#dc2626',         // Companies & Organizations - Strategic red accent
        text: '#111827',           // Body Text - Near black for strong contrast
        textSecondary: '#6b7280',  // Secondary Text - Balanced gray
        background: '#ffffff',     // Background - Crisp white
        border: '#d1d5db'          // Borders & Lines - Subtle gray structure
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5
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
      id: 'creative',
      name: 'Creative Orange',
      colors: {
        primary: '#ea580c',        // Name & Headings - Bold orange for creativity
        secondary: '#dc2626',      // Professional Title - Energetic red
        accent: '#f59e0b',         // Companies & Organizations - Warm yellow-orange
        text: '#1f2937',           // Body Text - Dark gray for balance
        textSecondary: '#6b7280',  // Secondary Text - Neutral gray
        background: '#ffffff',     // Background - Clean white base
        border: '#fed7aa'          // Borders & Lines - Soft orange tint
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5
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
      id: 'minimalist',
      name: 'Minimalist Gray',
      colors: {
        primary: '#111827',        // Name & Headings - Deep charcoal for clarity
        secondary: '#4b5563',      // Professional Title - Medium gray
        accent: '#6b7280',         // Companies & Organizations - Subtle gray accent
        text: '#374151',           // Body Text - Readable dark gray
        textSecondary: '#9ca3af',  // Secondary Text - Light gray for hierarchy
        background: '#ffffff',     // Background - Pure white
        border: '#f3f4f6'          // Borders & Lines - Very light gray for minimal structure
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5
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
