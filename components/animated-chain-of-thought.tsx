"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { useRouter } from "next/navigation"
import { BrainIcon, Loader2, ChevronDownIcon, Download, Package, Wand2, Lock, LineChart } from "lucide-react"
import { cn } from "@/lib/utils"
import { TextDotsLoader } from "@/components/ui/loader"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { normalizeR2Url } from "@/lib/r2-storage"
import { ImageLightbox } from "@/components/image-lightbox"
import { FavoriteHeart } from "@/components/favorite-heart"
import { toast } from "sonner"

interface ChainOfThoughtItem {
  id: string
  text: string
  timestamp: number
  status: "active" | "complete"
}

interface ThemeDesign {
  theme: string
  images: string[] // Array of 2 images (2 views)
  label: string
}

interface AnimatedChainOfThoughtProps {
  className?: string
  intervalMs?: number
  isProcessing?: boolean
  generatedDesigns?: ThemeDesign[] | null
  roiAnalysis?: string | null
  designId?: string | null
  onComplete?: () => void
  /**
   * Phase 7b — when provided, each theme tab gets a "Refine this" button +
   * inline feedback input. Returns the new image URLs for the theme so this
   * component can transition out of its busy state.
   */
  onRefineTheme?: (themeKey: string, feedback: string) => Promise<void> | void
  /**
   * Phase 7c — when true, image downloads are intercepted with a sign-up
   * upsell and the ROI panel is replaced by an "unlock the cost breakdown"
   * card. The dashboard passes the value from useAuth().isGuest.
   */
  isGuest?: boolean
}

// Predefined AI design process thoughts
const DESIGN_THOUGHTS = [
  "Analyzing room dimensions and layout constraints",
  "Processing style preferences and color schemes",
  "Evaluating furniture placement options",
  "Calculating optimal lighting arrangements",
  "Generating material and texture combinations",
  "Optimizing for budget constraints",
  "Assessing traffic flow patterns",
  "Selecting complementary accent pieces",
  "Balancing proportions and scale",
  "Creating functional storage solutions",
  "Determining focal point placements",
  "Coordinating with existing architectural elements",
  "Planning seasonal adaptability",
  "Ensuring accessibility requirements",
  "Finalizing design recommendations"
]

export function AnimatedChainOfThought({
  className,
  intervalMs = 3500,
  isProcessing = true,
  generatedDesigns = null,
  roiAnalysis = null,
  designId = null,
  onComplete,
  onRefineTheme,
  isGuest = false,
}: AnimatedChainOfThoughtProps) {
  const router = useRouter()
  // Phase 7b — per-theme refinement state.
  const [refineOpenFor, setRefineOpenFor] = useState<string | null>(null)
  const [refineFeedback, setRefineFeedback] = useState("")
  const [refiningThemeKey, setRefiningThemeKey] = useState<string | null>(null)
  const [thoughts, setThoughts] = useState<ChainOfThoughtItem[]>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [showDesigns, setShowDesigns] = useState(false)
  const [showROI, setShowROI] = useState(false)
  const [showROIThinking, setShowROIThinking] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string>("")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxImages, setLightboxImages] = useState<Array<{ src: string; alt: string; title: string }>>([])
  const thoughtIndexRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Reset states when processing starts
  useEffect(() => {
    if (isProcessing) {
      setShowDesigns(false)
      setShowROI(false)
      setShowROIThinking(false)
      if (thoughts.length === 0) {
        addNewThought()
      }
    }
  }, [isProcessing])

  // Handle design display when generation completes
  useEffect(() => {
    if (!isProcessing && generatedDesigns && generatedDesigns.length > 0) {
      console.log('🎨 Generation complete, showing designs...');
      
      // Mark all thoughts as complete
      setThoughts(prev => prev.map(thought => ({
        ...thought,
        status: "complete" as const
      })))
      
      // Set default theme to first design
      setSelectedTheme(generatedDesigns[0].theme)
      
      // Show designs after a brief delay
      setTimeout(() => {
        setShowDesigns(true)
        
        // Show ROI analysis after designs are shown (if available)
        if (roiAnalysis) {
          setTimeout(() => {
            setShowROIThinking(true)
          }, 800) // Show thinking step first
          
          setTimeout(() => {
            setShowROI(true)
          }, 1800) // Then show actual ROI content
        }
        
        if (onComplete) {
          onComplete()
        }
      }, 300)
    }
  }, [isProcessing, generatedDesigns, onComplete])

  // Set up interval for adding new thoughts
  useEffect(() => {
    if (!isProcessing) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    intervalRef.current = setInterval(() => {
      addNewThought()
    }, intervalMs)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isProcessing, intervalMs])

  const addNewThought = () => {
    const newThought: ChainOfThoughtItem = {
      id: `thought-${Date.now()}`,
      text: DESIGN_THOUGHTS[thoughtIndexRef.current % DESIGN_THOUGHTS.length],
      timestamp: Date.now(),
      status: "active"
    }

    setThoughts(prevThoughts => {
      // Mark previous active thought as complete
      const updatedThoughts = prevThoughts.map(thought => ({
        ...thought,
        status: "complete" as const
      }))

      // Add new thought and keep last 6 for better context
      const newThoughts = [newThought, ...updatedThoughts].slice(0, 6)
      return newThoughts
    })

    thoughtIndexRef.current += 1
  }

  const getOpacity = (index: number) => {
    if (index < 3) return 1 // Latest 3 - fully visible
    if (index === 3) return 0.8 // 4th - slightly faded
    if (index === 4) return 0.6 // 5th - more faded
    return 0.4 // 6th - most faded
  }

  // Download individual image. Guests get an upsell instead — downloads are
  // a signed-in benefit.
  const handleDownloadImage = async (imageUrl: string, imageName: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent lightbox from opening

    if (isGuest) {
      toast.message("Sign up to download high-res images", {
        description: "Create a free account to save the images you love.",
        action: {
          label: "Sign up",
          onClick: () => router.push("/signup"),
        },
      })
      return
    }

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = imageName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(blobUrl)
      toast.success("Image downloaded successfully")
    } catch (error) {
      console.error("Error downloading image:", error)
      toast.error("Failed to download image")
    }
  }

  // Download all images as ZIP
  const handleDownloadAll = async () => {
    if (!designId) {
      toast.error("Design ID not available")
      return
    }

    try {
      toast.info("Preparing download...")

      const response = await fetch(`/api/designs/${designId}/download-zip`)

      if (!response.ok) {
        throw new Error("Failed to download ZIP")
      }

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `design-${designId}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(blobUrl)
      toast.success("ZIP downloaded successfully")
    } catch (error) {
      console.error("Error downloading ZIP:", error)
      toast.error("Failed to download ZIP")
    }
  }

  return (
    <div className={cn("not-prose w-full max-w-full", className)}>
      {/* Header */}
      <button
        // onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground mb-4"
      >
        <BrainIcon className="size-4" />
        <div className="flex-1 text-left">
          {isProcessing ? (
            <TextDotsLoader text="Generating designs" size="lg" className="text-foreground" />
          ) : (
            <span className="text-green-600 font-medium">✅ Generation Complete</span>
          )}
        </div>
        {/* <ChevronDownIcon
          className={cn(
            "size-4 transition-transform",
            isExpanded ? "rotate-180" : "rotate-0"
          )}
        /> */}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-3 overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              {thoughts.map((thought, index) => (
                <motion.div
                  key={thought.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{
                    opacity: getOpacity(index),
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: 20,
                    scale: 0.95,
                    transition: { duration: 0.2 }
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeOut",
                    opacity: { duration: 0.4 }
                  }}
                  className="flex gap-3 text-sm"
                  style={{ opacity: getOpacity(index) }}
                >
                  {/* Icon with connector line */}
                  <div className="relative mt-0.5 flex-shrink-0">
                    {thought.status === "active" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Loader2 className="size-4 text-primary" />
                      </motion.div>
                    ) : (
                      <div className="size-4 rounded-full bg-primary/60 border-2 border-background" />
                    )}

                    {/* Connector line - only show if not the last item */}
                    {index < thoughts.length - 1 && (
                      <motion.div
                        className="absolute top-6 left-1/2 w-px bg-border -translate-x-1/2"
                        style={{ height: "24px" }}
                        initial={{ scaleY: 0, originY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className={cn(
                        "font-medium",
                        thought.status === "active"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {thought.text}
                    </motion.div>

                    {thought.status === "active" && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="text-xs text-muted-foreground mt-1"
                      >
                        Processing...
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Show placeholder when no thoughts yet */}
            {thoughts.length === 0 && isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 text-sm text-muted-foreground"
              >
                <div className="mt-0.5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Loader2 className="size-4" />
                  </motion.div>
                </div>
                <div>Initializing AI design process...</div>
              </motion.div>
            )}

            {/* Generated Designs Result - Final step in chain */}
            {showDesigns && generatedDesigns && generatedDesigns.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex gap-3 text-sm mt-6"
              >
                {/* Icon with connector line from last thought */}
                <div className="relative mt-0.5 flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="size-4 rounded-full border-2 border-background flex items-center justify-center"
                  >
                    <svg className="size-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>

                  {/* Connector line from last thought */}
                  {thoughts.length > 0 && (
                    <motion.div
                      className="absolute bottom-full left-1/2 w-px bg-border -translate-x-1/2 mb-1"
                      style={{ height: "16px" }}
                      initial={{ scaleY: 0, originY: 1 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="font-medium text-green-600 mb-3"
                  >
                    ✨ {generatedDesigns.length} theme designs generated successfully!
                  </motion.div>

                  {/* Theme Tabs */}
                  <Tabs value={selectedTheme} onValueChange={setSelectedTheme} className="w-full">
                    <TabsList className="mb-4 w-full justify-start overflow-x-auto bg-muted">
                      {generatedDesigns.map((design) => (
                        <TabsTrigger key={design.theme} value={design.theme} className="shrink-0 text-sm">
                          {design.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {generatedDesigns.map((design) => (
                      <TabsContent key={design.theme} value={design.theme}>
                        {/* Theme toolbar — label + per-theme favourite + refine.
                            Only authed users (designId present) can save / refine. */}
                        {designId && (
                          <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="text-sm font-semibold">{design.label}</p>
                              <p className="text-xs text-muted-foreground">
                                {design.images.length} view{design.images.length === 1 ? "" : "s"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {onRefineTheme && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={!!refiningThemeKey}
                                  onClick={() => {
                                    if (refineOpenFor === design.theme) {
                                      setRefineOpenFor(null)
                                      return
                                    }
                                    setRefineOpenFor(design.theme)
                                    setRefineFeedback("")
                                  }}
                                >
                                  <Wand2 className="mr-2 h-4 w-4" />
                                  Refine this
                                </Button>
                              )}
                              <FavoriteHeart
                                designId={designId}
                                themeKey={design.theme}
                                size="md"
                              />
                            </div>
                          </div>
                        )}

                        {/* Inline feedback input (only for the theme whose
                            "Refine this" was clicked). */}
                        {onRefineTheme && refineOpenFor === design.theme && (
                          <div className="mb-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
                            <Label className="text-xs">
                              Tell me what to change about <span className="font-medium">{design.label}</span>
                            </Label>
                            <Textarea
                              value={refineFeedback}
                              onChange={(e) => setRefineFeedback(e.target.value)}
                              placeholder="e.g. make it warmer; swap the sofa for a sectional; add more plants; darker walls"
                              rows={2}
                              maxLength={500}
                              className="mt-1 mb-2 resize-none bg-background"
                              autoFocus
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-muted-foreground">
                                {refineFeedback.length} / 500
                              </span>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setRefineOpenFor(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  disabled={!refineFeedback.trim() || !!refiningThemeKey}
                                  onClick={async () => {
                                    const fb = refineFeedback.trim()
                                    if (!fb || !onRefineTheme) return
                                    setRefineOpenFor(null)
                                    setRefineFeedback("")
                                    setRefiningThemeKey(design.theme)
                                    try {
                                      await onRefineTheme(design.theme, fb)
                                      toast.success(`Refined ${design.label}`)
                                    } catch (err) {
                                      toast.error(
                                        err instanceof Error ? err.message : "Couldn't refine — try again"
                                      )
                                    } finally {
                                      setRefiningThemeKey(null)
                                    }
                                  }}
                                >
                                  <Wand2 className="mr-2 h-4 w-4" />
                                  Refine
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Image Grid - 2 views side by side */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative"
                        >
                          {refiningThemeKey === design.theme && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                              <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1.5 border shadow-sm">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <span className="text-sm font-medium">Refining {design.label}…</span>
                              </div>
                            </div>
                          )}
                          {design.images.map((imageUrl, index) => (
                            <div
                              key={index}
                              className="relative w-full rounded-lg overflow-hidden border-2 border-primary/30 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                              onClick={() => {
                                // Prepare all images for the current theme
                                const images = design.images.map((url, idx) => ({
                                  src: normalizeR2Url(url),
                                  alt: `${design.label} - View ${idx + 1}`,
                                  title: `${design.label}_view_${idx + 1}.jpg`
                                }))
                                setLightboxImages(images)
                                setLightboxIndex(index)
                                setLightboxOpen(true)
                              }}
                            >
                              <img
                                src={normalizeR2Url(imageUrl)}
                                alt={`${design.label} - View ${index + 1}`}
                                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                View {index + 1}
                              </div>
                              <button
                                onClick={(e) => handleDownloadImage(
                                  normalizeR2Url(imageUrl),
                                  `${design.label}_view_${index + 1}.jpg`,
                                  e
                                )}
                                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded transition-colors z-10"
                                title={isGuest ? "Sign up to download" : "Download image"}
                                aria-label={isGuest ? "Sign up to download" : "Download image"}
                              >
                                {isGuest ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                              </button>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </TabsContent>
                    ))}
                  </Tabs>

                  {/* Download All Button */}
                  {designId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="mt-6 flex justify-center"
                    >
                      <Button
                        onClick={handleDownloadAll}
                        className="gap-2"
                        size="lg"
                      >
                        <Package className="w-4 h-4" />
                        Download All as ZIP
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ROI Thinking Step */}
            {showROIThinking && roiAnalysis && !showROI && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex gap-3 text-sm mt-6"
              >
                {/* Icon with connector line */}
                <div className="relative mt-0.5 flex-shrink-0">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <Loader2 className="size-4 text-primary" />
                  </motion.div>

                  {/* Connector line from designs */}
                  <motion.div
                    className="absolute top-6 left-1/2 w-px bg-border -translate-x-1/2"
                    style={{ height: "24px" }}
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="font-medium text-foreground"
                  >
                    Calculating ROI projections and investment insights...
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ROI Analysis Step - Appears after thinking */}
            {showROI && roiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex gap-2 md:gap-3 text-xs md:text-sm mt-4 md:mt-6"
              >
                {/* Icon with connector line */}
                <div className="relative mt-0.5 flex-shrink-0">
                  {/* Connector line from designs */}
                  <motion.div
                    className="absolute top-6 left-1/2 w-px bg-border -translate-x-1/2"
                    style={{ height: "24px" }}
                    initial={{ scaleY: 0, originY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  />
                </div>

                {/* ROI Analysis Content */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="font-medium text-muted-foreground mb-2"
                  >
                    💰 ROI Analysis
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-4"
                  >
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <div className="p-1 md:p-1.5 rounded">
                        <svg className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h4 className="text-xs md:text-sm font-semibold text-foreground">
                        Investment Insights & Financial Analysis
                      </h4>
                    </div>
                    
                    <div className="prose prose-xs max-w-none text-muted-foreground">
                      {roiAnalysis.split('\n').map((line, index) => {
                        // Enhanced formatting for different sections
                        if (line.startsWith('📊') || line.startsWith('🎨') || line.startsWith('🏆') || line.startsWith('🌍') || line.startsWith('⚠️') || line.startsWith('💡')) {
                          return (
                            <h5 key={index} className="text-sm font-semibold text-foreground mt-3 mb-1 first:mt-0">
                              {line}
                            </h5>
                          );
                        }
                        
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <h6 key={index} className="text-xs font-semibold text-foreground mt-2 mb-1">
                              {line.replace(/\*\*/g, '')}
                            </h6>
                          );
                        }
                        
                        if (line.startsWith('💰') || line.startsWith('📈') || line.startsWith('⏰') || line.startsWith('🎯') || line.startsWith('✅') || line.startsWith('❌')) {
                          return (
                            <p key={index} className="text-xs ml-3 mb-1 font-medium">
                              {line}
                            </p>
                          );
                        }
                        
                        if (line.trim()) {
                          return (
                            <p key={index} className="text-xs mb-1 leading-relaxed">
                              {line}
                            </p>
                          );
                        }
                        
                        return <br key={index} />;
                      })}
                    </div>
                    
                    <div className="mt-3 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground italic">
                        * Estimates based on industry benchmarks - validate with local market data
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Guest upsell — ROI is signed-in-only. Shown in place of the
                full breakdown so the value is obvious without giving it away. */}
            {isGuest && !roiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.4 }}
                className="mt-4 md:mt-6 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <LineChart className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      Cost breakdown &amp; ROI estimate &mdash; for signed-in members
                    </p>
                    <p className="mt-1 text-xs md:text-sm text-muted-foreground">
                      Sign up free to see the projected cost, payback timeline,
                      and ROI for each generated theme alongside your designs.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => router.push("/signup")}
                      >
                        Sign up &mdash; it&apos;s free
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push("/login")}
                      >
                        I already have an account
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        open={lightboxOpen}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        isGuest={isGuest}
      />
    </div>
  )
}
