import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PizZip from 'pizzip';
import { exportAsDOCX, exportAsPDF } from './exportUtils';
import { ResumeData, Theme } from '@/types/resume';
import * as importExportUtils from '@/utils/importExport';

const mockText = vi.fn();
const mockSetFont = vi.fn();
const mockSetFontSize = vi.fn();
const mockSetTextColor = vi.fn();
const mockSplitTextToSize = vi.fn((text: string) => [text]);
const mockSave = vi.fn();
const mockAddPage = vi.fn();
const mockLine = vi.fn();
const mockSetDrawColor = vi.fn();
const mockSetLineWidth = vi.fn();
const mockAddImage = vi.fn();

const mockJsPDF = {
  text: mockText,
  setFont: mockSetFont,
  setFontSize: mockSetFontSize,
  setTextColor: mockSetTextColor,
  splitTextToSize: mockSplitTextToSize,
  save: mockSave,
  addPage: mockAddPage,
  addImage: mockAddImage,
  line: mockLine,
  setDrawColor: mockSetDrawColor,
  setLineWidth: mockSetLineWidth,
  internal: {
    pageSize: {
      getWidth: () => 210,
      getHeight: () => 297,
    },
  },
};

vi.mock('jspdf', () => ({
  jsPDF: vi.fn(() => mockJsPDF),
}));

vi.mock('@/utils/importExport', async () => {
  const actual = await vi.importActual<typeof import('@/utils/importExport')>('@/utils/importExport');
  return {
    ...actual,
    downloadBlob: vi.fn(),
    downloadFile: vi.fn(),
  };
});

const baseTheme: Theme = {
  id: 'professional',
  name: 'Professional Blue',
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#0ea5e9',
    text: '#1e293b',
    textSecondary: '#64748b',
    background: '#ffffff',
    border: '#e2e8f0',
  },
  typography: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 1.5,
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Inter',
  },
  spacing: {
    section: '2rem',
    item: '1rem',
  },
};

const baseResumeData: ResumeData = {
  basics: {
    name: 'Jane Doe',
    label: 'Research & Development <Lead>',
    image: '',
    email: 'jane@example.com',
    phone: '+1-555-987-6543',
    url: 'https://janedoe.design',
    summary: 'Creative designer with résumé building expertise & "special" characters…',
    location: {
      address: '456 Design Ave',
      city: 'New York',
      region: 'NY',
      postalCode: '10001',
      countryCode: 'US',
    },
    profiles: [
      {
        network: 'GitHub',
        username: 'janedoe',
        url: 'https://github.com/janedoe',
        visible: true,
      },
      {
        network: 'LinkedIn',
        username: 'hidden-profile',
        url: 'https://linkedin.com/in/hidden-profile',
        visible: false,
      },
    ],
  },
  work: [
    {
      name: 'Design Studio',
      position: 'Senior UX Designer',
      startDate: '2021-03',
      endDate: '2024-01',
      location: 'Remote',
      summary: 'Led design for mobile applications',
      highlights: [
        { content: 'Visible achievement', visible: true },
        { content: 'Hidden achievement', visible: false },
      ],
      url: 'https://designstudio.com',
      visible: true,
    },
  ],
  volunteer: [
    {
      organization: 'Accessibility Org',
      position: 'Volunteer Mentor',
      url: 'https://example.org',
      startDate: '2020-01',
      endDate: '',
      summary: 'Mentored junior designers',
      highlights: ['Hosted portfolio reviews'],
      visible: true,
    },
  ],
  education: [
    {
      institution: 'Design University',
      area: 'Graphic Design',
      studyType: 'Bachelor of Fine Arts',
      startDate: '2017-09',
      endDate: '2021-05',
      score: '3.8 GPA',
      courses: [
        { name: 'Design Systems', visible: true },
        { name: 'Hidden Course', visible: false },
      ],
      url: 'https://designuni.edu',
      visible: true,
    },
  ],
  skills: [
    {
      name: 'Design Systems',
      level: 'Expert',
      keywords: [
        { name: 'Figma', visible: true },
        { name: 'Secret Keyword', visible: false },
      ],
      visible: true,
    },
  ],
  projects: [
    {
      name: 'Portfolio Platform',
      description: 'Built a publishing workflow for designers',
      highlights: [
        { content: 'Public launch in 2024', visible: true },
        { content: 'Hidden roadmap item', visible: false },
      ],
      keywords: [
        { name: 'React', visible: true },
        { name: 'Hidden Stack', visible: false },
      ],
      startDate: '2023-01',
      endDate: '2024-02',
      url: 'https://portfolio.example.com',
      roles: [
        { name: 'Design Lead', visible: true },
        { name: 'Hidden Role', visible: false },
      ],
      entity: 'Independent',
      type: 'Product',
      visible: true,
    },
  ],
  awards: [
    {
      title: 'Design Award',
      date: '2023',
      awarder: 'Design Guild',
      summary: 'Recognized for accessibility-first design.',
      visible: true,
    },
  ],
  certificates: [
    {
      name: 'Accessibility Certification',
      date: '2022',
      issuer: 'IAAP',
      url: 'https://certs.example.com/accessibility',
      visible: true,
    },
  ],
  publications: [
    {
      name: 'Designing for Complex Systems',
      publisher: 'UX Review',
      releaseDate: '2021',
      url: 'https://uxreview.example.com/designing-complex-systems',
      summary: 'Article on design system governance.',
      visible: true,
    },
  ],
  interests: [
    {
      name: 'Accessibility',
      keywords: [
        { name: 'Screen readers', visible: true },
        { name: 'Hidden interest', visible: false },
      ],
      visible: true,
    },
  ],
  references: [
    {
      name: 'Visible Reference',
      reference: 'Available on request',
      visible: true,
    },
  ],
  languages: [
    {
      language: 'English',
      fluency: 'Native',
      visible: true,
    },
  ],
  meta: undefined,
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
    references: true,
  },
};

const originalCreateElement = document.createElement;
const originalFetch = global.fetch;
const originalImage = global.Image;

const tinyPngDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/afoAAAAASUVORK5CYII=';
const tinyAltPngDataUrl = 'data:image/png;base64,ZmFrZS1jb252ZXJ0ZWQtcGhvdG8=';
const tinyJpegDataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQEBAVFRUVFRUVFRUVFRUVFRUVFRUXFhUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGy0mICYtLS8tLS0tLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAAEAAgMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAAAAQID/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEAMQAAAB6AAAAP/EABQQAQAAAAAAAAAAAAAAAAAAACD/2gAIAQEAAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAACD/2gAIAQMBAT8Af//Z';
const tinyIcoDataUrl = 'data:image/x-icon;base64,AAABAAEAEBAAAAAAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wD///8A////AP///wD///8A////AP///wD///8AAAAAAP///wD///8A////AP///wD///8A////AAAAAAD///8A////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wD///8A////AP///wD///8A////AAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8AAAAAAP///wD///8A////AP///wD///8A////AP///wAAAAAA';
let canvasDataUrlCallCount = 0;

function createCanvasWithUnicodeSupport(hasUnicodeSupport: boolean): HTMLCanvasElement {
  return {
    width: 1,
    height: 1,
    getContext: vi.fn(() => ({
      beginPath: vi.fn(),
      arc: vi.fn(),
      clearRect: vi.fn(),
      clip: vi.fn(),
      closePath: vi.fn(),
      drawImage: vi.fn(),
      measureText: vi.fn((text: string) => ({
        width: hasUnicodeSupport && /[📧📞🌐📍•]/u.test(text) ? 60 : 20,
      })),
      font: '',
      restore: vi.fn(),
      save: vi.fn(),
    })),
    toDataURL: vi.fn(() => {
      const value = canvasDataUrlCallCount === 0 ? tinyPngDataUrl : tinyAltPngDataUrl;
      canvasDataUrlCallCount += 1;
      return value;
    }),
  } as unknown as HTMLCanvasElement;
}

async function readBlobAsArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read blob'));
    reader.readAsArrayBuffer(blob);
  });
}

async function getGeneratedDocxXml(): Promise<string> {
  const zip = await getGeneratedDocxZip();
  const file = zip.file('word/document.xml');
  expect(file).toBeTruthy();
  return file?.asText() ?? '';
}

async function getGeneratedDocxZip(): Promise<PizZip> {
  const mockDownloadBlob = vi.mocked(importExportUtils.downloadBlob);
  const blob = mockDownloadBlob.mock.calls[0]?.[0] as Blob;
  expect(blob).toBeInstanceOf(Blob);
  const buffer = await readBlobAsArrayBuffer(blob);
  return new PizZip(new Uint8Array(buffer));
}

beforeEach(() => {
  vi.clearAllMocks();
  canvasDataUrlCallCount = 0;
  mockSplitTextToSize.mockImplementation((text: string) => [text]);
  document.createElement = vi.fn((tagName: string) => {
    if (tagName === 'canvas') {
      return createCanvasWithUnicodeSupport(false);
    }
    return originalCreateElement.call(document, tagName);
  });
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Missing image asset')));
  vi.stubGlobal(
    'Image',
    class MockImage {
      onload: null | (() => void) = null;
      onerror: null | (() => void) = null;
      width = 32;
      height = 32;
      naturalWidth = 32;
      naturalHeight = 32;

      set src(value: string) {
        queueMicrotask(() => {
          if (value.includes('broken-image')) {
            this.onerror?.();
            return;
          }
          this.onload?.();
        });
      }
    } as unknown as typeof Image,
  );
});

afterEach(() => {
  document.createElement = originalCreateElement;
  if (originalFetch) {
    global.fetch = originalFetch;
  }
  if (originalImage) {
    global.Image = originalImage;
  }
  vi.unstubAllGlobals();
});

describe('PDF export', () => {
  it('renders only visible content and saves the file', async () => {
    await exportAsPDF(baseResumeData, baseTheme);

    const renderedText = mockText.mock.calls.map((call) => call[0]).join('\n');

    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(renderedText).toContain('Visible achievement');
    expect(renderedText).toContain('Volunteer Mentor');
    expect(renderedText).toContain('Accessibility Certification');
    expect(renderedText).toContain('Designing for Complex Systems');
    expect(renderedText).toContain('Available on request');
    expect(renderedText).not.toContain('Hidden achievement');
    expect(renderedText).not.toContain('Secret Keyword');
    expect(renderedText).not.toContain('Hidden Role');
    expect(renderedText).not.toContain('Hidden roadmap item');
  });

  it('does not fail when optional images cannot be loaded', async () => {
    const resumeWithImages: ResumeData = {
      ...baseResumeData,
      icon: {
        data: '/missing-icon.png',
        position: { top: 20, right: 20 },
        size: 48,
      },
      photo: {
        data: '/missing-photo.jpg',
        position: { top: 20, right: 96 },
        size: 72,
      },
    };

    await expect(exportAsPDF(resumeWithImages, baseTheme)).resolves.not.toThrow();
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it('embeds supported photos and rasterizes unsupported icons before rendering', async () => {
    const resumeWithImages: ResumeData = {
      ...baseResumeData,
      icon: {
        data: tinyIcoDataUrl,
        position: { top: 20, right: 20 },
        size: 48,
      },
      photo: {
        data: tinyJpegDataUrl,
        position: { top: 20, right: 96 },
        size: 72,
      },
    };

    await exportAsPDF(resumeWithImages, baseTheme);

    expect(mockAddImage).toHaveBeenCalledTimes(2);
    const imageTypes = mockAddImage.mock.calls.map((call) => call[1]);
    expect(imageTypes).toEqual(['PNG', 'PNG']);
    expect(mockAddImage.mock.calls.every((call) => String(call[0]).startsWith('data:image/png;base64,'))).toBe(true);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it('measures wrapped text after applying font size and justifies the summary paragraph', async () => {
    mockSplitTextToSize.mockImplementation((text: string) => {
      if (text.includes('Creative designer with résumé building expertise')) {
        return ['summary-line-1', 'summary-line-2'];
      }
      return [text];
    });

    await exportAsPDF(baseResumeData, baseTheme);

    expect(mockSetFontSize.mock.invocationCallOrder[0]).toBeLessThan(mockSplitTextToSize.mock.invocationCallOrder[0]);

    const justifiedSummaryCall = mockText.mock.calls.find((call) => call[0] === 'summary-line-1');
    expect(justifiedSummaryCall?.[3]).toMatchObject({
      align: 'justify',
    });
  });
});

describe('DOCX export', () => {
  it('generates a valid DOCX file with visible sections and escaped special characters', async () => {
    await exportAsDOCX(baseResumeData, baseTheme);

    const mockDownloadBlob = vi.mocked(importExportUtils.downloadBlob);
    expect(mockDownloadBlob).toHaveBeenCalledTimes(1);
    expect(mockDownloadBlob.mock.calls[0]?.[1]).toMatch(/\.docx$/);

    const xml = await getGeneratedDocxXml();
    const parsed = new DOMParser().parseFromString(xml, 'application/xml');
    expect(parsed.getElementsByTagName('parsererror')).toHaveLength(0);

    const textContent = parsed.documentElement.textContent ?? '';
    expect(textContent).toContain('Research & Development <Lead>');
    expect(textContent).toContain('Visible achievement');
    expect(textContent).toContain('Volunteer Mentor');
    expect(textContent).toContain('Accessibility Certification');
    expect(textContent).toContain('Designing for Complex Systems');
    expect(textContent).not.toContain('Hidden achievement');
    expect(textContent).not.toContain('Secret Keyword');
    expect(textContent).not.toContain('Hidden Role');

    expect(xml).toContain('WORK EXPERIENCE');
    expect(xml).toContain('VOLUNTEER EXPERIENCE');
    expect(xml).toContain('CERTIFICATES');
    expect(xml).toContain('PUBLICATIONS');
    expect(xml).toContain('&amp;');
    expect(xml).toContain('&lt;');
  });

  it('creates a non-empty blob that can be unpacked', async () => {
    await exportAsDOCX(baseResumeData, baseTheme);

    const mockDownloadBlob = vi.mocked(importExportUtils.downloadBlob);
    const blob = mockDownloadBlob.mock.calls[0]?.[0] as Blob;
    expect(blob.size).toBeGreaterThan(0);

    const zip = await getGeneratedDocxZip();
    expect(zip.file('[Content_Types].xml')).toBeTruthy();
    expect(zip.file('word/document.xml')).toBeTruthy();
  });

  it('embeds icon and photo assets in the DOCX package', async () => {
    const resumeWithImages: ResumeData = {
      ...baseResumeData,
      icon: {
        data: tinyIcoDataUrl,
        position: { top: 20, right: 20 },
        size: 48,
      },
      photo: {
        data: tinyJpegDataUrl,
        position: { top: 20, right: 96 },
        size: 72,
      },
    };

    await exportAsDOCX(resumeWithImages, baseTheme);

    const zip = await getGeneratedDocxZip();
    const mediaFiles = Object.keys(zip.files).filter((name) => name.startsWith('word/media/') && !zip.files[name]?.dir);
    expect(mediaFiles.length).toBe(2);
    expect(mediaFiles.every((name) => name.endsWith('.png'))).toBe(true);

    const documentXml = zip.file('word/document.xml')?.asText() ?? '';
    const relationshipsXml = zip.file('word/_rels/document.xml.rels')?.asText() ?? '';

    expect(documentXml).toContain('<w:drawing>');
    expect(documentXml).toContain('<wp:anchor');
    expect(documentXml).toContain('<wp:wrapSquare');
    expect((relationshipsXml.match(/relationships\/image/g) ?? []).length).toBe(2);
    expect(relationshipsXml).toContain('Target="media/');
  });
});
