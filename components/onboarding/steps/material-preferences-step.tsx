"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import {
  OnboardingFormData,
  MATERIAL_OPTIONS,
} from "@/lib/validations/onboarding";

const MATERIAL_INFO = {
  Wood: {
    description: "Natural warmth and timeless appeal",
    characteristics: ["warm", "natural", "versatile"],
    icon: "🌳",
  },
  Metal: {
    description: "Modern industrial strength and sleekness",
    characteristics: ["modern", "durable", "sleek"],
    icon: "⚙️",
  },
  Glass: {
    description: "Light, airy, and contemporary feel",
    characteristics: ["light", "modern", "clean"],
    icon: "✨",
  },
  Stone: {
    description: "Solid, luxurious, and enduring",
    characteristics: ["luxurious", "durable", "natural"],
    icon: "🗿",
  },
  Fabric: {
    description: "Soft comfort and endless pattern possibilities",
    characteristics: ["comfortable", "colorful", "cozy"],
    icon: "🧶",
  },
  Leather: {
    description: "Sophisticated luxury with character",
    characteristics: ["luxurious", "sophisticated", "aging"],
    icon: "👜",
  },
  Concrete: {
    description: "Raw industrial aesthetic",
    characteristics: ["industrial", "raw", "modern"],
    icon: "🏗️",
  },
  Marble: {
    description: "Elegant luxury with unique patterns",
    characteristics: ["elegant", "luxurious", "unique"],
    icon: "💎",
  },
  Ceramic: {
    description: "Clean, durable, and design-flexible",
    characteristics: ["clean", "durable", "versatile"],
    icon: "🏺",
  },
  Bamboo: {
    description: "Sustainable and naturally beautiful",
    characteristics: ["sustainable", "natural", "light"],
    icon: "🎋",
  },
  Rattan: {
    description: "Casual tropical and bohemian charm",
    characteristics: ["casual", "tropical", "bohemian"],
    icon: "🪑",
  },
  Velvet: {
    description: "Luxurious texture and rich depth",
    characteristics: ["luxurious", "rich", "textured"],
    icon: "👗",
  },
  Linen: {
    description: "Relaxed elegance and natural comfort",
    characteristics: ["relaxed", "natural", "breathable"],
    icon: "🌾",
  },
  Wool: {
    description: "Cozy warmth and natural insulation",
    characteristics: ["cozy", "warm", "natural"],
    icon: "🐑",
  },
} as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export function MaterialPreferencesStep() {
  const { watch, setValue } = useFormContext<OnboardingFormData>();
  const selectedMaterials = watch("materialPreferences") || [];

  const handleMaterialToggle = (material: string) => {
    const currentMaterials = selectedMaterials || [];
    let newMaterials;

    if (currentMaterials.includes(material)) {
      newMaterials = currentMaterials.filter(m => m !== material);
    } else {
      newMaterials = [...currentMaterials, material];
    }

    setValue("materialPreferences", newMaterials, { shouldValidate: true });
  };

  const handleClearAll = () => {
    setValue("materialPreferences", [], { shouldValidate: true });
  };

  const handleSkip = () => {
    setValue("materialPreferences", undefined, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">
          Select materials that appeal to you. We'll incorporate these into our recommendations.
        </p>
        <p className="text-sm text-muted-foreground">
          You can select multiple materials or skip this step entirely.
        </p>
      </div>

      {selectedMaterials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <div>
            <p className="text-primary font-medium">
              {selectedMaterials.length} material{selectedMaterials.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-primary text-sm">
              {selectedMaterials.join(", ")}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-primary border-primary/30 hover:bg-primary/10"
          >
            Clear All
          </Button>
        </motion.div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {MATERIAL_OPTIONS.map((material) => {
          const info = MATERIAL_INFO[material];
          const isSelected = selectedMaterials.includes(material);

          return (
            <motion.div key={material} variants={item}>
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  isSelected
                    ? "ring-2 ring-blue-500 border-primary/20 bg-primary/5"
                    : "hover:border-gray-300"
                )}
                onClick={() => handleMaterialToggle(material)}
              >
                <CardContent className="p-4 text-center">
                  <motion.div
                    className="text-2xl mb-2"
                    whileHover={{ scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {info.icon}
                  </motion.div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{material}</h3>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Check className="w-4 h-4 text-primary" />
                      </motion.div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">
                    {info.description}
                  </p>

                  <div className="flex flex-wrap gap-1 justify-center">
                    {info.characteristics.slice(0, 2).map((char) => (
                      <Badge
                        key={char}
                        variant="outline"
                        className="text-xs capitalize"
                      >
                        {char}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {selectedMaterials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <p className="text-primary font-medium">
            Great selections! We'll focus on {selectedMaterials.join(", ")} in our recommendations.
          </p>
          <p className="text-primary text-sm mt-1">
            These materials will help create the perfect texture mix for your space.
          </p>
        </motion.div>
      )}

      <div className="text-center space-y-2">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          Skip - Surprise me with materials
        </Button>
        <p className="text-xs text-muted-foreground">
          Our AI will select complementary materials based on your style preferences
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-700 text-sm">
          <strong>Material Mixing Tip:</strong> The best designs often combine 2-4 different materials
          for visual interest and tactile appeal. We'll help you find the perfect balance!
        </p>
      </div>
    </div>
  );
}