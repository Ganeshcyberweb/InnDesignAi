"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/user-dropdown";
import { DesignChatInput } from "@/components/design-chat-input";
import { AnimatedChainOfThought } from "@/components/animated-chain-of-thought";
import { FurnitureSuggestionsCarousel } from "@/components/furniture-suggestions-carousel";
import { useDesignFormStore } from "@/stores/design-form-store";
import { useDesignHistoryStore } from "@/stores/design-history-store";
import { useBatchImageUpload } from "@/hooks/use-batch-image-upload";
import type { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { History, RefreshCw, X } from "lucide-react";

interface ThemeDesign {
  theme: string
  images: string[]
  label: string
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { formData, updateFormData } = useDesignFormStore();
  const { addNewDesign, invalidateCache } = useDesignHistoryStore();
  const { uploadImages, progress: uploadProgress, isUploading, overallProgress } = useBatchImageUpload();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<ThemeDesign[] | null>(null);
  const [roiAnalysis, setRoiAnalysis] = useState<string | null>(null);
  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Regeneration state
  const [parentDesignId, setParentDesignId] = useState<string | null>(null);
  const [previousDesign, setPreviousDesign] = useState<any>(null);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);

  // Load previous design if regenerating
  useEffect(() => {
    const regenerateFrom = searchParams?.get('regenerateFrom');
    if (regenerateFrom) {
      loadPreviousDesign(regenerateFrom);
    }
  }, [searchParams]);

  const loadPreviousDesign = async (designId: string) => {
    setIsLoadingPrevious(true);
    console.log('\n🔄 Loading previous design for regeneration:', designId);

    try {
      const response = await fetch(`/api/designs/${designId}`);
      const result = await response.json();

      if (result.success && result.design) {
        const design = result.design;
        console.log('✅ Previous design loaded:', {
          generationNumber: design.generationNumber,
          outputsCount: design.designOutputs?.length || 0,
          hasPreferences: !!design.preferences
        });

        // Set parent design ID for regeneration
        setParentDesignId(design.id);
        setPreviousDesign(design);

        // Convert design outputs to ThemeDesign format for display
        const themeDesigns = convertOutputsToThemes(design.designOutputs);
        setGeneratedDesigns(themeDesigns);

        // Pre-fill form with previous preferences
        if (design.preferences) {
          console.log('📝 Pre-filling form with previous preferences');
          updateFormData({
            roomType: design.preferences.roomType || formData.roomType,
            roomSize: design.preferences.size || formData.roomSize,
            stylePreference: design.preferences.stylePreference || formData.stylePreference,
            budgetRange: design.preferences.budget || formData.budgetRange,
            colorPalette: design.preferences.colorScheme || formData.colorPalette,
            prompt: design.preferences.otherRequirements || formData.prompt,
          });
        }
      } else {
        console.error('❌ Failed to load previous design:', result.error);
        // Don't set error state - allow user to continue with fresh generation
      }
    } catch (err) {
      console.error('❌ Error loading previous design:', err);
      // Don't set error state - allow user to continue with fresh generation
    } finally {
      setIsLoadingPrevious(false);
    }
  };

  // Convert design outputs to theme format for display
  const convertOutputsToThemes = (outputs: any[]): ThemeDesign[] => {
    const themeMap = new Map<string, string[]>();

    outputs.forEach(output => {
      const params = output.generationParameters || {};
      const theme = params.theme || 'default';
      const label = params.themeLabel || 'Design';

      if (!themeMap.has(theme)) {
        themeMap.set(theme, []);
      }
      themeMap.get(theme)!.push(output.outputImageUrl);
    });

    return Array.from(themeMap.entries()).map(([theme, images]) => ({
      theme,
      label: outputs.find(o => o.generationParameters?.theme === theme)?.generationParameters?.themeLabel || theme,
      images
    }));
  };

  const clearRegenerationContext = () => {
    setParentDesignId(null);
    setPreviousDesign(null);
    setGeneratedDesigns(null);
    setRoiAnalysis(null);
    setSavedDesignId(null);
    setError(null);
    router.push('/dashboard');
  };

  const handleGenerateDesign = async (message: PromptInputMessage) => {
    setIsGenerating(true);
    setError(null); // Clear any previous errors
    setRoiAnalysis(null); // Clear any previous ROI analysis
    setIsLoadingPrevious(false); // Clear loading state

    try {
      // Validate image formats before processing
      const unsupportedFormats = ['image/avif', 'image/heic', 'image/heif'];
      const invalidFiles = (message.files || []).filter(file => 
        file.mediaType && unsupportedFormats.includes(file.mediaType.toLowerCase())
      );

      if (invalidFiles.length > 0) {
        const formatNames = invalidFiles
          .map(f => f.mediaType?.split('/')[1]?.toUpperCase() || 'Unknown')
          .join(', ');
        throw new Error(
          `❌ Image format not supported: ${formatNames}\n\n` +
          `Please upload images in one of these formats:\n` +
          `✅ JPEG (.jpg, .jpeg)\n` +
          `✅ PNG (.png)\n` +
          `✅ WebP (.webp)\n` +
          `✅ GIF (.gif)\n\n` +
          `Tip: You can convert ${formatNames} images to JPEG or PNG using online converters or your photo editing software.`
        );
      }

      // Convert File objects to data URLs
      const imageFiles = await Promise.all(
        (message.files || []).map(async (file) => {
          // @ts-ignore - file property exists but not in base type
          if (file.file) {
            // Convert File to data URL
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              // @ts-ignore
              reader.readAsDataURL(file.file);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = error => reject(error);
            });
            return {
              ...file,
              url: dataUrl
            };
          }
          return file;
        })
      );

      // 🧪 TESTING MODE: Use test-db endpoint instead of generate-themes
      // This tests database operations without calling Gemini API
      // TODO: Switch back to '/api/ai/generate-themes' when ready for production
      const USE_TEST_MODE = false; // Set to false to use real Gemini generation

      const apiEndpoint = USE_TEST_MODE ? '/api/ai/test-db' : '/api/ai/generate-themes';
      console.log(`🔧 Using endpoint: ${apiEndpoint} ${USE_TEST_MODE ? '(TEST MODE)' : '(PRODUCTION MODE)'}`);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt: message.text,
          images: imageFiles,
          formData: formData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429 && result.retryAfter) {
          // Handle quota exceeded with retry suggestion
          throw new Error(`${result.error} Please wait ${Math.ceil(result.retryAfter / 1000)} seconds before trying again.`);
        }
        throw new Error(result.error || 'Failed to generate design');
      }

      if (result.success && result.themes && result.themes.length > 0) {
        setGeneratedDesigns(result.themes);
        setRoiAnalysis(result.roiAnalysis || null);
        console.log(`✅ Generated ${result.themes.length} themes with ${result.metadata.totalImages} total images in ${(result.metadata.totalDuration / 1000).toFixed(1)}s`);
        if (result.roiAnalysis) {
          console.log('💰 ROI Analysis generated successfully');
        }
        
        // Save the generated design to database
        try {
          console.log('\n💾 === SAVING TO DATABASE ===');
          console.log('📊 Payload Summary:', {
            promptLength: message.text?.length || 0,
            hasImage: !!imageFiles[0]?.url,
            themesCount: result.themes?.length || 0,
            totalImages: result.metadata?.totalImages || 0,
            hasFormData: !!formData,
            aiModel: 'gemini-2.5-flash-image'
          });

          // Collect all base64 images from all themes
          console.log('\n☁️ === UPLOADING IMAGES TO R2 ===');
          const allBase64Images: string[] = [];
          const imageIndexMap: Array<{ themeIndex: number; imageIndex: number }> = [];

          result.themes.forEach((theme: ThemeDesign, themeIndex: number) => {
            theme.images.forEach((image: string, imageIndex: number) => {
              allBase64Images.push(image);
              imageIndexMap.push({ themeIndex, imageIndex });
            });
          });

          console.log(`📤 Total images to upload: ${allBase64Images.length}`);
          console.log(`📦 Distributed across ${result.themes.length} themes`);

          // Upload all images in batch with progress tracking
          const uploadResult = await uploadImages(allBase64Images, 'variation');

          console.log('\n📊 Upload Results:', {
            success: uploadResult.success,
            totalUploaded: uploadResult.uploadedUrls.filter(url => url !== null).length,
            totalFailed: uploadResult.failedIndices.length,
          });

          if (!uploadResult.success) {
            const failedCount = uploadResult.failedIndices.length;
            console.error(`❌ ${failedCount} image(s) failed to upload:`, uploadResult.failedIndices);
            
            // Show user-friendly error
            throw new Error(
              `Failed to upload ${failedCount} image(s) to storage. ` +
              `Please check your connection and try again.`
            );
          }

          // Map uploaded URLs back to themes structure
          console.log('\n🔄 Mapping uploaded URLs back to themes...');
          const themesWithR2Urls = result.themes.map((theme: ThemeDesign, themeIndex: number) => {
            const themeImages = theme.images.map((_, imageIndex: number) => {
              // Find the corresponding uploaded URL
              const globalIndex = imageIndexMap.findIndex(
                (map) => map.themeIndex === themeIndex && map.imageIndex === imageIndex
              );
              const uploadedUrl = uploadResult.uploadedUrls[globalIndex];

              if (!uploadedUrl) {
                console.error(`❌ Missing URL for theme ${themeIndex}, image ${imageIndex}`);
                throw new Error(`Failed to get uploaded URL for image ${globalIndex + 1}`);
              }

              return uploadedUrl;
            });

            return { ...theme, images: themeImages };
          });

          console.log('✅ All images mapped successfully');

          const savePayload = {
            inputPrompt: message.text,
            uploadedImageUrl: imageFiles[0]?.url || null,
            aiModelUsed: 'gemini-2.5-flash-image',
            themes: themesWithR2Urls,
            formData: formData,
            parentDesignId: parentDesignId, // Include for regeneration chain
            roiAnalysis: result.roiAnalysis || null, // Include ROI analysis for storage
          };

          console.log('\n🌐 Sending save request to /api/designs/save...');
          console.log('📊 Payload size:', JSON.stringify(savePayload).length, 'bytes');
          const saveStartTime = Date.now();

          const saveResponse = await fetch('/api/designs/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(savePayload),
          });

          const saveDuration = Date.now() - saveStartTime;
          console.log(`⏱️ Save API response time: ${saveDuration}ms`);

          const saveResult = await saveResponse.json();

          if (saveResult.success) {
            console.log('✅ === SAVE SUCCESSFUL ===');
            console.log('📦 Saved Design Details:', {
              designId: saveResult.design.id,
              outputsCount: saveResult.metadata?.outputsCount || saveResult.design.designOutputs?.length || 0,
              userTotalDesigns: saveResult.metadata?.userTotalDesigns,
              processingTime: saveResult.metadata?.processingTime,
              generationNumber: saveResult.design.generationNumber,
              status: saveResult.design.status,
            });
            console.log('========================\n');

            setSavedDesignId(saveResult.design.id);

            // Add to history store and invalidate cache
            console.log('📦 Adding design to history store...');
            addNewDesign(saveResult.design);
            invalidateCache();
            console.log('✅ History store updated - design will appear in history page');
          } else {
            console.error('\n⚠️ === SAVE FAILED ===');
            console.error('Error:', saveResult.error);
            console.error('Details:', saveResult.details);
            console.error('Status:', saveResponse.status);
            console.error('===================\n');
            // Don't throw error - generation was successful, saving is secondary
          }
        } catch (saveErr) {
          console.error('\n⚠️ === SAVE ERROR ===');
          console.error('Error Type:', saveErr?.constructor?.name);
          console.error('Error Message:', saveErr instanceof Error ? saveErr.message : String(saveErr));
          if (saveErr instanceof Error && saveErr.stack) {
            console.error('Stack:', saveErr.stack);
          }
          console.error('==================\n');
          // Don't throw error - generation was successful
        }
      } else {
        throw new Error('No themes generated');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate design');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background group/sidebar-inset">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-background text-sidebar-foreground relative before:absolute before:inset-y-3 before:-left-px before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5 before:z-50">
          <SidebarTrigger className="-ms-2" />
          <div className="flex items-center gap-8 ml-auto">
            <UserDropdown />
          </div>
        </header>
        <div className="flex-1 p-6 h-fit overflow-auto mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">InnDesign Studio</h1>
              <p className="text-muted-foreground">Create stunning interior designs with AI assistance</p>
            </div>

            {/* Regeneration Context Banner */}
            {previousDesign && !isGenerating && (
              <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">
                        Regenerating from Generation #{previousDesign.generationNumber}
                      </h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      Previous prompt: "{previousDesign.inputPrompt?.substring(0, 100)}{previousDesign.inputPrompt?.length > 100 ? '...' : ''}"
                    </p>
                    <p className="text-xs text-blue-600">
                      Form has been pre-filled with previous preferences. Modify and generate to create a new variation.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRegenerationContext}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* AI Generation Results Display */}
            <div className="mb-8">
              {/* Upload Progress Indicator */}
              {isUploading && (
                <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-1">
                        Uploading Images to Cloud Storage
                      </h3>
                      <p className="text-sm text-blue-700">
                        {overallProgress}% complete - Please wait while we upload your designs
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  {uploadProgress.length > 0 && (
                    <div className="mt-3 text-xs text-blue-600">
                      <p>
                        {uploadProgress.filter(p => p.status === 'success').length} / {uploadProgress.length} images uploaded
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(isGenerating || generatedDesigns) && (
                <AnimatedChainOfThought
                  className="w-full"
                  intervalMs={3500}
                  isProcessing={isGenerating}
                  generatedDesigns={generatedDesigns}
                  roiAnalysis={roiAnalysis}
                />
              )}

              {error && !isGenerating && (
                <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-red-800 font-semibold mb-2">Generation Failed</h3>
                      <div className="text-red-700 text-sm whitespace-pre-line">{error}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons - Show after successful generation */}
            {!isGenerating && generatedDesigns && savedDesignId && (
              <div className="mb-8 flex gap-3 justify-center">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => router.push(`/designs/${savedDesignId}/history`)}
                >
                  <History className="w-4 h-4 mr-2" />
                  View in History
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setGeneratedDesigns(null);
                    setRoiAnalysis(null);
                    setSavedDesignId(null);
                    setError(null);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Create New Design
                </Button>
              </div>
            )}

            {/* Furniture Suggestions Carousel */}
            <div className="mb-8">
              <FurnitureSuggestionsCarousel
                budgetRange={formData.budgetRange}
                roomType={formData.roomType}
                className="w-full"
              />
            </div>

            <div className="relative my-10">
              <DesignChatInput
                onSubmit={handleGenerateDesign}
                className="mb-8 relative z-10"
                alwaysOpen={true}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
