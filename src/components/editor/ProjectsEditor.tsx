import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { Project, Highlight, Keyword, Role } from "@/types/resume";
import { 
  normalizeHighlight, 
  normalizeKeyword, 
  normalizeRole,
  getHighlightContent, 
  getKeywordName, 
  getRoleName,
  isHighlightVisible, 
  isKeywordVisible, 
  isRoleVisible 
} from "@/utils/visibilityHelpers";

const ProjectsEditor = () => {
  const { state, dispatch } = useResume();

  const addProject = () => {
    const newProject: Project = {
      name: "",
      description: "",
      highlights: [{ content: '', visible: true }],
      keywords: [{ name: '', visible: true }],
      startDate: "",
      endDate: "",
      url: "",
      roles: [{ name: '', visible: true }],
      entity: "",
      type: "",
      visible: true
    };
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
  };

  const updateProject = (index: number, field: keyof Project, value: string | boolean | (string | Highlight)[] | (string | Keyword)[] | (string | Role)[]) => {
    dispatch({ 
      type: 'UPDATE_PROJECT', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removeProject = (index: number) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: index });
  };

  // Highlight functions
  const addHighlight = (projectIndex: number) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedHighlights = [...currentProject.highlights, { content: '', visible: true }];
    updateProject(projectIndex, 'highlights', updatedHighlights);
  };

  const updateHighlight = (projectIndex: number, highlightIndex: number, value: string) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedHighlights = currentProject.highlights.map((highlight, i) => {
      if (i === highlightIndex) {
        const normalized = normalizeHighlight(highlight);
        return { ...normalized, content: value };
      }
      return highlight;
    });
    updateProject(projectIndex, 'highlights', updatedHighlights);
  };

  const toggleHighlightVisibility = (projectIndex: number, highlightIndex: number) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedHighlights = currentProject.highlights.map((highlight, i) => {
      if (i === highlightIndex) {
        const normalized = normalizeHighlight(highlight);
        return { ...normalized, visible: !normalized.visible };
      }
      return highlight;
    });
    updateProject(projectIndex, 'highlights', updatedHighlights);
  };

  const removeHighlight = (projectIndex: number, highlightIndex: number) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedHighlights = currentProject.highlights.filter((_, i) => i !== highlightIndex);
    updateProject(projectIndex, 'highlights', updatedHighlights);
  };

  // Keyword functions
  const addKeyword = (projectIndex: number) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedKeywords = [...currentProject.keywords, { name: '', visible: true }];
    updateProject(projectIndex, 'keywords', updatedKeywords);
  };

  const updateKeyword = (projectIndex: number, keywordIndex: number, value: string) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedKeywords = currentProject.keywords.map((keyword, i) => {
      if (i === keywordIndex) {
        const normalized = normalizeKeyword(keyword);
        return { ...normalized, name: value };
      }
      return keyword;
    });
    updateProject(projectIndex, 'keywords', updatedKeywords);
  };

  const toggleKeywordVisibility = (projectIndex: number, keywordIndex: number) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedKeywords = currentProject.keywords.map((keyword, i) => {
      if (i === keywordIndex) {
        const normalized = normalizeKeyword(keyword);
        return { ...normalized, visible: !normalized.visible };
      }
      return keyword;
    });
    updateProject(projectIndex, 'keywords', updatedKeywords);
  };

  const removeKeyword = (projectIndex: number, keywordIndex: number) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedKeywords = currentProject.keywords.filter((_, i) => i !== keywordIndex);
    updateProject(projectIndex, 'keywords', updatedKeywords);
  };

  // Role functions
  const addRole = (projectIndex: number) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedRoles = [...currentProject.roles, { name: '', visible: true }];
    updateProject(projectIndex, 'roles', updatedRoles);
  };

  const updateRole = (projectIndex: number, roleIndex: number, value: string) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedRoles = currentProject.roles.map((role, i) => {
      if (i === roleIndex) {
        const normalized = normalizeRole(role);
        return { ...normalized, name: value };
      }
      return role;
    });
    updateProject(projectIndex, 'roles', updatedRoles);
  };

  const toggleRoleVisibility = (projectIndex: number, roleIndex: number) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedRoles = currentProject.roles.map((role, i) => {
      if (i === roleIndex) {
        const normalized = normalizeRole(role);
        return { ...normalized, visible: !normalized.visible };
      }
      return role;
    });
    updateProject(projectIndex, 'roles', updatedRoles);
  };

  const removeRole = (projectIndex: number, roleIndex: number) => {
    const currentProject = state.resumeData.projects[projectIndex];
    const updatedRoles = currentProject.roles.filter((_, i) => i !== roleIndex);
    updateProject(projectIndex, 'roles', updatedRoles);
  };

  const sectionVisible = state.resumeData.sectionVisibility?.projects ?? true;
  const toggleSectionVisibility = () => {
    dispatch({
      type: 'UPDATE_SECTION_VISIBILITY',
      payload: { projects: !sectionVisible }
    });
  };

  return (
    <div className="space-y-6" data-testid="projects-editor">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSectionVisibility}
            className="p-1"
            data-testid="projects-visibility-toggle"
          >
            {sectionVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <h2 className="text-2xl font-bold">Projects</h2>
        </div>
        <Button onClick={addProject} className="flex items-center space-x-2" data-testid="add-project-button">
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </Button>
      </div>

      {state.resumeData.projects.map((project, index) => (
        <Card key={index} className="relative" data-testid={`project-${index}-card`}>
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
                  data-testid={`project-${index}-visibility-toggle`}
                >
                  {project.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-700"
                  data-testid={`project-${index}-remove-button`}
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
                  spellCheck={true}
                  data-testid={`project-${index}-name-input`}
                />
              </div>
              <div>
                <Label htmlFor={`project-url-${index}`}>URL</Label>
                <Input
                  id={`project-url-${index}`}
                  value={project.url}
                  onChange={(e) => updateProject(index, 'url', e.target.value)}
                  placeholder="https://github.com/user/project"
                  data-testid={`project-${index}-url-input`}
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
                  spellCheck={true}
                  data-testid={`project-${index}-entity-input`}
                />
              </div>
              <div>
                <Label htmlFor={`project-type-${index}`}>Type</Label>
                <Input
                  id={`project-type-${index}`}
                  value={project.type}
                  onChange={(e) => updateProject(index, 'type', e.target.value)}
                  placeholder="Web Application, Mobile App, etc."
                  spellCheck={true}
                  data-testid={`project-${index}-type-input`}
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
                  data-testid={`project-${index}-start-date-input`}
                />
              </div>
              <div>
                <Label htmlFor={`project-end-${index}`}>End Date</Label>
                <Input
                  id={`project-end-${index}`}
                  type="date"
                  value={project.endDate}
                  onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                  data-testid={`project-${index}-end-date-input`}
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
                spellCheck={true}
                data-testid={`project-${index}-description-input`}
              />
            </div>

            {/* Highlights Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Highlights</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addHighlight(index)}
                  data-testid={`project-${index}-add-highlight-button`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Highlight
                </Button>
              </div>
              <div className="space-y-2">
                {project.highlights.map((highlight, highlightIndex) => {
                  const normalized = normalizeHighlight(highlight);
                  return (
                    <div key={highlightIndex} className="flex gap-2" data-testid={`project-${index}-highlight-${highlightIndex}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHighlightVisibility(index, highlightIndex)}
                        className="p-1 self-start mt-1"
                        data-testid={`project-${index}-highlight-${highlightIndex}-visibility-toggle`}
                      >
                        {isHighlightVisible(highlight) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Textarea
                        value={getHighlightContent(highlight)}
                        onChange={(e) => updateHighlight(index, highlightIndex, e.target.value)}
                        placeholder="Describe a key achievement or feature..."
                        rows={2}
                        className="flex-1"
                        spellCheck={true}
                        data-testid={`project-${index}-highlight-${highlightIndex}-input`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeHighlight(index, highlightIndex)}
                        className="text-red-600 hover:text-red-700 self-start mt-1"
                        data-testid={`project-${index}-highlight-${highlightIndex}-remove-button`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keywords Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Keywords & Technologies</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addKeyword(index)}
                  data-testid={`project-${index}-add-keyword-button`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Keyword
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.keywords.map((keyword, keywordIndex) => {
                  const normalized = normalizeKeyword(keyword);
                  return (
                    <div key={keywordIndex} className="flex gap-2" data-testid={`project-${index}-keyword-${keywordIndex}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeywordVisibility(index, keywordIndex)}
                        className="p-1"
                        data-testid={`project-${index}-keyword-${keywordIndex}-visibility-toggle`}
                      >
                        {isKeywordVisible(keyword) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Input
                        value={getKeywordName(keyword)}
                        onChange={(e) => updateKeyword(index, keywordIndex, e.target.value)}
                        placeholder="Technology or keyword"
                        className="flex-1"
                        spellCheck={true}
                        data-testid={`project-${index}-keyword-${keywordIndex}-input`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeKeyword(index, keywordIndex)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`project-${index}-keyword-${keywordIndex}-remove-button`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Roles Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Roles</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addRole(index)}
                  data-testid={`project-${index}-add-role-button`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {project.roles.map((role, roleIndex) => {
                  const normalized = normalizeRole(role);
                  return (
                    <div key={roleIndex} className="flex gap-2" data-testid={`project-${index}-role-${roleIndex}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRoleVisibility(index, roleIndex)}
                        className="p-1"
                        data-testid={`project-${index}-role-${roleIndex}-visibility-toggle`}
                      >
                        {isRoleVisible(role) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Input
                        value={getRoleName(role)}
                        onChange={(e) => updateRole(index, roleIndex, e.target.value)}
                        placeholder="Your role in the project"
                        className="flex-1"
                        spellCheck={true}
                        data-testid={`project-${index}-role-${roleIndex}-input`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRole(index, roleIndex)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`project-${index}-role-${roleIndex}-remove-button`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {state.resumeData.projects.length === 0 && (
        <Card className="text-center py-8" data-testid="no-projects-message">
          <CardContent>
            <p className="text-gray-500 mb-4">No projects added yet</p>
            <Button onClick={addProject} className="flex items-center space-x-2 mx-auto" data-testid="add-first-project-button">
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
