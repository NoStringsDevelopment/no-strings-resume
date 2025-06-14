import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Palette, Upload, Download, Undo, Redo, Trash2, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useResume } from "@/context/ResumeContext";
import BasicEditor from "@/components/editor/BasicEditor";
import WorkEditor from "@/components/editor/WorkEditor";
import EducationEditor from "@/components/editor/EducationEditor";
import SkillsEditor from "@/components/editor/SkillsEditor";
import ProjectsEditor from "@/components/editor/ProjectsEditor";
import AwardsEditor from "@/components/editor/AwardsEditor";
import LanguagesEditor from "@/components/editor/LanguagesEditor";
import AdditionalSectionsEditor from "@/components/editor/AdditionalSectionsEditor";
import { exportResumeAsJson, importResumeData, downloadFile } from "@/utils/importExport";

const ResumeEditor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { state, dispatch } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("basics");

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
        const resumeData = importResumeData(content);
        dispatch({ type: 'SET_RESUME_DATA', payload: resumeData });
        toast({
          title: "Import Successful",
          description: "Resume data has been imported and validated successfully."
        });
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
      title: "Export Successful",
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

  const handleResetToDefault = () => {
    dispatch({ type: 'RESET_TO_DEFAULT' });
    toast({
      title: "Reset",
      description: "Resume has been reset to default template."
    });
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NR</span>
                </div>
                <span className="font-semibold text-gray-900 hidden sm:block">No Strings Resume</span>
              </div>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                Edit Mode
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                className="flex items-center space-x-1"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
                <span className="hidden md:block">Undo</span>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                className="flex items-center space-x-1"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
                <span className="hidden md:block">Redo</span>
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleImport}
                className="flex items-center space-x-1"
                title="Import"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden md:block">Import</span>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleExportJson}
                className="flex items-center space-x-1"
                title="Export"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:block">Export</span>
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden md:block">Clear</span>
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleResetToDefault}
                className="flex items-center space-x-1"
                title="Reset to Default"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden md:block">Reset</span>
              </Button>
              
              <div className="w-px h-6 bg-gray-300 mx-1" />
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/view')}
                className="flex items-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:block">View</span>
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/theme')}
                className="flex items-center space-x-1"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:block">Theme</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="awards">Awards</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-6">
              <BasicEditor />
            </TabsContent>

            <TabsContent value="work" className="space-y-6">
              <WorkEditor />
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <EducationEditor />
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <SkillsEditor />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectsEditor />
            </TabsContent>

            <TabsContent value="awards" className="space-y-6">
              <AwardsEditor />
            </TabsContent>

            <TabsContent value="languages" className="space-y-6">
              <LanguagesEditor />
            </TabsContent>

            <TabsContent value="more" className="space-y-6">
              <AdditionalSectionsEditor />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ResumeEditor;
