
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, FileText } from "lucide-react";
import { NonConformingData } from "@/types/resume";

interface NonConformingDataViewerProps {
  data: NonConformingData;
}

const NonConformingDataViewer = ({ data }: NonConformingDataViewerProps) => {
  return (
    <Card className="border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-amber-800">
          <AlertTriangle className="w-5 h-5" />
          <span>Non-Conforming Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-amber-200 bg-amber-50">
          <FileText className="h-4 w-4" />
          <AlertDescription className="text-amber-700">
            This section contains data from your imported resume that didn't conform to the expected schema.
            Please review and manually integrate the information below into the appropriate sections.
          </AlertDescription>
        </Alert>

        {data.parsingErrors && data.parsingErrors.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Parsing Errors:</h4>
            <ul className="space-y-1">
              {data.parsingErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.invalidFields && data.invalidFields.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Invalid Fields:</h4>
            <div className="space-y-2">
              {data.invalidFields.map((field, index) => (
                <div key={index} className="bg-amber-50 p-3 rounded border border-amber-200">
                  <div className="text-sm font-medium text-amber-800">
                    {field.section} → {field.field}
                  </div>
                  <div className="text-sm text-amber-700 mt-1">
                    Reason: {field.reason}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    Original value: {JSON.stringify(field.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.rawText && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Raw Text Data:</h4>
            <textarea
              className="w-full h-32 p-3 border border-gray-300 rounded text-xs font-mono"
              value={data.rawText}
              readOnly
              placeholder="No raw text data available"
            />
          </div>
        )}

        {data.originalData && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Original Data Structure:</h4>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-64 border">
              {JSON.stringify(data.originalData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NonConformingDataViewer;
