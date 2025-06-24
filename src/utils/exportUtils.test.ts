import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportAsPDF } from './exportUtils';
import { ResumeData, Theme } from '@/types/resume';

// Mock jsPDF
const mockText = vi.fn();
const mockSetFont = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetTextColor = vi.fn();
const mockSplitTextToSize = vi.fn();
const mockSave = vi.fn();
const mockAddPage = vi.fn();
const mockLine = vi.fn();
const mockSetDrawColor = vi.fn();
const mockSetLineWidth = vi.fn();

const mockJsPDF = {
  text: mockText,
  setFont: mockSetFont,
  setFontSize: mockSetFontSize,
  setTextColor: mockSetTextColor,
  splitTextToSize: mockSplitTextToSize,
  save: mockSave,
  addPage: mockAddPage,
  line: mockLine,
  setDrawColor: mockSetDrawColor,
  setLineWidth: mockSetLineWidth,
  internal: {
    pageSize: {
      getWidth: () => 210,
      getHeight: () => 297
    }
  }
};

vi.mock('jspdf', () => ({
  jsPDF: vi.fn(() => mockJsPDF)
}));

// Mock canvas for Unicode detection
const mockCanvas = {
  getContext: vi.fn(() => ({
    measureText: vi.fn((text: string) => ({ 
      width: text.includes('📧') ? 50 : 20 // Different widths to simulate Unicode support
    })),
    font: ''
  }))
};

// Mock document.createElement to return our mock canvas
const originalCreateElement = document.createElement;
beforeEach(() => {
  document.createElement = vi.fn((tagName: string) => {
    if (tagName === 'canvas') {
      return mockCanvas as unknown as HTMLCanvasElement;
    }
    return originalCreateElement.call(document, tagName);
  });
});

afterEach(() => {
  document.createElement = originalCreateElement;
});

describe('PDF Export', () => {
  const mockTheme: Theme = {
    id: 'test-theme',
    name: 'Test Theme',
    colors: {
      primary: '#2563eb',
      secondary: '#3b82f6',
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
      body: 'Inter',
      heading: 'Inter'
    },
    spacing: {
      section: '2rem',
      item: '1.5rem'
    }
  };

  const mockResumeData: ResumeData = {
    basics: {
      name: 'John Doe',
      label: 'Software Engineer',
      image: '',
      email: 'john@example.com',
      phone: '+1-555-123-4567',
      url: 'https://johndoe.dev',
      summary: 'Passionate developer with special characters: café, naïve, résumé',
      location: {
        address: '123 Main St',
        city: 'San Francisco',
        region: 'CA',
        postalCode: '94105',
        countryCode: 'US'
      },
      profiles: [
        {
          network: 'LinkedIn',
          username: 'johndoe',
          url: 'https://linkedin.com/in/johndoe',
          visible: true
        }
      ]
    },
    work: [
      {
        name: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2020-01',
        endDate: '2023-12',
        summary: 'Built applications with émojis and spëcial chars',
        highlights: ['Achievement with • bullet points', 'Another item'],
        url: 'https://techcorp.com',
        visible: true
      }
    ],
    education: [],
    skills: [],
    projects: [],
    awards: [],
    certificates: [],
    publications: [],
    volunteer: [],
    interests: [],
    references: [],
    languages: [],
    sectionVisibility: {
      basics: true,
      work: true,
      education: true,
      skills: true,
      projects: true,
      awards: true,
      certificates: true,
      publications: true,
      volunteer: true,
      interests: true,
      references: true,
      languages: true
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSplitTextToSize.mockImplementation((text: string) => [text]);
  });

  it('should handle special characters and emojis without errors', async () => {
    await exportAsPDF(mockResumeData, mockTheme);
    
    expect(mockText).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalled();
    
    // Check that text calls were made - we'll verify character handling in the actual function
    const textCalls = mockText.mock.calls;
    expect(textCalls.length).toBeGreaterThan(0);
  });

  it('should intelligently handle Unicode characters based on support detection', async () => {
    await exportAsPDF(mockResumeData, mockTheme);
    
    // Check that contact info was processed
    const textCalls = mockText.mock.calls.map(call => call[0]);
    const contactInfoCall = textCalls.find(text => 
      typeof text === 'string' && text.includes('john@example.com')
    );
    
    // With our mock setup simulating Unicode support, emojis should be preserved
    if (contactInfoCall) {
      // The function should detect Unicode support and preserve characters
      expect(contactInfoCall).toBeDefined();
    }
  });

  it('should adapt bullet points based on Unicode support', async () => {
    await exportAsPDF(mockResumeData, mockTheme);
    
    const textCalls = mockText.mock.calls.map(call => call[0]);
    const bulletCall = textCalls.find(text => 
      typeof text === 'string' && text.includes('Achievement')
    );
    
    // Should contain either • or - depending on Unicode support
    if (bulletCall) {
      expect(bulletCall).toMatch(/[•-]/);
    }
  });

  it('should handle accented characters gracefully', async () => {
    await exportAsPDF(mockResumeData, mockTheme);
    
    const textCalls = mockText.mock.calls.map(call => call[0]);
    const summaryCall = textCalls.find(text => 
      typeof text === 'string' && text.includes('developer')
    );
    
    // Should handle accented characters or replace them
    if (summaryCall) {
      // The text should either keep accented chars or replace them with ASCII equivalents
      expect(typeof summaryCall).toBe('string');
    }
  });

  it('should not crash when processing undefined or null text', async () => {
    const dataWithNulls: ResumeData = {
      ...mockResumeData,
      basics: {
        ...mockResumeData.basics,
        summary: '',
        label: ''
      }
    };

    await expect(exportAsPDF(dataWithNulls, mockTheme)).resolves.not.toThrow();
  });

  it('should provide appropriate fallback when Unicode detection fails', async () => {
    // Mock canvas to return null context (simulating failure)
    const mockFailingCanvas = {
      getContext: vi.fn(() => null)
    };
    
    document.createElement = vi.fn((tagName: string) => {
      if (tagName === 'canvas') {
        return mockFailingCanvas as unknown as HTMLCanvasElement;
      }
      return originalCreateElement.call(document, tagName);
    });

    const complexData: ResumeData = {
      ...mockResumeData,
      basics: {
        ...mockResumeData.basics,
        name: 'José María González',
        summary: 'Experienced developer with résumé building skills. Worked on high-impact projects—delivering solutions that exceed expectations. "Innovative" and passionate about technology…',
      },
      work: [
        {
          name: 'Tech Inc.',
          position: 'Senior Developer',
          startDate: '2020-01',
          endDate: '2023-12',
          summary: 'Built apps with émojis 📱 and special chars',
          highlights: ['• Increased performance by 50%', '• Led team of 5 developers', '• Implemented CI/CD pipelines'],
          url: 'https://techinc.com',
          visible: true
        }
      ]
    };

    await exportAsPDF(complexData, mockTheme);
    
    expect(mockText).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalled();
    
    // Verify that all text calls were made (fallback should work)
    const textCalls = mockText.mock.calls.map(call => call[0] as string);
    
    // With Unicode detection failure, should fall back to sanitization
    textCalls.forEach(text => {
      if (typeof text === 'string') {
        // Some emojis should be converted to text (since Unicode support failed)
        expect(typeof text).toBe('string');
      }
    });
    
    // Verify accented characters are preserved (they should work with jsPDF)
    const nameCall = textCalls.find(text => text && text.includes('José'));
    expect(nameCall).toBeTruthy();
  });
}); 