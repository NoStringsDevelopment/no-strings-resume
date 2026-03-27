
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

type ExportFormat = 'json' | 'hropen' | 'html' | 'pdf' | 'docx';

const EXPORT_SUCCESS_MESSAGES: Record<ExportFormat, string> = {
  json: 'Resume exported as JSON Resume format',
  hropen: 'Resume exported as HR-Open format',
  html: 'Resume exported as HTML',
  pdf: 'Resume exported as PDF',
  docx: 'Resume exported as DOCX',
};

const EXPORT_ERROR_MESSAGES: Record<ExportFormat, string> = {
  json: 'Failed to export JSON Resume. Please try again.',
  hropen: 'Failed to export HR-Open JSON. Please try again.',
  html: 'Failed to export HTML. Please try again.',
  pdf: 'Failed to export PDF. Please try again or use DOCX/HTML as a fallback.',
  docx: 'Failed to export DOCX. Please try again or use PDF/HTML as a fallback.',
};

const ResumeView = () => {
  const navigate = useNavigate();
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('ResumeView must be used within a ResumeProvider');
  }
  const { state } = context;
  const { themeState } = useTheme();
  const { toast } = useToast();

  const handleExport = async (format: ExportFormat) => {
    try {
      switch (format) {
        case 'json':
          exportAsJsonResume(state.resumeData);
          break;
        case 'hropen':
          exportAsHROpen(state.resumeData);
          break;
        case 'html':
          exportAsHTML(state.resumeData, themeState.currentTheme);
          break;
        case 'pdf':
          await exportAsPDF(state.resumeData, themeState.currentTheme);
          break;
        case 'docx':
          await exportAsDOCX(state.resumeData, themeState.currentTheme);
          break;
        default:
          return;
      }

      toast({
        title: "Success",
        description: EXPORT_SUCCESS_MESSAGES[format]
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: EXPORT_ERROR_MESSAGES[format]
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
