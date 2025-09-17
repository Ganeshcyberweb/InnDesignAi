"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Crown, Coins } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface BudgetStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  onNext: () => void;
}

const BUDGET_RANGES = [
  {
    id: 'budget',
    label: 'Budget-Friendly',
    description: 'Smart solutions without breaking the bank',
    range: '$500 - $2,000',
    icon: Coins,
    color: 'bg-primary/5 border-primary/20 text-green-900',
    iconColor: 'text-primary',
    features: ['DIY options', 'Affordable materials', 'Smart shopping tips']
  },
  {
    id: 'mid_range',
    label: 'Mid-Range',
    description: 'Balanced approach with quality and value',
    range: '$2,000 - $8,000',
    icon: DollarSign,
    color: 'bg-primary/5 border-primary/20 text-blue-900',
    iconColor: 'text-primary',
    features: ['Quality furniture', 'Professional touches', 'Custom elements']
  },
  {
    id: 'luxury',
    label: 'Luxury',
    description: 'Premium materials and designer pieces',
    range: '$8,000+',
    icon: Crown,
    color: 'bg-purple-50 border-purple-200 text-purple-900',
    iconColor: 'text-purple-600',
    features: ['Designer pieces', 'Premium materials', 'Exclusive finishes']
  }
];

export function BudgetStep({ data, updateData, onNext }: BudgetStepProps) {
  const handleSelect = (budget: string) => {
    updateData('budget', budget);
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
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            What's your budget range?
          </h2>
          <p className="text-slate-600 text-lg">
            Help us tailor recommendations to your investment level
          </p>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {BUDGET_RANGES.map((budget, index) => {
          const Icon = budget.icon;
          const isSelected = data.budget === budget.id;

          return (
            <motion.div
              key={budget.id}
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
                onClick={() => handleSelect(budget.id)}
              >
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full ${budget.color} flex items-center justify-center mx-auto`}>
                    <Icon className={`w-8 h-8 ${budget.iconColor}`} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl text-slate-900 mb-1">
                      {budget.label}
                    </h3>
                    <p className="text-lg font-bold text-primary mb-2">
                      {budget.range}
                    </p>
                    <p className="text-sm text-slate-600 mb-4">
                      {budget.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2">
                      {budget.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * index + 0.1 * featureIndex }}
                          className="flex items-center text-sm text-slate-600"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                          {feature}
                        </motion.div>
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

      {data.budget && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-primary font-medium">
            ✓ {BUDGET_RANGES.find(b => b.id === data.budget)?.label} budget selected
          </p>
        </motion.div>
      )}
    </div>
  );
}