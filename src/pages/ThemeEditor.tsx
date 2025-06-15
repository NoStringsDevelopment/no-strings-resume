import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Palette, Edit, Eye, Home } from "lucide-react";
import { ThemeCustomizer } from "@/components/theme/ThemeCustomizer";
import { ThemePreview } from "@/components/theme/ThemePreview";
const ThemeEditor = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              
              
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/edit')} className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
              <Button variant="outline" onClick={() => navigate('/view')} className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View</span>
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
              <ThemePreview />
            </div>
          </div>
        </div>
      </main>
    </div>;
};
export default ThemeEditor;