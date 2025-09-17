'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RefreshCw, X, Wand2, Settings, Palette, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

interface Design {
  id: string;
  input_prompt: string;
  uploaded_image_url: string | null;
  ai_model_used: string;
  preferences?: any;
  design_outputs: any[];
}

interface RegenerationModifications {
  style?: string;
  roomType?: string;
  colorScheme?: string;
  materials?: string;
  budget?: number;
  additionalPrompt?: string;
  aiProvider?: string;
  variationCount?: number;
  qualityLevel?: string;
  mood?: string;
  lighting?: string;
}

interface RegenerationPanelProps {
  design: Design;
  onRegenerate: (modifications: RegenerationModifications) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
  className?: string;
}

export function RegenerationPanel({
  design,
  onRegenerate,
  onClose,
  isLoading = false,
  className = '',
}: RegenerationPanelProps) {
  const [modifications, setModifications] = useState<RegenerationModifications>({
    variationCount: 1,
    aiProvider: design.ai_model_used,
  });
  const [activeSection, setActiveSection] = useState<'quick' | 'style' | 'advanced' | 'prompt'>('quick');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleModificationChange = (key: keyof RegenerationModifications, value: any) => {
    setModifications(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleQuickPreset = (preset: RegenerationModifications) => {
    setModifications(prev => ({
      ...prev,
      ...preset,
    }));
  };

  const handleRegenerate = async () => {
    try {
      await onRegenerate(modifications);
    } catch (error) {
      console.error('Regeneration error:', error);
    }
  };

  const quickPresets = [
    {
      name: 'Modern Refresh',
      description: 'Clean, contemporary styling',
      modifications: { style: 'modern', colorScheme: 'neutral', mood: 'bright' },
    },
    {
      name: 'Cozy Traditional',
      description: 'Warm, classic comfort',
      modifications: { style: 'traditional', colorScheme: 'warm', mood: 'cozy' },
    },
    {
      name: 'Luxury Upgrade',
      description: 'Premium materials and finishes',
      modifications: { qualityLevel: 'luxury', style: 'contemporary', mood: 'elegant' },
    },
    {
      name: 'Budget Friendly',
      description: 'Cost-effective improvements',
      modifications: { qualityLevel: 'budget', style: 'minimalist', budget: 5000 },
    },
    {
      name: 'Color Pop',
      description: 'Bold, vibrant colors',
      modifications: { colorScheme: 'bold', mood: 'energetic' },
    },
    {
      name: 'Natural Light',
      description: 'Bright, airy feel',
      modifications: { lighting: 'natural', colorScheme: 'light', mood: 'fresh' },
    },
  ];

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Regenerate Design
          </DialogTitle>
          <DialogDescription>
            Modify your design preferences to generate new variations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Section Navigation */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <Button
              variant={activeSection === 'quick' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('quick')}
              className="flex-1"
            >
              <Wand2 className="h-4 w-4 mr-1" />
              Quick Presets
            </Button>
            <Button
              variant={activeSection === 'style' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('style')}
              className="flex-1"
            >
              <Palette className="h-4 w-4 mr-1" />
              Style & Color
            </Button>
            <Button
              variant={activeSection === 'advanced' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('advanced')}
              className="flex-1"
            >
              <Settings className="h-4 w-4 mr-1" />
              Advanced
            </Button>
            <Button
              variant={activeSection === 'prompt' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveSection('prompt')}
              className="flex-1"
            >
              Custom Prompt
            </Button>
          </div>

          {/* Quick Presets Section */}
          {activeSection === 'quick' && (
            <div className="space-y-4">
              <h3 className="font-medium">Quick Style Presets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickPresets.map((preset) => (
                  <Card
                    key={preset.name}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleQuickPreset(preset.modifications)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{preset.name}</h4>
                        <p className="text-sm text-muted-foreground">{preset.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(preset.modifications).map(([key, value]) => (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key}: {value}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Style & Color Section */}
          {activeSection === 'style' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Design Style</Label>
                  <Select
                    value={modifications.style || ''}
                    onValueChange={(value) => handleModificationChange('style', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="contemporary">Contemporary</SelectItem>
                      <SelectItem value="traditional">Traditional</SelectItem>
                      <SelectItem value="transitional">Transitional</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="scandinavian">Scandinavian</SelectItem>
                      <SelectItem value="bohemian">Bohemian</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="rustic">Rustic</SelectItem>
                      <SelectItem value="art_deco">Art Deco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <Select
                    value={modifications.colorScheme || ''}
                    onValueChange={(value) => handleModificationChange('colorScheme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutral Tones</SelectItem>
                      <SelectItem value="warm">Warm Colors</SelectItem>
                      <SelectItem value="cool">Cool Colors</SelectItem>
                      <SelectItem value="bold">Bold & Vibrant</SelectItem>
                      <SelectItem value="monochromatic">Monochromatic</SelectItem>
                      <SelectItem value="earth">Earth Tones</SelectItem>
                      <SelectItem value="pastels">Soft Pastels</SelectItem>
                      <SelectItem value="dark">Dark & Moody</SelectItem>
                      <SelectItem value="light">Light & Airy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Materials</Label>
                  <Select
                    value={modifications.materials || ''}
                    onValueChange={(value) => handleModificationChange('materials', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select materials" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural_wood">Natural Wood</SelectItem>
                      <SelectItem value="metal_accents">Metal Accents</SelectItem>
                      <SelectItem value="stone_marble">Stone & Marble</SelectItem>
                      <SelectItem value="fabric_textiles">Rich Fabrics</SelectItem>
                      <SelectItem value="glass_crystal">Glass & Crystal</SelectItem>
                      <SelectItem value="leather">Leather</SelectItem>
                      <SelectItem value="concrete">Concrete</SelectItem>
                      <SelectItem value="bamboo">Bamboo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Mood & Atmosphere</Label>
                  <Select
                    value={modifications.mood || ''}
                    onValueChange={(value) => handleModificationChange('mood', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cozy">Cozy & Intimate</SelectItem>
                      <SelectItem value="bright">Bright & Energetic</SelectItem>
                      <SelectItem value="elegant">Elegant & Sophisticated</SelectItem>
                      <SelectItem value="relaxing">Calm & Relaxing</SelectItem>
                      <SelectItem value="dramatic">Bold & Dramatic</SelectItem>
                      <SelectItem value="fresh">Fresh & Clean</SelectItem>
                      <SelectItem value="romantic">Romantic</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Lighting Preference</Label>
                <Select
                  value={modifications.lighting || ''}
                  onValueChange={(value) => handleModificationChange('lighting', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lighting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural Light Focused</SelectItem>
                    <SelectItem value="warm">Warm Artificial Light</SelectItem>
                    <SelectItem value="bright">Bright & Well-lit</SelectItem>
                    <SelectItem value="ambient">Ambient & Mood Lighting</SelectItem>
                    <SelectItem value="dramatic">Dramatic Lighting</SelectItem>
                    <SelectItem value="task">Task-focused Lighting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Advanced Section */}
          {activeSection === 'advanced' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>AI Provider</Label>
                  <Select
                    value={modifications.aiProvider || ''}
                    onValueChange={(value) => handleModificationChange('aiProvider', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                      <SelectItem value="midjourney">Midjourney</SelectItem>
                      <SelectItem value="dall-e">DALL-E</SelectItem>
                      <SelectItem value="replicate">Replicate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quality Level</Label>
                  <Select
                    value={modifications.qualityLevel || ''}
                    onValueChange={(value) => handleModificationChange('qualityLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget-Friendly</SelectItem>
                      <SelectItem value="mid-range">Mid-Range</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="custom">Custom/High-End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Variations</Label>
                  <div className="px-2">
                    <Slider
                      value={[modifications.variationCount || 1]}
                      onValueChange={(value) => handleModificationChange('variationCount', value[0])}
                      max={4}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1</span>
                      <span>{modifications.variationCount || 1} variations</span>
                      <span>4</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Budget (optional)
                  </Label>
                  <Input
                    type="number"
                    placeholder="Enter budget in USD"
                    value={modifications.budget || ''}
                    onChange={(e) => handleModificationChange('budget', parseInt(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Custom Prompt Section */}
          {activeSection === 'prompt' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Original Prompt</Label>
                <div className="p-3 bg-muted rounded text-sm">
                  {design.input_prompt}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Instructions</Label>
                <Textarea
                  placeholder="Add specific modifications, style requests, or additional details..."
                  value={modifications.additionalPrompt || ''}
                  onChange={(e) => handleModificationChange('additionalPrompt', e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  These instructions will be added to the original prompt. Be specific about what you want to change.
                </p>
              </div>
            </div>
          )}

          {/* Current Modifications Summary */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Current Modifications</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showAdvanced ? 'Hide' : 'Show'} Details
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {Object.entries(modifications).map(([key, value]) => {
                  if (value && value !== '' && key !== 'additionalPrompt') {
                    return (
                      <Badge key={key} variant="secondary">
                        {key}: {typeof value === 'number' ? value : String(value)}
                      </Badge>
                    );
                  }
                  return null;
                })}
                {modifications.additionalPrompt && (
                  <Badge variant="secondary">Custom prompt added</Badge>
                )}
                {Object.keys(modifications).filter(key => modifications[key as keyof RegenerationModifications] && modifications[key as keyof RegenerationModifications] !== '').length === 0 && (
                  <span className="text-sm text-muted-foreground">No modifications selected</span>
                )}
              </div>

              {showAdvanced && (
                <div className="mt-3 pt-3 border-t">
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(modifications, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setModifications({ variationCount: 1, aiProvider: design.ai_model_used })}
              >
                Reset
              </Button>
              <Button
                onClick={handleRegenerate}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Regenerate ({modifications.variationCount || 1})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default RegenerationPanel;