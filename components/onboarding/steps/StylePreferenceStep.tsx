"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Palette, Sparkles } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface StylePreferenceStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  onNext: () => void;
}

const STYLES = [
  {
    id: 'modern',
    label: 'Modern',
    description: 'Clean lines, minimalist aesthetics, contemporary feel',
    gradient: 'bg-gradient-to-br from-slate-100 to-slate-200',
    accent: 'bg-slate-600',
    keywords: ['Minimalist', 'Clean', 'Sleek', 'Contemporary']
  },
  {
    id: 'traditional',
    label: 'Traditional',
    description: 'Classic elegance, timeless designs, rich textures',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    accent: 'bg-amber-700',
    keywords: ['Classic', 'Elegant', 'Timeless', 'Rich']
  },
  {
    id: 'industrial',
    label: 'Industrial',
    description: 'Raw materials, exposed elements, urban atmosphere',
    gradient: 'bg-gradient-to-br from-gray-200 to-gray-300',
    accent: 'bg-card',
    keywords: ['Raw', 'Urban', 'Metal', 'Exposed']
  },
  {
    id: 'scandinavian',
    label: 'Scandinavian',
    description: 'Light woods, cozy textures, hygge atmosphere',
    gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    accent: 'bg-primary',
    keywords: ['Hygge', 'Light', 'Cozy', 'Natural']
  },
  {
    id: 'bohemian',
    label: 'Bohemian',
    description: 'Eclectic patterns, vibrant colors, artistic flair',
    gradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
    accent: 'bg-purple-600',
    keywords: ['Eclectic', 'Vibrant', 'Artistic', 'Free-spirited']
  },
  {
    id: 'mediterranean',
    label: 'Mediterranean',
    description: 'Warm colors, natural textures, coastal vibes',
    gradient: 'bg-gradient-to-br from-yellow-100 to-orange-100',
    accent: 'bg-orange-600',
    keywords: ['Warm', 'Coastal', 'Terracotta', 'Natural']
  }
];

export function StylePreferenceStep({ data, updateData, onNext }: StylePreferenceStepProps) {
  const handleSelect = (style: string) => {
    updateData('stylePreference', style);
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
            What's your design style?
          </h2>
          <p className="text-slate-600 text-lg">
            Choose the aesthetic that speaks to you
          </p>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {STYLES.map((style, index) => {
          const isSelected = data.stylePreference === style.id;

          return (
            <motion.div
              key={style.id}
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
                onClick={() => handleSelect(style.id)}
              >
                <div className="space-y-4">
                  {/* Style preview */}
                  <div className={`h-24 ${style.gradient} rounded-lg relative overflow-hidden`}>
                    <div className={`absolute bottom-2 right-2 w-3 h-3 rounded-full ${style.accent}`} />
                    <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${style.accent} opacity-60`} />
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-1 ${style.accent} opacity-80`} />

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute inset-0 bg-primary/50 bg-opacity-20 flex items-center justify-center"
                      >
                        <Sparkles className="w-6 h-6 text-primary" />
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">
                      {style.label}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {style.description}
                    </p>

                    {/* Keywords */}
                    <div className="flex flex-wrap gap-1">
                      {style.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
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

      {data.stylePreference && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-primary font-medium">
            ✓ {STYLES.find(s => s.id === data.stylePreference)?.label} style selected
          </p>
        </motion.div>
      )}
    </div>
  );
}