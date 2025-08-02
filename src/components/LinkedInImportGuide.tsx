import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Archive } from "lucide-react";

interface LinkedInImportGuideProps {
  onClose?: () => void;
}

export const LinkedInImportGuide = ({ onClose }: LinkedInImportGuideProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Archive className="w-5 h-5 text-blue-600" />
          <span>Import from LinkedIn</span>
        </CardTitle>
        <CardDescription>
          Follow these steps to export your LinkedIn data and import it into your resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <div>
              <p className="font-medium">Request your LinkedIn data</p>
              <p className="text-sm text-gray-600 mt-1">
                Go to LinkedIn Settings & Privacy → Data Privacy → Get a copy of your data
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <div>
              <p className="font-medium">Select data to export</p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Important:</strong> Select "Download larger data archive" option to get all required sections: Profile, Positions, Education, Skills, Languages, and Certifications
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <div>
              <p className="font-medium">Wait for email notification</p>
              <p className="text-sm text-gray-600 mt-1">
                LinkedIn will email you a download link within 24-72 hours
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
            <div>
              <p className="font-medium">Download and import</p>
              <p className="text-sm text-gray-600 mt-1">
                Download the ZIP file and use the Import button above to upload it directly
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.linkedin.com/psettings/member-data', '_blank')}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Go to LinkedIn Data Export</span>
            </Button>
            
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Download className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Required format:</p>
              <p className="text-blue-700 mt-1">
                LinkedIn data export ZIP file containing the full data archive
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};