
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Palette, Edit, Eye } from "lucide-react";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";
import { ResumeRenderer } from "@/components/display/ResumeRenderer";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";

const ThemeEditor = () => {
  const navigate = useNavigate();
  const { state } = useResume();
  const { themeState } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
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
              <Button variant="outline" onClick={() => navigate('/view')} className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/edit')} className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Theme Customization Panel */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Palette className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">Customize Theme</h2>
            </div>
            <ThemeCustomizer />
          </div>

          {/* Live Preview */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preview</h2>
            <div className="sticky top-8">
              <div className="max-h-[80vh] overflow-y-auto">
                <ResumeRenderer 
                  resumeData={state.resumeData} 
                  theme={themeState.currentTheme}
                  className="scale-75 origin-top"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThemeEditor;
