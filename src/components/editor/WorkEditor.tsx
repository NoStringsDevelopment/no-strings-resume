
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { WorkExperience } from "@/types/resume";

export default function WorkEditor() {
  const { state, dispatch } = useResume();
  const { work } = state.resumeData;

  const addWorkExperience = () => {
    const newWork: WorkExperience = {
      name: '',
      position: '',
      url: '',
      startDate: '',
      endDate: '',
      summary: '',
      highlights: [''],
      visible: true
    };
    dispatch({ type: 'ADD_WORK_EXPERIENCE', payload: newWork });
  };

  const updateWorkExperience = (index: number, field: string, value: string | string[]) => {
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
    const updatedHighlights = [...currentWork.highlights, ''];
    updateWorkExperience(workIndex, 'highlights', updatedHighlights);
  };

  const updateHighlight = (workIndex: number, highlightIndex: number, value: string) => {
    const currentWork = work[workIndex];
    const updatedHighlights = currentWork.highlights.map((highlight, i) =>
      i === highlightIndex ? value : highlight
    );
    updateWorkExperience(workIndex, 'highlights', updatedHighlights);
  };

  const removeHighlight = (workIndex: number, highlightIndex: number) => {
    const currentWork = work[workIndex];
    const updatedHighlights = currentWork.highlights.filter((_, i) => i !== highlightIndex);
    updateWorkExperience(workIndex, 'highlights', updatedHighlights);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Work Experience</h2>
        <Button onClick={addWorkExperience}>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {work.map((experience, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Experience #{index + 1}
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
                <Label>Company Name</Label>
                <Input
                  value={experience.name}
                  onChange={(e) => updateWorkExperience(index, 'name', e.target.value)}
                  placeholder="Company name"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={experience.position}
                  onChange={(e) => updateWorkExperience(index, 'position', e.target.value)}
                  placeholder="Job title"
                />
              </div>
              <div>
                <Label>Company URL</Label>
                <Input
                  value={experience.url}
                  onChange={(e) => updateWorkExperience(index, 'url', e.target.value)}
                  placeholder="https://company.com"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={experience.startDate}
                  onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                  placeholder="YYYY-MM"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={experience.endDate}
                  onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                  placeholder="YYYY-MM or leave blank if current"
                />
              </div>
            </div>

            <div>
              <Label>Summary</Label>
              <Textarea
                value={experience.summary}
                onChange={(e) => updateWorkExperience(index, 'summary', e.target.value)}
                placeholder="Brief summary of your role and responsibilities..."
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Key Achievements</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addHighlight(index)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </div>
              <div className="space-y-2">
                {experience.highlights.map((highlight, highlightIndex) => (
                  <div key={highlightIndex} className="flex gap-2">
                    <Textarea
                      value={highlight}
                      onChange={(e) => updateHighlight(index, highlightIndex, e.target.value)}
                      placeholder="Describe a key achievement or responsibility..."
                      rows={2}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeHighlight(index, highlightIndex)}
                      className="text-red-600 hover:text-red-700 self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {work.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No work experience added yet.</p>
          <Button onClick={addWorkExperience} className="mt-2">
            Add Your First Experience
          </Button>
        </div>
      )}
    </div>
  );
}
