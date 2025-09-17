"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Ruler, Square } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface RoomSizeStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  onNext: () => void;
}

const ROOM_SIZES = [
  {
    id: 'small',
    label: 'Small',
    description: 'Cozy and compact space',
    dimensions: '< 100 sq ft',
    visualSize: 'w-12 h-12',
    color: 'bg-accent/50 border-accent text-yellow-900'
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Comfortable standard size',
    dimensions: '100-200 sq ft',
    visualSize: 'w-16 h-16',
    color: 'bg-primary/5 border-primary/20 text-green-900'
  },
  {
    id: 'large',
    label: 'Large',
    description: 'Spacious and roomy',
    dimensions: '200-400 sq ft',
    visualSize: 'w-20 h-20',
    color: 'bg-primary/5 border-primary/20 text-blue-900'
  },
  {
    id: 'extra_large',
    label: 'Extra Large',
    description: 'Expansive luxury space',
    dimensions: '400+ sq ft',
    visualSize: 'w-24 h-24',
    color: 'bg-purple-50 border-purple-200 text-purple-900'
  }
];

export function RoomSizeStep({ data, updateData, onNext }: RoomSizeStepProps) {
  const handleSelect = (size: string) => {
    updateData('size', size);
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
          <Ruler className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            What's the size of your space?
          </h2>
          <p className="text-slate-600 text-lg">
            Help us understand the scale of your room
          </p>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {ROOM_SIZES.map((size, index) => {
          const isSelected = data.size === size.id;

          return (
            <motion.div
              key={size.id}
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
                onClick={() => handleSelect(size.id)}
              >
                <div className="text-center space-y-4">
                  {/* Visual size representation */}
                  <div className="flex justify-center items-end h-24">
                    <motion.div
                      className={`${size.visualSize} ${size.color} rounded-lg border-2 border-dashed flex items-center justify-center`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Square className="w-4 h-4 opacity-60" />
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">
                      {size.label}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {size.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {size.dimensions}
                    </p>
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

      {data.size && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-primary font-medium">
            ✓ {ROOM_SIZES.find(s => s.id === data.size)?.label} room selected
          </p>
        </motion.div>
      )}
    </div>
  );
}