import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useResume } from "@/context/ResumeContext";

const exportSections = [
  { key: 'work', label: 'Work Experience' },
  { key: 'education', label: 'Education' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'awards', label: 'Awards' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'publications', label: 'Publications' },
  { key: 'languages', label: 'Languages' },
  { key: 'interests', label: 'Interests' },
  { key: 'references', label: 'References' },
  { key: 'volunteer', label: 'Volunteer Experience' },
] as const;

const SectionVisibilityEditor = () => {
  const { state, dispatch } = useResume();
  const sectionPageBreaks = state.resumeData.sectionPageBreaks ?? {};

  return (
    <Card data-testid="section-visibility-info">
      <CardHeader>
        <CardTitle>Export Layout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Start selected sections on a new page when exporting to PDF or DOCX.
        </p>
        <div className="space-y-3">
          {exportSections.map((section) => (
            <div key={section.key} className="flex items-center justify-between gap-4">
              <div>
                <div className="font-medium">{`Before ${section.label}`}</div>
                <div className="text-sm text-gray-500">Insert a manual page break before this section.</div>
              </div>
              <Switch
                checked={Boolean(sectionPageBreaks[section.key])}
                onCheckedChange={(checked) =>
                  dispatch({
                    type: 'UPDATE_SECTION_PAGE_BREAKS',
                    payload: { [section.key]: checked },
                  })
                }
                data-testid={`page-break-${section.key}-toggle`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
export default SectionVisibilityEditor;
