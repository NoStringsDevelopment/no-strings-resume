
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { Project } from "@/types/resume";

const ProjectsEditor = () => {
  const { state, dispatch } = useResume();
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const addProject = () => {
    const newProject: Project = {
      name: "",
      description: "",
      highlights: [],
      keywords: [],
      startDate: "",
      endDate: "",
      url: "",
      roles: [],
      entity: "",
      type: "",
      visible: true
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    dispatch({ 
      type: 'UPDATE_PROJECT', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removeProject = (index: number) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: index });
  };

  const updateArrayField = (index: number, field: 'highlights' | 'keywords' | 'roles', value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    updateProject(index, field, items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={addProject} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </Button>
      </div>

      {state.resumeData.projects.map((project, index) => (
        <Card key={index} className="relative">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {project.name || `Project ${index + 1}`}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateProject(index, 'visible', !project.visible)}
                  className="flex items-center space-x-1"
                >
                  {project.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`project-name-${index}`}>Project Name</Label>
                <Input
                  id={`project-name-${index}`}
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  placeholder="My Awesome Project"
                />
              </div>
              <div>
                <Label htmlFor={`project-url-${index}`}>URL</Label>
                <Input
                  id={`project-url-${index}`}
                  value={project.url}
                  onChange={(e) => updateProject(index, 'url', e.target.value)}
                  placeholder="https://github.com/user/project"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`project-entity-${index}`}>Entity/Organization</Label>
                <Input
                  id={`project-entity-${index}`}
                  value={project.entity}
                  onChange={(e) => updateProject(index, 'entity', e.target.value)}
                  placeholder="Company or Organization"
                />
              </div>
              <div>
                <Label htmlFor={`project-type-${index}`}>Type</Label>
                <Input
                  id={`project-type-${index}`}
                  value={project.type}
                  onChange={(e) => updateProject(index, 'type', e.target.value)}
                  placeholder="Web Application, Mobile App, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`project-start-${index}`}>Start Date</Label>
                <Input
                  id={`project-start-${index}`}
                  type="date"
                  value={project.startDate}
                  onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`project-end-${index}`}>End Date</Label>
                <Input
                  id={`project-end-${index}`}
                  type="date"
                  value={project.endDate}
                  onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`project-description-${index}`}>Description</Label>
              <Textarea
                id={`project-description-${index}`}
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                placeholder="Brief description of the project..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor={`project-highlights-${index}`}>Highlights (one per line)</Label>
              <Textarea
                id={`project-highlights-${index}`}
                value={project.highlights.join('\n')}
                onChange={(e) => updateArrayField(index, 'highlights', e.target.value)}
                placeholder="Built responsive web application&#10;Implemented user authentication&#10;Deployed to AWS"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`project-keywords-${index}`}>Keywords (one per line)</Label>
                <Textarea
                  id={`project-keywords-${index}`}
                  value={project.keywords.join('\n')}
                  onChange={(e) => updateArrayField(index, 'keywords', e.target.value)}
                  placeholder="React&#10;TypeScript&#10;Node.js"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor={`project-roles-${index}`}>Roles (one per line)</Label>
                <Textarea
                  id={`project-roles-${index}`}
                  value={project.roles.join('\n')}
                  onChange={(e) => updateArrayField(index, 'roles', e.target.value)}
                  placeholder="Full Stack Developer&#10;Project Lead"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {state.resumeData.projects.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500 mb-4">No projects added yet</p>
            <Button onClick={addProject} className="flex items-center space-x-2 mx-auto">
              <Plus className="w-4 h-4" />
              <span>Add Your First Project</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectsEditor;
