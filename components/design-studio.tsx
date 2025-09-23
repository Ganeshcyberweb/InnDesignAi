"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  RiSparklingLine,
  RiRefreshLine,
  RiSettings3Line,
  RiImageLine,
  RiUploadCloudLine,
} from "@remixicon/react";

const COLOR_PALETTES = [
  { id: "neutral", colors: ["#1a1a1a", "#6b7280", "#f3f4f6"] },
  { id: "warm", colors: ["#991b1b", "#f59e0b", "#fef3c7"] },
  { id: "cool", colors: ["#1e40af", "#3b82f6", "#dbeafe"] },
  { id: "earth", colors: ["#92400e", "#d97706", "#fef7cd"] },
];

const STYLE_TABS = [
  { id: "styleA", label: "Style A", active: true },
  { id: "styleB", label: "Style B", active: false },
  { id: "styleC", label: "Style C", active: false },
];

export default function DesignStudio() {
  const [activeTab, setActiveTab] = useState("styleA");
  const [selectedPalette, setSelectedPalette] = useState("neutral");
  const [formData, setFormData] = useState({
    prompt: "",
    roomType: "living_room",
    roomSize: "",
    stylePreference: "modern",
    budgetRange: "$1,000 - $5,000",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderDesignPlaceholder = () => (
    <div className="bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 h-80 flex flex-col items-center justify-center text-muted-foreground">
      <RiImageLine size={48} className="mb-4" />
      <h3 className="text-lg font-medium mb-2">Main Design View</h3>
      <p className="text-sm text-center">AI-generated room design will appear here</p>
    </div>
  );

  const renderThumbnailGrid = () => (
    <div className="grid grid-cols-6 gap-2 mt-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-muted/30 rounded border-2 border-dashed border-muted-foreground/20 aspect-square flex items-center justify-center"
        >
          <RiImageLine size={20} className="text-muted-foreground/50" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* AI Generated Designs Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">AI Generated Designs</h2>
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            {STYLE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Design View */}
        {renderDesignPlaceholder()}

        {/* Thumbnail Gallery */}
        {renderThumbnailGrid()}
      </div>

      {/* Project Details */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Project Details</h3>

        <div className="space-y-6">
          {/* Prompt */}
          <div>
            <Label htmlFor="prompt" className="text-sm font-medium mb-2 block">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Describe specific requirements, furniture preferences, or design elements..."
              value={formData.prompt}
              onChange={(e) => handleInputChange("prompt", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Room Type */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Room Type</Label>
              <Select
                value={formData.roomType}
                onValueChange={(value) => handleInputChange("roomType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="living_room">Living Room</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                  <SelectItem value="dining_room">Dining Room</SelectItem>
                  <SelectItem value="office">Home Office</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Room Size */}
            <div>
              <Label htmlFor="roomSize" className="text-sm font-medium mb-2 block">
                Room Size (sq ft)
              </Label>
              <Input
                id="roomSize"
                type="number"
                placeholder="250"
                value={formData.roomSize}
                onChange={(e) => handleInputChange("roomSize", e.target.value)}
              />
            </div>

            {/* Style Preference */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Style Preference</Label>
              <Select
                value={formData.stylePreference}
                onValueChange={(value) => handleInputChange("stylePreference", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="scandinavian">Scandinavian</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="bohemian">Bohemian</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Budget Range</Label>
              <Select
                value={formData.budgetRange}
                onValueChange={(value) => handleInputChange("budgetRange", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$500 - $1,000">$500 - $1,000</SelectItem>
                  <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                  <SelectItem value="$5,000 - $15,000">$5,000 - $15,000</SelectItem>
                  <SelectItem value="$15,000 - $30,000">$15,000 - $30,000</SelectItem>
                  <SelectItem value="$30,000+">$30,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Color Palette</Label>
            <div className="flex gap-3">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => setSelectedPalette(palette.id)}
                  className={`flex gap-1 p-2 rounded-lg border-2 transition-colors ${
                    selectedPalette === palette.id
                      ? "border-primary"
                      : "border-muted-foreground/20 hover:border-muted-foreground/40"
                  }`}
                >
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-muted-foreground/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Reference */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Upload Reference</Label>
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:border-muted-foreground/40 transition-colors cursor-pointer">
              <RiUploadCloudLine size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" size="lg">
              <RiSparklingLine size={20} className="mr-2" />
              Generate Design
            </Button>
            <Button variant="outline" size="lg">
              <RiRefreshLine size={20} className="mr-2" />
              Regenerate
            </Button>
            <Button variant="outline" size="lg">
              <RiSettings3Line size={20} className="mr-2" />
              Refine Design
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}