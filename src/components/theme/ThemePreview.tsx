
import { useTheme } from "@/context/ThemeContext";
import { useResume } from "@/context/ResumeContext";

export const ThemePreview = () => {
  const { themeState } = useTheme();
  const { state } = useResume();
  const { currentTheme } = themeState;
  const { resumeData } = state;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div 
        className="p-8 space-y-6"
        style={{
          fontFamily: currentTheme.typography.fontFamily,
          fontSize: `${currentTheme.typography.fontSize}px`,
          lineHeight: currentTheme.typography.lineHeight,
          color: currentTheme.colors.text
        }}
      >
        {/* Header */}
        <div className="text-center border-b pb-6" style={{ borderColor: currentTheme.colors.primary }}>
          <h1 
            className="text-3xl font-bold mb-2" 
            style={{ color: currentTheme.colors.primary }}
          >
            {resumeData.basics?.name || "John Doe"}
          </h1>
          <div 
            className="text-xl mb-2" 
            style={{ color: currentTheme.colors.secondary }}
          >
            {resumeData.basics?.label || "Software Developer"}
          </div>
          <div className="text-sm space-x-2">
            <span>{resumeData.basics?.email || "john@example.com"}</span>
            <span>•</span>
            <span>{resumeData.basics?.phone || "+1 234 567 8900"}</span>
          </div>
        </div>

        {/* Summary */}
        <div>
          <h2 
            className="text-lg font-semibold mb-3 pb-1 border-b" 
            style={{ 
              color: currentTheme.colors.primary,
              borderColor: currentTheme.colors.accent 
            }}
          >
            Summary
          </h2>
          <p className="leading-relaxed">
            {resumeData.basics?.summary || "Experienced software developer with a passion for creating innovative solutions and delivering high-quality code. Skilled in multiple programming languages and frameworks."}
          </p>
        </div>

        {/* Experience */}
        <div>
          <h2 
            className="text-lg font-semibold mb-3 pb-1 border-b" 
            style={{ 
              color: currentTheme.colors.primary,
              borderColor: currentTheme.colors.accent 
            }}
          >
            Experience
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 
                  className="font-medium" 
                  style={{ color: currentTheme.colors.secondary }}
                >
                  Senior Software Developer
                </h3>
                <span className="text-sm text-gray-500">2022 - Present</span>
              </div>
              <div className="text-sm mb-2" style={{ color: currentTheme.colors.accent }}>
                Tech Company Inc.
              </div>
              <ul className="text-sm space-y-1 list-disc list-inside ml-4">
                <li>Led development of key features for web applications</li>
                <li>Mentored junior developers and conducted code reviews</li>
                <li>Improved system performance by 40% through optimization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h2 
            className="text-lg font-semibold mb-3 pb-1 border-b" 
            style={{ 
              color: currentTheme.colors.primary,
              borderColor: currentTheme.colors.accent 
            }}
          >
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'].map((skill) => (
              <span 
                key={skill}
                className="px-2 py-1 text-xs rounded"
                style={{ 
                  backgroundColor: `${currentTheme.colors.accent}20`,
                  color: currentTheme.colors.accent 
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
