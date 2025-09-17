"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  Home,
  Palette,
  DollarSign,
  Layers,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import type { OnboardingData } from "./OnboardingWizard";

interface OnboardingCompleteProps {
  data: OnboardingData;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  'living_room': 'Living Room',
  'bedroom': 'Bedroom',
  'kitchen': 'Kitchen',
  'bathroom': 'Bathroom',
  'office': 'Home Office',
  'dining_room': 'Dining Room'
};

const SIZE_LABELS: Record<string, string> = {
  'small': 'Small',
  'medium': 'Medium',
  'large': 'Large',
  'extra_large': 'Extra Large'
};

const STYLE_LABELS: Record<string, string> = {
  'modern': 'Modern',
  'traditional': 'Traditional',
  'industrial': 'Industrial',
  'scandinavian': 'Scandinavian',
  'bohemian': 'Bohemian',
  'mediterranean': 'Mediterranean'
};

const BUDGET_LABELS: Record<string, string> = {
  'budget': 'Budget-Friendly',
  'mid_range': 'Mid-Range',
  'luxury': 'Luxury'
};

const COLOR_LABELS: Record<string, string> = {
  'neutral': 'Neutral',
  'warm': 'Warm',
  'cool': 'Cool',
  'bold': 'Bold',
  'monochrome': 'Monochrome'
};

export function OnboardingComplete({ data, onSubmit, isSubmitting }: OnboardingCompleteProps) {
  const summaryItems = [
    {
      icon: Home,
      label: 'Room Type',
      value: ROOM_TYPE_LABELS[data.roomType] || data.roomType,
      color: 'text-primary'
    },
    {
      icon: Layers,
      label: 'Size',
      value: SIZE_LABELS[data.size] || data.size,
      color: 'text-primary'
    },
    {
      icon: Palette,
      label: 'Style',
      value: STYLE_LABELS[data.stylePreference] || data.stylePreference,
      color: 'text-purple-600'
    },
    {
      icon: DollarSign,
      label: 'Budget',
      value: BUDGET_LABELS[data.budget] || data.budget,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Perfect! Your preferences are ready
          </h2>
          <p className="text-slate-600 text-lg">
            Let's review your design preferences and create your personalized space
          </p>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {summaryItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">{item.label}</p>
                    <p className="font-semibold text-slate-900">{item.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Color Scheme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Palette className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">Color Scheme</h3>
          </div>
          <p className="text-slate-700">
            {COLOR_LABELS[data.colorScheme] || data.colorScheme} palette
          </p>
        </Card>
      </motion.div>

      {/* Materials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Layers className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-slate-900">Materials</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.materialPreferences.map((material) => (
              <span
                key={material}
                className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full capitalize"
              >
                {material}
              </span>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Additional Requirements */}
      {data.otherRequirements && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-slate-900">Special Requirements</h3>
            </div>
            <p className="text-slate-700 whitespace-pre-wrap">
              {data.otherRequirements}
            </p>
          </Card>
        </motion.div>
      )}

      {/* Reference Image */}
      {data.uploadedImageUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ImageIcon className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold text-slate-900">Reference Image</h3>
            </div>
            <div className="relative">
              <img
                src={data.uploadedImageUrl}
                alt="Reference"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="text-center space-y-4"
      >
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-primary/20">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-blue-900">Ready to Generate</h3>
          </div>
          <p className="text-blue-800 text-sm mb-4">
            Our AI will create personalized design recommendations based on your preferences
          </p>

          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            size="lg"
            className="bg-primary hover:bg-blue-700 text-white px-8"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Creating Your Design...' : 'Generate My Design'}
          </Button>
        </Card>

        <p className="text-sm text-slate-500">
          This will create a new design project in your dashboard
        </p>
      </motion.div>
    </div>
  );
}