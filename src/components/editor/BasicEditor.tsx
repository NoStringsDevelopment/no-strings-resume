
import { useResume } from "@/context/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={basics.name}
                onChange={(e) => updateBasics('name', e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="label">Professional Title</Label>
              <Input
                id="label"
                value={basics.label}
                onChange={(e) => updateBasics('label', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
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
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={basics.phone}
                onChange={(e) => updateBasics('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="url">Website/Portfolio</Label>
              <Input
                id="url"
                value={basics.url}
                onChange={(e) => updateBasics('url', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={basics.summary}
              onChange={(e) => updateBasics('summary', e.target.value)}
              placeholder="Brief professional summary..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={basics.location.address}
                onChange={(e) => updateLocation('address', e.target.value)}
                placeholder="Street address"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={basics.location.city}
                onChange={(e) => updateLocation('city', e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <Label htmlFor="region">State/Region</Label>
              <Input
                id="region"
                value={basics.location.region}
                onChange={(e) => updateLocation('region', e.target.value)}
                placeholder="State or Region"
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={basics.location.postalCode}
                onChange={(e) => updateLocation('postalCode', e.target.value)}
                placeholder="Postal code"
              />
            </div>
            <div>
              <Label htmlFor="countryCode">Country Code</Label>
              <Input
                id="countryCode"
                value={basics.location.countryCode}
                onChange={(e) => updateLocation('countryCode', e.target.value)}
                placeholder="US"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Social Profiles
            <Button onClick={addProfile} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Profile
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {basics.profiles.map((profile, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Network</Label>
                  <Input
                    value={profile.network}
                    onChange={(e) => updateProfile(index, 'network', e.target.value)}
                    placeholder="LinkedIn, GitHub, etc."
                  />
                </div>
                <div className="flex-1">
                  <Label>Username</Label>
                  <Input
                    value={profile.username}
                    onChange={(e) => updateProfile(index, 'username', e.target.value)}
                    placeholder="Your username"
                  />
                </div>
                <div className="flex-1">
                  <Label>URL</Label>
                  <Input
                    value={profile.url}
                    onChange={(e) => updateProfile(index, 'url', e.target.value)}
                    placeholder="Profile URL"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeProfile(index)}
                  className="text-red-600 hover:text-red-700"
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
