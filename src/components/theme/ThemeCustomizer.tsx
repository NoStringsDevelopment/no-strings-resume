
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/context/ThemeContext";
import { Theme, ThemeColors, ThemeTypography } from "@/types/resume";
import { useCallback } from "react";

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

  const updateTheme = useCallback((updates: Partial<Theme>) => {
    const updatedTheme = { ...themeState.currentTheme, ...updates };
    setTheme(updatedTheme);
  }, [themeState.currentTheme, setTheme]);

  const updateThemeColors = useCallback((colors: Partial<ThemeColors>) => {
    updateTheme({
      colors: { ...themeState.currentTheme.colors, ...colors }
    });
  }, [themeState.currentTheme.colors, updateTheme]);

  const updateThemeTypography = useCallback((typography: Partial<ThemeTypography>) => {
    updateTheme({
      typography: { ...themeState.currentTheme.typography, ...typography }
    });
  }, [themeState.currentTheme.typography, updateTheme]);

  const updateThemeSpacing = useCallback((spacing: Partial<typeof themeState.currentTheme.spacing>) => {
    updateTheme({
      spacing: { ...themeState.currentTheme.spacing, ...spacing }
    });
  }, [themeState.currentTheme.spacing, updateTheme]);

  const resetToDefaults = useCallback(() => {
    const defaultTheme = themeState.availableThemes[0];
    if (defaultTheme) {
      setTheme(defaultTheme);
    }
  }, [themeState.availableThemes, setTheme]);

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
              color={themeState.currentTheme.colors.primary}
              onChange={(color) => updateThemeColors({ primary: color })}
              label="Name & Headings"
            />
            <ColorPicker 
              color={themeState.currentTheme.colors.secondary}
              onChange={(color) => updateThemeColors({ secondary: color })}
              label="Professional Title"
            />
            <ColorPicker 
              color={themeState.currentTheme.colors.accent}
              onChange={(color) => updateThemeColors({ accent: color })}
              label="Companies & Organizations"
            />
            <ColorPicker 
              color={themeState.currentTheme.colors.text}
              onChange={(color) => updateThemeColors({ text: color })}
              label="Body Text"
            />
            <ColorPicker 
              color={themeState.currentTheme.colors.textSecondary}
              onChange={(color) => updateThemeColors({ textSecondary: color })}
              label="Secondary Text"
            />
            <ColorPicker 
              color={themeState.currentTheme.colors.background}
              onChange={(color) => updateThemeColors({ background: color })}
              label="Background"
            />
            <ColorPicker 
              color={themeState.currentTheme.colors.border}
              onChange={(color) => updateThemeColors({ border: color })}
              label="Borders & Lines"
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
                value={themeState.currentTheme.typography.fontFamily} 
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
                  value={[themeState.currentTheme.typography.fontSize]}
                  onValueChange={([value]) => updateThemeTypography({ fontSize: value })}
                  min={12}
                  max={18}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 mt-1">{themeState.currentTheme.typography.fontSize}px</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Line Height</Label>
            <div className="px-2">
              <Slider
                value={[themeState.currentTheme.typography.lineHeight]}
                onValueChange={([value]) => updateThemeTypography({ lineHeight: value })}
                min={1.2}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{themeState.currentTheme.typography.lineHeight}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Options */}
      <Card>
        <CardHeader>
          <CardTitle>Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Section Spacing</Label>
              <Select 
                value={themeState.currentTheme.spacing.section}
                onValueChange={(value) => updateThemeSpacing({ section: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1rem">Compact (1rem)</SelectItem>
                  <SelectItem value="1.5rem">Normal (1.5rem)</SelectItem>
                  <SelectItem value="2rem">Spacious (2rem)</SelectItem>
                  <SelectItem value="2.5rem">Extra Spacious (2.5rem)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Item Spacing</Label>
              <Select 
                value={themeState.currentTheme.spacing.item}
                onValueChange={(value) => updateThemeSpacing({ item: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5rem">Compact (0.5rem)</SelectItem>
                  <SelectItem value="1rem">Normal (1rem)</SelectItem>
                  <SelectItem value="1.5rem">Spacious (1.5rem)</SelectItem>
                </SelectContent>
              </Select>
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
                  themeState.currentTheme.id === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setTheme(theme)}
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

      {/* Reset Action */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Default Theme
        </Button>
      </div>
    </div>
  );
};
