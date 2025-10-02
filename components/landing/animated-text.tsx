"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  children: React.ReactNode
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  className?: string
  delay?: number
  duration?: number
  split?: "words" | "chars" | "none"
}

export function AnimatedText({
  children,
  as: Component = "div",
  className,
  delay = 0,
  duration = 0.6,
  split = "words",
}: AnimatedTextProps) {
  const text = typeof children === "string" ? children : ""

  if (split === "none" || typeof children !== "string") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Component className={cn(className)}>
          {children}
        </Component>
      </motion.div>
    )
  }

  const words = text.split(" ")

  if (split === "words") {
    return (
      <Component className={cn(className)}>
        {words.map((word, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0, y: 20, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
            {index < words.length - 1 && "\u00A0"}
          </motion.span>
        ))}
      </Component>
    )
  }

  if (split === "chars") {
    return (
      <Component className={cn(className)}>
        {Array.from(text).map((char, index) => (
          <motion.span
            key={index}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: delay + index * 0.03,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </Component>
    )
  }

  return (
    <Component className={cn(className)}>
      {children}
    </Component>
  )
}