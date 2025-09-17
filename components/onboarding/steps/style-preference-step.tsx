"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  OnboardingFormData,
  StylePreference,
  STYLE_INFO,
} from "@/lib/validations/onboarding";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StylePreferenceStep() {
  const { watch, setValue } = useFormContext<OnboardingFormData>();
  const selectedStyle = watch("stylePreference");

  const handleStyleSelect = (style: StylePreference) => {
    setValue("stylePreference", style, { shouldValidate: true });
  };

  const styles = Object.entries(STYLE_INFO) as [StylePreference, typeof STYLE_INFO[StylePreference]][];

  return (
    <div className="space-y-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {styles.map(([key, info]) => (
          <motion.div key={key} variants={item}>
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md h-full",
                selectedStyle === key
                  ? "ring-2 ring-blue-500 border-primary/20 bg-primary/5"
                  : "hover:border-gray-300"
              )}
              onClick={() => handleStyleSelect(key)}
            >
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{info.label}</h3>
                  {selectedStyle === key && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        Selected
                      </Badge>
                    </motion.div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  {info.description}
                </p>

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

                {selectedStyle === key && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-primary/20"
                  >
                    <p className="text-xs text-primary">
                      Great choice! This style will guide our design recommendations.
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selectedStyle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <p className="text-primary font-medium">
            Excellent! {STYLE_INFO[selectedStyle].label} style it is.
          </p>
          <p className="text-primary text-sm mt-1">
            We'll incorporate {STYLE_INFO[selectedStyle].keywords.join(", ")} elements into your design.
          </p>
        </motion.div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Your style preference helps us curate furniture, colors, and decor that match your vision.
        </p>
      </div>
    </div>
  );
}