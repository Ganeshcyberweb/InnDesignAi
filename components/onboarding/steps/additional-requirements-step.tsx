"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageSquare, Lightbulb, Home, Heart } from "lucide-react";
import {
  OnboardingFormData,
} from "@/lib/validations/onboarding";

const QUICK_REQUIREMENTS = [
  "Pet-friendly materials",
  "Child-safe design",
  "Wheelchair accessible",
  "Easy to clean",
  "Lots of storage",
  "Home office space",
  "Entertainment area",
  "Reading nook",
  "Plant-friendly",
  "Minimalist approach",
  "Vintage touches",
  "Smart home integration",
] as const;

const INSPIRATION_PROMPTS = [
  "What activities will happen in this space?",
  "Do you have any specific furniture pieces you love?",
  "Are there any colors you absolutely want to avoid?",
  "Do you need storage solutions for specific items?",
  "Any architectural features you want to highlight?",
  "Lighting preferences (bright, ambient, natural)?",
] as const;

export function AdditionalRequirementsStep() {
  const { watch, setValue, register } = useFormContext<OnboardingFormData>();
  const requirements = watch("otherRequirements") || "";

  const handleQuickAdd = (requirement: string) => {
    const currentRequirements = requirements.trim();
    const newRequirement = currentRequirements
      ? `${currentRequirements}\n• ${requirement}`
      : `• ${requirement}`;

    setValue("otherRequirements", newRequirement, { shouldValidate: true });
  };

  const handleClear = () => {
    setValue("otherRequirements", "", { shouldValidate: true });
  };

  const handleSkip = () => {
    setValue("otherRequirements", undefined, { shouldValidate: true });
  };

  const characterCount = requirements.length;
  const isNearLimit = characterCount > 800;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">
          Share any specific needs, preferences, or constraints for your space.
        </p>
        <p className="text-sm text-muted-foreground">
          The more details you provide, the better we can tailor our recommendations!
        </p>
      </div>

      {/* Quick Add Suggestions */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-medium">Quick Add Common Requirements</h3>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {QUICK_REQUIREMENTS.map((requirement) => (
              <motion.div
                key={requirement}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAdd(requirement)}
                  className="w-full text-left justify-start text-xs hover:bg-primary/5 hover:border-primary/20"
                >
                  {requirement}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>

      {/* Main Text Area */}
      <div className="space-y-3">
        <Label htmlFor="requirements" className="text-base font-medium">
          Additional Requirements & Notes
        </Label>

        <div className="relative">
          <textarea
            {...register("otherRequirements")}
            id="requirements"
            placeholder="Tell us about any specific needs, preferences, or constraints for your space..."
            className={cn(
              "w-full min-h-[120px] p-4 rounded-lg border border-gray-300",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "resize-y transition-colors",
              isNearLimit && "border-yellow-400 focus:ring-yellow-500"
            )}
            maxLength={1000}
          />

          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
            {characterCount}/1000
          </div>
        </div>

        {requirements.trim() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex justify-end"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all text
            </Button>
          </motion.div>
        )}
      </div>

      {/* Inspiration Prompts */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium text-purple-800">Need Inspiration?</h3>
          </div>

          <div className="space-y-2">
            {INSPIRATION_PROMPTS.map((prompt, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-sm text-purple-700 flex items-start space-x-2"
              >
                <span className="text-purple-400 mt-1">•</span>
                <span>{prompt}</span>
              </motion.p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Requirements Preview */}
      {requirements.trim() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <div className="flex items-center space-x-2 mb-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h4 className="font-medium text-green-800">Your Requirements</h4>
          </div>
          <div className="text-sm text-primary whitespace-pre-line">
            {requirements}
          </div>
        </motion.div>
      )}

      {/* Skip Option */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          Skip - No specific requirements
        </Button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <p className="text-primary text-sm">
          <strong>Pro tip:</strong> Specific requirements help our AI avoid suggesting
          items that won't work for your lifestyle. Even small details matter!
        </p>
      </div>
    </div>
  );
}