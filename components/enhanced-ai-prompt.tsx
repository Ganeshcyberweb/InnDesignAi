"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowRight,
  Image,
  Home,
  Ruler,
  Palette,
  DollarSign,
  ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { COLOR_PALETTES } from "@/constants/color-palettes";
import type { FileUIPart } from "ai";

// Import the ai-elements components
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  PromptInputButton,
  PromptInputSubmit,
  PromptInputAttachments,
  PromptInputAttachment,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

interface EnhancedAIPromptProps {
  formData: {
    prompt: string;
    roomType: string;
    roomSize: string;
    stylePreference: string;
    budgetRange: string;
    colorPalette: string;
  };
  onInputChange: (field: keyof EnhancedAIPromptProps['formData'], value: string) => void;
  onSubmit?: (message: PromptInputMessage) => void;
}

export default function EnhancedAIPrompt({
  formData,
  onInputChange,
  onSubmit
}: EnhancedAIPromptProps) {
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const colorPaletteRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPaletteRef.current && !colorPaletteRef.current.contains(event.target as Node)) {
        setIsColorPaletteOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedPalette = COLOR_PALETTES.find(palette => palette.id === formData.colorPalette) || COLOR_PALETTES[0];

  const handleSubmit = (message: PromptInputMessage) => {
    // Update the prompt in the form data
    onInputChange("prompt", message.text || "");

    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(message);
    }

    // Clear the prompt after submission (like in original component)
    setTimeout(() => {
      onInputChange("prompt", "");
    }, 100);
  };

  return (
    <div className="w-full max-w-[2000px]">
      <PromptInput
        className={cn(
          "bg-stone-800/50 border-stone-700/50 shadow-lg",
          "divide-stone-700/50"
        )}
        onSubmit={handleSubmit}
        accept="image/*"
        multiple
        maxFiles={5}
        maxFileSize={10 * 1024 * 1024} // 10MB
      >
        <PromptInputBody className="space-y-0">
          {/* File Attachments */}
          <PromptInputAttachments>
            {(attachment) => (
              <PromptInputAttachment
                key={attachment.id}
                data={attachment}
                className="border-stone-600/50 bg-stone-700/30"
              />
            )}
          </PromptInputAttachments>

          {/* Main Textarea */}
          <PromptInputTextarea
            placeholder="Explain your design?"
            value={formData.prompt}
            onChange={(e) => onInputChange("prompt", e.target.value)}
            className={cn(
              "text-white placeholder:text-stone-500 bg-transparent",
              "min-h-[100px] text-sm border-none shadow-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "resize-none"
            )}
          />

          {/* Toolbar with Design Form Fields */}
          <PromptInputToolbar className="bg-transparent p-4 pt-0">
            <PromptInputTools className="flex-wrap gap-2">
              {/* File Upload Button */}
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger
                  className={cn(
                    "h-8 px-3 text-xs rounded-md",
                    "bg-stone-700/50 border-stone-600/50 text-stone-300",
                    "hover:bg-stone-600/50 hover:text-white",
                    "transition-colors"
                  )}
                >
                  <Image className="w-4 h-4" />
                </PromptInputActionMenuTrigger>
                <PromptInputActionMenuContent className="bg-stone-800 border-stone-700">
                  <PromptInputActionAddAttachments className="text-stone-300 hover:bg-stone-700/50 hover:text-white" />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>

              {/* Room Type Select */}
              <Select
                value={formData.roomType}
                onValueChange={(value) => onInputChange("roomType", value)}
              >
                <SelectTrigger className={cn(
                  "flex items-center gap-2 h-8 w-auto px-3 text-xs",
                  "rounded-md bg-stone-700/50 border-stone-600/50",
                  "hover:bg-stone-600/50 transition-colors",
                  "focus:ring-0 focus:ring-offset-0 text-white"
                )}>
                  <Home className="w-4 h-4 text-stone-300" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-800 border-stone-700">
                  <SelectItem value="living_room">Living</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bathroom">Bath</SelectItem>
                  <SelectItem value="dining_room">Dining</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>

              {/* Style Preference Select */}
              <Select
                value={formData.stylePreference}
                onValueChange={(value) => onInputChange("stylePreference", value)}
              >
                <SelectTrigger className={cn(
                  "flex items-center gap-2 h-8 w-auto px-3 text-xs",
                  "rounded-md bg-stone-700/50 border-stone-600/50",
                  "hover:bg-stone-600/50 transition-colors",
                  "focus:ring-0 focus:ring-offset-0 text-white"
                )}>
                  <Palette className="w-4 h-4 text-stone-300" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-800 border-stone-700">
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="scandinavian">Scandinavian</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="bohemian">Bohemian</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>

              {/* Budget Range Select */}
              <Select
                value={formData.budgetRange}
                onValueChange={(value) => onInputChange("budgetRange", value)}
              >
                <SelectTrigger className={cn(
                  "flex items-center gap-2 h-8 w-auto px-3 text-xs",
                  "rounded-md bg-stone-700/50 border-stone-600/50",
                  "hover:bg-stone-600/50 transition-colors",
                  "focus:ring-0 focus:ring-offset-0 text-white"
                )}>
                  <DollarSign className="w-4 h-4 text-stone-300" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-stone-800 border-stone-700">
                  <SelectItem value="$500 - $1,000">$500-1K</SelectItem>
                  <SelectItem value="$1,000 - $5,000">$1K-5K</SelectItem>
                  <SelectItem value="$5,000 - $15,000">$5K-15K</SelectItem>
                  <SelectItem value="$15,000 - $30,000">$15K-30K</SelectItem>
                  <SelectItem value="$30,000+">$30K+</SelectItem>
                </SelectContent>
              </Select>

              {/* Color Palette Selector */}
              <div className="relative" ref={colorPaletteRef}>
                <button
                  type="button"
                  onClick={() => setIsColorPaletteOpen(!isColorPaletteOpen)}
                  className={cn(
                    "flex items-center gap-2 h-8 px-3 text-xs",
                    "rounded-md bg-stone-700/50 border border-stone-600/50",
                    "hover:bg-stone-600/50 transition-colors",
                    "focus:ring-0 focus:ring-offset-0 text-white"
                  )}
                >
                  <div className="flex gap-1">
                    {selectedPalette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full border border-stone-600/50"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <ChevronDown className={cn(
                    "w-3 h-3 text-stone-300 transition-transform",
                    isColorPaletteOpen && "rotate-180"
                  )} />
                </button>

                {isColorPaletteOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-stone-800 border border-stone-700 rounded-md shadow-lg z-50 min-w-[200px]">
                    <div className="p-2">
                      <div className="text-xs text-stone-300 mb-2 px-2">Color Palette</div>
                      {COLOR_PALETTES.map((palette) => (
                        <button
                          key={palette.id}
                          onClick={() => {
                            onInputChange("colorPalette", palette.id);
                            setIsColorPaletteOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 p-2 rounded-md text-xs hover:bg-stone-700/50 transition-colors",
                            formData.colorPalette === palette.id && "bg-stone-700/50"
                          )}
                        >
                          <div className="flex gap-1">
                            {palette.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-stone-600/50"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="text-white">{palette.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Room Size Input */}
              <div className={cn(
                "flex items-center gap-2 h-8 px-3 text-xs",
                "rounded-md bg-stone-700/50 border border-stone-600/50",
                "hover:bg-stone-600/50 transition-colors"
              )}>
                <Ruler className="w-4 h-4 text-stone-300" />
                <Input
                  type="number"
                  placeholder="Room size"
                  value={formData.roomSize}
                  onChange={(e) => onInputChange("roomSize", e.target.value)}
                  className="h-6 w-16 text-xs border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-center text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs text-stone-300">sq ft</span>
              </div>
            </PromptInputTools>

            {/* Submit Button */}
            <PromptInputSubmit
              className={cn(
                "h-8 w-8 rounded-md",
                "bg-stone-700/50 border-stone-600/50",
                "hover:bg-stone-600/50 transition-colors",
                "disabled:opacity-30"
              )}
              disabled={!formData.prompt.trim()}
            >
              <ArrowRight className="w-4 h-4 text-white" />
            </PromptInputSubmit>
          </PromptInputToolbar>
        </PromptInputBody>
      </PromptInput>
    </div>
  );
}