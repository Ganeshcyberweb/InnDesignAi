"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Upload, X, Image as ImageIcon, Camera, AlertCircle } from "lucide-react";
import { useImageUpload } from "@/hooks/use-image-upload";
import {
  OnboardingFormData,
} from "@/lib/validations/onboarding";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageUploadStep() {
  const { watch, setValue } = useFormContext<OnboardingFormData>();
  const [isDragActive, setIsDragActive] = useState(false);
  const { uploadImage, isUploading, error: uploadError } = useImageUpload();

  const uploadedImageUrl = watch("uploadedImageUrl");

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Please upload a JPEG, PNG, or WebP image";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }
    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      return;
    }

    try {
      // Create a preview URL immediately for better UX
      const previewUrl = URL.createObjectURL(file);
      setValue("uploadedImageUrl", previewUrl, { shouldValidate: true });

      // Upload to Supabase storage
      const permanentUrl = await uploadImage(file);

      // Replace preview URL with permanent URL
      setValue("uploadedImageUrl", permanentUrl, { shouldValidate: true });
      setValue("uploadedImageFile", file, { shouldValidate: true });

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error("Upload error:", error);
      setValue("uploadedImageUrl", undefined);
      setValue("uploadedImageFile", undefined);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setValue("uploadedImageUrl", undefined);
    setValue("uploadedImageFile", undefined);
  };

  const handleSkip = () => {
    setValue("uploadedImageUrl", undefined);
    setValue("uploadedImageFile", undefined);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-muted-foreground mb-2">
          Upload a reference image to help us understand your vision better.
        </p>
        <p className="text-sm text-muted-foreground">
          This could be inspiration from Pinterest, a photo of your current space, or any style you love!
        </p>
      </div>

      {!uploadedImageUrl ? (
        <motion.div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
            isDragActive
              ? "border-blue-400 bg-primary/5"
              : "border-gray-300 hover:border-gray-400 hover:bg-muted"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="space-y-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="flex justify-center space-x-4 text-4xl">
              <motion.div
                animate={{ rotate: isDragActive ? 12 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Upload className="w-12 h-12 text-muted-foreground" />
              </motion.div>
              <ImageIcon className="w-12 h-12 text-muted-foreground" />
              <Camera className="w-12 h-12 text-muted-foreground" />
            </div>

            <div>
              <p className="text-lg font-medium text-foreground mb-2">
                {isDragActive ? "Drop your image here!" : "Upload a reference image"}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop an image here, or click to browse
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file-upload">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  loading={isUploading}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Choose File"}
                </Button>
              </Label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploading}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              JPEG, PNG, or WebP • Max 10MB
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded reference"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-primary mt-3 text-center">
                Great! We'll use this image as inspiration for your design.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-destructive text-sm">{uploadError}</p>
        </motion.div>
      )}

      <div className="text-center space-y-3">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          Skip - No reference image
        </Button>
        <p className="text-xs text-muted-foreground">
          No worries! Our AI can create amazing designs based on your preferences alone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">Good Reference Images</h4>
            <ul className="text-sm text-primary space-y-1">
              <li>• Pinterest inspiration photos</li>
              <li>• Room photos from magazines</li>
              <li>• Your current space</li>
              <li>• Furniture you love</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-amber-800 mb-2">Image Tips</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Clear, well-lit photos work best</li>
              <li>• Multiple angles are helpful</li>
              <li>• Focus on overall style/mood</li>
              <li>• Don't worry about perfect quality</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}