"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { BrainIcon, Loader2, ChevronDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { TextDotsLoader } from "@/components/ui/loader"

interface ChainOfThoughtItem {
  id: string
  text: string
  timestamp: number
  status: "active" | "complete"
}

interface AnimatedChainOfThoughtProps {
  className?: string
  intervalMs?: number
  isProcessing?: boolean
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
  isProcessing = true
}: AnimatedChainOfThoughtProps) {
  const [thoughts, setThoughts] = useState<ChainOfThoughtItem[]>([])
  const [isExpanded, setIsExpanded] = useState(true)
  const thoughtIndexRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  // Initialize with first thought
  useEffect(() => {
    if (isProcessing && thoughts.length === 0) {
      addNewThought()
    }
  }, [isProcessing])

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

      // Add new thought and keep only last 4
      const newThoughts = [newThought, ...updatedThoughts].slice(0, 4)
      return newThoughts
    })

    thoughtIndexRef.current += 1
  }

  const getOpacity = (index: number) => {
    switch (index) {
      case 0: return 1 // Latest - fully visible
      case 1: return 0.7 // Previous - faded
      case 2: return 0.5 // Older - more faded
      case 3: return 0.3 // Oldest - most faded
      default: return 0
    }
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
          <TextDotsLoader text="Generating designs" size="lg" className="text-foreground" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}