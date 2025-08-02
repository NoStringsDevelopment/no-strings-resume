import React from 'react';
import { Education } from '@/types/resume';
import { formatDate } from '@/utils/formatters';
import { SectionRenderer } from './SectionRenderer';
import { getVisibleCourses, getCourseName } from '@/utils/visibilityHelpers';

interface EducationSectionProps {
  education: Education[];
  isVisible: boolean;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ education, isVisible }) => {
  const visibleEducation = education.filter(e => e.visible !== false);
  
  return (
    <SectionRenderer 
      title="Education" 
      isVisible={isVisible} 
      hasItems={visibleEducation.length > 0}
      testId="resume-education-section"
    >
      <div className="space-y-4">
        {visibleEducation.map((edu, index) => {
          const visibleCourses = getVisibleCourses(edu.courses);
          
          return (
            <div key={index} data-testid={`resume-education-${index}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold" style={{ color: 'var(--color-secondary)' }}>
                    {edu.studyType} {edu.area && `in ${edu.area}`}
                  </h4>
                  <p className="font-medium" style={{ color: 'var(--color-accent)' }}>
                    {edu.institution}
                  </p>
                </div>
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                </span>
              </div>
              {edu.score && (
                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  {edu.score}
                </p>
              )}
              {visibleCourses.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                    Relevant Courses:
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {visibleCourses.map(course => getCourseName(course)).join(', ')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionRenderer>
  );
};
