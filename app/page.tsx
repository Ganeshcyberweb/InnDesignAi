"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { MorphSurface } from "@/components/smoothui/ui/AiInput";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { Button } from "@/components/ui/button";
import { DesignChatInput } from "@/components/design-chat-input"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AnimatedGroup } from "@/components/landing/animated-group";
import { AnimatedText } from "@/components/landing/animated-text";
import { HeroHeader } from "@/components/smoothui/blocks/HeroHeader";
import BeamsBackground from "@/components/kokonutui/beams-background";
import { GlowEffect } from "@/components/motion-primitives/glow-effect";

interface HeroProductProps {
  badgeText?: string;
  heading?: string;
  description?: string;
  primaryButton?: {
    text: string;
    url: string;
  };
  secondaryButton?: {
    text: string;
    url: string;
  };
  imageSrc?: string;
  imageAlt?: string;
  reviews?: {
    count: number;
    avatars: {
      src: string;
      alt: string;
    }[];
    rating?: number;
  };
}

export default function Home({
  badgeText = "AI-Powered Interior Design",
  description = "Create stunning interior designs in minutes with our intelligent AI design assistant.",
  reviews = {
    count: 200,
    rating: 5.0,
    avatars: [
      {
        src: "https://github.com/educlopez.png",
        alt: "Avatar 1",
      },
      {
        src: "https://github.com/emilkowalski.png",
        alt: "Avatar 2",
      },
      {
        src: "https://github.com/raunofreiberg.png",
        alt: "Avatar 3",
      },
      {
        src: "https://github.com/shadcn.png",
        alt: "Avatar 4",
      },
      {
        src: "https://github.com/leerob.png",
        alt: "Avatar 5",
      },
    ],
  },
}: HeroProductProps) {
  return (
    <div className="relative">
      {/* <BeamsBackground intensity="subtle" className="absolute inset-0" colorTheme="pink" /> */}
      <div className="relative z-10">
        <HeroHeader />
        <main>
          <motion.section
            className="relative overflow-hidden"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
            }}
          >
            <div className="py-20 md:py-36">
              <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
              <AnimatedGroup preset="blur-slide" className="space-y-2">
                {/* Badge */}
                <AnimatedText
                  as="div"
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  delay={0.1}
                >
                  {badgeText}
                </AnimatedText>

                {/* Main heading with staggered animation */}
                <AnimatedText
                  as="h1"
                  className="mx-auto mt-8 max-w-2xl text-3xl font-bold tracking-tight text-balance text-foreground sm:text-6xl"
                  delay={0.2}
                >
                  Transform Your Space with{" "}
                  <motion.span
                    className="bg-gradient-to-r from-primary/50 via-primary to-primary/70 bg-[length:200%_100%] bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["200% center", "-200% center"],
                    }}
                    transition={{
                      duration: 6,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    InnDesignAI
                  </motion.span>
                </AnimatedText>

                {/* Description */}
                <AnimatedText
                  as="p"
                  className="text-muted-foreground mx-auto my-6 max-w-lg text-sm text-balance"
                  delay={0.3}
                >
                  {description}
                </AnimatedText>

                {/* Reviews Section */}
                <AnimatedGroup
                  preset="fade-up"
                  className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row mx-auto"
                >
                  <span className="inline-flex items-center -space-x-4">
                    {reviews.avatars.map((avatar, index) => (
                      <motion.div
                        key={`${avatar.src}-${index}`}
                        whileHover={{ y: -8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        style={{ display: "inline-block" }}
                      >
                        <Avatar className="size-9 border border-border">
                          <AvatarImage src={avatar.src} alt={avatar.alt} />
                        </Avatar>
                      </motion.div>
                    ))}
                  </span>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starNumber) => (
                        <Star
                          key={`star-${starNumber}`}
                          className="size-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="mr-1 font-semibold text-foreground">
                        {reviews.rating?.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-left font-medium">
                      from {reviews.count}+ reviews
                    </p>
                  </div>
                </AnimatedGroup>
                <Magnetic>
                  <motion.div
                    className="flex w-full items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    {/* <div className="flex flex-col items-center space-y-1">
                      <MorphSurface />
                    </div> */}

                    <div className="relative">
                      {/* <GlowEffect
                        colors={['#ec4899', '#8b5cf6', '#06b6d4', '#f59e0b']}
                        mode="rotate"
                        blur="medium"
                        className="opacity-40 scale-110"
                        duration={8}
                      /> */}
                      <DesignChatInput
                        onSubmit={(message) => console.log('Design submitted:', message)}
                        className="drop-shadow-lg relative z-10"
                      />
                    </div>

                  </motion.div>
                </Magnetic>
              </AnimatedGroup>
            </div>

            {/* Image section with parallax-like animation */}
            {/* <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="relative z-10 mx-auto max-w-5xl px-6">
                <motion.div
                  className="mt-12 md:mt-16"
                  whileHover={{
                    scale: 1.02,
                    rotateY: 2,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  <motion.div
                    className="bg-background relative mx-auto overflow-hidden rounded-(--radius) border border-transparent ring-1 shadow-lg shadow-black/10 ring-black/10"
                    initial={{
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1)",
                    }}
                    whileHover={{
                      boxShadow:
                        "0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <motion.div
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 1.2,
                        delay: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width="2880"
                        height="1842"
                        className="h-auto w-full"
                        priority
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div> */}
              </div>
            </motion.section>
          </main>
        </div>
      </div>
    );
}
