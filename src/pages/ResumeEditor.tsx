import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Palette, Upload, Download, Undo, Redo, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useResume } from "@/context/ResumeContext";
import { useTheme } from "@/context/ThemeContext";
import { usePreviewToggle } from "@/hooks/usePreviewToggle";
import { EnhancedPreview } from "@/components/display/EnhancedPreview";
import BasicEditor from "@/components/editor/BasicEditor";
import WorkEditor from "@/components/editor/WorkEditor";
import EducationEditor from "@/components/editor/EducationEditor";
import SkillsEditor from "@/components/editor/SkillsEditor";
import ProjectsEditor from "@/components/editor/ProjectsEditor";
import AwardsEditor from "@/components/editor/AwardsEditor";
import LanguagesEditor from "@/components/editor/LanguagesEditor";
import AdditionalSectionsEditor from "@/components/editor/AdditionalSectionsEditor";
import { exportResumeAsJson, importResumeData, downloadFile } from "@/utils/importExport";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ResumeEditor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, dispatch } = useResume();
  const { themeState } = useTheme();
  const { isPreviewVisible, togglePreview } = usePreviewToggle();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("basics");
  const [importValidation, setImportValidation] = useState<{
    hasErrors: boolean;
    errors: string[];
    invalidFieldsCount: number;
  } | null>(null);

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importResult = importResumeData(content);
        
        dispatch({ type: 'SET_RESUME_DATA', payload: importResult.resumeData });
        
        setImportValidation({
          hasErrors: importResult.hasErrors,
          errors: importResult.validationErrors,
          invalidFieldsCount: importResult.nonConformingData?.invalidFields?.length || 0
        });

        if (importResult.hasErrors) {
          toast({
            title: "Import Completed with Issues",
            description: `Resume imported but ${importResult.validationErrors.length} validation issues found. See details below.`,
            variant: "default"
          });
        } else {
          toast({
            title: "Import Successful",
            description: "Resume data has been imported and validated successfully."
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to import resume data. Please check the file format.";
        toast({
          title: "Import Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleExportJson = () => {
    const jsonContent = exportResumeAsJson(state.resumeData);
    downloadFile(jsonContent, 'resume.json', 'application/json');
    toast({
      title: "Backup Successful",
      description: "Resume exported as JSON Resume format."
    });
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
    toast({
      title: "Undone",
      description: "Last action has been undone."
    });
  };

  const handleRedo = () => {
    dispatch({ type: 'REDO' });
    toast({
      title: "Redone",
      description: "Action has been redone."
    });
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ALL' });
    toast({
      title: "Cleared",
      description: "All resume data has been cleared."
    });
  };

  const handleResetToDefault = async () => {
    try {
      const response = await fetch('/resume.json');
      const defaultResumeData = await response.json();
      
      dispatch({ type: 'SET_RESUME_DATA', payload: defaultResumeData });
      toast({
        title: "Reset",
        description: "Resume has been reset to default template."
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Could not load default resume template.",
        variant: "destructive"
      });
    }
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <div className="min-h-screen bg-gray-50" data-testid="resume-editor">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10" data-testid="editor-header">
        <div className="container mx-auto px-4 py-3">
          {/* Desktop Layout - Single Row */}
          <div className="hidden md:flex items-center justify-between">
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
              <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium hidden sm:block">
                Edit Mode
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {/* History Actions */}
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                className="flex items-center space-x-1"
                title="Undo"
                data-testid="undo-button"
              >
                <Undo className="w-4 h-4" />
                <span className="hidden xl:block">Undo</span>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                className="flex items-center space-x-1"
                title="Redo"
                data-testid="redo-button"
              >
                <Redo className="w-4 h-4" />
                <span className="hidden xl:block">Redo</span>
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />
              
              {/* File Actions */}
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleImport}
                className="flex items-center space-x-1"
                title="Import"
                data-testid="import-button"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden xl:block">Import</span>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleExportJson}
                className="flex items-center space-x-1"
                title="Backup"
                data-testid="backup-button"
              >
                <Download className="w-4 h-4" />
                <span className="hidden xl:block">Backup</span>
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />
              
              {/* Data Actions */}
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                title="Clear All"
                data-testid="clear-button"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden xl:block">Clear</span>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleResetToDefault}
                className="flex items-center space-x-1"
                title="Reset to Default"
                data-testid="reset-button"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden xl:block">Reset</span>
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />
              
              {/* Preview Toggle */}
              <div className="flex items-center space-x-2 mr-2">
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
              
              <div className="w-px h-6 bg-gray-300 mr-1 hidden sm:block" />
              
              {/* Navigation Actions */}
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/theme')}
                className="flex items-center space-x-1"
                data-testid="theme-button"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden lg:block">Theme</span>
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/view')}
                className="flex items-center space-x-1"
                data-testid="view-button"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden lg:block">View</span>
              </Button>
            </div>
          </div>

          {/* Mobile/Tablet Layout - Two Rows */}
          <div className="md:hidden space-y-3">
            {/* First Row - Branding and Navigation Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigate('/')}
                  className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                  data-testid="home-button-mobile"
                >
                  <span className="text-white font-bold text-sm">NR</span>
                </button>
                <span className="font-semibold text-gray-900">No Strings Resume</span>
                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  Edit
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/theme')}
                  title="Theme"
                  data-testid="theme-button-mobile"
                >
                  <Palette className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/view')}
                  title="View"
                  data-testid="view-button-mobile"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Second Row - Action Buttons */}
            <div className="flex items-center justify-between space-x-1">
              {/* History Actions */}
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="Undo"
                  data-testid="undo-button-mobile"
                >
                  <Undo className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleRedo}
                  disabled={!canRedo}
                  title="Redo"
                  data-testid="redo-button-mobile"
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </div>

              {/* File Actions */}
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleImport}
                  title="Import"
                  data-testid="import-button-mobile"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleExportJson}
                  title="Backup"
                  data-testid="backup-button-mobile"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              {/* Data Actions */}
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-red-600 hover:text-red-700"
                  title="Clear All"
                  data-testid="clear-button-mobile"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleResetToDefault}
                  title="Reset to Default"
                  data-testid="reset-button-mobile"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Preview Toggle */}
              <div className="flex items-center space-x-1">
                <Checkbox 
                  id="preview-toggle-mobile"
                  checked={isPreviewVisible}
                  onCheckedChange={togglePreview}
                  data-testid="preview-toggle-mobile"
                />
                <label 
                  htmlFor="preview-toggle-mobile" 
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
      <main className="container mx-auto px-4 py-8" data-testid="editor-main">
        <div className={`grid gap-8 ${isPreviewVisible ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          {/* Left Column - Editor Content */}
          <div className="space-y-6">
            {/* Import Validation Alert */}
            {importValidation && importValidation.hasErrors && (
              <Alert className="border-amber-200 bg-amber-50" data-testid="import-validation-alert">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Import completed with validation issues</AlertTitle>
                <AlertDescription className="text-amber-700">
                  <div className="mt-2 space-y-1">
                    {importValidation.errors.map((error, index) => (
                      <div key={index} className="text-sm">• {error}</div>
                    ))}
                    {importValidation.invalidFieldsCount > 0 && (
                      <div className="text-sm font-medium mt-2">
                        {importValidation.invalidFieldsCount} field(s) had invalid data and were converted to safe defaults.
                        {state.resumeData.nonConformingData && (
                          <span className="block text-xs mt-1">
                            Review the "More" section for non-conforming data that needs manual attention.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" data-testid="editor-tabs">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8" data-testid="editor-tabs-list">
                <TabsTrigger value="basics" data-testid="basics-tab">Basics</TabsTrigger>
                <TabsTrigger value="work" data-testid="work-tab">Work</TabsTrigger>
                <TabsTrigger value="education" data-testid="education-tab">Education</TabsTrigger>
                <TabsTrigger value="skills" data-testid="skills-tab">Skills</TabsTrigger>
                <TabsTrigger value="projects" data-testid="projects-tab">Projects</TabsTrigger>
                <TabsTrigger value="awards" data-testid="awards-tab">Awards</TabsTrigger>
                <TabsTrigger value="languages" data-testid="languages-tab">Languages</TabsTrigger>
                <TabsTrigger value="more" className="relative" data-testid="more-tab">
                  More
                  {state.resumeData.nonConformingData && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" title="Contains non-conforming data" />
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-6" data-testid="basics-content">
                <BasicEditor />
              </TabsContent>

              <TabsContent value="work" className="space-y-6" data-testid="work-content">
                <WorkEditor />
              </TabsContent>

              <TabsContent value="education" className="space-y-6" data-testid="education-content">
                <EducationEditor />
              </TabsContent>

              <TabsContent value="skills" className="space-y-6" data-testid="skills-content">
                <SkillsEditor />
              </TabsContent>

              <TabsContent value="projects" className="space-y-6" data-testid="projects-content">
                <ProjectsEditor />
              </TabsContent>

              <TabsContent value="awards" className="space-y-6" data-testid="awards-content">
                <AwardsEditor />
              </TabsContent>

              <TabsContent value="languages" className="space-y-6" data-testid="languages-content">
                <LanguagesEditor />
              </TabsContent>

              <TabsContent value="more" className="space-y-6" data-testid="more-content">
                <AdditionalSectionsEditor />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Live Preview (Conditional) */}
          {isPreviewVisible && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Preview</h2>
              <div className="sticky top-8">
                <EnhancedPreview 
                  resumeData={state.resumeData} 
                  theme={themeState.currentTheme}
                  data-testid="editor-preview"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
        data-testid="file-input"
      />
    </div>
  );
};

export default ResumeEditor;
