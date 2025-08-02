import React, { ReactNode } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResumeProvider, useResume } from './ResumeContext';
import type { ResumeData } from '@/types/resume';

type TestResumeState = { resumeData: ResumeData; history: ResumeData[]; currentHistoryIndex: number; historyIndex: number; isLoading: boolean };

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Mock fetch
global.fetch = vi.fn();

// Test component to access context
const TestComponent = ({ onStateChange }: { onStateChange?: (state: TestResumeState) => void }) => {
  const { state } = useResume();
  
  React.useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  return (
    <div>
      <div data-testid="resume-name">{state.resumeData.basics.name}</div>
      <div data-testid="section-visibility-basics">{String(state.resumeData.sectionVisibility.basics)}</div>
      <div data-testid="section-visibility-education">{String(state.resumeData.sectionVisibility.education)}</div>
      <div data-testid="work-count">{state.resumeData.work.length}</div>
      <div data-testid="loading">{String(state.isLoading)}</div>
    </div>
  );
};

const renderWithProvider = (children: ReactNode) => {
  return render(
    <ResumeProvider>
      {children}
    </ResumeProvider>
  );
};

describe('ResumeContext Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false
    });
  });

  it('should initialize with normalized default data', async () => {
    let capturedState: TestResumeState;
    
    await act(async () => {
      renderWithProvider(
        <TestComponent onStateChange={(state) => { capturedState = state; }} />
      );
    });

    await waitFor(() => {
      expect(capturedState).toBeDefined();
      expect(capturedState.isLoading).toBe(false);
    });

    // Should have all required properties normalized
    expect(capturedState.resumeData.sectionVisibility).toBeDefined();
    expect(capturedState.resumeData.sectionVisibility.basics).toBe(true);
    expect(capturedState.resumeData.sectionVisibility.education).toBe(true);
    expect(capturedState.resumeData.sectionVisibility.work).toBe(true);
    
    // All arrays should exist
    expect(Array.isArray(capturedState.resumeData.work)).toBe(true);
    expect(Array.isArray(capturedState.resumeData.education)).toBe(true);
    expect(Array.isArray(capturedState.resumeData.skills)).toBe(true);
    
    // Work items should have visible property
    if (capturedState.resumeData.work.length > 0) {
      expect(typeof capturedState.resumeData.work[0].visible).toBe('boolean');
    }
  });

  it('should load and normalize data from localStorage', async () => {
    const storedData = {
      basics: { name: 'Test User' },
      work: [{ name: 'Company A', position: 'Developer' }],
      // Missing sectionVisibility
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

    let capturedState: TestResumeState;
    
    await act(async () => {
      renderWithProvider(
        <TestComponent onStateChange={(state) => { capturedState = state; }} />
      );
    });

    await waitFor(() => {
      expect(capturedState).toBeDefined();
      expect(capturedState.isLoading).toBe(false);
    });

    // Should normalize the loaded data
    expect(capturedState.resumeData.basics.name).toBe('Test User');
    expect(capturedState.resumeData.sectionVisibility).toBeDefined();
    expect(capturedState.resumeData.sectionVisibility.education).toBe(true);
    expect(capturedState.resumeData.work[0].visible).toBe(true);
  });

  it('should load and normalize data from resume.json when localStorage is empty', async () => {
    const resumeJsonData = {
      basics: { name: 'JSON User', email: 'test@example.com' },
      work: [{ name: 'Company B', position: 'Manager' }],
      education: []
    };

    mockLocalStorage.getItem.mockReturnValue(null);
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(resumeJsonData)
    });

    let capturedState: TestResumeState;
    
    await act(async () => {
      renderWithProvider(
        <TestComponent onStateChange={(state) => { capturedState = state; }} />
      );
    });

    await waitFor(() => {
      expect(capturedState).toBeDefined();
      expect(capturedState.isLoading).toBe(false);
    });

    // Should normalize the fetched data
    expect(capturedState.resumeData.basics.name).toBe('JSON User');
    expect(capturedState.resumeData.sectionVisibility).toBeDefined();
    expect(capturedState.resumeData.sectionVisibility.education).toBe(true);
    expect(capturedState.resumeData.work[0].visible).toBe(true);
  });

  it('should handle invalid localStorage data gracefully', async () => {
    mockLocalStorage.getItem.mockReturnValue('{ invalid json }');
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false
    });

    let capturedState: TestResumeState;
    
    await act(async () => {
      renderWithProvider(
        <TestComponent onStateChange={(state) => { capturedState = state; }} />
      );
    });

    await waitFor(() => {
      expect(capturedState).toBeDefined();
      expect(capturedState.isLoading).toBe(false);
    });

    // Should fall back to default data
    expect(capturedState.resumeData.sectionVisibility).toBeDefined();
    expect(capturedState.resumeData.sectionVisibility.education).toBe(true);
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('resumeData');
  });

  it('should handle data with missing visibility properties', async () => {
    const dataWithoutVisibility = {
      basics: { 
        name: 'Test User',
        profiles: [
          { network: 'LinkedIn', username: 'test' }
          // Missing visible property
        ]
      },
      work: [
        { name: 'Company A', position: 'Developer' }
        // Missing visible property
      ],
      education: [
        { institution: 'University A' }
        // Missing visible property
      ]
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(dataWithoutVisibility));

    let capturedState: TestResumeState;
    
    await act(async () => {
      renderWithProvider(
        <TestComponent onStateChange={(state) => { capturedState = state; }} />
      );
    });

    await waitFor(() => {
      expect(capturedState).toBeDefined();
      expect(capturedState.isLoading).toBe(false);
    });

    // Should add visible:true to all items
    expect(capturedState.resumeData.basics.profiles[0].visible).toBe(true);
    expect(capturedState.resumeData.work[0].visible).toBe(true);
    expect(capturedState.resumeData.education[0].visible).toBe(true);
  });

  it('should preserve existing visible:false properties', async () => {
    const dataWithMixedVisibility = {
      basics: { 
        name: 'Test User',
        profiles: [
          { network: 'LinkedIn', username: 'test', visible: false },
          { network: 'GitHub', username: 'test' }
        ]
      },
      work: [
        { name: 'Company A', position: 'Developer', visible: false },
        { name: 'Company B', position: 'Manager' }
      ]
    };

    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(dataWithMixedVisibility));

    let capturedState: TestResumeState;
    
    await act(async () => {
      renderWithProvider(
        <TestComponent onStateChange={(state) => { capturedState = state; }} />
      );
    });

    await waitFor(() => {
      expect(capturedState).toBeDefined();
      expect(capturedState.isLoading).toBe(false);
    });

    // Should preserve false, add true where missing
    expect(capturedState.resumeData.basics.profiles[0].visible).toBe(false);
    expect(capturedState.resumeData.basics.profiles[1].visible).toBe(true);
    expect(capturedState.resumeData.work[0].visible).toBe(false);
    expect(capturedState.resumeData.work[1].visible).toBe(true);
  });
});
