
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Education } from "@/types/resume";

export default function EducationEditor() {
  const { state, dispatch } = useResume();
  const { education } = state.resumeData;

  const addEducation = () => {
    const newEducation: Education = {
      institution: '',
      url: '',
      area: '',
      studyType: '',
      startDate: '',
      endDate: '',
      score: '',
      courses: [''],
      visible: true
    };
    dispatch({ type: 'ADD_EDUCATION', payload: newEducation });
  };

  const updateEducation = (index: number, field: string, value: string | string[] | boolean) => {
    dispatch({
      type: 'UPDATE_EDUCATION',
      payload: { index, data: { [field]: value } }
    });
  };

  const removeEducation = (index: number) => {
    dispatch({ type: 'REMOVE_EDUCATION', payload: index });
  };

  const addCourse = (eduIndex: number) => {
    const currentEdu = education[eduIndex];
    const updatedCourses = [...currentEdu.courses, ''];
    updateEducation(eduIndex, 'courses', updatedCourses);
  };

  const updateCourse = (eduIndex: number, courseIndex: number, value: string) => {
    const currentEdu = education[eduIndex];
    const updatedCourses = currentEdu.courses.map((course, i) =>
      i === courseIndex ? value : course
    );
    updateEducation(eduIndex, 'courses', updatedCourses);
  };

  const removeCourse = (eduIndex: number, courseIndex: number) => {
    const currentEdu = education[eduIndex];
    const updatedCourses = currentEdu.courses.filter((_, i) => i !== courseIndex);
    updateEducation(eduIndex, 'courses', updatedCourses);
  };

  const sectionVisible = state.resumeData.sectionVisibility.education;
  const toggleSectionVisibility = () => {
    dispatch({
      type: 'UPDATE_SECTION_VISIBILITY',
      payload: { ...state.resumeData.sectionVisibility, education: !sectionVisible }
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
          >
            {sectionVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <h2 className="text-2xl font-bold">education</h2>
        </div>
        <Button onClick={addEducation}>
          <Plus className="w-4 h-4 mr-2" />
          Add education
        </Button>
      </div>

      {education.map((edu, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateEducation(index, 'visible', !edu.visible)}
                  className="p-1"
                >
                  {edu.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <span>education #{index + 1}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeEducation(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`institution-${index}`}>institution</Label>
                <Input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="University name"
                  spellCheck={true}
                />
              </div>
              <div>
                <Label htmlFor={`url-${index}`}>url</Label>
                <Input
                  id={`url-${index}`}
                  value={edu.url}
                  onChange={(e) => updateEducation(index, 'url', e.target.value)}
                  placeholder="https://university.edu"
                />
              </div>
              <div>
                <Label htmlFor={`area-${index}`}>area</Label>
                <Input
                  id={`area-${index}`}
                  value={edu.area}
                  onChange={(e) => updateEducation(index, 'area', e.target.value)}
                  placeholder="Computer Science"
                  spellCheck={true}
                />
              </div>
              <div>
                <Label htmlFor={`studyType-${index}`}>studyType</Label>
                <Input
                  id={`studyType-${index}`}
                  value={edu.studyType}
                  onChange={(e) => updateEducation(index, 'studyType', e.target.value)}
                  placeholder="Bachelor of Science"
                  spellCheck={true}
                />
              </div>
              <div>
                <Label htmlFor={`startDate-${index}`}>startDate</Label>
                <Input
                  id={`startDate-${index}`}
                  value={edu.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                  placeholder="YYYY-MM"
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${index}`}>endDate</Label>
                <Input
                  id={`endDate-${index}`}
                  value={edu.endDate}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                  placeholder="YYYY-MM"
                />
              </div>
              <div>
                <Label htmlFor={`score-${index}`}>score</Label>
                <Input
                  id={`score-${index}`}
                  value={edu.score}
                  onChange={(e) => updateEducation(index, 'score', e.target.value)}
                  placeholder="3.8"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>courses</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCourse(index)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add course
                </Button>
              </div>
              <div className="space-y-2">
                {edu.courses.map((course, courseIndex) => (
                  <div key={courseIndex} className="flex gap-2">
                    <Input
                      value={course}
                      onChange={(e) => updateCourse(index, courseIndex, e.target.value)}
                      placeholder="Course name"
                      className="flex-1"
                      spellCheck={true}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCourse(index, courseIndex)}
                      className="text-red-600 hover:text-red-700"
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

      {education.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No education entries added yet.</p>
          <Button onClick={addEducation} className="mt-2">
            Add Your First education Entry
          </Button>
        </div>
      )}
    </div>
  );
}
