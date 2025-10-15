"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { BrainIcon, Loader2, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { TextDotsLoader } from "@/components/ui/loader"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
  onComplete?: () => void
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
  onComplete
}: AnimatedChainOfThoughtProps) {
  const [thoughts, setThoughts] = useState<ChainOfThoughtItem[]>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const [showDesigns, setShowDesigns] = useState(false)
  const [showROI, setShowROI] = useState(false)
  const [showROIThinking, setShowROIThinking] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string>("")
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

  return (
    <div className={cn("not-prose max-w-prose", className)}>
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
                    <TabsList className="mb-4 bg-muted">
                      {generatedDesigns.map((design) => (
                        <TabsTrigger key={design.theme} value={design.theme} className="text-sm">
                          {design.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {generatedDesigns.map((design) => (
                      <TabsContent key={design.theme} value={design.theme}>
                        {/* Image Grid - 2 views side by side */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          {design.images.map((imageUrl, index) => (
                            <div
                              key={index}
                              className="relative w-full rounded-lg overflow-hidden border-2 border-primary/30 shadow-md hover:shadow-lg transition-shadow"
                            >
                              <img
                                src={imageUrl}
                                alt={`${design.label} - View ${index + 1}`}
                                className="w-full h-auto"
                              />
                              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                View {index + 1}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </TabsContent>
                    ))}
                  </Tabs>
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
                className="flex gap-3 text-sm mt-6"
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
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}