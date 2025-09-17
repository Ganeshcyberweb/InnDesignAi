"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/auth/context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

// Step components
import { RoomTypeStep } from "./steps/RoomTypeStep";
import { RoomSizeStep } from "./steps/RoomSizeStep";
import { StylePreferenceStep } from "./steps/StylePreferenceStep";
import { BudgetStep } from "./steps/BudgetStep";
import { ColorSchemeStep } from "./steps/ColorSchemeStep";
import { MaterialsStep } from "./steps/MaterialsStep";
import { RequirementsStep } from "./steps/RequirementsStep";
import { ImageUploadStep } from "./steps/ImageUploadStep";
import { OnboardingComplete } from "./OnboardingComplete";

export type OnboardingData = {
  roomType: string;
  size: string;
  stylePreference: string;
  budget: string;
  colorScheme: string;
  materialPreferences: string[];
  otherRequirements: string;
  uploadedImageUrl?: string;
};

const STEPS = [
  { id: 'room-type', title: 'Room Type', component: RoomTypeStep },
  { id: 'room-size', title: 'Room Size', component: RoomSizeStep },
  { id: 'style', title: 'Style Preference', component: StylePreferenceStep },
  { id: 'budget', title: 'Budget Range', component: BudgetStep },
  { id: 'colors', title: 'Color Scheme', component: ColorSchemeStep },
  { id: 'materials', title: 'Materials', component: MaterialsStep },
  { id: 'requirements', title: 'Requirements', component: RequirementsStep },
  { id: 'image', title: 'Reference Image', component: ImageUploadStep },
  { id: 'complete', title: 'Complete', component: OnboardingComplete },
];

const STORAGE_KEY = 'inndesign-onboarding-data';

export function OnboardingWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    roomType: '',
    size: '',
    stylePreference: '',
    budget: '',
    colorScheme: '',
    materialPreferences: [],
    otherRequirements: '',
  });

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        setData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved onboarding data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.roomType !== '';
      case 1: return data.size !== '';
      case 2: return data.stylePreference !== '';
      case 3: return data.budget !== '';
      case 4: return data.colorScheme !== '';
      case 5: return data.materialPreferences.length > 0;
      case 6: return true; // Requirements is optional
      case 7: return true; // Image upload is optional
      default: return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/designs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: {
            roomType: data.roomType,
            size: data.size,
            stylePreference: data.stylePreference,
            budget: data.budget,
            colorScheme: data.colorScheme,
            materialPreferences: JSON.stringify(data.materialPreferences),
            otherRequirements: data.otherRequirements,
          },
          uploadedImageUrl: data.uploadedImageUrl,
          inputPrompt: `Create a ${data.stylePreference} ${data.roomType} design for a ${data.size} space with ${data.colorScheme} colors, using ${data.materialPreferences.join(', ')} materials. Budget: ${data.budget}. ${data.otherRequirements ? `Additional requirements: ${data.otherRequirements}` : ''}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create design');
      }

      const result = await response.json();

      // Clear saved data
      localStorage.removeItem(STORAGE_KEY);

      // Redirect to dashboard or design view
      router.push(`/dashboard/designs/${result.id}`);
    } catch (error) {
      console.error('Error creating design:', error);
      // Handle error - could show toast or error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepComponent = STEPS[currentStep];
  const StepComponent = currentStepComponent.component;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Design Preferences</h1>
            <span className="text-sm text-slate-600">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex justify-between mt-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-primary border-blue-600 text-white'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                  initial={false}
                  animate={{
                    scale: index === currentStep ? 1.1 : 1,
                  }}
                >
                  {index < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </motion.div>
                <span className="text-xs text-slate-600 mt-1 text-center max-w-20">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepComponent
                data={data}
                updateData={updateData}
                onNext={nextStep}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Navigation */}
        {!isLastStep && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}