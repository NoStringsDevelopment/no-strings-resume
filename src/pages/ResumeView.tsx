
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Edit, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ResumeContext } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { ResumeRenderer } from "@/components/display/ResumeRenderer";
import { exportAsJsonResume, exportAsHROpen, exportAsHTML, exportAsPDF, exportAsDOCX } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";

const ResumeView = () => {
  const navigate = useNavigate();
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('ResumeView must be used within a ResumeProvider');
  }
  const { state, dispatch } = context;
  const { themeState } = useTheme();
  const { toast } = useToast();

  const handleExport = async (format: string) => {
    try {
      switch (format) {
        case 'json':
          exportAsJsonResume(state.resumeData);
          toast({
            title: "Success",
            description: "Resume exported as JSON Resume format"
          });
          break;
        case 'hropen':
          exportAsHROpen(state.resumeData);
          toast({
            title: "Success",
            description: "Resume exported as HR-Open format"
          });
          break;
        case 'html':
          exportAsHTML(state.resumeData, themeState.currentTheme);
          toast({
            title: "Success",
            description: "Resume exported as HTML"
          });
          break;
        case 'pdf':
          await exportAsPDF(state.resumeData, themeState.currentTheme);
          toast({
            title: "Success",
            description: "Resume exported as PDF"
          });
          break;
        case 'docx':
          await exportAsDOCX(state.resumeData, themeState.currentTheme);
          toast({
            title: "Success",
            description: "Resume exported as DOCX"
          });
          break;
        default:
          toast({
            title: "Error",
            description: "Export format not supported"
          });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export resume"
      });
    }
  };

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
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700" 
                data-testid="view-home-button"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900 hidden sm:block">No Strings Resume</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center space-x-2" data-testid="view-export-button">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" data-testid="view-export-menu">
                  <DropdownMenuItem onClick={() => handleExport('pdf')} data-testid="export-pdf-button">
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('docx')} data-testid="export-docx-button">
                    <FileText className="w-4 h-4 mr-2" />
                    Export as DOCX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('html')} data-testid="export-html-button">
                    <FileText className="w-4 h-4 mr-2" />
                    Export as HTML
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('json')} data-testid="export-json-button">
                    <FileText className="w-4 h-4 mr-2" />
                    Export as JSON Resume
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('hropen')} data-testid="export-hropen-button">
                    <FileText className="w-4 h-4 mr-2" />
                    Export as HR-Open JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/edit')} 
                className="flex items-center space-x-2" 
                data-testid="view-edit-button"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div data-testid="resume-display">
          <ResumeRenderer resumeData={state.resumeData} theme={themeState.currentTheme} />
        </div>
      </main>
    </div>
  );
};

export default ResumeView;
