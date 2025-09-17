"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Sparkles, ArrowRight, Home } from "lucide-react";
import {
  OnboardingFormData,
  ROOM_TYPE_INFO,
  STYLE_INFO,
  BUDGET_INFO,
} from "@/lib/validations/onboarding";

interface OnboardingCompleteProps {
  data: OnboardingFormData;
}

export function OnboardingComplete({ data }: OnboardingCompleteProps) {
  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  };

  const handleViewDesign = () => {
    // Navigate to the specific design (would need design ID)
    window.location.href = "/dashboard/designs";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <CheckCircle className="w-10 h-10 text-primary" />
          </motion.div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Your design preferences have been saved
          </p>
          <p className="text-muted-foreground">
            Our AI is now processing your requirements to create personalized design recommendations
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Room Type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span className="text-2xl">
                    {data.roomType && ROOM_TYPE_INFO[data.roomType]?.icon}
                  </span>
                  <span>Room Type</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-foreground">
                  {data.roomType && ROOM_TYPE_INFO[data.roomType]?.label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.roomType && ROOM_TYPE_INFO[data.roomType]?.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Style</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-foreground">
                  {data.stylePreference && STYLE_INFO[data.stylePreference]?.label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.stylePreference && STYLE_INFO[data.stylePreference]?.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {data.stylePreference &&
                    STYLE_INFO[data.stylePreference]?.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Budget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span className="text-2xl">
                    {data.budget && BUDGET_INFO[data.budget]?.icon}
                  </span>
                  <span>Budget</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-foreground">
                  {data.budget && BUDGET_INFO[data.budget]?.label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.budget && BUDGET_INFO[data.budget]?.range}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Details */}
        {(data.colorScheme || data.materialPreferences?.length || data.otherRequirements) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.colorScheme && (
                  <div>
                    <p className="font-medium text-foreground">Color Scheme</p>
                    <Badge variant="outline" className="mt-1 capitalize">
                      {data.colorScheme.replace("_", " ")}
                    </Badge>
                  </div>
                )}

                {data.materialPreferences && data.materialPreferences.length > 0 && (
                  <div>
                    <p className="font-medium text-foreground">Preferred Materials</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.materialPreferences.map((material) => (
                        <Badge key={material} variant="outline">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {data.otherRequirements && (
                  <div>
                    <p className="font-medium text-foreground">Special Requirements</p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                      {data.otherRequirements}
                    </p>
                  </div>
                )}

                {data.uploadedImageUrl && (
                  <div>
                    <p className="font-medium text-foreground">Reference Image</p>
                    <div className="mt-2">
                      <img
                        src={data.uploadedImageUrl}
                        alt="Reference"
                        className="w-32 h-24 object-cover rounded-lg border"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center space-y-6"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <h4 className="font-medium">AI Processing</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your preferences and creates personalized design concepts
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <h4 className="font-medium">Design Generation</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Multiple design options are generated with product recommendations
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <h4 className="font-medium">Your Review</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Review designs, provide feedback, and refine your perfect space
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleViewDesign}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
              >
                <span>View My Designs</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleGoToDashboard}
                variant="outline"
                size="lg"
                className="px-8 py-3"
              >
                <Home className="w-5 h-5 mr-2" />
                <span>Go to Dashboard</span>
              </Button>
            </motion.div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Processing typically takes 2-5 minutes. You'll receive an email when your designs are ready!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}