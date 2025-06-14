
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Palette, Home } from "lucide-react";

const ResumeEditor = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Resume Editor</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/view')}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/theme')}
                className="flex items-center space-x-2"
              >
                <Palette className="w-4 h-4" />
                <span>Theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Edit className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume Editor</h2>
            <p className="text-gray-600 mb-6">
              This is where you'll edit your resume content. The full editor interface will be implemented here.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Coming soon:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Form-based editing of resume sections</li>
                <li>• Add/remove work experience, education, skills</li>
                <li>• Toggle section visibility</li>
                <li>• Import/export JSON data</li>
                <li>• Live preview integration</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeEditor;
