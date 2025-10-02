"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  RiSparklingLine,
  RiRefreshLine,
  RiSettings3Line,
  RiUploadCloudLine,
} from "@remixicon/react";
import { Mountain } from "lucide-react";
import { useDesignFormStore, useUIStore } from "@/stores";
import EnhancedAIPrompt from "@/components/enhanced-ai-prompt";
import { COLOR_PALETTES } from "@/constants/color-palettes";

const STYLE_TABS = [
  { id: "style-a", label: "Style A" },
  { id: "style-b", label: "Style B" },
  { id: "style-c", label: "Style C" },
];


export default function DesignStudio() {
  const { formData, updateField } = useDesignFormStore();
  const { selectedPalette, setSelectedPalette } = useUIStore();
  const [activeTab, setActiveTab] = useState("style-a");

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    updateField(field, value);
  };

  const renderDesignPlaceholder = () => {
    return (
      <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-16 text-center hover:border-muted-foreground/40 transition-colors">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-lg bg-muted/20 flex items-center justify-center">
            <Mountain size={32} className="text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">Main Design View</h3>
            <p className="text-sm text-muted-foreground">AI-generated room design will appear here</p>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold">Explain your design...</h2>
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
        {renderDesignPlaceholder()}
      </div>

      {/* Project Details */}
      <div className="rounded-lg my-6">
        <div className="space-y-6">
          {/* AI Prompt */}
          <EnhancedAIPrompt
            formData={formData}
            onInputChange={handleInputChange}
          />

          <div>
            <Label className="text-sm font-medium mb-2 block">Upload Reference</Label>
            <div className="border-2 w-fit border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:border-muted-foreground/40 transition-colors cursor-pointer">
              <RiUploadCloudLine size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
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