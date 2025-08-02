import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ThemeEditor from './ThemeEditor';

const mockNavigate = vi.fn();
const mockThemeState = {
  currentTheme: {
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
  availableThemes: []
};

const mockResumeState = {
  resumeData: {
    basics: {
      name: 'John Doe',
      label: 'Software Developer',
      email: 'john@example.com',
      phone: '+1 234 567 8900',
      summary: 'Test summary',
      image: '',
      url: '',
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
  },
  history: [],
  historyIndex: 0
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    themeState: mockThemeState,
    setTheme: vi.fn()
  })
}));

vi.mock('@/context/ResumeContext', () => ({
  useResume: () => ({
    state: mockResumeState,
    dispatch: vi.fn()
  })
}));

// Mock the components to avoid complex rendering in tests
vi.mock('@/components/theme/ThemeCustomizer', () => ({
  ThemeCustomizer: () => <div data-testid="theme-customizer">Theme Customizer</div>
}));

vi.mock('@/components/display/EnhancedPreview', () => ({
  EnhancedPreview: ({ 'data-testid': testId }: { 'data-testid': string }) => 
    <div data-testid={testId || 'enhanced-preview'}>Enhanced Preview</div>
}));

const renderThemeEditor = () => {
  return render(
    <BrowserRouter>
      <ThemeEditor />
    </BrowserRouter>
  );
};

describe('ThemeEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders theme editor with header', () => {
    renderThemeEditor();
    
    expect(screen.getByTestId('home-button')).toBeInTheDocument();
    expect(screen.getByText('No Strings Resume')).toBeInTheDocument(); // Single responsive layout
    expect(screen.getByText('Theme Mode')).toBeInTheDocument();
  });

  it('renders navigation buttons in correct order', () => {
    renderThemeEditor();
    
    const editButton = screen.getByTestId('edit-button');
    const viewButton = screen.getByTestId('view-button');
    
    expect(editButton).toBeInTheDocument();
    expect(viewButton).toBeInTheDocument();
    
    // Check that edit button comes before view button in the DOM
    const buttons = screen.getAllByRole('button');
    const editIndex = buttons.findIndex(btn => btn.getAttribute('data-testid') === 'edit-button');
    const viewIndex = buttons.findIndex(btn => btn.getAttribute('data-testid') === 'view-button');
    
    expect(editIndex).toBeLessThan(viewIndex);
  });

  it('navigates to edit page when edit button is clicked', () => {
    renderThemeEditor();
    
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/edit');
  });

  it('navigates to view page when view button is clicked', () => {
    renderThemeEditor();
    
    const viewButton = screen.getByTestId('view-button');
    fireEvent.click(viewButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/view');
  });

  it('navigates to home when home button is clicked', () => {
    renderThemeEditor();
    
    const homeButton = screen.getByTestId('home-button');
    fireEvent.click(homeButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders theme customizer section', () => {
    renderThemeEditor();
    
    expect(screen.getByText('Customize Theme')).toBeInTheDocument();
    expect(screen.getByTestId('theme-customizer')).toBeInTheDocument();
  });

  it('renders enhanced preview section', () => {
    renderThemeEditor();
    
    expect(screen.getByRole('heading', { name: 'Preview' })).toBeInTheDocument();
    expect(screen.getByTestId('theme-preview')).toBeInTheDocument();
  });

  it('uses two-column layout for large screens', () => {
    renderThemeEditor();
    
    const mainContent = screen.getByRole('main');
    const gridContainer = mainContent.querySelector('.grid.lg\\:grid-cols-2');
    
    expect(gridContainer).toBeInTheDocument();
  });
});
