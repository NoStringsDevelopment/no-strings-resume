import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Palette, Upload, Download, Undo, Redo, Trash2, RotateCcw, AlertTriangle, FileText, Zap } from "lucide-react";
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
import { importResumeData } from "@/utils/importExport";
import { exportAsBackup, importFromBackup } from "@/utils/backupUtils";
import { parseLinkedInZip } from "@/utils/linkedinParser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LinkedInImportGuide } from "@/components/LinkedInImportGuide";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a ZIP file (potential LinkedIn export)
    if (file.type === 'application/zip' || file.name.toLowerCase().endsWith('.zip')) {
      try {
        toast({
          title: "Processing LinkedIn Export",
          description: "Analyzing ZIP file contents..."
        });

        const linkedinResult = await parseLinkedInZip(file);
        
        if (linkedinResult.hasErrors && linkedinResult.validationErrors.some(error => 
          error.includes('does not appear to contain LinkedIn export data')
        )) {
          toast({
            title: "Import Failed",
            description: "ZIP file does not contain recognizable LinkedIn export data.",
            variant: "destructive"
          });
          return;
        }
        
        dispatch({ type: 'SET_RESUME_DATA', payload: linkedinResult.resumeData });
        
        setImportValidation({
          hasErrors: linkedinResult.hasErrors,
          errors: linkedinResult.validationErrors,
          invalidFieldsCount: 0
        });

        toast({
          title: "LinkedIn Data Imported",
          description: `Successfully processed ${linkedinResult.processedFiles.length} LinkedIn data files.`
        });
        
        return;
      } catch (error) {
        toast({
          title: "LinkedIn Import Failed",
          description: `Error processing LinkedIn ZIP: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
        return;
      }
    }

    // Handle JSON files (existing logic)
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Try backup import first
        const backupResult = importFromBackup(content);
        
        if (backupResult.isExtended) {
          // It's a backup file - handle extended format
          if (backupResult.isValid && backupResult.resumeData) {
            dispatch({ type: 'SET_RESUME_DATA', payload: backupResult.resumeData });
            
            setImportValidation({
              hasErrors: backupResult.warnings.length > 0,
              errors: backupResult.warnings,
              invalidFieldsCount: 0
            });

            toast({
              title: "Backup Restored Successfully",
              description: "Resume backup restored with all visibility settings preserved."
            });
          } else {
            toast({
              title: "Backup Restore Failed",
              description: `Invalid backup file: ${backupResult.errors.join(', ')}`,
              variant: "destructive"
            });
          }
        } else {
          // Not a backup file, treat as JSON Resume and populate extensions with defaults
          const importResult = importResumeData(content);
          
          if (importResult.hasErrors && importResult.validationErrors.some(error => 
            error.includes('Invalid resume format') || error.includes('unsupported')
          )) {
            // Fundamental format issues
            toast({
              title: "Import Failed",
              description: "File format not supported. Please import a valid JSON Resume or backup file.",
              variant: "destructive"
            });
            return;
          }
          
          dispatch({ type: 'SET_RESUME_DATA', payload: importResult.resumeData });
          
          setImportValidation({
            hasErrors: importResult.hasErrors,
            errors: importResult.validationErrors,
            invalidFieldsCount: importResult.nonConformingData?.invalidFields?.length || 0
          });

          if (importResult.hasErrors) {
            toast({
              title: "JSON Resume Imported with Issues",
              description: `Resume imported with default visibility settings. ${importResult.validationErrors.length} validation issues found.`,
              variant: "default"
            });
          } else {
            toast({
              title: "JSON Resume Imported Successfully",
              description: "Resume imported with default visibility settings applied."
            });
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to import file. Please check the format.";
        toast({
          title: "Import Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleBackup = () => {
    exportAsBackup(state.resumeData);
    toast({
      title: "Backup Successful",
      description: "Resume backed up with all visibility settings preserved."
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
          {/* Responsive Layout */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            
            {/* Brand and Status Row */}
            <div className="flex items-center justify-between lg:justify-start lg:space-x-4">
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
                
                {/* Edit Mode Badge - Below Logo */}
                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  Edit Mode
                </div>
              </div>
              
              {/* Navigation Actions - Mobile */}
              <div className="flex items-center space-x-1 lg:hidden">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/integrations')}
                  className="flex items-center space-x-1"
                  data-testid="integrations-button"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden sm:inline">Integrations</span>
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/theme')}
                  className="flex items-center space-x-1"
                  data-testid="theme-button"
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Theme</span>
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/view')}
                  className="flex items-center space-x-1"
                  data-testid="view-button"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View</span>
                </Button>
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-1 lg:space-x-1">
              
              {/* History Actions */}
              <div className="flex items-center space-x-1">
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
              </div>
              
              <div className="w-px h-6 bg-gray-300 mx-1 hidden xl:block" />
              
              {/* File Actions */}
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleImport}
                  className="flex items-center space-x-1"
                  title="Import JSON Resume, backup file, or LinkedIn export ZIP"
                  data-testid="import-button"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden xl:block">Import</span>
                </Button>
                
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleBackup}
                  className="flex items-center space-x-1"
                  title="Backup"
                  data-testid="backup-button"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden xl:block">Backup</span>
                </Button>
                
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-xs text-blue-600 hover:text-blue-800 p-1"
                      title="How to import from LinkedIn"
                    >
                      LinkedIn?
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="absolute top-full right-0 z-50 mt-2">
                    <LinkedInImportGuide />
                  </CollapsibleContent>
                </Collapsible>
              </div>
              
              <div className="w-px h-6 bg-gray-300 mx-1 hidden xl:block" />
              
              {/* Data Actions */}
              <div className="flex items-center space-x-1">
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
              </div>
              
              <div className="w-px h-6 bg-gray-300 mx-1 hidden xl:block" />
              
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
                  className="text-sm font-medium cursor-pointer hidden lg:block"
                >
                  Preview
                </label>
              </div>
              
              <div className="w-px h-6 bg-gray-300 mx-1 hidden xl:block" />
              
              {/* Navigation Actions - Desktop */}
              <div className="hidden lg:flex items-center space-x-1">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/integrations')}
                  className="flex items-center space-x-1"
                  data-testid="integrations-button"
                >
                  <Zap className="w-4 h-4" />
                  <span className="hidden xl:block">Integrations</span>
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/theme')}
                  className="flex items-center space-x-1"
                  data-testid="theme-button"
                >
                  <Palette className="w-4 h-4" />
                  <span className="hidden xl:block">Theme</span>
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/view')}
                  className="flex items-center space-x-1"
                  data-testid="view-button"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden xl:block">View</span>
                </Button>
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
        accept=".json,.zip"
        onChange={handleFileChange}
        className="hidden"
        data-testid="file-input"
      />
    </div>
  );
};

export default ResumeEditor;
