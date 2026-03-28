import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import SectionVisibilityEditor from './SectionVisibilityEditor';

const mockDispatch = vi.fn();

vi.mock('@/context/ResumeContext', () => ({
  useResume: () => ({
    state: {
      resumeData: {
        sectionPageBreaks: {
          basics: false,
          work: false,
          volunteer: false,
          education: false,
          skills: false,
          projects: false,
          awards: false,
          certificates: false,
          publications: false,
          languages: false,
          interests: false,
          references: false,
        },
      },
    },
    dispatch: mockDispatch,
  }),
}));

describe('SectionVisibilityEditor', () => {
  it('dispatches page break updates when a toggle is clicked', () => {
    render(<SectionVisibilityEditor />);

    fireEvent.click(screen.getByTestId('page-break-work-toggle'));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_SECTION_PAGE_BREAKS',
      payload: { work: true },
    });
  });
});
