"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import {
  OnboardingFormData,
  onboardingFormSchema,
  ONBOARDING_STEPS,
  OnboardingStep,
} from "@/lib/validations/onboarding";

// Import step components (we'll create these next)
import { RoomTypeStep } from "./steps/room-type-step";
import { RoomSizeStep } from "./steps/room-size-step";
import { StylePreferenceStep } from "./steps/style-preference-step";
import { BudgetRangeStep } from "./steps/budget-range-step";
import { ColorSchemeStep } from "./steps/color-scheme-step";
import { MaterialPreferencesStep } from "./steps/material-preferences-step";
import { AdditionalRequirementsStep } from "./steps/additional-requirements-step";
import { ImageUploadStep } from "./steps/image-upload-step";
import { OnboardingComplete } from "./onboarding-complete";

const STORAGE_KEY = "inndesign-onboarding-draft";

interface OnboardingWizardProps {
  onComplete: (data: OnboardingFormData) => Promise<void>;
  isLoading?: boolean;
}

export function OnboardingWizard({ onComplete, isLoading }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema),
    mode: "onChange",
    defaultValues: {
      materialPreferences: [],
    },
  });

  const { watch, trigger } = form;
  const watchedValues = watch();

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);

        // Mark completed steps based on saved data
        const completed = new Set<number>();
        ONBOARDING_STEPS.forEach((step, index) => {
          if (isStepValid(index, parsedData)) {
            completed.add(index);
          }
        });
        setCompletedSteps(completed);
      } catch (error) {
        console.error("Failed to load saved onboarding data:", error);
      }
    }
  }, [form]);

  // Save draft to localStorage on form changes
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Check if a step is valid
  const isStepValid = (stepIndex: number, data?: OnboardingFormData): boolean => {
    const step = ONBOARDING_STEPS[stepIndex];
    const currentData = data || watchedValues;

    switch (step.component) {
      case "RoomTypeStep":
        return !!currentData.roomType;
      case "RoomSizeStep":
        return !!currentData.size;
      case "StylePreferenceStep":
        return !!currentData.stylePreference;
      case "BudgetRangeStep":
        return !!currentData.budget;
      case "ColorSchemeStep":
        return step.isOptional || !!currentData.colorScheme;
      case "MaterialPreferencesStep":
        return step.isOptional || (currentData.materialPreferences?.length ?? 0) > 0;
      case "AdditionalRequirementsStep":
        return step.isOptional || !!currentData.otherRequirements;
      case "ImageUploadStep":
        return step.isOptional || !!currentData.uploadedImageUrl;
      default:
        return false;
    }
  };

  const canProceed = (): boolean => {
    return isStepValid(currentStep) || ONBOARDING_STEPS[currentStep].isOptional;
  };

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid && canProceed()) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));

      if (currentStep === ONBOARDING_STEPS.length - 1) {
        // Submit form
        try {
          await onComplete(watchedValues);
          setIsCompleted(true);
          localStorage.removeItem(STORAGE_KEY); // Clear draft
        } catch (error) {
          console.error("Failed to submit onboarding:", error);
        }
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow jumping to any previous step or the next step if current is valid
    if (stepIndex <= currentStep || (stepIndex === currentStep + 1 && canProceed())) {
      setCurrentStep(stepIndex);
    }
  };

  const renderStepComponent = () => {
    const step = ONBOARDING_STEPS[currentStep];

    switch (step.component) {
      case "RoomTypeStep":
        return <RoomTypeStep />;
      case "RoomSizeStep":
        return <RoomSizeStep />;
      case "StylePreferenceStep":
        return <StylePreferenceStep />;
      case "BudgetRangeStep":
        return <BudgetRangeStep />;
      case "ColorSchemeStep":
        return <ColorSchemeStep />;
      case "MaterialPreferencesStep":
        return <MaterialPreferencesStep />;
      case "AdditionalRequirementsStep":
        return <AdditionalRequirementsStep />;
      case "ImageUploadStep":
        return <ImageUploadStep />;
      default:
        return <div>Step not found</div>;
    }
  };

  const progressPercentage = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;
  const currentStepData = ONBOARDING_STEPS[currentStep];

  if (isCompleted) {
    return <OnboardingComplete data={watchedValues} />;
  }

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Let's Design Your Perfect Space
            </h1>
            <p className="text-muted-foreground">
              Tell us about your vision and we'll create personalized design recommendations
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="flex space-x-2 min-w-max px-4">
              {ONBOARDING_STEPS.map((step, index) => (
                <motion.button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm transition-colors ${
                    index === currentStep
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : completedSteps.has(index)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : index < currentStep
                      ? "bg-muted text-muted-foreground hover:bg-border"
                      : "bg-muted text-muted-foreground"
                  }`}
                  disabled={index > currentStep && !(index === currentStep + 1 && canProceed())}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {completedSteps.has(index) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="w-4 h-4 text-center text-xs font-medium">
                      {step.id}
                    </span>
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                  {step.isOptional && (
                    <Badge variant="secondary" className="text-xs">
                      Optional
                    </Badge>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">
                {currentStepData.title}
                {currentStepData.isOptional && (
                  <Badge variant="outline" className="ml-2">
                    Optional
                  </Badge>
                )}
              </CardTitle>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepComponent()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {currentStepData.isOptional && "This step is optional - you can skip it"}
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed() && !currentStepData.isOptional}
              className="flex items-center space-x-2"
              loading={isLoading}
            >
              <span>
                {currentStep === ONBOARDING_STEPS.length - 1 ? "Complete" : "Next"}
              </span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Draft Save Indicator */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground">
              Your progress is automatically saved as you go
            </p>
          </div>
        </motion.div>
      </div>
    </FormProvider>
  );
}