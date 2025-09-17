"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Ruler, Home, Building, Warehouse } from "lucide-react";
import {
  OnboardingFormData,
  RoomSize,
} from "@/lib/validations/onboarding";

const ROOM_SIZE_INFO = {
  small: {
    label: "Small",
    description: "Cozy spaces up to 150 sq ft",
    details: "Perfect for studio apartments, small bedrooms, or compact office spaces",
    icon: Home,
    dimensions: "Up to 150 sq ft",
  },
  medium: {
    label: "Medium",
    description: "Comfortable spaces 150-300 sq ft",
    details: "Great for most bedrooms, small living rooms, or home offices",
    icon: Ruler,
    dimensions: "150-300 sq ft",
  },
  large: {
    label: "Large",
    description: "Spacious areas 300-500 sq ft",
    details: "Ideal for master bedrooms, main living areas, or open concept spaces",
    icon: Building,
    dimensions: "300-500 sq ft",
  },
  extra_large: {
    label: "Extra Large",
    description: "Grand spaces over 500 sq ft",
    details: "Perfect for great rooms, large kitchens, or luxury master suites",
    icon: Warehouse,
    dimensions: "500+ sq ft",
  },
} as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 },
};

export function RoomSizeStep() {
  const { watch, setValue } = useFormContext<OnboardingFormData>();
  const selectedSize = watch("size");

  const handleSizeSelect = (size: RoomSize) => {
    setValue("size", size, { shouldValidate: true });
  };

  const roomSizes = Object.entries(ROOM_SIZE_INFO) as [RoomSize, typeof ROOM_SIZE_INFO[RoomSize]][];

  return (
    <div className="space-y-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {roomSizes.map(([key, info]) => {
          const IconComponent = info.icon;
          return (
            <motion.div key={key} variants={item}>
              <Card
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedSize === key
                    ? "ring-2 ring-blue-500 border-primary/20 bg-primary/5"
                    : "hover:border-gray-300"
                )}
                onClick={() => handleSizeSelect(key)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <motion.div
                      className={cn(
                        "p-3 rounded-full",
                        selectedSize === key
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{info.label}</h3>
                        {selectedSize === key && (
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
                      <p className="text-sm text-muted-foreground mb-2">
                        {info.description}
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        {info.details}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {info.dimensions}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {selectedSize && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <p className="text-primary font-medium">
            Perfect! We'll design for a {ROOM_SIZE_INFO[selectedSize].label.toLowerCase()} space.
          </p>
          <p className="text-primary text-sm mt-1">
            Size matters for furniture scale and layout recommendations.
          </p>
        </motion.div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <p>Don't worry about exact measurements - we'll help you refine this later!</p>
      </div>
    </div>
  );
}