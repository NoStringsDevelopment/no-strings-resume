import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Palette, Edit, Eye, FileText } from "lucide-react";
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
          {/* Single Responsive Layout */}
          <div className="flex items-center justify-between">
            
            {/* Brand Section */}
            <div className="flex flex-col items-start space-y-1">
              <Button 
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 p-1"
                data-testid="home-button"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900 hidden sm:block lg:hidden xl:block">No Strings Resume</span>
              </Button>
              
              {/* Theme Mode Badge - Below Logo */}
              <div className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                Theme Mode
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center space-x-3">
              {/* Preview Toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="preview-toggle"
                  checked={isPreviewVisible}
                  onCheckedChange={togglePreview}
                  data-testid="preview-toggle"
                />
                <label 
                  htmlFor="preview-toggle" 
                  className="text-sm font-medium cursor-pointer hidden sm:block"
                >
                  Preview
                </label>
              </div>
              
              <div className="w-px h-6 bg-gray-300 hidden sm:block" />
              
              {/* Navigation Actions - Single Responsive Set */}
              <div className="flex items-center space-x-1">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/edit')}
                  className="flex items-center space-x-1"
                  data-testid="edit-button"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline xl:block">Edit</span>
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/view')}
                  className="flex items-center space-x-1"
                  data-testid="view-button"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline xl:block">View</span>
                </Button>
              </div>
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
