
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/context/ThemeContext";
import { Theme, ThemeColors, ThemeTypography } from "@/types/resume";
import { useState } from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    <div className="flex items-center space-x-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-8 rounded border cursor-pointer"
      />
      <span className="text-sm font-mono text-gray-600">{color}</span>
    </div>
  </div>
);

export const ThemeCustomizer = () => {
  const { themeState, setTheme } = useTheme();
  const [customTheme, setCustomTheme] = useState<Theme>(themeState.currentTheme);

  const updateThemeColors = (colors: Partial<ThemeColors>) => {
    const updated = {
      ...customTheme,
      colors: { ...customTheme.colors, ...colors }
    };
    setCustomTheme(updated);
  };

  const updateThemeTypography = (typography: Partial<ThemeTypography>) => {
    const updated = {
      ...customTheme,
      typography: { ...customTheme.typography, ...typography }
    };
    setCustomTheme(updated);
  };

  const applyTheme = () => {
    setTheme(customTheme);
  };

  const resetToDefaults = () => {
    const defaultTheme = themeState.availableThemes[0];
    setCustomTheme(defaultTheme);
    setTheme(defaultTheme);
  };

  return (
    <div className="space-y-6">
      {/* Color Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker 
              color={customTheme.colors.primary}
              onChange={(color) => updateThemeColors({ primary: color })}
              label="Primary Color"
            />
            <ColorPicker 
              color={customTheme.colors.secondary}
              onChange={(color) => updateThemeColors({ secondary: color })}
              label="Secondary Color"
            />
            <ColorPicker 
              color={customTheme.colors.accent}
              onChange={(color) => updateThemeColors({ accent: color })}
              label="Accent Color"
            />
            <ColorPicker 
              color={customTheme.colors.text}
              onChange={(color) => updateThemeColors({ text: color })}
              label="Text Color"
            />
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select 
                value={customTheme.typography.fontFamily} 
                onValueChange={(value) => updateThemeTypography({ fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Base Font Size</Label>
              <div className="px-2">
                <Slider
                  value={[customTheme.typography.fontSize]}
                  onValueChange={([value]) => updateThemeTypography({ fontSize: value })}
                  min={12}
                  max={18}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{customTheme.typography.fontSize}px</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Line Height</Label>
            <div className="px-2">
              <Slider
                value={[customTheme.typography.lineHeight]}
                onValueChange={([value]) => updateThemeTypography({ lineHeight: value })}
                min={1.2}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{customTheme.typography.lineHeight}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preset Themes */}
      <Card>
        <CardHeader>
          <CardTitle>Preset Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeState.availableThemes.map((theme) => (
              <div
                key={theme.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  customTheme.id === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setCustomTheme(theme)}
              >
                <div className="text-sm font-medium mb-2">{theme.name}</div>
                <div className="flex space-x-2">
                  <div 
                    className="w-6 h-6 rounded" 
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-6 h-6 rounded" 
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="w-6 h-6 rounded" 
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button onClick={applyTheme} className="flex-1">
          Apply Theme
        </Button>
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Default
        </Button>
      </div>
    </div>
  );
};
