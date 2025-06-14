
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Edit, Download, Home } from "lucide-react";

const ResumeView = () => {
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
              <h1 className="text-xl font-semibold text-gray-900">Resume View</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/edit')}
                className="flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Button>
              <Button 
                className="flex items-center space-x-2"
                disabled
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <FileText className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resume Preview</h2>
            <p className="text-gray-600 mb-6">
              This is where your formatted resume will be displayed. You'll be able to see exactly how it will look when exported.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Coming soon:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Formatted resume display</li>
                <li>• Multiple theme layouts</li>
                <li>• Export to PDF, DOCX, HTML</li>
                <li>• Print-friendly formatting</li>
                <li>• ATS-optimized structure</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeView;
