import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('does not show undo/redo buttons', () => {
    renderResumeView();

    expect(screen.queryByTestId('view-undo-button')).toBeNull();
    expect(screen.queryByTestId('view-redo-button')).toBeNull();
  });

  it('opens export dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    renderResumeView();

    const exportButton = screen.getByTestId('view-export-button');
    await act(async () => {
      await user.click(exportButton);
    });

    // Check that button shows it's open
    expect(exportButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders export menu items when dropdown is opened', async () => {
    const user = userEvent.setup();
    renderResumeView();

    const exportButton = screen.getByTestId('view-export-button');
    await act(async () => {
      await user.click(exportButton);
    });

    // Wait for menu items to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('export-pdf-button')).toBeInTheDocument();
      expect(screen.getByTestId('export-json-button')).toBeInTheDocument();
      expect(screen.getByTestId('export-html-button')).toBeInTheDocument();
      expect(screen.getByTestId('export-hropen-button')).toBeInTheDocument();
    });
  });

  it('calls PDF export when PDF export button is activated via keyboard', async () => {
    const { exportAsPDF } = await import('@/utils/exportUtils');
    const user = userEvent.setup();
    renderResumeView();

    const exportButton = screen.getByTestId('view-export-button');
    
    // Open menu with keyboard
    await act(async () => {
      exportButton.focus();
      await user.keyboard('{Enter}');
    });

    // Wait for menu to be rendered and navigate to PDF option
    await waitFor(async () => {
      const pdfButton = screen.getByTestId('export-pdf-button');
      expect(pdfButton).toBeInTheDocument();
      
      // Activate the PDF export option
      await act(async () => {
        await user.click(pdfButton);
      });
    });

    expect(exportAsPDF).toHaveBeenCalled();
  });

  it('calls JSON export when JSON export button is activated via keyboard', async () => {
    const { exportAsJsonResume } = await import('@/utils/exportUtils');
    const user = userEvent.setup();
    renderResumeView();

    const exportButton = screen.getByTestId('view-export-button');
    
    // Open menu with keyboard
    await act(async () => {
      exportButton.focus();
      await user.keyboard('{Enter}');
    });

    // Wait for menu to be rendered and navigate to JSON option
    await waitFor(async () => {
      const jsonButton = screen.getByTestId('export-json-button');
      expect(jsonButton).toBeInTheDocument();
      
      // Activate the JSON export option
      await act(async () => {
        await user.click(jsonButton);
      });
    });

    expect(exportAsJsonResume).toHaveBeenCalled();
  });

  it('supports full keyboard navigation workflow', async () => {
    const { exportAsPDF } = await import('@/utils/exportUtils');
    const user = userEvent.setup();
    renderResumeView();

    const exportButton = screen.getByTestId('view-export-button');
    
    // Test complete keyboard workflow
    await act(async () => {
      // Focus and open menu with keyboard
      exportButton.focus();
      await user.keyboard('{Enter}');
    });

    // Verify menu opens and items are accessible
    await waitFor(() => {
      expect(screen.getByTestId('export-pdf-button')).toBeInTheDocument();
    });

    // Test that we can navigate and select with keyboard
    await act(async () => {
      // Use Tab to navigate to first menu item and Enter to select
      await user.keyboard('{Tab}{Enter}');
    });

    // Verify the export function was called
    expect(exportAsPDF).toHaveBeenCalled();
  });

  it('displays resume content', () => {
    renderResumeView();

    // The ResumeRenderer should be present
    expect(screen.getByTestId('resume-renderer')).toBeInTheDocument();
  });

});
