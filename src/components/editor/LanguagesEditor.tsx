
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

  const updateLanguage = (index: number, field: keyof Language, value: any) => {
    dispatch({ 
      type: 'UPDATE_LANGUAGE', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removeLanguage = (index: number) => {
    dispatch({ type: 'REMOVE_LANGUAGE', payload: index });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Languages</h2>
        <Button onClick={addLanguage} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Language</span>
        </Button>
      </div>

      {state.resumeData.languages.map((language, index) => (
        <Card key={index} className="relative">
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
                >
                  {language.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLanguage(index)}
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
                <Label htmlFor={`language-name-${index}`}>Language</Label>
                <Input
                  id={`language-name-${index}`}
                  value={language.language}
                  onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                  placeholder="Spanish, French, German..."
                />
              </div>
              <div>
                <Label htmlFor={`language-fluency-${index}`}>Fluency Level</Label>
                <Select 
                  value={language.fluency} 
                  onValueChange={(value) => updateLanguage(index, 'fluency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fluency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {fluencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
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
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500 mb-4">No languages added yet</p>
            <Button onClick={addLanguage} className="flex items-center space-x-2 mx-auto">
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
