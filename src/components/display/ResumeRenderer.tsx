
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
  // Safely destructure sectionVisibility with fallback
  const sectionVisibility = resumeData?.sectionVisibility || {
    basics: true,
    work: true,
    education: true,
    skills: true,
    projects: true,
    awards: true,
    certificates: true,
    publications: true,
    languages: true,
    interests: true,
    references: true,
    volunteer: true
  };

  // Early return if resumeData is not available
  if (!resumeData) {
    return <div>Loading...</div>;
  }

  // Ensure basics exists
  const basics = resumeData.basics || {
    name: '',
    label: '',
    email: '',
    phone: '',
    url: '',
    summary: '',
    image: '',
    location: {
      address: '',
      postalCode: '',
      city: '',
      countryCode: '',
      region: ''
    },
    profiles: []
  };

  // Ensure arrays exist
  const work = resumeData.work || [];
  const education = resumeData.education || [];
  const skills = resumeData.skills || [];
  const projects = resumeData.projects || [];
  const awards = resumeData.awards || [];
  const certificates = resumeData.certificates || [];
  const publications = resumeData.publications || [];
  const languages = resumeData.languages || [];
  const interests = resumeData.interests || [];
  const references = resumeData.references || [];
  const volunteer = resumeData.volunteer || [];

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
    '--font-family': theme.typography.fontFamily,
    '--font-size': `${theme.typography.fontSize}px`,
    '--line-height': theme.typography.lineHeight,
    '--spacing-section': theme.spacing.section,
    '--spacing-item': theme.spacing.item,
  } as React.CSSProperties;

  return (
    <div 
      className={`resume-renderer ${className}`}
      style={themeStyles}
      data-testid="resume-renderer"
    >
      <div 
        className="bg-white shadow-lg max-w-4xl mx-auto" 
        style={{ 
          fontFamily: 'var(--font-family)', 
          fontSize: 'var(--font-size)',
          lineHeight: 'var(--line-height)'
        }}
      >
        {/* Header Section */}
        {sectionVisibility.basics && (
          <header className="p-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }}>
            <h1 
              className="text-4xl font-bold mb-2" 
              style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
              data-testid="resume-name"
            >
              {basics.name}
            </h1>
            {basics.label && (
              <h2 
                className="text-xl mb-4" 
                style={{ color: 'var(--color-secondary)' }}
                data-testid="resume-label"
              >
                {basics.label}
              </h2>
            )}
            
            {/* Contact Information */}
            <div className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
              {basics.email && (
                <span data-testid="resume-email">📧 {basics.email}</span>
              )}
              {basics.phone && (
                <span data-testid="resume-phone">{basics.email && ' • '}📞 {basics.phone}</span>
              )}
              {basics.url && (
                <span data-testid="resume-url">{(basics.email || basics.phone) && ' • '}🌐 {basics.url}</span>
              )}
              {(basics.location.city || basics.location.region) && (
                <span data-testid="resume-location">{(basics.email || basics.phone || basics.url) && ' • '}📍 {[basics.location.city, basics.location.region].filter(Boolean).join(', ')}</span>
              )}
            </div>

            {/* Social Profiles */}
            {basics.profiles.some(p => p.visible !== false) && (
              <div className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                {basics.profiles
                  .filter(profile => profile.visible !== false)
                  .map(profile => `${profile.network}: ${profile.username || profile.url}`)
                  .join(' • ')}
              </div>
            )}

            {/* Summary */}
            {basics.summary && (
              <p 
                className="mt-4 text-base leading-relaxed" 
                style={{ color: 'var(--color-text)' }}
                data-testid="resume-summary"
              >
                {basics.summary}
              </p>
            )}
          </header>
        )}

        <div className="p-8" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-section)' }}>
          {/* Work Experience */}
          {sectionVisibility.work && work.some(w => w.visible !== false) && (
            <section data-testid="resume-work-section">
              <h3 
                className="text-2xl font-bold pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)',
                  marginBottom: 'var(--spacing-item)'
                }}
              >
                Work Experience
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-item)' }}>
                {work
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
          {sectionVisibility.education && education.some(e => e.visible !== false) && (
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
                {education
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
          {sectionVisibility.skills && skills.some(s => s.visible !== false) && (
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
                {skills
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
          {sectionVisibility.projects && projects.some(p => p.visible !== false) && (
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
                {projects
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

          {/* Volunteer Experience */}
          {sectionVisibility.volunteer && volunteer.some(v => v.visible !== false) && (
            <section data-testid="resume-volunteer-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Volunteer Experience
              </h3>
              <div className="space-y-4">
                {volunteer
                  .filter(vol => vol.visible !== false)
                  .map((vol, index) => (
                    <div key={index} data-testid={`resume-volunteer-${index}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
                            {vol.position}
                          </h4>
                          <p className="font-medium" style={{ color: 'var(--color-accent)' }}>
                            {vol.organization}
                          </p>
                        </div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(vol.startDate)} - {vol.endDate ? formatDate(vol.endDate) : 'Present'}
                        </span>
                      </div>
                      {vol.summary && (
                        <p className="mb-2" style={{ color: 'var(--color-text)' }}>
                          {vol.summary}
                        </p>
                      )}
                      {vol.highlights.length > 0 && (
                        <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: 'var(--color-text)' }}>
                          {vol.highlights.map((highlight, hIndex) => (
                            <li key={hIndex}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {sectionVisibility.awards && awards.some(a => a.visible !== false) && (
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
                {awards
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

          {/* Certificates */}
          {sectionVisibility.certificates && certificates.some(c => c.visible !== false) && (
            <section data-testid="resume-certificates-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Certificates
              </h3>
              <div className="space-y-3">
                {certificates
                  .filter(cert => cert.visible !== false)
                  .map((cert, index) => (
                    <div key={index} data-testid={`resume-certificate-${index}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                            {cert.name}
                          </h4>
                          <p style={{ color: 'var(--color-accent)' }}>{cert.issuer}</p>
                        </div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(cert.date)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Publications */}
          {sectionVisibility.publications && publications.some(p => p.visible !== false) && (
            <section data-testid="resume-publications-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Publications
              </h3>
              <div className="space-y-3">
                {publications
                  .filter(pub => pub.visible !== false)
                  .map((pub, index) => (
                    <div key={index} data-testid={`resume-publication-${index}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                            {pub.name}
                          </h4>
                          <p style={{ color: 'var(--color-accent)' }}>{pub.publisher}</p>
                        </div>
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {formatDate(pub.releaseDate)}
                        </span>
                      </div>
                      {pub.summary && (
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text)' }}>
                          {pub.summary}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {sectionVisibility.languages && languages.some(l => l.visible !== false) && (
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
                {languages
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

          {/* Interests */}
          {sectionVisibility.interests && interests.some(i => i.visible !== false) && (
            <section data-testid="resume-interests-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                Interests
              </h3>
              <div className="space-y-2">
                {interests
                  .filter(interest => interest.visible !== false)
                  .map((interest, index) => (
                    <div key={index} data-testid={`resume-interest-${index}`}>
                      <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {interest.name}
                      </h4>
                      {interest.keywords.length > 0 && (
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                          {interest.keywords.join(', ')}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* References */}
          {sectionVisibility.references && references.some(r => r.visible !== false) && (
            <section data-testid="resume-references-section">
              <h3 
                className="text-2xl font-bold mb-4 pb-2 border-b" 
                style={{ 
                  color: 'var(--color-primary)', 
                  fontFamily: 'var(--font-heading)',
                  borderColor: 'var(--color-border)'
                }}
              >
                References
              </h3>
              <div className="space-y-3">
                {references
                  .filter(ref => ref.visible !== false)
                  .map((ref, index) => (
                    <div key={index} data-testid={`resume-reference-${index}`}>
                      <h4 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                        {ref.name}
                      </h4>
                      <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                        {ref.reference}
                      </p>
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
