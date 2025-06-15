import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Contribute from './Contribute';

// Type for Ko-fi widget
interface KofiWidget {
  init: (text: string, color: string, id: string) => void;
  draw: () => void;
}

declare global {
  interface Window {
    kofiwidget2?: KofiWidget;
  }
}

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock console methods to test Ko-fi widget handling
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

// Mock Ko-fi widget
Object.defineProperty(window, 'kofiwidget2', {
  value: {
    init: vi.fn(),
    draw: vi.fn(),
  },
  writable: true,
});

const renderWithRouter = (component: JSX.Element) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Contribute Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockConsoleLog.mockClear();
    mockConsoleWarn.mockClear();
    
    // Clear any existing Ko-fi scripts
    const scripts = document.querySelectorAll('script[src*="ko-fi"]');
    scripts.forEach(script => script.remove());
  });

  afterEach(() => {
    // Cleanup scripts after each test
    const scripts = document.querySelectorAll('script[src*="ko-fi"]');
    scripts.forEach(script => script.remove());
  });

  describe('Component Mounting', () => {
    it('should render without crashing', () => {
      const { container } = renderWithRouter(<Contribute />);
      expect(container).toBeInTheDocument();
    });

    it('should display all main sections', () => {
      renderWithRouter(<Contribute />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('No Strings Resume');
      expect(screen.getByText(/Help Make/)).toBeInTheDocument();
      expect(screen.getByText('Ways to Contribute')).toBeInTheDocument();
      expect(screen.getByText('Support the Project')).toBeInTheDocument();
    });
  });

  describe('Header Section', () => {
    it('should display header with logo and navigation', () => {
      renderWithRouter(<Contribute />);
      
      // Check logo and title in header specifically
      const headerElement = screen.getByRole('banner') || screen.getByRole('contentinfo').parentElement;
      expect(headerElement).toBeInTheDocument();
      
      // Check navigation buttons
      expect(screen.getByTestId('back-to-home-btn')).toBeInTheDocument();
      expect(screen.getByTestId('start-building-btn')).toBeInTheDocument();
    });

    it('should handle navigation button clicks', () => {
      renderWithRouter(<Contribute />);
      
      // Test back to home button
      fireEvent.click(screen.getByTestId('back-to-home-btn'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
      
      // Test start building button
      fireEvent.click(screen.getByTestId('start-building-btn'));
      expect(mockNavigate).toHaveBeenCalledWith('/edit');
    });
  });

  describe('Hero Section', () => {
    it('should display hero content', () => {
      renderWithRouter(<Contribute />);
      
      // Check hero heading - using a more flexible matcher since the text is split across elements
      expect(screen.getByText(/Help Make/)).toBeInTheDocument();
      expect(screen.getByText(/Even Better/)).toBeInTheDocument();
      
      // Check gradient text specifically using test-id
      const gradientText = screen.getByTestId('gradient-text');
      expect(gradientText).toBeInTheDocument();
      expect(gradientText).toHaveClass('text-transparent');
      expect(gradientText).toHaveClass('bg-clip-text');
      expect(gradientText).toHaveClass('bg-gradient-to-r');
      
      // Check description
      expect(screen.getByText(/No Strings Resume is an open-source project/)).toBeInTheDocument();
    });

    it('should have proper gradient text styling', () => {
      renderWithRouter(<Contribute />);
      
      const gradientSpan = screen.getByTestId('gradient-text');
      const computedStyle = window.getComputedStyle(gradientSpan);
      
      // Check that the element has the gradient classes
      expect(gradientSpan.classList.contains('text-transparent')).toBe(true);
      expect(gradientSpan.classList.contains('bg-clip-text')).toBe(true);
      expect(gradientSpan.classList.contains('bg-gradient-to-r')).toBe(true);
      expect(gradientSpan.classList.contains('from-blue-600')).toBe(true);
      expect(gradientSpan.classList.contains('to-purple-600')).toBe(true);
    });
  });

  describe('Contribution Ways Section', () => {
    it('should display ways to contribute heading', () => {
      renderWithRouter(<Contribute />);
      expect(screen.getByText('Ways to Contribute')).toBeInTheDocument();
    });

    it('should display all contribution cards', () => {
      renderWithRouter(<Contribute />);
      
      const contributions = [
        'Code Contributions',
        'Report Issues', 
        'Documentation',
        'Community Support'
      ];
      
      contributions.forEach(contribution => {
        expect(screen.getByText(contribution)).toBeInTheDocument();
      });
    });

    it('should display contribution card descriptions', () => {
      renderWithRouter(<Contribute />);
      
      expect(screen.getByText(/Help improve the codebase by submitting pull requests/)).toBeInTheDocument();
      expect(screen.getByText(/Found a bug or have a feature request/)).toBeInTheDocument();
      expect(screen.getByText(/Help improve documentation/)).toBeInTheDocument();
      expect(screen.getByText(/Help other users by answering questions/)).toBeInTheDocument();
    });

    it('should have working buttons for each contribution card', () => {
      renderWithRouter(<Contribute />);
      
      const buttons = [
        'View Repository',
        'Report Issue',
        'Contribute Docs',
        'Join Discussions'
      ];
      
      buttons.forEach(buttonText => {
        const button = screen.getByText(buttonText);
        expect(button).toBeInTheDocument();
        expect(button.closest('button')).toBeInTheDocument();
      });
    });
  });

  describe('Support Section', () => {
    it('should display support project section', () => {
      renderWithRouter(<Contribute />);
      
      expect(screen.getByText('Support the Project')).toBeInTheDocument();
      expect(screen.getByText(/If you find No Strings Resume helpful/)).toBeInTheDocument();
    });

    it('should have Ko-fi iframe', () => {
      renderWithRouter(<Contribute />);
      
      const kofiIframe = document.getElementById('kofiframe');
      expect(kofiIframe).toBeInTheDocument();
      expect(kofiIframe).toHaveAttribute('src');
      expect(kofiIframe?.getAttribute('src')).toMatch(/ko-fi\.com/);
    });
  });

  describe('Footer Section', () => {
    it('should display footer content', () => {
      renderWithRouter(<Contribute />);
      
      expect(screen.getByText('Open source resume builder. Your data, your control.')).toBeInTheDocument();
      expect(screen.getByText(/Built with React, Tailwind CSS/)).toBeInTheDocument();
    });
  });

  describe('Ko-fi Widget Integration', () => {
    it('should display Ko-fi iframe with correct attributes', () => {
      renderWithRouter(<Contribute />);
      
      const kofiIframe = document.getElementById('kofiframe');
      expect(kofiIframe).toBeInTheDocument();
      expect(kofiIframe?.tagName.toLowerCase()).toBe('iframe');
      expect(kofiIframe).toHaveAttribute('title', 'Support on Ko-fi');
      expect(kofiIframe?.getAttribute('src')).toMatch(/ko-fi\.com.*leej3/);
    });

    it('should have Ko-fi iframe with proper styling', () => {
      renderWithRouter(<Contribute />);
      
      const kofiIframe = document.getElementById('kofiframe');
      expect(kofiIframe).toBeInTheDocument();
      expect(kofiIframe).toHaveClass('border-none');
      expect(kofiIframe).toHaveClass('w-full');
      expect(kofiIframe).toHaveClass('bg-gray-100');
      expect(kofiIframe).toHaveClass('rounded-lg');
    });

    it('should render Ko-fi iframe without blocking page load', () => {
      renderWithRouter(<Contribute />);
      
      // Verify that the iframe doesn't block other content from loading
      expect(screen.getByText('Support the Project')).toBeInTheDocument();
      expect(screen.getByText('Ways to Contribute')).toBeInTheDocument();
      
      const kofiIframe = document.getElementById('kofiframe');
      expect(kofiIframe).toBeInTheDocument();
    });
  });

  describe('External Links', () => {
    beforeEach(() => {
      // Mock window.open
      vi.stubGlobal('open', vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should open external links when buttons are clicked', () => {
      renderWithRouter(<Contribute />);
      
      const viewRepoButton = screen.getByText('View Repository');
      fireEvent.click(viewRepoButton);
      
      expect(window.open).toHaveBeenCalledWith(
        'https://github.com/NoStringsDevelopment/no-strings-resume',
        '_blank'
      );
    });

    it('should have correct URLs for all external links', () => {
      renderWithRouter(<Contribute />);
      
      const buttonLinks = [
        { text: 'View Repository', url: 'https://github.com/NoStringsDevelopment/no-strings-resume' },
        { text: 'Report Issue', url: 'https://github.com/NoStringsDevelopment/no-strings-resume/issues' },
        { text: 'Contribute Docs', url: 'https://github.com/NoStringsDevelopment/no-strings-resume' },
        { text: 'Join Discussions', url: 'https://github.com/NoStringsDevelopment/no-strings-resume/discussions' }
      ];
      
      buttonLinks.forEach(({ text, url }) => {
        const button = screen.getByText(text);
        fireEvent.click(button);
        expect(window.open).toHaveBeenCalledWith(url, '_blank');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderWithRouter(<Contribute />);
      
      const h1Elements = screen.getAllByRole('heading', { level: 1 });
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      
      expect(h1Elements.length).toBeGreaterThan(0);
      expect(h2Elements.length).toBeGreaterThan(0);
      expect(h3Elements.length).toBeGreaterThan(0);
    });

    it('should have accessible button text', () => {
      renderWithRouter(<Contribute />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.textContent?.trim()).toBeTruthy();
        expect((button.textContent?.trim()?.length || 0) > 2).toBe(true);
      });
    });
  });

  describe('Component Cleanup', () => {
    it('should unmount cleanly without side effects', () => {
      const { unmount } = renderWithRouter(<Contribute />);
      
      // Verify the component is mounted
      expect(screen.getByText('Support the Project')).toBeInTheDocument();
      
      // Unmount component - should not throw errors or leave behind scripts
      expect(() => unmount()).not.toThrow();
      
      // Since we're using iframe instead of dynamic scripts, 
      // there should be no Ko-fi scripts in the document
      const scriptCount = document.querySelectorAll('script[src*="ko-fi"]').length;
      expect(scriptCount).toBe(0);
    });
  });
}); 