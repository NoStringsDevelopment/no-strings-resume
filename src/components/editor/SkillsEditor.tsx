import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Skill, Keyword } from "@/types/resume";
import { normalizeKeyword, getKeywordName, isKeywordVisible } from "@/utils/visibilityHelpers";

export default function SkillsEditor() {
  const { state, dispatch } = useResume();
  const { skills } = state.resumeData;

  const addSkill = () => {
    const newSkill: Skill = {
      name: '',
      level: '',
      keywords: [{ name: '', visible: true }],
      visible: true
    };
    const updatedSkills = [...skills, newSkill];
    dispatch({ type: 'UPDATE_SKILLS', payload: updatedSkills });
  };

  const updateSkill = (index: number, field: string, value: string | (string | Keyword)[] | boolean) => {
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
    const updatedKeywords = [...currentSkill.keywords, { name: '', visible: true }];
    updateSkill(skillIndex, 'keywords', updatedKeywords);
  };

  const updateKeyword = (skillIndex: number, keywordIndex: number, value: string) => {
    const currentSkill = skills[skillIndex];
    const updatedKeywords = currentSkill.keywords.map((keyword, i) => {
      if (i === keywordIndex) {
        const normalized = normalizeKeyword(keyword);
        return { ...normalized, name: value };
      }
      return keyword;
    });
    updateSkill(skillIndex, 'keywords', updatedKeywords);
  };

  const toggleKeywordVisibility = (skillIndex: number, keywordIndex: number) => {
    const currentSkill = skills[skillIndex];
    const updatedKeywords = currentSkill.keywords.map((keyword, i) => {
      if (i === keywordIndex) {
        const normalized = normalizeKeyword(keyword);
        return { ...normalized, visible: !normalized.visible };
      }
      return keyword;
    });
    updateSkill(skillIndex, 'keywords', updatedKeywords);
  };

  const removeKeyword = (skillIndex: number, keywordIndex: number) => {
    const currentSkill = skills[skillIndex];
    const updatedKeywords = currentSkill.keywords.filter((_,  i) => i !== keywordIndex);
    updateSkill(skillIndex, 'keywords', updatedKeywords);
  };

  const sectionVisible = state.resumeData.sectionVisibility.skills;
  const toggleSectionVisibility = () => {
    dispatch({
      type: 'UPDATE_SECTION_VISIBILITY',
      payload: { ...state.resumeData.sectionVisibility, skills: !sectionVisible }
    });
  };

  return (
    <div className="space-y-6" data-testid="skills-editor">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSectionVisibility}
            className="p-1"
            data-testid="skills-visibility-toggle"
          >
            {sectionVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <h2 className="text-2xl font-bold">Skills</h2>
        </div>
        <Button onClick={addSkill} data-testid="add-skill-button">
          <Plus className="w-4 h-4 mr-2" />
          Add skill
        </Button>
      </div>

      {skills.map((skill, index) => (
        <Card key={index} data-testid={`skill-${index}-card`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSkill(index, 'visible', !skill.visible)}
                  className="p-1"
                  data-testid={`skill-${index}-visibility-toggle`}
                >
                  {skill.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <span>skill #{index + 1}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeSkill(index)}
                className="text-red-600 hover:text-red-700"
                data-testid={`skill-${index}-remove-button`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${index}`}>name</Label>
                <Input
                  id={`name-${index}`}
                  value={skill.name}
                  onChange={(e) => updateSkill(index, 'name', e.target.value)}
                  placeholder="e.g., Programming Languages"
                  spellCheck={true}
                  data-testid={`skill-${index}-name-input`}
                />
              </div>
              <div>
                <Label htmlFor={`level-${index}`}>level</Label>
                <Input
                  id={`level-${index}`}
                  value={skill.level}
                  onChange={(e) => updateSkill(index, 'level', e.target.value)}
                  placeholder="e.g., Expert, Advanced, Intermediate"
                  spellCheck={true}
                  data-testid={`skill-${index}-level-input`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>keywords</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addKeyword(index)}
                  data-testid={`skill-${index}-add-keyword-button`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add keyword
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {skill.keywords.map((keyword, keywordIndex) => {
                  const normalized = normalizeKeyword(keyword);
                  return (
                    <div key={keywordIndex} className="flex gap-2" data-testid={`skill-${index}-keyword-${keywordIndex}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeywordVisibility(index, keywordIndex)}
                        className="p-1"
                        data-testid={`skill-${index}-keyword-${keywordIndex}-visibility-toggle`}
                      >
                        {isKeywordVisible(keyword) ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Input
                        value={getKeywordName(keyword)}
                        onChange={(e) => updateKeyword(index, keywordIndex, e.target.value)}
                        placeholder="Technology or skill"
                        className="flex-1"
                        spellCheck={true}
                        data-testid={`skill-${index}-keyword-${keywordIndex}-input`}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeKeyword(index, keywordIndex)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`skill-${index}-keyword-${keywordIndex}-remove-button`}
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

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500" data-testid="no-skills-message">
          <p>No skills added yet.</p>
          <Button onClick={addSkill} className="mt-2" data-testid="add-first-skill-button">
            Add Your First skill
          </Button>
        </div>
      )}
    </div>
  );
}
