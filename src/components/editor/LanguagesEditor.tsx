
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { Language } from "@/types/resume";

const LanguagesEditor = () => {
  const { state, dispatch } = useResume();

  const fluencyLevels = [
    "Elementary proficiency",
    "Limited working proficiency", 
    "Professional working proficiency",
    "Full professional proficiency",
    "Native or bilingual proficiency"
  ];

  const addLanguage = () => {
    const newLanguage: Language = {
      language: "",
      fluency: "",
      visible: true
    };
    dispatch({ type: 'ADD_LANGUAGE', payload: newLanguage });
  };

  const updateLanguage = (index: number, field: keyof Language, value: string | boolean | undefined) => {
    dispatch({ 
      type: 'UPDATE_LANGUAGE', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removeLanguage = (index: number) => {
    dispatch({ type: 'REMOVE_LANGUAGE', payload: index });
  };

  const sectionVisible = state.resumeData.sectionVisibility?.languages ?? true;
  const toggleSectionVisibility = () => {
    dispatch({
      type: 'UPDATE_SECTION_VISIBILITY',
      payload: { languages: !sectionVisible }
    });
  };

  return (
    <div className="space-y-6" data-testid="languages-editor">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSectionVisibility}
            className="p-1"
            data-testid="languages-visibility-toggle"
          >
            {sectionVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <h2 className="text-2xl font-bold">Languages</h2>
        </div>
        <Button onClick={addLanguage} className="flex items-center space-x-2" data-testid="add-language-button">
          <Plus className="w-4 h-4" />
          <span>Add Language</span>
        </Button>
      </div>

      {state.resumeData.languages.map((language, index) => (
        <Card key={index} className="relative" data-testid={`language-${index}-card`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {language.language || `Language ${index + 1}`}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateLanguage(index, 'visible', !language.visible)}
                  className="flex items-center space-x-1"
                  data-testid={`language-${index}-visibility-toggle`}
                >
                  {language.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(index)}
                  className="text-red-600 hover:text-red-700"
                  data-testid={`language-${index}-remove-button`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`language-name-${index}`}>Language</Label>
                <Input
                  id={`language-name-${index}`}
                  value={language.language}
                  onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                  placeholder="Spanish, French, German..."
                  spellCheck={true}
                  data-testid={`language-${index}-name-input`}
                />
              </div>
              <div>
                <Label htmlFor={`language-fluency-${index}`}>Fluency Level</Label>
                <Select 
                  value={language.fluency} 
                  onValueChange={(value) => updateLanguage(index, 'fluency', value)}
                >
                  <SelectTrigger data-testid={`language-${index}-fluency-select`}>
                    <SelectValue placeholder="Select fluency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {fluencyLevels.map((level) => (
                      <SelectItem key={level} value={level} data-testid={`language-${index}-fluency-${level.replace(/\s+/g, '-').toLowerCase()}`}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {state.resumeData.languages.length === 0 && (
        <Card className="text-center py-8" data-testid="no-languages-message">
          <CardContent>
            <p className="text-gray-500 mb-4">No languages added yet</p>
            <Button onClick={addLanguage} className="flex items-center space-x-2 mx-auto" data-testid="add-first-language-button">
              <Plus className="w-4 h-4" />
              <span>Add Your First Language</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LanguagesEditor;
