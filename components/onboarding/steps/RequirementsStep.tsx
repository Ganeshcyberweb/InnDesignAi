"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileText, Lightbulb, Users, Heart } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface RequirementsStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  onNext: () => void;
}

const SUGGESTION_PROMPTS = [
  {
    icon: Users,
    text: "Space is used by 2 adults and 1 child",
    category: "Family"
  },
  {
    icon: Heart,
    text: "Must be pet-friendly for our dog",
    category: "Pets"
  },
  {
    icon: Lightbulb,
    text: "Need good lighting for reading",
    category: "Lighting"
  },
  {
    icon: FileText,
    text: "Require extra storage solutions",
    category: "Storage"
  }
];

export function RequirementsStep({ data, updateData, onNext }: RequirementsStepProps) {
  const handleTextChange = (value: string) => {
    updateData('otherRequirements', value);
  };

  const addSuggestion = (suggestion: string) => {
    const currentText = data.otherRequirements || '';
    const newText = currentText ? `${currentText}\n${suggestion}` : suggestion;
    handleTextChange(newText);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Any special requirements?
          </h2>
          <p className="text-slate-600 text-lg">
            Share any specific needs, constraints, or preferences (optional)
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-6">
          <div className="space-y-4">
            <Label htmlFor="requirements" className="text-base font-medium">
              Additional Requirements & Notes
            </Label>

            <textarea
              id="requirements"
              value={data.otherRequirements || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Example: The room needs to accommodate a home office setup, has limited natural light, or needs to be child-safe..."
              className="w-full h-32 p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
            />

            <div className="flex justify-between text-sm text-slate-500">
              <span>Optional - you can skip this step</span>
              <span>{(data.otherRequirements || '').length}/500</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick suggestion prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-4">
          <p className="text-sm text-slate-600">Quick suggestions to get you started:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SUGGESTION_PROMPTS.map((prompt, index) => {
            const Icon = prompt.icon;

            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addSuggestion(prompt.text)}
                className="p-3 text-left border border-slate-200 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-700 group-hover:text-primary">
                      {prompt.text}
                    </p>
                    <span className="text-xs text-slate-500 group-hover:text-primary">
                      {prompt.category}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Examples section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-4 bg-slate-50 border-slate-200">
          <h4 className="font-medium text-slate-900 mb-2">Examples of helpful details:</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Room dimensions or layout constraints</li>
            <li>• Specific furniture pieces you want to keep</li>
            <li>• Accessibility requirements</li>
            <li>• Entertainment or work needs</li>
            <li>• Storage requirements</li>
            <li>• Lighting preferences or limitations</li>
          </ul>
        </Card>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center"
      >
        <Button
          onClick={onNext}
          size="lg"
          className="px-8"
        >
          {data.otherRequirements ? 'Continue with Requirements' : 'Skip This Step'}
        </Button>

        {data.otherRequirements && (
          <p className="text-primary font-medium mt-2 text-sm">
            ✓ Requirements added
          </p>
        )}
      </motion.div>
    </div>
  );
}