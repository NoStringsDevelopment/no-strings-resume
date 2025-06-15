import React from 'react';
import { ResumeData, Theme } from '@/types/resume';
import { formatDate } from '@/utils/formatters';

interface ResumeRendererProps {
  resumeData: ResumeData;
  theme: Theme;
  className?: string;
}

export const ResumeRenderer: React.FC<ResumeRendererProps> = ({ 
  resumeData, 
  theme, 
  className = '' 
}) => {
  const { sectionVisibility } = resumeData;

  const themeStyles = {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--color-text': theme.colors.text,
    '--color-text-secondary': theme.colors.textSecondary,
    '--color-background': theme.colors.background,
    '--color-border': theme.colors.border,
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
    '--spacing-section': theme.spacing.section,
    '--spacing-item': theme.spacing.item,
  } as React.CSSProperties;

  return (
    <div 
      className={`resume-renderer ${className}`}
      style={themeStyles}
      data-testid="resume-renderer"
    >
      <div className="bg-white shadow-lg max-w-4xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
        {/* Header Section */}
        {sectionVisibility.basics && (
          <header className="p-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }}>
            <h1 
              className="text-4xl font-bold mb-2" 
              style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
              data-testid="resume-name"
            >
              {resumeData.basics.name}
            </h1>
            {resumeData.basics.label && (
              <h2 
                className="text-xl mb-4" 
                style={{ color: 'var(--color-secondary)' }}
                data-testid="resume-label"
              >
                {resumeData.basics.label}
              </h2>
            )}
            
            {/* Contact Information - Split for test ids */}
            <div className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              {resumeData.basics.email && (
                <span data-testid="resume-email">📧 {resumeData.basics.email}</span>
              )}
              {resumeData.basics.phone && (
                <span data-testid="resume-phone">{resumeData.basics.email && ' • '}📞 {resumeData.basics.phone}</span>
              )}
              {resumeData.basics.url && (
                <span data-testid="resume-url">{(resumeData.basics.email || resumeData.basics.phone) && ' • '}🌐 {resumeData.basics.url}</span>
              )}
              {(resumeData.basics.location.city || resumeData.basics.location.region) && (
                <span data-testid="resume-location">{(resumeData.basics.email || resumeData.basics.phone || resumeData.basics.url) && ' • '}📍 {[resumeData.basics.location.city, resumeData.basics.location.region].filter(Boolean).join(', ')}</span>
              )}
            </div>

            {/* Social Profiles - Also compressed */}
            {resumeData.basics.profiles.some(p => p.visible !== false) && (
              <div className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {resumeData.basics.profiles
                  .filter(profile => profile.visible !== false)
                  .map(profile => `${profile.network}: ${profile.username || profile.url}`)
                  .join(' • ')}
              </div>
            )}

            {/* Summary */}
            {resumeData.basics.summary && (
              <p 
                className="mt-4 text-base leading-relaxed" 
                style={{ color: 'var(--color-text)' }}
                data-testid="resume-summary"
              >
                {resumeData.basics.summary}
              </p>
            )}
          </header>
        )}

        <div className="p-8 space-y-8">
          {/* Work Experience */}
          {sectionVisibility.work && resumeData.work.some(w => w.visible !== false) && (
            <section data-testid="resume-work-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Work Experience
              </h3>
              <div className="space-y-6">
                {resumeData.work
                  .filter(work => work.visible !== false)
                  .map((work, index) => (
                    <div key={index} data-testid={`resume-work-${index}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
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
                      {work.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--color-text)' }}>
                          {work.highlights.map((highlight, hIndex) => (
                            <li key={hIndex}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Education */}
          {sectionVisibility.education && resumeData.education.some(e => e.visible !== false) && (
            <section data-testid="resume-education-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Education
              </h3>
              <div className="space-y-4">
                {resumeData.education
                  .filter(edu => edu.visible !== false)
                  .map((edu, index) => (
                    <div key={index} data-testid={`resume-education-${index}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
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
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {sectionVisibility.skills && resumeData.skills.some(s => s.visible !== false) && (
            <section data-testid="resume-skills-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.skills
                  .filter(skill => skill.visible !== false)
                  .map((skill, index) => (
                    <div key={index} data-testid={`resume-skill-${index}`}>
                      <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {skill.name} {skill.level && `(${skill.level})`}
                      </h4>
                      {skill.keywords.length > 0 && (
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {skill.keywords.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {sectionVisibility.projects && resumeData.projects.some(p => p.visible !== false) && (
            <section data-testid="resume-projects-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Projects
              </h3>
              <div className="space-y-4">
                {resumeData.projects
                  .filter(project => project.visible !== false)
                  .map((project, index) => (
                    <div key={index} data-testid={`resume-project-${index}`}>
                      <h4 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                        {project.name}
                      </h4>
                      <p style={{ color: 'var(--color-text)' }}>{project.description}</p>
                      {project.keywords.length > 0 && (
                        <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                          Technologies: {project.keywords.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {sectionVisibility.awards && resumeData.awards.some(a => a.visible !== false) && (
            <section data-testid="resume-awards-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Awards
              </h3>
              <div className="space-y-3">
                {resumeData.awards
                  .filter(award => award.visible !== false)
                  .map((award, index) => (
                    <div key={index} data-testid={`resume-award-${index}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                            {award.title}
                          </h4>
                          <p style={{ color: 'var(--color-accent)' }}>{award.awarder}</p>
                        </div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(award.date)}
                        </span>
                      </div>
                      {award.summary && (
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text)' }}>
                          {award.summary}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {sectionVisibility.languages && resumeData.languages.some(l => l.visible !== false) && (
            <section data-testid="resume-languages-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Languages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {resumeData.languages
                  .filter(lang => lang.visible !== false)
                  .map((lang, index) => (
                    <div key={index} data-testid={`resume-language-${index}`}>
                      <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {lang.language}
                      </span>
                      {lang.fluency && (
                        <span className="text-sm ml-2" style={{ color: 'var(--color-text-secondary)' }}>
                          ({lang.fluency})
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
