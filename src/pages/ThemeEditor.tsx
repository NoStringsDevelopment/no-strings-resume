
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
          {/* Desktop Layout - Single Row */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  data-testid="home-button"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 hidden xl:block">No Strings Resume</span>
                </Button>
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full font-medium hidden lg:block">
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
                  className="text-sm font-medium cursor-pointer hidden lg:block"
                >
                  Preview
                </label>
              </div>
              
              <div className="w-px h-6 bg-gray-300 mr-1 hidden lg:block" />
              
              <Button variant="outline" onClick={() => navigate('/edit')} className="flex items-center space-x-2" data-testid="edit-button">
                <Edit className="w-4 h-4" />
                <span className="hidden xl:block">Edit</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/view')} className="flex items-center space-x-2" data-testid="view-button">
                <Eye className="w-4 h-4" />
                <span className="hidden xl:block">View</span>
              </Button>
            </div>
          </div>

          {/* Mobile/Tablet Layout - Three Rows */}
          <div className="md:hidden space-y-3">
            {/* First Row - Branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  data-testid="home-button-mobile"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">No Strings Resume</span>
                </Button>
                <div className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                  Theme
                </div>
              </div>
            </div>

            {/* Second Row - Navigation */}
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/edit')} className="flex items-center space-x-2" data-testid="edit-button-mobile">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/view')} className="flex items-center space-x-2" data-testid="view-button-mobile">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </Button>
            </div>

            {/* Third Row - Preview Toggle */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="theme-preview-toggle-mobile"
                  checked={isPreviewVisible}
                  onCheckedChange={togglePreview}
                  data-testid="preview-toggle-mobile"
                />
                <label 
                  htmlFor="theme-preview-toggle-mobile" 
                  className="text-sm font-medium cursor-pointer"
                >
                  Preview
                </label>
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
