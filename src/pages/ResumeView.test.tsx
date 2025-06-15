
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ResumeView from './ResumeView';
import { ResumeProvider } from '@/context/ResumeContext';
import { ThemeProvider } from '@/context/ThemeContext';

// Mock the export utilities
vi.mock('@/utils/exportUtils', () => ({
  exportAsJsonResume: vi.fn(),
  exportAsHROpen: vi.fn(),
  exportAsHTML: vi.fn(),
  exportAsPDF: vi.fn().mockResolvedValue(undefined),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const renderResumeView = () => {
  return render(
    <BrowserRouter>
      <ResumeProvider>
        <ThemeProvider>
          <ResumeView />
        </ThemeProvider>
      </ResumeProvider>
    </BrowserRouter>
  );
};

describe('ResumeView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the resume view page', () => {
    renderResumeView();

    expect(screen.getByTestId('view-home-button')).toBeInTheDocument();
    expect(screen.getByTestId('view-edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('view-export-button')).toBeInTheDocument();
    expect(screen.getByTestId('resume-display')).toBeInTheDocument();
  });

  it('shows navigation buttons', () => {
    renderResumeView();

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('shows undo/redo buttons', () => {
    renderResumeView();

    expect(screen.getByTestId('view-undo-button')).toBeInTheDocument();
    expect(screen.getByTestId('view-redo-button')).toBeInTheDocument();
  });

  it('opens export dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    renderResumeView();

    const exportButton = screen.getByTestId('view-export-button');
    await user.click(exportButton);

    // Check that button shows it's open
    expect(exportButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls PDF export when PDF export button is clicked', async () => {
    const { exportAsPDF } = await import('@/utils/exportUtils');
    const user = userEvent.setup();
    renderResumeView();

    const exportButton = screen.getByTestId('view-export-button');
    await user.click(exportButton);

    // Since the dropdown doesn't render in JSDOM properly, we'll test the export functionality by simulating keyboard navigation
    await user.keyboard('{ArrowDown}'); // Navigate to first item (PDF)
    await user.keyboard('{Enter}'); // Select PDF export

    expect(exportAsPDF).toHaveBeenCalled();
  });

  it('calls JSON export when JSON export button is clicked', async () => {
    const { exportAsJsonResume } = await import('@/utils/exportUtils');
    const user = userEvent.setup();
    renderResumeView();

    const exportButton = screen.getByTestId('view-export-button');
    await user.click(exportButton);

    // Navigate to JSON export option (3rd item)
    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}'); 
    await user.keyboard('{Enter}');

    expect(exportAsJsonResume).toHaveBeenCalled();
  });

  it('displays resume content', () => {
    renderResumeView();

    // The ResumeRenderer should be present
    expect(screen.getByTestId('resume-renderer')).toBeInTheDocument();
  });

  it('shows explanatory text', () => {
    renderResumeView();

    expect(screen.getByText(/This is how your resume will appear when exported/)).toBeInTheDocument();
  });
});
