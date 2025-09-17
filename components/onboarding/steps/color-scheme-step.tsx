"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import {
  OnboardingFormData,
  ColorScheme,
} from "@/lib/validations/onboarding";

const COLOR_SCHEME_INFO = {
  neutral: {
    label: "Neutral",
    description: "Timeless whites, grays, and beiges",
    colors: ["#F8F9FA", "#E9ECEF", "#DEE2E6", "#ADB5BD", "#6C757D"],
    keywords: ["timeless", "versatile", "calming"],
  },
  warm: {
    label: "Warm",
    description: "Cozy browns, oranges, and golden tones",
    colors: ["#FFF8E1", "#FFE082", "#FF8A65", "#D4A574", "#8D6E63"],
    keywords: ["cozy", "inviting", "comfortable"],
  },
  cool: {
    label: "Cool",
    description: "Refreshing blues, greens, and purples",
    colors: ["#E3F2FD", "#81C784", "#64B5F6", "#7986CB", "#9575CD"],
    keywords: ["refreshing", "serene", "modern"],
  },
  bold: {
    label: "Bold",
    description: "Vibrant and energetic statement colors",
    colors: ["#FF5722", "#E91E63", "#9C27B0", "#3F51B5", "#FF9800"],
    keywords: ["energetic", "confident", "dramatic"],
  },
  monochrome: {
    label: "Monochrome",
    description: "Classic black, white, and gray palette",
    colors: ["#000000", "#424242", "#757575", "#BDBDBD", "#FFFFFF"],
    keywords: ["classic", "sophisticated", "minimal"],
  },
  earthy: {
    label: "Earthy",
    description: "Natural greens, browns, and earth tones",
    colors: ["#8BC34A", "#795548", "#FF8F00", "#689F38", "#5D4037"],
    keywords: ["natural", "grounding", "organic"],
  },
  pastels: {
    label: "Pastels",
    description: "Soft, muted colors with gentle appeal",
    colors: ["#F8BBD0", "#C8E6C9", "#DCEDC8", "#FFE0B2", "#D1C4E9"],
    keywords: ["soft", "gentle", "dreamy"],
  },
} as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

export function ColorSchemeStep() {
  const { watch, setValue } = useFormContext<OnboardingFormData>();
  const selectedColorScheme = watch("colorScheme");

  const handleColorSchemeSelect = (colorScheme: ColorScheme) => {
    setValue("colorScheme", colorScheme, { shouldValidate: true });
  };

  const handleSkip = () => {
    setValue("colorScheme", undefined, { shouldValidate: true });
  };

  const colorSchemes = Object.entries(COLOR_SCHEME_INFO) as [
    ColorScheme,
    typeof COLOR_SCHEME_INFO[ColorScheme]
  ][];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">
          Choose a color direction that speaks to you, or skip if you're unsure.
        </p>
        <p className="text-sm text-muted-foreground">
          We can always adjust colors later based on your preferences!
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {colorSchemes.map(([key, info]) => (
          <motion.div key={key} variants={item}>
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedColorScheme === key
                  ? "ring-2 ring-primary border-primary/20 bg-primary/5"
                  : "hover:border-border"
              )}
              onClick={() => handleColorSchemeSelect(key)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{info.label}</h3>
                  {selectedColorScheme === key && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-2"
                    >
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        Selected
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSkip();
                        }}
                        className="h-6 w-6 p-0 hover:bg-primary/20"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {info.description}
                </p>

                {/* Color Palette Preview */}
                <div className="flex space-x-1 mb-4">
                  {info.colors.map((color, index) => (
                    <motion.div
                      key={color}
                      className="flex-1 h-8 rounded"
                      style={{ backgroundColor: color }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                    />
                  ))}
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1">
                  {info.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selectedColorScheme && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <p className="text-primary font-medium">
            Beautiful choice! {COLOR_SCHEME_INFO[selectedColorScheme].label} colors will create a {COLOR_SCHEME_INFO[selectedColorScheme].keywords[0]} atmosphere.
          </p>
          <p className="text-primary/80 text-sm mt-1">
            We'll incorporate these tones throughout your design recommendations.
          </p>
        </motion.div>
      )}

      <div className="text-center">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          Skip - I'll decide on colors later
        </Button>
      </div>

      <div className="bg-accent/50 border border-accent rounded-lg p-4">
        <p className="text-accent-foreground text-sm">
          <strong>Color Psychology Tip:</strong> Colors can dramatically affect mood and perception of space.
          We'll help you choose the perfect palette for your lifestyle and goals.
        </p>
      </div>
    </div>
  );
}