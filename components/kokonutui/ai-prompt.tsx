"use client";

/**
 * @author: @kokonutui
 * @description: AI Prompt Input
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Image, Home, Ruler, Palette, DollarSign, ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { COLOR_PALETTES } from "@/constants/color-palettes";

interface AI_PromptProps {
  formData: {
    prompt: string;
    roomType: string;
    roomSize: string;
    stylePreference: string;
    budgetRange: string;
    colorPalette: string;
  };
  onInputChange: (field: keyof AI_PromptProps['formData'], value: string) => void;
}

export default function AI_Prompt({ formData, onInputChange }: AI_PromptProps) {
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });

    const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
    const colorPaletteRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onInputChange("prompt", "");
            adjustHeight(true);
        }
    };

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

    return (
        <div className="w-full max-w-[2000px]">
            <div className="bg-stone-800/50 rounded-lg border border-stone-700/50 overflow-hidden">
                <div className="relative flex flex-col">
                    <div className="p-4 pb-0">
                        <Textarea
                            id="ai-input-15"
                            value={formData.prompt}
                            placeholder={"Explain your design?"}
                            className={cn(
                                "w-full p-2 border-none bg-transparent shadow-none text-white placeholder:text-stone-500 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                                "min-h-[100px] text-sm"
                            )}
                            ref={textareaRef}
                            onKeyDown={handleKeyDown}
                            onChange={(e) => {
                                onInputChange("prompt", e.target.value);
                                adjustHeight();
                            }}
                        />
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <label
                                className={cn(
                                    "rounded-md p-2 bg-stone-700/50 cursor-pointer border border-stone-600/50",
                                    "hover:bg-stone-600/50 transition-colors",
                                    "text-stone-300 hover:text-white"
                                )}
                                aria-label="Upload image"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Image className="w-4 h-4 transition-colors" />
                            </label>

                            <div className="flex items-center gap-2">
                                <Select
                                    value={formData.roomType}
                                    onValueChange={(value) => onInputChange("roomType", value)}
                                >
                                    <SelectTrigger className={cn(
                                        "flex items-center gap-2 h-8 w-auto px-3 text-xs",
                                        "rounded-md bg-stone-700/50 border border-stone-600/50",
                                        "hover:bg-stone-600/50 transition-colors",
                                        "focus:ring-0 focus:ring-offset-0 text-white"
                                    )}>
                                        <Home className="w-4 h-4 text-stone-300" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="living_room">Living</SelectItem>
                                        <SelectItem value="bedroom">Bedroom</SelectItem>
                                        <SelectItem value="kitchen">Kitchen</SelectItem>
                                        <SelectItem value="bathroom">Bath</SelectItem>
                                        <SelectItem value="dining_room">Dining</SelectItem>
                                        <SelectItem value="office">Office</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={formData.stylePreference}
                                    onValueChange={(value) => onInputChange("stylePreference", value)}
                                >
                                    <SelectTrigger className={cn(
                                        "flex items-center gap-2 h-8 w-auto px-3 text-xs",
                                        "rounded-md bg-stone-700/50 border border-stone-600/50",
                                        "hover:bg-stone-600/50 transition-colors",
                                        "focus:ring-0 focus:ring-offset-0 text-white"
                                    )}>
                                        <Palette className="w-4 h-4 text-stone-300" />
                                        <SelectValue />
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

                                <Select
                                    value={formData.budgetRange}
                                    onValueChange={(value) => onInputChange("budgetRange", value)}
                                >
                                    <SelectTrigger className={cn(
                                        "flex items-center gap-2 h-8 w-auto px-3 text-xs",
                                        "rounded-md bg-stone-700/50 border border-stone-600/50",
                                        "hover:bg-stone-600/50 transition-colors",
                                        "focus:ring-0 focus:ring-offset-0 text-white"
                                    )}>
                                        <DollarSign className="w-4 h-4 text-stone-300" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="$500 - $1,000">$500-1K</SelectItem>
                                        <SelectItem value="$1,000 - $5,000">$1K-5K</SelectItem>
                                        <SelectItem value="$5,000 - $15,000">$5K-15K</SelectItem>
                                        <SelectItem value="$15,000 - $30,000">$15K-30K</SelectItem>
                                        <SelectItem value="$30,000+">$30K+</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Color Palette */}
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
                            </div>
                        </div>

                        <button
                            type="button"
                            className={cn(
                                "rounded-md p-2 bg-stone-700/50 border border-stone-600/50",
                                "hover:bg-stone-600/50 transition-colors",
                                "focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                            )}
                            aria-label="Send message"
                            disabled={!formData.prompt.trim()}
                        >
                            <ArrowRight
                                className={cn(
                                    "w-4 h-4 text-white transition-opacity duration-200",
                                    formData.prompt.trim()
                                        ? "opacity-100"
                                        : "opacity-30"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
