import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Eye, EyeOff, Settings } from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { Certificate, Publication, Volunteer, Interest, Reference } from "@/types/resume";
import NonConformingDataViewer from "@/components/NonConformingDataViewer";
import SectionVisibilityEditor from "@/components/editor/SectionVisibilityEditor";

const AdditionalSectionsEditor = () => {
  const { state, dispatch } = useResume();

  // Certificate handlers
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

  // Publication handlers
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

  // Volunteer handlers
  const addVolunteer = () => {
    const newVolunteer: Volunteer = {
      organization: "",
      position: "",
      url: "",
      startDate: "",
      endDate: "",
      summary: "",
      highlights: [""],
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

  const addVolunteerHighlight = (index: number) => {
    const currentVolunteer = state.resumeData.volunteer[index];
    const updatedHighlights = [...currentVolunteer.highlights, ""];
    updateVolunteer(index, 'highlights', updatedHighlights);
  };

  const updateVolunteerHighlight = (volunteerIndex: number, highlightIndex: number, value: string) => {
    const currentVolunteer = state.resumeData.volunteer[volunteerIndex];
    const updatedHighlights = currentVolunteer.highlights.map((highlight, i) => 
      i === highlightIndex ? value : highlight
    );
    updateVolunteer(volunteerIndex, 'highlights', updatedHighlights);
  };

  const removeVolunteerHighlight = (volunteerIndex: number, highlightIndex: number) => {
    const currentVolunteer = state.resumeData.volunteer[volunteerIndex];
    const updatedHighlights = currentVolunteer.highlights.filter((_, i) => i !== highlightIndex);
    updateVolunteer(volunteerIndex, 'highlights', updatedHighlights);
  };

  // Interest handlers
  const addInterest = () => {
    const newInterest: Interest = {
      name: "",
      keywords: [""],
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

  const addInterestKeyword = (interestIndex: number) => {
    const currentInterest = state.resumeData.interests[interestIndex];
    const updatedKeywords = [...currentInterest.keywords, ""];
    updateInterest(interestIndex, 'keywords', updatedKeywords);
  };

  const updateInterestKeyword = (interestIndex: number, keywordIndex: number, value: string) => {
    const currentInterest = state.resumeData.interests[interestIndex];
    const updatedKeywords = currentInterest.keywords.map((keyword, i) => 
      i === keywordIndex ? value : keyword
    );
    updateInterest(interestIndex, 'keywords', updatedKeywords);
  };

  const removeInterestKeyword = (interestIndex: number, keywordIndex: number) => {
    const currentInterest = state.resumeData.interests[interestIndex];
    const updatedKeywords = currentInterest.keywords.filter((_, i) => i !== keywordIndex);
    updateInterest(interestIndex, 'keywords', updatedKeywords);
  };

  // Reference handlers
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

  return (
    <div className="space-y-8">
      {/* Section Visibility Controls */}
      <SectionVisibilityEditor />

      {/* Non-Conforming Data */}
      {state.resumeData.nonConformingData && (
        <NonConformingDataViewer data={state.resumeData.nonConformingData} />
      )}

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
                    placeholder="https://certificate-url.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {state.resumeData.certificates.length === 0 && (
          <Card className="text-center py-8">
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
              <div>
                <Label htmlFor={`pub-name-${index}`}>Publication Title</Label>
                <Input
                  id={`pub-name-${index}`}
                  value={publication.name}
                  onChange={(e) => updatePublication(index, 'name', e.target.value)}
                  placeholder="Building Scalable React Applications"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`pub-publisher-${index}`}>Publisher</Label>
                  <Input
                    id={`pub-publisher-${index}`}
                    value={publication.publisher}
                    onChange={(e) => updatePublication(index, 'publisher', e.target.value)}
                    placeholder="TechMedium"
                  />
                </div>
                <div>
                  <Label htmlFor={`pub-date-${index}`}>Release Date</Label>
                  <Input
                    id={`pub-date-${index}`}
                    type="date"
                    value={publication.releaseDate}
                    onChange={(e) => updatePublication(index, 'releaseDate', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`pub-url-${index}`}>Publication URL</Label>
                <Input
                  id={`pub-url-${index}`}
                  value={publication.url}
                  onChange={(e) => updatePublication(index, 'url', e.target.value)}
                  placeholder="https://publication-url.com"
                />
              </div>
              <div>
                <Label htmlFor={`pub-summary-${index}`}>Summary</Label>
                <Textarea
                  id={`pub-summary-${index}`}
                  value={publication.summary}
                  onChange={(e) => updatePublication(index, 'summary', e.target.value)}
                  placeholder="Brief description of the publication..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {state.resumeData.publications.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500 mb-4">No publications added yet</p>
              <Button onClick={addPublication} className="flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Add Your First Publication</span>
              </Button>
            </CardContent>
          </Card>
        )}
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
                  {volunteer.organization || `Volunteer Experience ${index + 1}`}
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
                  <Label htmlFor={`volunteer-org-${index}`}>Organization</Label>
                  <Input
                    id={`volunteer-org-${index}`}
                    value={volunteer.organization}
                    onChange={(e) => updateVolunteer(index, 'organization', e.target.value)}
                    placeholder="Organization name"
                  />
                </div>
                <div>
                  <Label htmlFor={`volunteer-position-${index}`}>Position</Label>
                  <Input
                    id={`volunteer-position-${index}`}
                    value={volunteer.position}
                    onChange={(e) => updateVolunteer(index, 'position', e.target.value)}
                    placeholder="Your role"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`volunteer-url-${index}`}>Website</Label>
                <Input
                  id={`volunteer-url-${index}`}
                  value={volunteer.url}
                  onChange={(e) => updateVolunteer(index, 'url', e.target.value)}
                  placeholder="https://organization-website.org"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`volunteer-start-${index}`}>Start Date</Label>
                  <Input
                    id={`volunteer-start-${index}`}
                    type="date"
                    value={volunteer.startDate}
                    onChange={(e) => updateVolunteer(index, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`volunteer-end-${index}`}>End Date</Label>
                  <Input
                    id={`volunteer-end-${index}`}
                    type="date"
                    value={volunteer.endDate}
                    onChange={(e) => updateVolunteer(index, 'endDate', e.target.value)}
                    placeholder="Leave blank if current"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`volunteer-summary-${index}`}>Summary</Label>
                <Textarea
                  id={`volunteer-summary-${index}`}
                  value={volunteer.summary}
                  onChange={(e) => updateVolunteer(index, 'summary', e.target.value)}
                  placeholder="Brief description of your volunteer work..."
                  rows={3}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Highlights</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addVolunteerHighlight(index)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>
                <div className="space-y-2">
                  {volunteer.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex gap-2">
                      <Input
                        value={highlight}
                        onChange={(e) => updateVolunteerHighlight(index, highlightIndex, e.target.value)}
                        placeholder="Key achievement or responsibility"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeVolunteerHighlight(index, highlightIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {state.resumeData.volunteer.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500 mb-4">No volunteer experience added yet</p>
              <Button onClick={addVolunteer} className="flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Add Your First Volunteer Experience</span>
              </Button>
            </CardContent>
          </Card>
        )}
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
                <Label htmlFor={`interest-name-${index}`}>Interest Name</Label>
                <Input
                  id={`interest-name-${index}`}
                  value={interest.name}
                  onChange={(e) => updateInterest(index, 'name', e.target.value)}
                  placeholder="Technology, Sports, Arts, etc."
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Keywords</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addInterestKeyword(index)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Keyword
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {interest.keywords.map((keyword, keywordIndex) => (
                    <div key={keywordIndex} className="flex gap-2">
                      <Input
                        value={keyword}
                        onChange={(e) => updateInterestKeyword(index, keywordIndex, e.target.value)}
                        placeholder="Specific interest"
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeInterestKeyword(index, keywordIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {state.resumeData.interests.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500 mb-4">No interests added yet</p>
              <Button onClick={addInterest} className="flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Add Your First Interest</span>
              </Button>
            </CardContent>
          </Card>
        )}
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
                <Label htmlFor={`reference-name-${index}`}>Reference Name & Title</Label>
                <Input
                  id={`reference-name-${index}`}
                  value={reference.name}
                  onChange={(e) => updateReference(index, 'name', e.target.value)}
                  placeholder="John Doe - CEO at Company"
                />
              </div>
              <div>
                <Label htmlFor={`reference-text-${index}`}>Reference Text</Label>
                <Textarea
                  id={`reference-text-${index}`}
                  value={reference.reference}
                  onChange={(e) => updateReference(index, 'reference', e.target.value)}
                  placeholder="What they said about you..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {state.resumeData.references.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500 mb-4">No references added yet</p>
              <Button onClick={addReference} className="flex items-center space-x-2 mx-auto">
                <Plus className="w-4 h-4" />
                <span>Add Your First Reference</span>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdditionalSectionsEditor;
