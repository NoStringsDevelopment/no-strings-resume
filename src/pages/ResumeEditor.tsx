
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Palette, Home, Upload, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useResume } from "@/context/ResumeContext";
import BasicEditor from "@/components/editor/BasicEditor";
import WorkEditor from "@/components/editor/WorkEditor";
import EducationEditor from "@/components/editor/EducationEditor";
import SkillsEditor from "@/components/editor/SkillsEditor";
import { exportResumeAsJson, exportResumeWithExtensions, importResumeData, downloadFile } from "@/utils/importExport";

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
          description: "Resume data has been imported successfully."
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import resume data. Please check the file format.",
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

  const handleExportWithExtensions = () => {
    const jsonContent = exportResumeWithExtensions(state.resumeData);
    downloadFile(jsonContent, 'resume-backup.json', 'application/json');
    toast({
      title: "Backup Created",
      description: "Full resume backup with all settings exported."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
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
                onClick={handleImport}
                className="flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </Button>
              <Button 
                variant="outline"
                onClick={handleExportJson}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </Button>
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
              <div className="text-center py-8 text-gray-500">
                <p>Projects editor coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="awards" className="space-y-6">
              <div className="text-center py-8 text-gray-500">
                <p>Awards editor coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="languages" className="space-y-6">
              <div className="text-center py-8 text-gray-500">
                <p>Languages editor coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="more" className="space-y-6">
              <div className="text-center py-8 text-gray-500">
                <p>Additional sections (certificates, publications, volunteer, etc.) coming soon...</p>
                <div className="mt-4 space-x-2">
                  <Button onClick={handleExportWithExtensions} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Backup All Data
                  </Button>
                </div>
              </div>
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
