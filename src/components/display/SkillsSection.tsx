import React from 'react';
import { Skill } from '@/types/resume';
import { SectionRenderer } from './SectionRenderer';
import { getVisibleKeywords, getKeywordName } from '@/utils/visibilityHelpers';

interface SkillsSectionProps {
  skills: Skill[];
  isVisible: boolean;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, isVisible }) => {
  const visibleSkills = skills.filter(s => s.visible !== false);
  
  return (
    <SectionRenderer 
      title="Skills" 
      isVisible={isVisible} 
      hasItems={visibleSkills.length > 0}
      testId="resume-skills-section"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleSkills.map((skill, index) => {
          const visibleKeywords = getVisibleKeywords(skill.keywords);
          
          return (
            <div key={index} data-testid={`resume-skill-${index}`}>
              <h4 className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
                {skill.name} {skill.level && `(${skill.level})`}
              </h4>
              {visibleKeywords.length > 0 && (
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {visibleKeywords.map(keyword => getKeywordName(keyword)).join(', ')}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </SectionRenderer>
  );
};
