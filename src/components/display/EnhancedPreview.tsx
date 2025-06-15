
import React from 'react';
import { ResumeData, Theme } from '@/types/resume';
import { ResumeRenderer } from './ResumeRenderer';

interface EnhancedPreviewProps {
  resumeData: ResumeData;
  theme: Theme;
  className?: string;
}

export const EnhancedPreview: React.FC<EnhancedPreviewProps> = ({ 
  resumeData, 
  theme, 
  className = '' 
}) => {
  return (
    <div 
      className={`enhanced-preview ${className}`}
      data-testid="enhanced-preview"
    >
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Top fade gradient */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        
        {/* Preview container with padding and overflow handling */}
        <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 transition-colors">
          <div className="py-8 px-4">
            <ResumeRenderer 
              resumeData={resumeData} 
              theme={theme}
              className="scale-75 origin-top transform-gpu"
            />
          </div>
        </div>
        
        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
};
