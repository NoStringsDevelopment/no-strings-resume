
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { Certificate, Publication, Interest, Reference, Volunteer } from "@/types/resume";

const AdditionalSectionsEditor = () => {
  const { state, dispatch } = useResume();

  // Certificates section
  const addCertificate = () => {
    const newCertificate: Certificate = {
      name: "",
      date: "",
      issuer: "",
      url: "",
      visible: true
    };
    dispatch({ type: 'ADD_CERTIFICATE', payload: newCertificate });
  };

  const updateCertificate = (index: number, field: keyof Certificate, value: any) => {
    dispatch({ 
      type: 'UPDATE_CERTIFICATE', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removeCertificate = (index: number) => {
    dispatch({ type: 'REMOVE_CERTIFICATE', payload: index });
  };

  return (
    <div className="space-y-8">
      {/* Certificates Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Certificates</h2>
          <Button onClick={addCertificate} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Certificate</span>
          </Button>
        </div>

        {state.resumeData.certificates.map((certificate, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {certificate.name || `Certificate ${index + 1}`}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateCertificate(index, 'visible', !certificate.visible)}
                    className="flex items-center space-x-1"
                  >
                    {certificate.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCertificate(index)}
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
                  <Label htmlFor={`cert-name-${index}`}>Certificate Name</Label>
                  <Input
                    id={`cert-name-${index}`}
                    value={certificate.name}
                    onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>
                <div>
                  <Label htmlFor={`cert-date-${index}`}>Date Issued</Label>
                  <Input
                    id={`cert-date-${index}`}
                    type="date"
                    value={certificate.date}
                    onChange={(e) => updateCertificate(index, 'date', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`cert-issuer-${index}`}>Issuing Organization</Label>
                  <Input
                    id={`cert-issuer-${index}`}
                    value={certificate.issuer}
                    onChange={(e) => updateCertificate(index, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <Label htmlFor={`cert-url-${index}`}>Certificate URL</Label>
                  <Input
                    id={`cert-url-${index}`}
                    value={certificate.url}
                    onChange={(e) => updateCertificate(index, 'url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {state.resumeData.certificates.length === 0 && (
          <Card className="text-center py-6">
            <CardContent>
              <p className="text-gray-500 mb-4">No certificates added yet</p>
              <Button onClick={addCertificate} className="flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Add Your First Certificate</span>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Coming Soon Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="text-center py-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Publications</h3>
            <p className="text-gray-500 mb-4">Add your publications, articles, and research papers</p>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </CardContent>
        </Card>

        <Card className="text-center py-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Volunteer Work</h3>
            <p className="text-gray-500 mb-4">Showcase your volunteer experience and community involvement</p>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </CardContent>
        </Card>

        <Card className="text-center py-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Interests</h3>
            <p className="text-gray-500 mb-4">Add your hobbies and personal interests</p>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </CardContent>
        </Card>

        <Card className="text-center py-6">
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">References</h3>
            <p className="text-gray-500 mb-4">Add professional references</p>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdditionalSectionsEditor;
