
import React from 'react';

interface SectionRendererProps {
  title: string;
  isVisible: boolean;
  hasItems: boolean;
  children: React.ReactNode;
  testId: string;
}

export const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  title, 
  isVisible, 
  hasItems, 
  children, 
  testId 
}) => {
  if (!isVisible || !hasItems) return null;

  return (
    <section data-testid={testId}>
      <h3 
        className="text-2xl font-bold mb-4 pb-2 border-b" 
        style={{ 
          color: 'var(--color-primary)', 
          fontFamily: 'var(--font-heading)',
          borderColor: 'var(--color-border)'
        }}
      >
        {title}
      </h3>
      {children}
    </section>
  );
};
