
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const SectionVisibilityEditor = () => {
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
          Section visibility is now controlled directly from each section. Look for the eye icon next to each section title and individual items.
        </p>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Visibility controls have been moved to individual sections</p>
          <Button disabled variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Use controls in each section
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionVisibilityEditor;
