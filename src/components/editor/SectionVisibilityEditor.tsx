
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

const SectionVisibilityEditor = () => {
  return (
    <Card data-testid="section-visibility-info">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="w-5 h-5" />
          <span>Section Visibility</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 mb-4">
          Section visibility is now controlled directly from each section. Look for the eye icon next to each section title and individual items.
        </p>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            Use the visibility controls in each individual section to show or hide content.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionVisibilityEditor;
