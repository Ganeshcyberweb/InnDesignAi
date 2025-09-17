"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Camera,
  Sparkles
} from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface ImageUploadStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  onNext: () => void;
}

export function ImageUploadStep({ data, updateData, onNext }: ImageUploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadError('Image size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      updateData('uploadedImageUrl', result.url);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeImage = () => {
    updateData('uploadedImageUrl', undefined);
    setUploadError(null);
  };

  const hasImage = !!data.uploadedImageUrl;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Camera className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Add a reference image
          </h2>
          <p className="text-slate-600 text-lg">
            Upload a photo of your current space or inspiration (optional)
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        {!hasImage ? (
          <Card
            className={`p-8 border-2 border-dashed transition-all duration-200 ${
              isDragging
                ? 'border-blue-400 bg-primary/5'
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="text-center space-y-4">
              {isUploading ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="space-y-3"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-8 h-8 text-primary" />
                    </motion.div>
                  </div>
                  <p className="text-primary font-medium">Uploading your image...</p>
                </motion.div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-slate-400" />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      Drop your image here, or browse
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Supports JPG, PNG, and WebP up to 10MB
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button asChild variant="outline">
                        <span className="cursor-pointer">
                          <ImageIcon className="w-4 h-4 mr-2" />
                          Browse Files
                        </span>
                      </Button>
                    </label>
                  </div>

                  {uploadError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center space-x-2 text-destructive"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{uploadError}</span>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-primary">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Image uploaded successfully</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeImage}
                    className="text-slate-500 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="relative">
                  <img
                    src={data.uploadedImageUrl}
                    alt="Uploaded reference"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                </div>

                <p className="text-sm text-slate-600 text-center">
                  This image will help our AI understand your preferences and current space
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>

      {/* Benefits section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2" />
            How images help our AI
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Understand your current space layout and constraints</li>
            <li>• Identify existing furniture and architectural features</li>
            <li>• Generate more personalized and realistic recommendations</li>
            <li>• Suggest improvements that work with your existing setup</li>
          </ul>
        </Card>
      </motion.div>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center"
      >
        <Button
          onClick={onNext}
          size="lg"
          className="px-8"
          disabled={isUploading}
        >
          {hasImage ? 'Continue with Image' : 'Skip & Continue'}
        </Button>

        {!hasImage && (
          <p className="text-slate-500 text-sm mt-2">
            You can always upload images later
          </p>
        )}
      </motion.div>
    </div>
  );
}