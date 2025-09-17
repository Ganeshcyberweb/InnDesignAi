"use client";

import React from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  OnboardingFormData,
  RoomType,
  ROOM_TYPE_INFO,
} from "@/lib/validations/onboarding";

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function RoomTypeStep() {
  const { watch, setValue } = useFormContext<OnboardingFormData>();
  const selectedRoomType = watch("roomType");

  const handleRoomTypeSelect = (roomType: RoomType) => {
    setValue("roomType", roomType, { shouldValidate: true });
  };

  const roomTypes = Object.entries(ROOM_TYPE_INFO) as [RoomType, typeof ROOM_TYPE_INFO[RoomType]][];

  return (
    <div className="space-y-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {roomTypes.map(([key, info]) => (
          <motion.div key={key} variants={item}>
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                selectedRoomType === key
                  ? "ring-2 ring-blue-500 border-primary/20 bg-primary/5"
                  : "hover:border-gray-300"
              )}
              onClick={() => handleRoomTypeSelect(key)}
            >
              <CardContent className="p-6 text-center">
                <motion.div
                  className="text-4xl mb-3"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {info.icon}
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">{info.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {info.description}
                </p>
                {selectedRoomType === key && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3"
                  >
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      Selected
                    </Badge>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {selectedRoomType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <p className="text-primary font-medium">
            Great choice! You've selected {ROOM_TYPE_INFO[selectedRoomType].label.toLowerCase()}.
          </p>
          <p className="text-primary text-sm mt-1">
            Let's continue to learn more about your space.
          </p>
        </motion.div>
      )}
    </div>
  );
}