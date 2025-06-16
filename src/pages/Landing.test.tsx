import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Landing from './Landing';

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderLanding = () => {
  return render(
    <BrowserRouter>
      <Landing />
    </BrowserRouter>
  );
};

describe('Landing Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset viewport to default
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it('renders the landing page with all main components', () => {
    renderLanding();

    expect(screen.getAllByText('No Strings Resume')).toHaveLength(2); // Header and footer
    expect(screen.getByText('Resume Builder with')).toBeInTheDocument();
    expect(screen.getByText('No Strings Attached')).toBeInTheDocument();
    expect(screen.getByTestId('start-building-btn')).toBeInTheDocument();
    expect(screen.getByTestId('view-sample-resume-btn')).toBeInTheDocument();
    expect(screen.getByTestId('contribute-btn')).toBeInTheDocument();
  });

  describe('Contribute Button', () => {
    it('renders the contribute button with both icon and text', () => {
      renderLanding();

      const contributeButton = screen.getByTestId('contribute-btn');
      expect(contributeButton).toBeInTheDocument();
      expect(contributeButton).toBeVisible();

      // Check for heart icon (lucide-react renders as svg)
      const heartIcon = contributeButton.querySelector('svg');
      expect(heartIcon).toBeInTheDocument();

      // Check for text content
      expect(contributeButton).toHaveTextContent('Contribute');
    });

    it('is always visible and clickable', () => {
      renderLanding();

      const contributeButton = screen.getByTestId('contribute-btn');
      expect(contributeButton).toBeVisible();
      expect(contributeButton).toBeEnabled();
      expect(contributeButton).not.toHaveAttribute('disabled');
    });

    it('navigates to contribute page when clicked', async () => {
      const user = userEvent.setup();
      renderLanding();

      const contributeButton = screen.getByTestId('contribute-btn');
      await act(async () => {
        await user.click(contributeButton);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/contribute');
    });

    it('is focusable and accessible via keyboard', async () => {
      const user = userEvent.setup();
      renderLanding();

      const contributeButton = screen.getByTestId('contribute-btn');
      
      await act(async () => {
        await user.tab(); // Tab to first focusable element
        await user.tab(); // Tab to contribute button (assuming it's the second focusable element)
      });

      // Check if the button can receive focus
      contributeButton.focus();
      expect(contributeButton).toHaveFocus();

      // Test keyboard activation
      await act(async () => {
        await user.keyboard('{Enter}');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/contribute');
    });

    it('has proper CSS classes for responsive behavior', () => {
      renderLanding();

      const contributeButton = screen.getByTestId('contribute-btn');
      
      // Button should always be flexed and have proper layout classes
      expect(contributeButton).toHaveClass('flex', 'items-center', 'space-x-2');

      // Find the text span
      const textSpan = contributeButton.querySelector('span');
      expect(textSpan).toBeInTheDocument();
      expect(textSpan).toHaveClass('hidden', 'sm:inline');
    });

    it('maintains proper structure with icon and text elements', () => {
      renderLanding();

      const contributeButton = screen.getByTestId('contribute-btn');
      
      // Check that it contains both icon and text
      const heartIcon = contributeButton.querySelector('svg');
      const textSpan = contributeButton.querySelector('span');
      
      expect(heartIcon).toBeInTheDocument();
      expect(textSpan).toBeInTheDocument();
      expect(textSpan).toHaveTextContent('Contribute');
    });

    it('has proper ARIA attributes for accessibility', () => {
      renderLanding();

      const contributeButton = screen.getByTestId('contribute-btn');
      
      // Button should have proper role and be clickable
      expect(contributeButton.tagName).toBe('BUTTON');
      
      // Should have accessible text content
      expect(contributeButton).toHaveTextContent('Contribute');
    });
  });

  describe('Navigation Functionality', () => {
    it('navigates to edit page when start building is clicked', async () => {
      const user = userEvent.setup();
      renderLanding();

      const startBuildingBtn = screen.getByTestId('start-building-btn');
      await act(async () => {
        await user.click(startBuildingBtn);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/edit');
    });

    it('navigates to view page when view sample is clicked', async () => {
      const user = userEvent.setup();
      renderLanding();

      const viewSampleBtn = screen.getByTestId('view-sample-resume-btn');
      await act(async () => {
        await user.click(viewSampleBtn);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/view');
    });
  });

  describe('Responsive Design', () => {
    it('displays all key elements regardless of screen size simulation', () => {
      renderLanding();

      // All main interactive elements should be present
      expect(screen.getByTestId('start-building-btn')).toBeInTheDocument();
      expect(screen.getByTestId('view-sample-resume-btn')).toBeInTheDocument();
      expect(screen.getByTestId('contribute-btn')).toBeInTheDocument();
      
      // Hero content should be present
      expect(screen.getByText('Resume Builder with')).toBeInTheDocument();
      expect(screen.getByText('No Strings Attached')).toBeInTheDocument();
    });

    it('maintains contribute button visibility in all scenarios', () => {
      renderLanding();

      const contributeButton = screen.getByTestId('contribute-btn');
      
      // Button should be visible and functional
      expect(contributeButton).toBeVisible();
      expect(contributeButton).toBeEnabled();
      
      // Icon should be present
      const heartIcon = contributeButton.querySelector('svg');
      expect(heartIcon).toBeInTheDocument();
    });
  });

  describe('Content Structure', () => {
    it('displays the correct hero heading', () => {
      renderLanding();

      expect(screen.getByText('Resume Builder with')).toBeInTheDocument();
      expect(screen.getByText('No Strings Attached')).toBeInTheDocument();
    });

    it('displays feature cards', () => {
      renderLanding();

      expect(screen.getByText('Privacy First')).toBeInTheDocument();
      expect(screen.getByText('Easy Editing')).toBeInTheDocument();
      expect(screen.getByText('Theme Customization')).toBeInTheDocument();
      expect(screen.getByText('Multiple Formats')).toBeInTheDocument();
    });

    it('displays user persona sections', () => {
      renderLanding();

      expect(screen.getByText('The Practical Applicant')).toBeInTheDocument();
      expect(screen.getByText('The Spontaneous Job Seeker')).toBeInTheDocument();
      expect(screen.getByText('The Privacy-Conscious User')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderLanding();

      // Should have h1 for the main title
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Main hero heading should be present (it's broken across multiple elements)
      expect(screen.getByText('Resume Builder with')).toBeInTheDocument();
      expect(screen.getByText('No Strings Attached')).toBeInTheDocument();
    });

    it('has accessible button labels', () => {
      renderLanding();

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        // Each button should have accessible text
        expect(button.textContent?.trim()).toBeTruthy();
        expect(button.textContent?.trim().length).toBeGreaterThan(0);
      });
    });
  });
}); 