import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Education, Course } from "@/types/resume";
import { normalizeCourse, getCourseName, isCourseVisible } from "@/utils/visibilityHelpers";

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
      courses: [{ name: '', visible: true }],
      visible: true
    };
    dispatch({ type: 'ADD_EDUCATION', payload: newEducation });
  };

  const updateEducation = (index: number, field: string, value: string | (string | Course)[] | boolean) => {
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
    const updatedCourses = [...currentEdu.courses, { name: '', visible: true }];
    updateEducation(eduIndex, 'courses', updatedCourses);
  };

  const updateCourse = (eduIndex: number, courseIndex: number, value: string) => {
    const currentEdu = education[eduIndex];
    const updatedCourses = currentEdu.courses.map((course, i) => {
      if (i === courseIndex) {
        const normalized = normalizeCourse(course);
        return { ...normalized, name: value };
      }
      return course;
    });
    updateEducation(eduIndex, 'courses', updatedCourses);
  };

  const toggleCourseVisibility = (eduIndex: number, courseIndex: number) => {
    const currentEdu = education[eduIndex];
    const updatedCourses = currentEdu.courses.map((course, i) => {
      if (i === courseIndex) {
        const normalized = normalizeCourse(course);
        return { ...normalized, visible: !normalized.visible };
      }
      return course;
    });
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
    <div className="space-y-6" data-testid="education-editor">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSectionVisibility}
            className="p-1"
            data-testid="education-visibility-toggle"
          >
            {sectionVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <h2 className="text-2xl font-bold">Education</h2>
        </div>
        <Button onClick={addEducation} data-testid="add-education-button">
          <Plus className="w-4 h-4 mr-2" />
          Add education
        </Button>
      </div>

      {education.map((edu, index) => (
        <Card key={index} data-testid={`education-${index}-card`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateEducation(index, 'visible', !edu.visible)}
                  className="p-1"
                  data-testid={`education-${index}-visibility-toggle`}
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
                data-testid={`education-${index}-remove-button`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`institution-${index}`}>Institution</Label>
                <Input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="University name"
                  spellCheck={true}
                  data-testid={`education-${index}-institution-input`}
                />
              </div>
              <div>
                <Label htmlFor={`url-${index}`}>Website</Label>
                <Input
                  id={`url-${index}`}
                  value={edu.url}
                  onChange={(e) => updateEducation(index, 'url', e.target.value)}
                  placeholder="https://university.edu"
                  data-testid={`education-${index}-url-input`}
                />
              </div>
              <div>
                <Label htmlFor={`area-${index}`}>Area of Study</Label>
                <Input
                  id={`area-${index}`}
                  value={edu.area}
                  onChange={(e) => updateEducation(index, 'area', e.target.value)}
                  placeholder="Computer Science"
                  spellCheck={true}
                  data-testid={`education-${index}-area-input`}
                />
              </div>
              <div>
                <Label htmlFor={`studyType-${index}`}>Study Type</Label>
                <Input
                  id={`studyType-${index}`}
                  value={edu.studyType}
                  onChange={(e) => updateEducation(index, 'studyType', e.target.value)}
                  placeholder="Bachelor"
                  spellCheck={true}
                  data-testid={`education-${index}-study-type-input`}
                />
              </div>
              <div>
                <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                <Input
                  id={`startDate-${index}`}
                  value={edu.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                  data-testid={`education-${index}-start-date-input`}
                />
              </div>
              <div>
                <Label htmlFor={`endDate-${index}`}>End Date</Label>
                <Input
                  id={`endDate-${index}`}
                  value={edu.endDate}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                  placeholder="YYYY-MM-DD or leave blank if current"
                  data-testid={`education-${index}-end-date-input`}
                />
              </div>
              <div>
                <Label htmlFor={`score-${index}`}>Score</Label>
                <Input
                  id={`score-${index}`}
                  value={edu.score || ''}
                  onChange={(e) => updateEducation(index, 'score', e.target.value)}
                  placeholder="3.7 GPA"
                  data-testid={`education-${index}-score-input`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Courses</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCourse(index)}
                  data-testid={`education-${index}-add-course-button`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </div>
              <div className="space-y-2">
                {edu.courses.map((course, courseIndex) => {
                  const normalized = normalizeCourse(course);
                  return (
                    <div key={courseIndex} className="flex gap-2" data-testid={`education-${index}-course-${courseIndex}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCourseVisibility(index, courseIndex)}
                        className="p-1"
                        data-testid={`education-${index}-course-${courseIndex}-visibility-toggle`}
                      >
                        {isCourseVisible(course) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Input
                        value={getCourseName(course)}
                        onChange={(e) => updateCourse(index, courseIndex, e.target.value)}
                        placeholder="Course name"
                        className="flex-1"
                        spellCheck={true}
                        data-testid={`education-${index}-course-${courseIndex}-input`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCourse(index, courseIndex)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`education-${index}-course-${courseIndex}-remove-button`}
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

      {education.length === 0 && (
        <div className="text-center py-8 text-gray-500" data-testid="no-education-message">
          <p>No education entries added yet.</p>
          <Button onClick={addEducation} className="mt-2" data-testid="add-first-education-button">
            Add Your First education Entry
          </Button>
        </div>
      )}
    </div>
  );
}
