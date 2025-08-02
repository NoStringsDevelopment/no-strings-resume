import React from 'react';
import { Project, Volunteer, Award, Certificate, Publication, Language, Interest, Reference } from '@/types/resume';
import { formatDate } from '@/utils/formatters';
import { SectionRenderer } from './SectionRenderer';
import { 
  getVisibleHighlights, 
  getVisibleKeywords, 
  getVisibleRoles, 
  getHighlightContent, 
  getKeywordName, 
  getRoleName 
} from '@/utils/visibilityHelpers';

interface OtherSectionsProps {
  projects: Project[];
  volunteer: Volunteer[];
  awards: Award[];
  certificates: Certificate[];
  publications: Publication[];
  languages: Language[];
  interests: Interest[];
  references: Reference[];
  sectionVisibility: {
    projects: boolean;
    volunteer: boolean;
    awards: boolean;
    certificates: boolean;
    publications: boolean;
    languages: boolean;
    interests: boolean;
    references: boolean;
  };
}

export const OtherSections: React.FC<OtherSectionsProps> = ({
  projects,
  volunteer,
  awards,
  certificates,
  publications,
  languages,
  interests,
  references,
  sectionVisibility
}) => {
  return (
    <>
      {/* Projects */}
      <SectionRenderer 
        title="Projects" 
        isVisible={sectionVisibility.projects} 
        hasItems={projects.some(p => p.visible !== false)}
        testId="resume-projects-section"
      >
        <div className="space-y-4">
          {projects
            .filter(project => project.visible !== false)
            .map((project, index) => {
              const visibleHighlights = getVisibleHighlights(project.highlights);
              const visibleKeywords = getVisibleKeywords(project.keywords);
              const visibleRoles = getVisibleRoles(project.roles);
              
              return (
                <div key={index} data-testid={`resume-project-${index}`}>
                  <h4 className="text-lg font-semibold" style={{ color: 'var(--color-secondary)' }}>
                    {project.name}
                  </h4>
                  <p style={{ color: 'var(--color-text)' }}>{project.description}</p>
                  
                  {visibleHighlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2" style={{ color: 'var(--color-text)' }}>
                      {visibleHighlights.map((highlight, hIndex) => (
                        <li key={hIndex}>{getHighlightContent(highlight)}</li>
                      ))}
                    </ul>
                  )}
                  
                  {visibleKeywords.length > 0 && (
                    <p className="text-sm mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                      <strong>Technologies:</strong> {visibleKeywords.map(keyword => getKeywordName(keyword)).join(', ')}
                    </p>
                  )}
                  
                  {visibleRoles.length > 0 && (
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      <strong>Roles:</strong> {visibleRoles.map(role => getRoleName(role)).join(', ')}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </SectionRenderer>

      {/* Volunteer Experience */}
      <SectionRenderer 
        title="Volunteer Experience" 
        isVisible={sectionVisibility.volunteer} 
        hasItems={volunteer.some(v => v.visible !== false)}
        testId="resume-volunteer-section"
      >
        <div className="space-y-4">
          {volunteer
            .filter(vol => vol.visible !== false)
            .map((vol, index) => {
              const visibleHighlights = getVisibleHighlights(vol.highlights);
              
              return (
                <div key={index} data-testid={`resume-volunteer-${index}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold" style={{ color: 'var(--color-secondary)' }}>
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

      {/* Awards */}
      <SectionRenderer 
        title="Awards" 
        isVisible={sectionVisibility.awards} 
        hasItems={awards.some(a => a.visible !== false)}
        testId="resume-awards-section"
      >
        <div className="space-y-3">
          {awards
            .filter(award => award.visible !== false)
            .map((award, index) => (
              <div key={index} data-testid={`resume-award-${index}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
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
      </SectionRenderer>

      {/* Certificates */}
      <SectionRenderer 
        title="Certificates" 
        isVisible={sectionVisibility.certificates} 
        hasItems={certificates.some(c => c.visible !== false)}
        testId="resume-certificates-section"
      >
        <div className="space-y-3">
          {certificates
            .filter(cert => cert.visible !== false)
            .map((cert, index) => (
              <div key={index} data-testid={`resume-certificate-${index}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
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
      </SectionRenderer>

      {/* Publications */}
      <SectionRenderer 
        title="Publications" 
        isVisible={sectionVisibility.publications} 
        hasItems={publications.some(p => p.visible !== false)}
        testId="resume-publications-section"
      >
        <div className="space-y-3">
          {publications
            .filter(pub => pub.visible !== false)
            .map((pub, index) => (
              <div key={index} data-testid={`resume-publication-${index}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
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
      </SectionRenderer>

      {/* Languages */}
      <SectionRenderer 
        title="Languages" 
        isVisible={sectionVisibility.languages} 
        hasItems={languages.some(l => l.visible !== false)}
        testId="resume-languages-section"
      >
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
      </SectionRenderer>

      {/* Interests */}
      <SectionRenderer 
        title="Interests" 
        isVisible={sectionVisibility.interests} 
        hasItems={interests.some(i => i.visible !== false)}
        testId="resume-interests-section"
      >
        <div className="space-y-2">
          {interests
            .filter(interest => interest.visible !== false)
            .map((interest, index) => {
              const visibleKeywords = getVisibleKeywords(interest.keywords);
              
              return (
                <div key={index} data-testid={`resume-interest-${index}`}>
                  <h4 className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
                    {interest.name}
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

      {/* References */}
      <SectionRenderer 
        title="References" 
        isVisible={sectionVisibility.references} 
        hasItems={references.some(r => r.visible !== false)}
        testId="resume-references-section"
      >
        <div className="space-y-3">
          {references
            .filter(ref => ref.visible !== false)
            .map((ref, index) => (
              <div key={index} data-testid={`resume-reference-${index}`}>
                <h4 className="font-semibold" style={{ color: 'var(--color-secondary)' }}>
                  {ref.name}
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-text)' }}>
                  {ref.reference}
                </p>
              </div>
            ))}
        </div>
      </SectionRenderer>
    </>
  );
};
