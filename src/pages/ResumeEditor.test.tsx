import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ResumeEditor from './ResumeEditor';

const mockNavigate = vi.fn();
const mockToast = vi.fn();
const mockDispatch = vi.fn();

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
  history: [{}],
  historyIndex: 0
};

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
  }
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

vi.mock('@/context/ResumeContext', () => ({
  useResume: () => ({
    state: mockResumeState,
    dispatch: mockDispatch
  })
}));

vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({
    themeState: mockThemeState
  })
}));

// Mock editor components
vi.mock('@/components/editor/BasicEditor', () => ({
  default: () => <div data-testid="basic-editor">Basic Editor</div>
}));

vi.mock('@/components/editor/WorkEditor', () => ({
  default: () => <div data-testid="work-editor">Work Editor</div>
}));

vi.mock('@/components/editor/EducationEditor', () => ({
  default: () => <div data-testid="education-editor">Education Editor</div>
}));

vi.mock('@/components/editor/SkillsEditor', () => ({
  default: () => <div data-testid="skills-editor">Skills Editor</div>
}));

vi.mock('@/components/editor/ProjectsEditor', () => ({
  default: () => <div data-testid="projects-editor">Projects Editor</div>
}));

vi.mock('@/components/editor/AwardsEditor', () => ({
  default: () => <div data-testid="awards-editor">Awards Editor</div>
}));

vi.mock('@/components/editor/LanguagesEditor', () => ({
  default: () => <div data-testid="languages-editor">Languages Editor</div>
}));

vi.mock('@/components/editor/AdditionalSectionsEditor', () => ({
  default: () => <div data-testid="additional-sections-editor">Additional Sections Editor</div>
}));

vi.mock('@/components/display/EnhancedPreview', () => ({
  EnhancedPreview: ({ 'data-testid': testId }: { 'data-testid': string }) => 
    <div data-testid={testId || 'enhanced-preview'}>Enhanced Preview</div>
}));

vi.mock('@/utils/importExport', () => ({
  exportResumeAsJson: vi.fn(() => 'mock-json-content'),
  importResumeData: vi.fn(),
  downloadFile: vi.fn()
}));

// Mock fetch for reset functionality
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ basics: { name: 'Default Name' } })
  })
));

const renderResumeEditor = () => {
  return render(
    <BrowserRouter>
      <ResumeEditor />
    </BrowserRouter>
  );
};

describe('ResumeEditor Preview Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with preview always visible', () => {
    renderResumeEditor();
    
    expect(screen.getByTestId('resume-editor')).toBeInTheDocument();
    expect(screen.getByTestId('editor-preview')).toBeInTheDocument();
  });

  it('has two-column layout by default', () => {
    renderResumeEditor();
    
    const mainContent = screen.getByTestId('editor-main');
    
    // Should always have two-column layout
    expect(mainContent.firstChild).toHaveClass('grid', 'lg:grid-cols-2');
  });

  it('displays preview heading', () => {
    renderResumeEditor();
    
    expect(screen.getByRole('heading', { name: 'Preview' })).toBeInTheDocument();
  });

  it('preview has sticky positioning', () => {
    renderResumeEditor();
    
    const previewContainer = screen.getByTestId('editor-preview').closest('.sticky');
    expect(previewContainer).toHaveClass('sticky', 'top-8');
  });

  it('renders enhanced preview component', () => {
    renderResumeEditor();
    
    const preview = screen.getByTestId('editor-preview');
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveTextContent('Enhanced Preview');
  });

  it('maintains preview visibility across tab changes', () => {
    renderResumeEditor();
    
    // Change tabs
    const workTab = screen.getByTestId('work-tab');
    fireEvent.click(workTab);
    
    // Preview should still be visible
    expect(screen.getByTestId('editor-preview')).toBeInTheDocument();
  });
});
