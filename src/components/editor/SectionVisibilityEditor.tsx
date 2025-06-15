
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useResume } from "@/context/ResumeContext";

const SectionVisibilityEditor = () => {
  const { state, dispatch } = useResume();
  const { sectionVisibility } = state.resumeData;

  const updateSectionVisibility = (section: keyof typeof sectionVisibility, visible: boolean) => {
    dispatch({
      type: 'UPDATE_SECTION_VISIBILITY',
      payload: { ...sectionVisibility, [section]: visible }
    });
  };

  const sections = [
    { key: 'basics' as const, label: 'Basic Information', description: 'Name, contact, summary' },
    { key: 'work' as const, label: 'Work Experience', description: 'Employment history' },
    { key: 'volunteer' as const, label: 'Volunteer Experience', description: 'Volunteer work' },
    { key: 'education' as const, label: 'Education', description: 'Academic background' },
    { key: 'skills' as const, label: 'Skills', description: 'Technical and soft skills' },
    { key: 'projects' as const, label: 'Projects', description: 'Personal and professional projects' },
    { key: 'awards' as const, label: 'Awards', description: 'Recognition and honors' },
    { key: 'certificates' as const, label: 'Certificates', description: 'Professional certifications' },
    { key: 'publications' as const, label: 'Publications', description: 'Articles and papers' },
    { key: 'languages' as const, label: 'Languages', description: 'Language proficiency' },
    { key: 'interests' as const, label: 'Interests', description: 'Personal interests and hobbies' },
    { key: 'references' as const, label: 'References', description: 'Professional references' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5" />
          <span>Section Visibility</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Control which sections appear on your resume. Hidden sections won't be displayed but data is preserved.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <div key={section.key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {sectionVisibility[section.key] ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                  <Label htmlFor={section.key} className="font-medium">
                    {section.label}
                  </Label>
                </div>
                <p className="text-xs text-gray-500 mt-1">{section.description}</p>
              </div>
              <Switch
                id={section.key}
                checked={sectionVisibility[section.key]}
                onCheckedChange={(checked) => updateSectionVisibility(section.key, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionVisibilityEditor;
