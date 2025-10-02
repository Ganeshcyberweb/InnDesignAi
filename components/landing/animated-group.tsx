"use client"

import { motion, type Variants } from "motion/react"
import { cn } from "@/lib/utils"

interface AnimatedGroupProps {
  children: React.ReactNode
  preset?: "blur-slide" | "fade-up" | "scale"
  className?: string
  delay?: number
  duration?: number
}

const presetVariants: Record<string, Variants> = {
  "blur-slide": {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)"
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  },
  "fade-up": {
    hidden: {
      opacity: 0,
      y: 40
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  },
  "scale": {
    hidden: {
      opacity: 0,
      scale: 0.95
    },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  },
}

export function AnimatedGroup({
  children,
  preset = "fade-up",
  className,
  delay = 0,
  duration,
}: AnimatedGroupProps) {
  const variants = presetVariants[preset]

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}