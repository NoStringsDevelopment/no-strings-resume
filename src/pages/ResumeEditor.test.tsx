
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ResumeProvider } from '@/context/ResumeContext';
import ResumeEditor from './ResumeEditor';
import { vi } from 'vitest';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock fetch for default resume loading
global.fetch = vi.fn();

const renderResumeEditor = () => {
  return render(
    <BrowserRouter>
      <ResumeProvider>
        <ResumeEditor />
      </ResumeProvider>
    </BrowserRouter>
  );
};

describe('ResumeEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the resume editor with main components', () => {
    renderResumeEditor();
    
    expect(screen.getByTestId('resume-editor')).toBeInTheDocument();
    expect(screen.getByTestId('editor-header')).toBeInTheDocument();
    expect(screen.getByTestId('editor-main')).toBeInTheDocument();
    expect(screen.getByTestId('editor-tabs')).toBeInTheDocument();
  });

  it('displays all tab options', () => {
    renderResumeEditor();
    
    expect(screen.getByTestId('basics-tab')).toBeInTheDocument();
    expect(screen.getByTestId('work-tab')).toBeInTheDocument();
    expect(screen.getByTestId('education-tab')).toBeInTheDocument();
    expect(screen.getByTestId('skills-tab')).toBeInTheDocument();
    expect(screen.getByTestId('projects-tab')).toBeInTheDocument();
    expect(screen.getByTestId('awards-tab')).toBeInTheDocument();
    expect(screen.getByTestId('languages-tab')).toBeInTheDocument();
    expect(screen.getByTestId('more-tab')).toBeInTheDocument();
  });

  it('shows header action buttons', () => {
    renderResumeEditor();
    
    expect(screen.getByTestId('home-button')).toBeInTheDocument();
    expect(screen.getByTestId('undo-button')).toBeInTheDocument();
    expect(screen.getByTestId('redo-button')).toBeInTheDocument();
    expect(screen.getByTestId('import-button')).toBeInTheDocument();
    expect(screen.getByTestId('backup-button')).toBeInTheDocument();
    expect(screen.getByTestId('clear-button')).toBeInTheDocument();
    expect(screen.getByTestId('reset-button')).toBeInTheDocument();
    expect(screen.getByTestId('view-button')).toBeInTheDocument();
    expect(screen.getByTestId('theme-button')).toBeInTheDocument();
  });

  it('switches between tabs correctly', () => {
    renderResumeEditor();
    
    // Default should be basics tab
    expect(screen.getByTestId('basics-content')).toBeInTheDocument();
    
    // Switch to work tab
    fireEvent.click(screen.getByTestId('work-tab'));
    expect(screen.getByTestId('work-content')).toBeInTheDocument();
    
    // Switch to education tab
    fireEvent.click(screen.getByTestId('education-tab'));
    expect(screen.getByTestId('education-content')).toBeInTheDocument();
  });

  it('handles file import trigger', () => {
    renderResumeEditor();
    
    const importButton = screen.getByTestId('import-button');
    const fileInput = screen.getByTestId('file-input');
    
    fireEvent.click(importButton);
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', '.json');
  });

  it('handles reset to default action', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ basics: { name: 'Test Name' } }),
    });
    global.fetch = mockFetch;

    renderResumeEditor();
    
    const resetButton = screen.getByTestId('reset-button');
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/resume.json');
    });
  });

  it('displays correct tooltip text for backup button', () => {
    renderResumeEditor();
    
    const backupButton = screen.getByTestId('backup-button');
    expect(backupButton).toHaveAttribute('title', 'Backup');
  });
});
