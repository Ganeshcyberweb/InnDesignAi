"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Bed,
  Sofa,
  ChefHat,
  Bath,
  Monitor,
  Home,
  Armchair
} from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface RoomTypeStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  onNext: () => void;
}

const ROOM_TYPES = [
  {
    id: 'living_room',
    label: 'Living Room',
    icon: Sofa,
    description: 'Main gathering space for relaxation and entertainment',
    color: 'bg-primary/5 border-primary/20 text-blue-900'
  },
  {
    id: 'bedroom',
    label: 'Bedroom',
    icon: Bed,
    description: 'Personal sanctuary for rest and relaxation',
    color: 'bg-purple-50 border-purple-200 text-purple-900'
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    icon: ChefHat,
    description: 'Heart of the home for cooking and dining',
    color: 'bg-orange-50 border-orange-200 text-orange-900'
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    icon: Bath,
    description: 'Functional space for daily routines and self-care',
    color: 'bg-teal-50 border-teal-200 text-teal-900'
  },
  {
    id: 'office',
    label: 'Home Office',
    icon: Monitor,
    description: 'Productive workspace for work and study',
    color: 'bg-primary/5 border-primary/20 text-green-900'
  },
  {
    id: 'dining_room',
    label: 'Dining Room',
    icon: Armchair,
    description: 'Dedicated space for meals and gatherings',
    color: 'bg-amber-50 border-amber-200 text-amber-900'
  }
];

export function RoomTypeStep({ data, updateData, onNext }: RoomTypeStepProps) {
  const handleSelect = (roomType: string) => {
    updateData('roomType', roomType);
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
          <Home className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            What room are you designing?
          </h2>
          <p className="text-slate-600 text-lg">
            Select the type of space you'd like to transform
          </p>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {ROOM_TYPES.map((room, index) => {
          const Icon = room.icon;
          const isSelected = data.roomType === room.id;

          return (
            <motion.div
              key={room.id}
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
                onClick={() => handleSelect(room.id)}
              >
                <div className="text-center space-y-3">
                  <div className={`w-16 h-16 rounded-full ${room.color} flex items-center justify-center mx-auto`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">
                      {room.label}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {room.description}
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

      {data.roomType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-primary font-medium">
            ✓ {ROOM_TYPES.find(r => r.id === data.roomType)?.label} selected
          </p>
        </motion.div>
      )}
    </div>
  );
}