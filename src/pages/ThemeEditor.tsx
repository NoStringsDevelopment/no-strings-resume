
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Palette, Edit, Eye } from "lucide-react";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";
import { EnhancedPreview } from "@/components/display/EnhancedPreview";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { usePreviewToggle } from "@/hooks/usePreviewToggle";

const ThemeEditor = () => {
  const navigate = useNavigate();
  const { state } = useResume();
  const { themeState } = useTheme();
  const { isPreviewVisible, togglePreview } = usePreviewToggle();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigate('/')}
                  className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  data-testid="home-button"
                >
                  <span className="text-white font-bold text-sm">NR</span>
                </button>
                <span className="font-semibold text-gray-900 hidden lg:block">No Strings Resume</span>
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium hidden sm:block">
                Theme Mode
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Preview Toggle */}
              <div className="flex items-center space-x-2 mr-2">
                <Checkbox 
                  id="theme-preview-toggle"
                  checked={isPreviewVisible}
                  onCheckedChange={togglePreview}
                  data-testid="preview-toggle"
                />
                <label 
                  htmlFor="theme-preview-toggle" 
                  className="text-sm font-medium cursor-pointer hidden sm:block"
                >
                  Preview
                </label>
              </div>
              
              <div className="w-px h-6 bg-gray-300 mr-1 hidden sm:block" />
              
              <Button variant="outline" onClick={() => navigate('/edit')} className="flex items-center space-x-2" data-testid="edit-button">
                <Edit className="w-4 h-4" />
                <span className="hidden lg:block">Edit</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/view')} className="flex items-center space-x-2" data-testid="view-button">
                <Eye className="w-4 h-4" />
                <span className="hidden lg:block">View</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Conditional Layout */}
      <main className="container mx-auto px-4 py-8">
        <div className={`grid gap-8 ${isPreviewVisible ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          {/* Left Column - Theme Customization Panel */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Palette className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Customize Theme</h2>
            </div>
            <ThemeCustomizer />
          </div>

          {/* Right Column - Live Preview (Conditional) */}
          {isPreviewVisible && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
              <div className="sticky top-8">
                <EnhancedPreview 
                  resumeData={state.resumeData} 
                  theme={themeState.currentTheme}
                  data-testid="theme-preview"
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ThemeEditor;
