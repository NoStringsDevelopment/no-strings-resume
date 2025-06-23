
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { SummarySelector } from "./SummarySelector";

export default function BasicEditor() {
  const { state, dispatch } = useResume();
  const { basics } = state.resumeData;

  const updateBasics = (field: string, value: string) => {
    dispatch({ 
      type: 'UPDATE_BASICS', 
      payload: { [field]: value } 
    });
  };

  const updateLocation = (field: string, value: string) => {
    dispatch({ 
      type: 'UPDATE_BASICS', 
      payload: { 
        location: { ...basics.location, [field]: value } 
      } 
    });
  };

  const addProfile = () => {
    const newProfile = { network: '', username: '', url: '', visible: true };
    dispatch({ 
      type: 'UPDATE_BASICS', 
      payload: { 
        profiles: [...basics.profiles, newProfile] 
      } 
    });
  };

  const updateProfile = (index: number, field: string, value: string | boolean) => {
    const updatedProfiles = basics.profiles.map((profile, i) => 
      i === index ? { ...profile, [field]: value } : profile
    );
    dispatch({ 
      type: 'UPDATE_BASICS', 
      payload: { profiles: updatedProfiles } 
    });
  };

  const removeProfile = (index: number) => {
    const updatedProfiles = basics.profiles.filter((_, i) => i !== index);
    dispatch({ 
      type: 'UPDATE_BASICS', 
      payload: { profiles: updatedProfiles } 
    });
  };

  // Safety check for sectionVisibility
  const sectionVisible = state.resumeData.sectionVisibility?.basics ?? true;
  const toggleSectionVisibility = () => {
    dispatch({
      type: 'UPDATE_SECTION_VISIBILITY',
      payload: { basics: !sectionVisible }
    });
  };

  return (
    <div className="space-y-6" data-testid="basic-editor">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSectionVisibility}
            className="p-1"
            data-testid="basics-visibility-toggle"
          >
            {sectionVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <h2 className="text-2xl font-bold">Basics</h2>
        </div>
      </div>
      
      <Card data-testid="personal-info-card">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={basics.name}
                onChange={(e) => updateBasics('name', e.target.value)}
                placeholder="Your full name"
                spellCheck={true}
                data-testid="name-input"
              />
            </div>
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={basics.label}
                onChange={(e) => updateBasics('label', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                spellCheck={true}
                data-testid="label-input"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={basics.email}
                onChange={(e) => updateBasics('email', e.target.value)}
                placeholder="your.email@example.com"
                data-testid="email-input"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={basics.phone}
                onChange={(e) => updateBasics('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                data-testid="phone-input"
              />
            </div>
            <div>
              <Label htmlFor="url">Website</Label>
              <Input
                id="url"
                value={basics.url}
                onChange={(e) => updateBasics('url', e.target.value)}
                placeholder="https://yourwebsite.com"
                data-testid="url-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Selector Component */}
      <SummarySelector />

      {/* Fallback Summary Textarea for direct editing */}
      <Card data-testid="summary-card">
        <CardHeader>
          <CardTitle>Summary (Direct Edit)</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={basics.summary}
              onChange={(e) => updateBasics('summary', e.target.value)}
              placeholder="Brief professional summary..."
              rows={4}
              spellCheck={true}
              data-testid="summary-input"
            />
          </div>
        </CardContent>
      </Card>

      <Card data-testid="location-card">
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={basics.location.address}
                onChange={(e) => updateLocation('address', e.target.value)}
                placeholder="123 Main Street"
                spellCheck={true}
                data-testid="address-input"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={basics.location.city}
                onChange={(e) => updateLocation('city', e.target.value)}
                placeholder="San Francisco"
                spellCheck={true}
                data-testid="city-input"
              />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                value={basics.location.region}
                onChange={(e) => updateLocation('region', e.target.value)}
                placeholder="CA"
                spellCheck={true}
                data-testid="region-input"
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={basics.location.postalCode}
                onChange={(e) => updateLocation('postalCode', e.target.value)}
                placeholder="94102"
                data-testid="postal-code-input"
              />
            </div>
            <div>
              <Label htmlFor="countryCode">Country Code</Label>
              <Input
                id="countryCode"
                value={basics.location.countryCode}
                onChange={(e) => updateLocation('countryCode', e.target.value)}
                placeholder="US"
                data-testid="country-code-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="profiles-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Profiles
            <Button onClick={addProfile} size="sm" data-testid="add-profile-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Profile
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {basics.profiles.map((profile, index) => (
              <div key={index} className="flex gap-4 items-end" data-testid={`profile-${index}`}>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateProfile(index, 'visible', !profile.visible)}
                    className="p-1"
                    data-testid={`profile-${index}-visibility-toggle`}
                  >
                    {profile.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex-1">
                  <Label>Network</Label>
                  <Input
                    value={profile.network}
                    onChange={(e) => updateProfile(index, 'network', e.target.value)}
                    placeholder="LinkedIn, GitHub, etc."
                    spellCheck={true}
                    data-testid={`profile-${index}-network-input`}
                  />
                </div>
                <div className="flex-1">
                  <Label>Username</Label>
                  <Input
                    value={profile.username}
                    onChange={(e) => updateProfile(index, 'username', e.target.value)}
                    placeholder="Your username"
                    data-testid={`profile-${index}-username-input`}
                  />
                </div>
                <div className="flex-1">
                  <Label>URL</Label>
                  <Input
                    value={profile.url}
                    onChange={(e) => updateProfile(index, 'url', e.target.value)}
                    placeholder="Profile URL"
                    data-testid={`profile-${index}-url-input`}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeProfile(index)}
                  className="text-red-600 hover:text-red-700"
                  data-testid={`profile-${index}-remove-button`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
