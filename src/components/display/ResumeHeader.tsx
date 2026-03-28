
import React from 'react';
import { Basics, BasicsFieldVisibility, DEFAULT_BASICS_VISIBILITY } from '@/types/resume';
import { ResumeInlineLink } from './ResumeInlineLink';

interface ResumeHeaderProps {
  basics: Basics;
  basicsVisibility?: BasicsFieldVisibility;
  isVisible: boolean;
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({ basics, basicsVisibility, isVisible }) => {
  if (!isVisible) return null;

  const fieldVisibility = { ...DEFAULT_BASICS_VISIBILITY, ...basicsVisibility };
  const locationText = [basics.location.city, basics.location.region || basics.location.countryCode]
    .filter(Boolean)
    .join(', ');
  const contactItems = [
    fieldVisibility.email && basics.email ? { key: 'email', testId: 'resume-email', value: basics.email, kind: 'email' as const } : null,
    fieldVisibility.phone && basics.phone ? { key: 'phone', testId: 'resume-phone', value: basics.phone, kind: 'phone' as const } : null,
    fieldVisibility.url && basics.url ? { key: 'url', testId: 'resume-url', value: basics.url, kind: 'url' as const } : null,
    fieldVisibility.location && locationText ? { key: 'location', testId: 'resume-location', value: locationText } : null,
  ].filter((item): item is { key: string; testId: string; value: string; kind?: 'email' | 'phone' | 'url' } => Boolean(item));
  const visibleProfiles = basics.profiles.filter(profile => profile.visible !== false);

  return (
    <header className="p-8 border-b-2" style={{ borderColor: 'var(--color-primary)' }}>
      <h1 
        className="text-4xl font-bold mb-2" 
        style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}
        data-testid="resume-name"
      >
        {basics.name}
      </h1>
      {fieldVisibility.label && basics.label && (
        <h2 
          className="text-xl mb-4" 
          style={{ color: 'var(--color-secondary)' }}
          data-testid="resume-label"
        >
          {basics.label}
        </h2>
      )}
      
      {/* Contact Information */}
      {contactItems.length > 0 && (
        <div className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
          {contactItems.map((item, index) => (
            <React.Fragment key={item.key}>
              {index > 0 && <span aria-hidden="true"> • </span>}
              {item.kind ? (
                <ResumeInlineLink value={item.value} kind={item.kind} testId={item.testId} className="underline-offset-2 hover:underline">
                  {item.value}
                </ResumeInlineLink>
              ) : (
                <span data-testid={item.testId}>{item.value}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Social Profiles */}
      {visibleProfiles.length > 0 && (
        <div 
          className="text-sm mb-4 pb-4" 
          style={{ 
            color: 'var(--color-text-secondary)',
            borderBottom: '1px solid var(--color-border)'
          }}
        >
          {visibleProfiles.map((profile, index) => (
            <React.Fragment key={`${profile.network}-${profile.url}-${index}`}>
              {index > 0 && <span aria-hidden="true"> • </span>}
              <ResumeInlineLink
                value={profile.url}
                testId={`resume-profile-${index}`}
                className="underline-offset-2 hover:underline"
              >
                {`${profile.network}: ${profile.username || profile.url}`}
              </ResumeInlineLink>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Summary */}
      {fieldVisibility.summary && basics.summary && (
        <p 
          className="mt-4 text-base leading-relaxed" 
          style={{ color: 'var(--color-text)' }}
          data-testid="resume-summary"
        >
          {basics.summary}
        </p>
      )}
    </header>
  );
};
