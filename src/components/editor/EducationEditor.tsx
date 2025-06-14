
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
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

  const updateEducation = (index: number, field: string, value: string | string[]) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Education</h2>
        <Button onClick={addEducation}>
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {education.map((edu, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Education #{index + 1}
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
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="University name"
                />
              </div>
              <div>
                <Label>Institution URL</Label>
                <Input
                  value={edu.url}
                  onChange={(e) => updateEducation(index, 'url', e.target.value)}
                  placeholder="https://university.edu"
                />
              </div>
              <div>
                <Label>Field of Study</Label>
                <Input
                  value={edu.area}
                  onChange={(e) => updateEducation(index, 'area', e.target.value)}
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <Label>Degree Type</Label>
                <Input
                  value={edu.studyType}
                  onChange={(e) => updateEducation(index, 'studyType', e.target.value)}
                  placeholder="Bachelor of Science"
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  value={edu.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                  placeholder="YYYY-MM"
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  value={edu.endDate}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                  placeholder="YYYY-MM"
                />
              </div>
              <div>
                <Label>GPA/Score</Label>
                <Input
                  value={edu.score}
                  onChange={(e) => updateEducation(index, 'score', e.target.value)}
                  placeholder="3.8"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Relevant Courses</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCourse(index)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
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
            Add Your First Education
          </Button>
        </div>
      )}
    </div>
  );
}
