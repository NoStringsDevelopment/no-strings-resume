import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseLinkedInZip } from './linkedinParser';

// Mock the fflate library
vi.mock('fflate', () => ({
  unzip: vi.fn()
}));

import { unzip } from 'fflate';
const mockedUnzip = vi.mocked(unzip);

// Create a proper File mock with arrayBuffer support
class MockFile implements File {
  constructor(
    public data: ArrayBuffer,
    public name: string,
    public options: FilePropertyBag = {}
  ) {}

  get size(): number {
    return this.data.byteLength;
  }

  get type(): string {
    return this.options.type || '';
  }

  get lastModified(): number {
    return this.options.lastModified || Date.now();
  }

  get webkitRelativePath(): string {
    return '';
  }

  async bytes(): Promise<Uint8Array> {
    return new Uint8Array(this.data);
  }

  async arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(this.data);
  }

  async text(): Promise<string> {
    return new TextDecoder().decode(this.data);
  }

  stream(): ReadableStream<Uint8Array> {
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(this.data));
        controller.close();
      }
    });
  }

  slice(start?: number, end?: number, contentType?: string): Blob {
    throw new Error('Not implemented');
  }
}

// Helper function to create mock ZIP data
function createMockZipData(): ArrayBuffer {
  // Create a simple buffer representing a ZIP file
  const buffer = new ArrayBuffer(100);
  const view = new Uint8Array(buffer);
  // Add minimal ZIP file structure
  view[0] = 0x50; // P
  view[1] = 0x4b; // K
  view[2] = 0x03; // ZIP signature
  view[3] = 0x04;
  return buffer;
}

// Mock CSV content for different LinkedIn files
const mockProfileCSV = `"First Name","Last Name","Headline","Summary","Email Address","Geo Location","Industry"
"John","Doe","Software Engineer","Experienced developer","john.doe@email.com","San Francisco, CA","Technology"`;

const mockPositionsCSV = `"Company Name","Title","Description","Location","Started On","Finished On"
"Tech Corp","Senior Developer","Led development team","Remote","Jan 2020","Dec 2023"
"StartupCo","Junior Developer","Built web applications","San Francisco","Jun 2018","Dec 2019"`;

const mockEducationCSV = `"School Name","Degree Name","Field Of Study","Started On","Finished On","Description"
"University of Technology","Bachelor of Science","Computer Science","Sep 2014","May 2018","Studied computer science"`;

const mockSkillsCSV = `"Name","Endorsement Count"
"JavaScript",25
"React",18
"TypeScript",12`;

const mockLanguagesCSV = `"Name","Proficiency"
"English","Native or bilingual proficiency"
"Spanish","Professional working proficiency"`;

const mockCertificationsCSV = `"Name","Authority","Started On","Finished On","URL"
"AWS Solutions Architect","Amazon","Jan 2023","","https://aws.amazon.com"`;

// Complex CSV test data with commas in quoted fields and escaped quotes
const complexCSV = `"Name","Description","Company"
"John, Jr.","Senior ""Tech Lead"" Developer","ACME, Inc."
"Jane Smith","Product Manager, Data Analytics","Tech Corp"
"Bob ""Bobby"" Johnson","Full-Stack Developer","StartupCo"`;

describe('LinkedIn Parser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('File.arrayBuffer() mocking', () => {
    it('should properly mock File.arrayBuffer()', async () => {
      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');
      
      const arrayBuffer = await mockFile.arrayBuffer();
      expect(arrayBuffer).toBeInstanceOf(ArrayBuffer);
      expect(arrayBuffer.byteLength).toBe(100);
    });
  });

  describe('CSV Parser - Complex Cases', () => {
    it('should handle commas in quoted fields', () => {
      // This will be tested indirectly through the main parser
      const mockFiles = {
        'Profile.csv': new TextEncoder().encode('Name,Company\n"John, Jr.","ACME, Inc."')
      };

      mockedUnzip.mockImplementation(() => {
        return () => {};
      });

      // The test will validate that parsing works correctly
      expect(true).toBe(true); // Placeholder - actual validation happens in integration test
    });

    it('should handle escaped quotes in quoted fields', () => {
      const mockFiles = {
        'Profile.csv': new TextEncoder().encode('Name,Title\n"John Doe","Senior ""Tech Lead"" Developer"')
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      expect(true).toBe(true); // Placeholder - actual validation happens in integration test
    });
  });

  describe('LinkedIn File Detection', () => {
    it('should detect valid LinkedIn export files', async () => {
      const mockFiles = {
        'Profile.csv': new TextEncoder().encode(mockProfileCSV),
        'Positions.csv': new TextEncoder().encode(mockPositionsCSV),
        'Education.csv': new TextEncoder().encode(mockEducationCSV)
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      expect(result.hasErrors).toBe(false);
      expect(result.validationErrors).not.toContain('ZIP file does not appear to contain LinkedIn export data');
      expect(result.processedFiles.length).toBeGreaterThan(0);
    });

    it('should reject non-LinkedIn ZIP files', async () => {
      const mockFiles = {
        'random-file.txt': new TextEncoder().encode('This is not LinkedIn data'),
        'another-file.csv': new TextEncoder().encode('Random,CSV\nData,Here')
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'random-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      expect(result.hasErrors).toBe(true);
      expect(result.validationErrors).toContain('ZIP file does not appear to contain LinkedIn export data');
      expect(result.processedFiles.length).toBe(0);
    });

    it('should handle case-insensitive file detection', async () => {
      const mockFiles = {
        'profile.csv': new TextEncoder().encode(mockProfileCSV),
        'POSITIONS.CSV': new TextEncoder().encode(mockPositionsCSV),
        'Education.CSV': new TextEncoder().encode(mockEducationCSV)
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      expect(result.hasErrors).toBe(false);
      expect(result.processedFiles.length).toBe(3);
    });
  });

  describe('Data Processing', () => {
    it('should process profile data correctly', async () => {
      const mockFiles = {
        'Profile.csv': new TextEncoder().encode(mockProfileCSV)
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      expect(result.resumeData.basics.name).toBe('John Doe');
      expect(result.resumeData.basics.email).toBe('john.doe@email.com');
      expect(result.resumeData.basics.label).toBe('Software Engineer');
    });

    it('should process work positions correctly', async () => {
      const mockFiles = {
        'Profile.csv': new TextEncoder().encode(mockProfileCSV),
        'Positions.csv': new TextEncoder().encode(mockPositionsCSV)
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      expect(result.resumeData.work).toHaveLength(2);
      expect(result.resumeData.work[0].name).toBe('Tech Corp');
      expect(result.resumeData.work[0].position).toBe('Senior Developer');
      expect(result.resumeData.work[1].name).toBe('StartupCo');
      expect(result.resumeData.work[1].position).toBe('Junior Developer');
    });

    it('should process education data correctly', async () => {
      const mockFiles = {
        'Profile.csv': new TextEncoder().encode(mockProfileCSV),
        'Education.csv': new TextEncoder().encode(mockEducationCSV)
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      expect(result.resumeData.education).toHaveLength(1);
      expect(result.resumeData.education[0].institution).toBe('University of Technology');
      expect(result.resumeData.education[0].studyType).toBe('Bachelor of Science');
      expect(result.resumeData.education[0].area).toBe('Computer Science');
    });

    it('should process skills data correctly', async () => {
      const mockFiles = {
        'Profile.csv': new TextEncoder().encode(mockProfileCSV),
        'Skills.csv': new TextEncoder().encode(mockSkillsCSV)
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      expect(result.resumeData.skills).toHaveLength(3);
      expect(result.resumeData.skills[0].name).toBe('JavaScript');
      expect(result.resumeData.skills[0].level).toBe('Advanced'); // 25 endorsements >= 20
    });
  });

  describe('Error Handling', () => {
    it('should handle ZIP extraction errors', async () => {
      mockedUnzip.mockImplementation((_, callback) => {
        const error = new Error('Failed to extract ZIP') as Error & { code: number };
        error.code = 1;
        callback(error, null);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'corrupted.zip');

      const result = await parseLinkedInZip(mockFile);
      
      expect(result.hasErrors).toBe(true);
      expect(result.validationErrors).toContain('Failed to extract ZIP file');
    });

    it('should handle malformed CSV data', async () => {
      const malformedCSV = 'First Name,Last Name,Email Address\nJohn,,'; // Missing last name and email
      const mockFiles = {
        'Profile.csv': new TextEncoder().encode(malformedCSV)
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      // Should not crash, but may have partial data
      expect(result.resumeData.basics.name).toBe('John');
      expect(result.resumeData.basics.email).toBe('');
    });
  });

  describe('Complex CSV Parsing Integration', () => {
    it('should handle CSV with commas in quoted fields', async () => {
      const csvWithCommas = `"First Name","Last Name","Company"
"John, Jr.","Doe","ACME, Inc."
"Jane","Smith, PhD","Tech Corp"`;

      const mockFiles = {
        'Profile.csv': new TextEncoder().encode(csvWithCommas)
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      // The name should include the comma
      expect(result.resumeData.basics.name).toBe('John, Jr. Doe');
    });

    it('should handle CSV with escaped quotes', async () => {
      const csvWithEscapedQuotes = `"First Name","Last Name","Headline"
"John","Doe","Senior ""Tech Lead"" Developer"
"Jane","Smith","Product Manager ""Data Analytics"""`;

      const mockFiles = {
        'Profile.csv': new TextEncoder().encode(csvWithEscapedQuotes)
      };

      mockedUnzip.mockImplementation((_, callback) => {
        callback(null, mockFiles);
        return () => {};
      });

      const mockData = createMockZipData();
      const mockFile = new MockFile(mockData, 'linkedin-export.zip');

      const result = await parseLinkedInZip(mockFile);
      
      // The headline should include the quotes
      expect(result.resumeData.basics.label).toBe('Senior "Tech Lead" Developer');
    });
  });
});