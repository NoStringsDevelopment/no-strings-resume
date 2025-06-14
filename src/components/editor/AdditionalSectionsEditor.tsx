
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { Certificate, Publication, Volunteer, Interest, Reference } from "@/types/resume";

const AdditionalSectionsEditor = () => {
  const { state, dispatch } = useResume();

  // Certificates
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

  // Publications
  const addPublication = () => {
    const newPublication: Publication = {
      name: "",
      publisher: "",
      releaseDate: "",
      url: "",
      summary: "",
      visible: true
    };
    dispatch({ type: 'ADD_PUBLICATION', payload: newPublication });
  };

  const updatePublication = (index: number, field: keyof Publication, value: any) => {
    dispatch({ 
      type: 'UPDATE_PUBLICATION', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removePublication = (index: number) => {
    dispatch({ type: 'REMOVE_PUBLICATION', payload: index });
  };

  // Volunteer
  const addVolunteer = () => {
    const newVolunteer: Volunteer = {
      organization: "",
      position: "",
      url: "",
      startDate: "",
      endDate: "",
      summary: "",
      highlights: [],
      visible: true
    };
    dispatch({ type: 'ADD_VOLUNTEER', payload: newVolunteer });
  };

  const updateVolunteer = (index: number, field: keyof Volunteer, value: any) => {
    dispatch({ 
      type: 'UPDATE_VOLUNTEER', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removeVolunteer = (index: number) => {
    dispatch({ type: 'REMOVE_VOLUNTEER', payload: index });
  };

  // Interests
  const addInterest = () => {
    const newInterest: Interest = {
      name: "",
      keywords: [],
      visible: true
    };
    dispatch({ type: 'ADD_INTEREST', payload: newInterest });
  };

  const updateInterest = (index: number, field: keyof Interest, value: any) => {
    dispatch({ 
      type: 'UPDATE_INTEREST', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removeInterest = (index: number) => {
    dispatch({ type: 'REMOVE_INTEREST', payload: index });
  };

  // References
  const addReference = () => {
    const newReference: Reference = {
      name: "",
      reference: "",
      visible: true
    };
    dispatch({ type: 'ADD_REFERENCE', payload: newReference });
  };

  const updateReference = (index: number, field: keyof Reference, value: any) => {
    dispatch({ 
      type: 'UPDATE_REFERENCE', 
      payload: { index, data: { [field]: value } }
    });
  };

  const removeReference = (index: number) => {
    dispatch({ type: 'REMOVE_REFERENCE', payload: index });
  };

  const updateArrayField = (items: string[], value: string) => {
    return value.split('\n').filter(item => item.trim());
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
                  <Label>Certificate Name</Label>
                  <Input
                    value={certificate.name}
                    onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                  />
                </div>
                <div>
                  <Label>Issuer</Label>
                  <Input
                    value={certificate.issuer}
                    onChange={(e) => updateCertificate(index, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                  />
                </div>
                <div>
                  <Label>Date Issued</Label>
                  <Input
                    type="date"
                    value={certificate.date}
                    onChange={(e) => updateCertificate(index, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Certificate URL</Label>
                  <Input
                    value={certificate.url}
                    onChange={(e) => updateCertificate(index, 'url', e.target.value)}
                    placeholder="https://certificate-url.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Publications Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Publications</h2>
          <Button onClick={addPublication} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Publication</span>
          </Button>
        </div>

        {state.resumeData.publications.map((publication, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {publication.name || `Publication ${index + 1}`}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updatePublication(index, 'visible', !publication.visible)}
                    className="flex items-center space-x-1"
                  >
                    {publication.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePublication(index)}
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
                  <Label>Publication Name</Label>
                  <Input
                    value={publication.name}
                    onChange={(e) => updatePublication(index, 'name', e.target.value)}
                    placeholder="Research Paper Title"
                  />
                </div>
                <div>
                  <Label>Publisher</Label>
                  <Input
                    value={publication.publisher}
                    onChange={(e) => updatePublication(index, 'publisher', e.target.value)}
                    placeholder="IEEE, ACM, etc."
                  />
                </div>
                <div>
                  <Label>Release Date</Label>
                  <Input
                    type="date"
                    value={publication.releaseDate}
                    onChange={(e) => updatePublication(index, 'releaseDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    value={publication.url}
                    onChange={(e) => updatePublication(index, 'url', e.target.value)}
                    placeholder="https://publication-url.com"
                  />
                </div>
              </div>
              <div>
                <Label>Summary</Label>
                <Textarea
                  value={publication.summary}
                  onChange={(e) => updatePublication(index, 'summary', e.target.value)}
                  placeholder="Brief summary of the publication..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Volunteer Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Volunteer Experience</h2>
          <Button onClick={addVolunteer} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Volunteer Experience</span>
          </Button>
        </div>

        {state.resumeData.volunteer.map((volunteer, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {volunteer.organization || `Volunteer ${index + 1}`}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateVolunteer(index, 'visible', !volunteer.visible)}
                    className="flex items-center space-x-1"
                  >
                    {volunteer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVolunteer(index)}
                    className="text-red-600 hover:text-re-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Organization</Label>
                  <Input
                    value={volunteer.organization}
                    onChange={(e) => updateVolunteer(index, 'organization', e.target.value)}
                    placeholder="Red Cross, Local Food Bank, etc."
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={volunteer.position}
                    onChange={(e) => updateVolunteer(index, 'position', e.target.value)}
                    placeholder="Volunteer Coordinator"
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    value={volunteer.url}
                    onChange={(e) => updateVolunteer(index, 'url', e.target.value)}
                    placeholder="https://organization.org"
                  />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={volunteer.startDate}
                    onChange={(e) => updateVolunteer(index, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={volunteer.endDate}
                    onChange={(e) => updateVolunteer(index, 'endDate', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Summary</Label>
                <Textarea
                  value={volunteer.summary}
                  onChange={(e) => updateVolunteer(index, 'summary', e.target.value)}
                  placeholder="Description of volunteer work..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Highlights (one per line)</Label>
                <Textarea
                  value={volunteer.highlights.join('\n')}
                  onChange={(e) => updateVolunteer(index, 'highlights', updateArrayField(volunteer.highlights, e.target.value))}
                  placeholder="Key achievements in volunteer role..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interests Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Interests</h2>
          <Button onClick={addInterest} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Interest</span>
          </Button>
        </div>

        {state.resumeData.interests.map((interest, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {interest.name || `Interest ${index + 1}`}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateInterest(index, 'visible', !interest.visible)}
                    className="flex items-center space-x-1"
                  >
                    {interest.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInterest(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Interest Name</Label>
                <Input
                  value={interest.name}
                  onChange={(e) => updateInterest(index, 'name', e.target.value)}
                  placeholder="Photography, Travel, etc."
                />
              </div>
              <div>
                <Label>Keywords (one per line)</Label>
                <Textarea
                  value={interest.keywords.join('\n')}
                  onChange={(e) => updateInterest(index, 'keywords', updateArrayField(interest.keywords, e.target.value))}
                  placeholder="Digital Photography&#10;Landscape&#10;Portrait"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* References Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">References</h2>
          <Button onClick={addReference} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Reference</span>
          </Button>
        </div>

        {state.resumeData.references.map((reference, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {reference.name || `Reference ${index + 1}`}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateReference(index, 'visible', !reference.visible)}
                    className="flex items-center space-x-1"
                  >
                    {reference.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReference(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Reference Name</Label>
                <Input
                  value={reference.name}
                  onChange={(e) => updateReference(index, 'name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Reference Statement</Label>
                <Textarea
                  value={reference.reference}
                  onChange={(e) => updateReference(index, 'reference', e.target.value)}
                  placeholder="Testimonial or reference statement..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdditionalSectionsEditor;
