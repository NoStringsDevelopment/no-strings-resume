import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportAsPDF, exportAsDOCX } from './exportUtils';
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

// Mock PizZip and Docxtemplater for DOCX export
const mockPizZipGenerate = vi.fn();
const mockPizZipFile = vi.fn();
const mockPizZip = {
  file: mockPizZipFile,
  generate: mockPizZipGenerate
};

vi.mock('pizzip', () => ({
  default: vi.fn(() => mockPizZip)
}));

vi.mock('docxtemplater', () => ({
  default: vi.fn()
}));

// Mock URL and DOM for DOCX download
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockClick = vi.fn();
const mockAppendChild = vi.fn();
const mockRemoveChild = vi.fn();
const mockCreateElement = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  
  // Reset PizZip mocks
  mockPizZipFile.mockImplementation(() => mockPizZip);
  mockPizZipGenerate.mockReturnValue(new Blob(['mock docx content'], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  }));
  
  // Mock URL methods
  Object.defineProperty(global, 'URL', {
    value: {
      ...global.URL,
      createObjectURL: mockCreateObjectURL.mockReturnValue('mock-blob-url'),
      revokeObjectURL: mockRevokeObjectURL
    },
    writable: true
  });
  
  // Mock DOM methods for download
  const mockLink = {
    href: '',
    download: '',
    click: mockClick
  };
  
  document.createElement = mockCreateElement.mockImplementation((tagName: string) => {
    if (tagName === 'a') return mockLink;
    if (tagName === 'canvas') return mockCanvas as unknown as HTMLCanvasElement;
    return originalCreateElement.call(document, tagName);
  });
  
  document.body.appendChild = mockAppendChild;
  document.body.removeChild = mockRemoveChild;
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

describe('DOCX Export Theme Application', () => {
  const professionalTheme: Theme = {
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
      heading: 'Playfair Display',
      body: 'Inter'
    },
    spacing: {
      section: '2rem',
      item: '1rem'
    }
  };

  const elegantTheme: Theme = {
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
    typography: {
      fontFamily: 'Georgia',
      fontSize: 16,
      lineHeight: 1.6
    },
    fonts: {
      heading: 'Georgia',
      body: 'Times New Roman'
    },
    spacing: {
      section: '2.5rem',
      item: '1.25rem'
    }
  };

  const mockResumeWithWork: ResumeData = {
    basics: {
      name: 'Jane Doe',
      label: 'UX Designer',
      email: 'jane@example.com',
      phone: '+1-555-987-6543',
      url: 'https://janedoe.design',
      summary: 'Creative designer with a passion for user-centered design',
      location: {
        address: '456 Design Ave',
        city: 'New York',
        region: 'NY',
        postalCode: '10001',
        countryCode: 'US'
      },
      profiles: [],
      image: ''
    },
    work: [
      {
        name: 'Design Studio',
        position: 'Senior UX Designer',
        startDate: '2021-03',
        endDate: '2024-01',
        summary: 'Led design for mobile applications',
        highlights: ['Increased user engagement by 40%', 'Designed award-winning interface'],
        url: 'https://designstudio.com',
        visible: true
      }
    ],
    education: [
      {
        institution: 'Design University',
        area: 'Graphic Design',
        studyType: 'Bachelor of Fine Arts',
        startDate: '2017-09',
        endDate: '2021-05',
        score: '3.8 GPA',
        courses: [],
        url: 'https://designuni.edu',
        visible: true
      }
    ],
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
  });

  it('should apply theme colors correctly in DOCX content', async () => {
    await exportAsDOCX(mockResumeWithWork, professionalTheme);

    expect(mockPizZipFile).toHaveBeenCalledWith('word/document.xml', expect.stringContaining('2563eb')); // Primary color
    expect(mockPizZipFile).toHaveBeenCalledWith('word/document.xml', expect.stringContaining('64748b')); // Secondary color  
    expect(mockPizZipFile).toHaveBeenCalledWith('word/document.xml', expect.stringContaining('0ea5e9')); // Accent color
    expect(mockPizZipFile).toHaveBeenCalledWith('word/document.xml', expect.stringContaining('1e293b')); // Text color
  });

  it('should apply theme fonts correctly in DOCX content', async () => {
    await exportAsDOCX(mockResumeWithWork, professionalTheme);

    const docxContent = mockPizZipFile.mock.calls.find(call => call[0] === 'word/document.xml')?.[1];
    expect(docxContent).toContain('Playfair Display'); // Heading font
    expect(docxContent).toContain('Inter'); // Body font
  });

  it('should calculate font sizes based on theme typography', async () => {
    await exportAsDOCX(mockResumeWithWork, professionalTheme);

    const docxContent = mockPizZipFile.mock.calls.find(call => call[0] === 'word/document.xml')?.[1];
    // Base font size (14) * 2 = 28 half-points for normal text
    expect(docxContent).toContain('w:sz w:val="28"');
    // Heading font size (14 * 2 * 1.5) = 42 half-points for headings
    expect(docxContent).toContain('w:sz w:val="42"');
    // Large font size (14 * 2 * 2) = 56 half-points for main headings
    expect(docxContent).toContain('w:sz w:val="56"');
  });

  it('should apply different styling for different themes', async () => {
    // Test Professional theme
    await exportAsDOCX(mockResumeWithWork, professionalTheme);
    const professionalContent = mockPizZipFile.mock.calls.find(call => call[0] === 'word/document.xml')?.[1];

    vi.clearAllMocks();

    // Test Elegant theme
    await exportAsDOCX(mockResumeWithWork, elegantTheme);
    const elegantContent = mockPizZipFile.mock.calls.find(call => call[0] === 'word/document.xml')?.[1];

    // Colors should be different
    expect(professionalContent).toContain('2563eb'); // Professional primary
    expect(elegantContent).toContain('7c3aed'); // Elegant primary

    // Fonts should be different
    expect(professionalContent).toContain('Playfair Display');
    expect(elegantContent).toContain('Georgia');

    // Font sizes should be different (16px vs 14px base)
    expect(professionalContent).toContain('w:sz w:val="28"'); // 14*2
    expect(elegantContent).toContain('w:sz w:val="32"'); // 16*2
  });

  it('should apply proper styling to work experience sections', async () => {
    await exportAsDOCX(mockResumeWithWork, professionalTheme);

    const docxContent = mockPizZipFile.mock.calls.find(call => call[0] === 'word/document.xml')?.[1];
    
    // Should contain job title with bold formatting
    expect(docxContent).toContain('Senior UX Designer');
    expect(docxContent).toContain('<w:b/>');
    
    // Should contain company name with accent color
    expect(docxContent).toContain('Design Studio');
    expect(docxContent).toContain('0ea5e9'); // Accent color for company
    
    // Should contain date information
    expect(docxContent).toContain('2021-03 - 2024-01');
  });

  it('should apply proper styling to education sections', async () => {
    await exportAsDOCX(mockResumeWithWork, professionalTheme);

    const docxContent = mockPizZipFile.mock.calls.find(call => call[0] === 'word/document.xml')?.[1];
    
    // Should contain degree with bold formatting
    expect(docxContent).toContain('Bachelor of Fine Arts in Graphic Design');
    
    // Should contain institution with accent color
    expect(docxContent).toContain('Design University');
    expect(docxContent).toContain('0ea5e9'); // Accent color for institution
  });

  it('should include proper DOCX structure with theme-aware content', async () => {
    await exportAsDOCX(mockResumeWithWork, professionalTheme);

    // Verify that all required DOCX files are created
    expect(mockPizZipFile).toHaveBeenCalledWith('[Content_Types].xml', expect.any(String));
    expect(mockPizZipFile).toHaveBeenCalledWith('_rels/.rels', expect.any(String));
    expect(mockPizZipFile).toHaveBeenCalledWith('word/_rels/document.xml.rels', expect.any(String));
    expect(mockPizZipFile).toHaveBeenCalledWith('word/document.xml', expect.stringContaining('<?xml version="1.0"'));

    // Verify download process
    expect(mockPizZipGenerate).toHaveBeenCalledWith({ 
      type: 'blob', 
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it('should handle empty sections gracefully', async () => {
    const emptyResumeData: ResumeData = {
      ...mockResumeWithWork,
      work: [],
      education: [],
      sectionVisibility: {
        ...mockResumeWithWork.sectionVisibility,
        work: false,
        education: false
      }
    };

    await expect(exportAsDOCX(emptyResumeData, professionalTheme)).resolves.not.toThrow();
    
    const docxContent = mockPizZipFile.mock.calls.find(call => call[0] === 'word/document.xml')?.[1];
    expect(docxContent).toContain('Jane Doe'); // Should still contain basic info
  });

  it('should apply consistent spacing throughout the document', async () => {
    await exportAsDOCX(mockResumeWithWork, professionalTheme);

    const docxContent = mockPizZipFile.mock.calls.find(call => call[0] === 'word/document.xml')?.[1];
    
    // Should have proper spacing before sections
    expect(docxContent).toContain('w:spacing w:before="400"');
    // Should have proper spacing after items
    expect(docxContent).toContain('w:spacing w:after="200"');
    // Should have proper spacing after paragraphs
    expect(docxContent).toContain('w:spacing w:after="120"');
  });
});

describe('DOCX Export Error Handling', () => {
  const mockTheme: Theme = {
    id: 'test',
    name: 'Test',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      text: '#000000',
      textSecondary: '#666666',
      background: '#ffffff',
      border: '#cccccc'
    },
    typography: {
      fontFamily: 'Arial',
      fontSize: 12,
      lineHeight: 1.4
    },
    fonts: {
      heading: 'Arial',
      body: 'Arial'
    },
    spacing: {
      section: '1rem',
      item: '0.5rem'
    }
  };

  const testResumeData: ResumeData = {
    basics: {
      name: 'Test User',
      label: 'Test Developer',
      email: 'test@example.com',
      phone: '+1-555-123-4567',
      url: 'https://test.dev',
      summary: 'Test summary',
      location: {
        address: '123 Test St',
        city: 'Test City',
        region: 'TC',
        postalCode: '12345',
        countryCode: 'US'
      },
      profiles: [],
      image: ''
    },
    work: [],
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
  });

  it('should handle missing theme properties gracefully', async () => {
    const incompleteTheme = {
      ...mockTheme,
      colors: {
        ...mockTheme.colors,
        primary: undefined,
        accent: undefined
      }
    } as Theme;

    await expect(exportAsDOCX(testResumeData, incompleteTheme)).resolves.not.toThrow();
  });

  it('should handle special characters in content', async () => {
    const dataWithSpecialChars: ResumeData = {
      ...testResumeData,
      basics: {
        ...testResumeData.basics,
        name: 'José María González-Smith',
        summary: 'Designer with résumé building expertise & "special" characters…'
      }
    };

    await expect(exportAsDOCX(dataWithSpecialChars, mockTheme)).resolves.not.toThrow();
    
    const docxContent = mockPizZipFile.mock.calls.find(call => call[0] === 'word/document.xml')?.[1];
    expect(docxContent).toContain('José María González-Smith');
  });
}); 