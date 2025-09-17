"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Palette, CheckCircle } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface ColorSchemeStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  onNext: () => void;
}

const COLOR_SCHEMES = [
  {
    id: 'neutral',
    label: 'Neutral',
    description: 'Timeless beiges, grays, and whites',
    colors: ['#F5F5F0', '#E8E6E1', '#D4CFC7', '#8B8680'],
    mood: 'Calm & Versatile'
  },
  {
    id: 'warm',
    label: 'Warm',
    description: 'Cozy oranges, reds, and earth tones',
    colors: ['#F4E4C1', '#E6B17A', '#D4956B', '#8B4513'],
    mood: 'Inviting & Energetic'
  },
  {
    id: 'cool',
    label: 'Cool',
    description: 'Refreshing blues, greens, and purples',
    colors: ['#E8F4F8', '#B8D4E3', '#7BA7BC', '#4A628A'],
    mood: 'Serene & Fresh'
  },
  {
    id: 'bold',
    label: 'Bold',
    description: 'Vibrant and statement-making colors',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
    mood: 'Dynamic & Confident'
  },
  {
    id: 'monochrome',
    label: 'Monochrome',
    description: 'Classic black, white, and gray palette',
    colors: ['#FFFFFF', '#F0F0F0', '#808080', '#2C2C2C'],
    mood: 'Sophisticated & Modern'
  }
];

export function ColorSchemeStep({ data, updateData, onNext }: ColorSchemeStepProps) {
  const handleSelect = (colorScheme: string) => {
    updateData('colorScheme', colorScheme);
    // Auto-advance after selection with slight delay for visual feedback
    setTimeout(onNext, 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Palette className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Choose your color palette
          </h2>
          <p className="text-slate-600 text-lg">
            Select colors that reflect your personality and mood
          </p>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {COLOR_SCHEMES.map((scheme, index) => {
          const isSelected = data.colorScheme === scheme.id;

          return (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? 'ring-2 ring-blue-500 bg-primary/5 border-primary/20'
                    : 'hover:border-slate-300'
                }`}
                onClick={() => handleSelect(scheme.id)}
              >
                <div className="space-y-4">
                  {/* Color palette preview */}
                  <div className="relative">
                    <div className="flex h-20 rounded-lg overflow-hidden">
                      {scheme.colors.map((color, colorIndex) => (
                        <motion.div
                          key={colorIndex}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 * index + 0.05 * colorIndex }}
                        />
                      ))}
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-primary/50 bg-opacity-20 rounded-lg flex items-center justify-center"
                      >
                        <CheckCircle className="w-8 h-8 text-primary" />
                      </motion.div>
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className="font-semibold text-lg text-slate-900 mb-1">
                      {scheme.label}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">
                      {scheme.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                      {scheme.mood}
                    </span>
                  </div>

                  {/* Individual color swatches with hex codes */}
                  <div className="grid grid-cols-4 gap-1">
                    {scheme.colors.map((color, colorIndex) => (
                      <motion.div
                        key={colorIndex}
                        className="aspect-square rounded-md border border-slate-200 relative group"
                        style={{ backgroundColor: color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 * index + 0.05 * colorIndex }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-md flex items-center justify-center">
                          <span className="text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            {color}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mx-auto"
                    >
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {data.colorScheme && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-primary font-medium">
            ✓ {COLOR_SCHEMES.find(c => c.id === data.colorScheme)?.label} palette selected
          </p>
        </motion.div>
      )}
    </div>
  );
}