
import React from 'react';
import { Basics } from '@/types/resume';

interface ResumeHeaderProps {
  basics: Basics;
  isVisible: boolean;
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({ basics, isVisible }) => {
  if (!isVisible) return null;

  return (
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
        <div 
          className="text-sm mb-4 pb-4" 
          style={{ 
            color: 'var(--color-text-secondary)',
            borderBottom: '1px solid var(--color-border)'
          }}
        >
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
  );
};
