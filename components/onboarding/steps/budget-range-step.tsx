"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  OnboardingFormData,
  BudgetRange,
  BUDGET_INFO,
} from "@/lib/validations/onboarding";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export function BudgetRangeStep() {
  const { watch, setValue } = useFormContext<OnboardingFormData>();
  const selectedBudget = watch("budget");

  const handleBudgetSelect = (budget: BudgetRange) => {
    setValue("budget", budget, { shouldValidate: true });
  };

  const budgetRanges = Object.entries(BUDGET_INFO) as [BudgetRange, typeof BUDGET_INFO[BudgetRange]][];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          This helps us recommend products and solutions within your comfort zone.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Don't worry - we'll show you options across different price points!
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {budgetRanges.map(([key, info]) => (
          <motion.div key={key} variants={item}>
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedBudget === key
                  ? "ring-2 ring-blue-500 border-primary/20 bg-primary/5"
                  : "hover:border-gray-300"
              )}
              onClick={() => handleBudgetSelect(key)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <motion.div
                    className={cn(
                      "text-3xl p-3 rounded-full",
                      selectedBudget === key
                        ? "bg-primary/10"
                        : "bg-muted"
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {info.icon}
                  </motion.div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-xl">{info.label}</h3>
                      {selectedBudget === key && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            Selected
                          </Badge>
                        </motion.div>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-2">
                      {info.description}
                    </p>

                    <Badge
                      variant="outline"
                      className={cn(
                        "font-medium",
                        selectedBudget === key
                          ? "border-primary/30 text-primary"
                          : "border-gray-300"
                      )}
                    >
                      {info.range}
                    </Badge>

                    {selectedBudget === key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t border-primary/20"
                      >
                        <p className="text-sm text-primary">
                          Perfect! We'll focus on {info.label.toLowerCase()} solutions that deliver great value.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selectedBudget && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <p className="text-primary font-medium">
            Budget set! We'll tailor our recommendations to your {BUDGET_INFO[selectedBudget].range} range.
          </p>
          <p className="text-primary text-sm mt-1">
            Remember, great design is about smart choices, not just spending more.
          </p>
        </motion.div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-amber-700 text-sm">
          <strong>Pro tip:</strong> Our AI will show you how to maximize impact within your budget,
          including DIY options and strategic investment pieces.
        </p>
      </div>
    </div>
  );
}