import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { WorkExperience, Highlight } from "@/types/resume";
import { normalizeHighlight, getHighlightContent, isHighlightVisible } from "@/utils/visibilityHelpers";

export default function WorkEditor() {
  const { state, dispatch } = useResume();
  const { work } = state.resumeData;

  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      name: '',
      location: '',
      description: '',
      position: '',
      url: '',
      startDate: '',
      endDate: '',
      summary: '',
      highlights: [{ content: '', visible: true }],
      visible: true
    };
    dispatch({ type: 'ADD_WORK_EXPERIENCE', payload: newWork });
  };

  const updateWorkExperience = (index: number, field: string, value: string | (string | Highlight)[] | boolean) => {
    dispatch({
      type: 'UPDATE_WORK_EXPERIENCE',
      payload: { index, data: { [field]: value } }
    });
  };

  const removeWorkExperience = (index: number) => {
    dispatch({ type: 'REMOVE_WORK_EXPERIENCE', payload: index });
  };

  const addHighlight = (workIndex: number) => {
    const currentWork = work[workIndex];
    const updatedHighlights = [...currentWork.highlights, { content: '', visible: true }];
    updateWorkExperience(workIndex, 'highlights', updatedHighlights);
  };

  const updateHighlight = (workIndex: number, highlightIndex: number, value: string) => {
    const currentWork = work[workIndex];
    const updatedHighlights = currentWork.highlights.map((highlight, i) => {
      if (i === highlightIndex) {
        const normalized = normalizeHighlight(highlight);
        return { ...normalized, content: value };
      }
      return highlight;
    });
    updateWorkExperience(workIndex, 'highlights', updatedHighlights);
  };

  const toggleHighlightVisibility = (workIndex: number, highlightIndex: number) => {
    const currentWork = work[workIndex];
    const updatedHighlights = currentWork.highlights.map((highlight, i) => {
      if (i === highlightIndex) {
        const normalized = normalizeHighlight(highlight);
        return { ...normalized, visible: !normalized.visible };
      }
      return highlight;
    });
    updateWorkExperience(workIndex, 'highlights', updatedHighlights);
  };

  const removeHighlight = (workIndex: number, highlightIndex: number) => {
    const currentWork = work[workIndex];
    const updatedHighlights = currentWork.highlights.filter((_, i) => i !== highlightIndex);
    updateWorkExperience(workIndex, 'highlights', updatedHighlights);
  };

  const sectionVisible = state.resumeData.sectionVisibility.work;
  const toggleSectionVisibility = () => {
    dispatch({
      type: 'UPDATE_SECTION_VISIBILITY',
      payload: { ...state.resumeData.sectionVisibility, work: !sectionVisible }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSectionVisibility}
            className="p-1"
            data-testid="work-visibility-toggle"
          >
            {sectionVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <h2 className="text-2xl font-bold">Work</h2>
        </div>
        <Button onClick={addWorkExperience}>
          <Plus className="w-4 h-4 mr-2" />
          Add work
        </Button>
      </div>

      {work.map((experience, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateWorkExperience(index, 'visible', !experience.visible)}
                  className="p-1"
                  data-testid={`work-${index}-visibility-toggle`}
                >
                  {experience.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <span>work #{index + 1}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeWorkExperience(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${index}`}>Company Name</Label>
                <Input
                  id={`name-${index}`}
                  value={experience.name}
                  onChange={(e) => updateWorkExperience(index, 'name', e.target.value)}
                  placeholder="Company name"
                  spellCheck={true}
                />
              </div>
              <div>
                <Label htmlFor={`position-${index}`}>Position</Label>
                <Input
                  id={`position-${index}`}
                  value={experience.position}
                  onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                  placeholder="Job title"
                  spellCheck={true}
                />
              </div>
              <div>
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  value={experience.location || ''}
                  onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                  placeholder="City, State"
                  spellCheck={true}
                />
              </div>
              <div>
                <Label htmlFor={`url-${index}`}>Website</Label>
                <Input
                  id={`url-${index}`}
                  value={experience.url}
                  onChange={(e) => updateWorkExperience(index, 'url', e.target.value)}
                  placeholder="https://company.com"
                />
              </div>
              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  value={experience.startDate}
                  onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  value={experience.endDate}
                  onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                  placeholder="YYYY-MM-DD or leave blank if current"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                value={experience.description || ''}
                onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                placeholder="Brief description of the company..."
                rows={2}
                spellCheck={true}
              />
            </div>

            <div>
              <Label htmlFor={`summary-${index}`}>Summary</Label>
              <Textarea
                id={`summary-${index}`}
                value={experience.summary}
                onChange={(e) => updateWorkExperience(index, 'summary', e.target.value)}
                placeholder="Brief summary of your role and responsibilities..."
                rows={3}
                spellCheck={true}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Highlights</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addHighlight(index)}
                  data-testid={`work-${index}-add-highlight-button`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add highlight
                </Button>
              </div>
              <div className="space-y-2">
                {experience.highlights.map((highlight, highlightIndex) => {
                  const normalized = normalizeHighlight(highlight);
                  return (
                    <div key={highlightIndex} className="flex gap-2" data-testid={`work-${index}-highlight-${highlightIndex}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleHighlightVisibility(index, highlightIndex)}
                        className="p-1 self-start mt-1"
                        data-testid={`work-${index}-highlight-${highlightIndex}-visibility-toggle`}
                      >
                        {isHighlightVisible(highlight) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Textarea
                        value={getHighlightContent(highlight)}
                        onChange={(e) => updateHighlight(index, highlightIndex, e.target.value)}
                        placeholder="Describe a key achievement or responsibility..."
                        rows={2}
                        className="flex-1"
                        spellCheck={true}
                        data-testid={`work-${index}-highlight-${highlightIndex}-input`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeHighlight(index, highlightIndex)}
                        className="text-red-600 hover:text-red-700 self-start mt-1"
                        data-testid={`work-${index}-highlight-${highlightIndex}-remove-button`}
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

      {work.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No work entries added yet.</p>
          <Button onClick={addWorkExperience} className="mt-2">
            Add Your First work Entry
          </Button>
        </div>
      )}
    </div>
  );
}
