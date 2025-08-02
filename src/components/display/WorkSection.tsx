import React from 'react';
import { WorkExperience } from '@/types/resume';
import { formatDate } from '@/utils/formatters';
import { SectionRenderer } from './SectionRenderer';
import { getVisibleHighlights, getHighlightContent } from '@/utils/visibilityHelpers';

interface WorkSectionProps {
  work: WorkExperience[];
  isVisible: boolean;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ work, isVisible }) => {
  const visibleWork = work.filter(w => w.visible !== false);
  
  return (
    <SectionRenderer 
      title="Work Experience" 
      isVisible={isVisible} 
      hasItems={visibleWork.length > 0}
      testId="resume-work-section"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item)' }}>
        {visibleWork.map((work, index) => {
          const visibleHighlights = getVisibleHighlights(work.highlights);
          
          return (
            <div key={index} data-testid={`resume-work-${index}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-semibold" style={{ color: 'var(--color-secondary)' }}>
                    {work.position}
                  </h4>
                  <p className="text-base font-medium" style={{ color: 'var(--color-accent)' }}>
                    {work.name}
                  </p>
                </div>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {formatDate(work.startDate)} - {work.endDate ? formatDate(work.endDate) : 'Present'}
                </span>
              </div>
              {work.summary && (
                <p className="mb-2" style={{ color: 'var(--color-text)' }}>
                  {work.summary}
                </p>
              )}
              {visibleHighlights.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--color-text)' }}>
                  {visibleHighlights.map((highlight, hIndex) => (
                    <li key={hIndex}>{getHighlightContent(highlight)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </SectionRenderer>
  );
};
