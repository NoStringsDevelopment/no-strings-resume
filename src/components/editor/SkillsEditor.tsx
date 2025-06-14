
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Skill } from "@/types/resume";

export default function SkillsEditor() {
  const { state, dispatch } = useResume();
  const { skills } = state.resumeData;

  const addSkill = () => {
    const newSkill: Skill = {
      name: '',
      level: '',
      keywords: [''],
      visible: true
    };
    const updatedSkills = [...skills, newSkill];
    dispatch({ type: 'UPDATE_SKILLS', payload: updatedSkills });
  };

  const updateSkill = (index: number, field: string, value: string | string[]) => {
    const updatedSkills = skills.map((skill, i) =>
      i === index ? { ...skill, [field]: value } : skill
    );
    dispatch({ type: 'UPDATE_SKILLS', payload: updatedSkills });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    dispatch({ type: 'UPDATE_SKILLS', payload: updatedSkills });
  };

  const addKeyword = (skillIndex: number) => {
    const currentSkill = skills[skillIndex];
    const updatedKeywords = [...currentSkill.keywords, ''];
    updateSkill(skillIndex, 'keywords', updatedKeywords);
  };

  const updateKeyword = (skillIndex: number, keywordIndex: number, value: string) => {
    const currentSkill = skills[skillIndex];
    const updatedKeywords = currentSkill.keywords.map((keyword, i) =>
      i === keywordIndex ? value : keyword
    );
    updateSkill(skillIndex, 'keywords', updatedKeywords);
  };

  const removeKeyword = (skillIndex: number, keywordIndex: number) => {
    const currentSkill = skills[skillIndex];
    const updatedKeywords = currentSkill.keywords.filter((_, i) => i !== keywordIndex);
    updateSkill(skillIndex, 'keywords', updatedKeywords);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Skills</h2>
        <Button onClick={addSkill}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill Category
        </Button>
      </div>

      {skills.map((skill, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Skill Category #{index + 1}
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSkill(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Skill Name/Category</Label>
                <Input
                  value={skill.name}
                  onChange={(e) => updateSkill(index, 'name', e.target.value)}
                  placeholder="e.g., Programming Languages"
                />
              </div>
              <div>
                <Label>Proficiency Level</Label>
                <Input
                  value={skill.level}
                  onChange={(e) => updateSkill(index, 'level', e.target.value)}
                  placeholder="e.g., Expert, Advanced, Intermediate"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Skills/Technologies</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addKeyword(index)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {skill.keywords.map((keyword, keywordIndex) => (
                  <div key={keywordIndex} className="flex gap-2">
                    <Input
                      value={keyword}
                      onChange={(e) => updateKeyword(index, keywordIndex, e.target.value)}
                      placeholder="Technology or skill"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeKeyword(index, keywordIndex)}
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

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No skills added yet.</p>
          <Button onClick={addSkill} className="mt-2">
            Add Your First Skill Category
          </Button>
        </div>
      )}
    </div>
  );
}
