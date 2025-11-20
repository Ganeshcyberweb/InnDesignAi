"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  BookOpen,
  Palette,
  Upload,
  Sparkles,
  Download,
  Settings,
  ChevronRight,
  Home,
  MessageSquare,
  Image as ImageIcon
} from "lucide-react";
import { HeroHeader } from "@/components/smoothui/blocks/HeroHeader";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const tutorials = [
  {
    id: 1,
    title: "Getting Started with InnDesign AI",
    description: "Learn how to create your first AI-generated interior design in minutes.",
    icon: Sparkles,
    steps: [
      "Sign up for a free account",
      "Navigate to the dashboard",
      "Enter your design vision in the chat",
      "Select room type and preferences",
      "Click generate and watch the magic happen"
    ]
  },
  {
    id: 2,
    title: "Uploading Reference Images",
    description: "Get better results by providing reference images of your space or inspiration.",
    icon: Upload,
    steps: [
      "Click the image icon in the chat input",
      "Select up to 5 images (JPEG, PNG, WebP, or GIF)",
      "Choose images of your actual room or design inspiration",
      "Each image should be under 10MB",
      "The AI will analyze your images to create personalized designs"
    ]
  },
  {
    id: 3,
    title: "Using the Design Chat",
    description: "Master the art of communicating your vision to the AI.",
    icon: MessageSquare,
    steps: [
      "Be specific about your preferences (e.g., 'modern minimalist living room')",
      "Mention colors you love or want to avoid",
      "Describe the mood you want (cozy, elegant, vibrant, etc.)",
      "Include practical requirements (pet-friendly, kid-safe, etc.)",
      "Ask for variations if the first result isn't perfect"
    ]
  },
  {
    id: 4,
    title: "Customizing Room Preferences",
    description: "Fine-tune your designs with detailed preference controls.",
    icon: Settings,
    steps: [
      "Select your room type (living room, bedroom, kitchen, etc.)",
      "Enter the room size in square feet",
      "Choose a style preference (modern, traditional, industrial, etc.)",
      "Set your budget range",
      "Pick a color palette or create a custom one"
    ]
  },
  {
    id: 5,
    title: "Working with Color Palettes",
    description: "Create harmonious designs with the right color combinations.",
    icon: Palette,
    steps: [
      "Choose from preset palettes (neutral, warm, cool, bold)",
      "Or create a custom palette with your own colors",
      "Select three colors that work well together",
      "Use a color wheel for complementary combinations",
      "The AI will incorporate your palette into the design"
    ]
  },
  {
    id: 6,
    title: "Selecting Furniture Items",
    description: "Browse and add specific furniture pieces to your design.",
    icon: Home,
    steps: [
      "Browse the furniture suggestions carousel",
      "Click on items you like to add them to your design",
      "Select up to 3 furniture items per generation",
      "The AI will incorporate selected items into the layout",
      "Remove items by clicking the X icon"
    ]
  },
  {
    id: 7,
    title: "Downloading Your Designs",
    description: "Save and share your AI-generated interior designs.",
    icon: Download,
    steps: [
      "Review the 3 generated design themes",
      "Each theme includes 2 different views",
      "Click on any design to view it full-screen",
      "Right-click and 'Save Image As' to download",
      "Designs are saved to your history automatically"
    ]
  },
  {
    id: 8,
    title: "Viewing Design History",
    description: "Access and regenerate your previous designs anytime.",
    icon: BookOpen,
    steps: [
      "Click 'History' in the sidebar",
      "Browse all your past design generations",
      "Click 'View Details' to see a specific design",
      "Use 'Regenerate' to create variations",
      "Each regeneration creates a new version with a generation counter"
    ]
  }
];

const tips = [
  {
    title: "Be Descriptive",
    description: "The more details you provide, the better the AI understands your vision. Instead of 'nice living room', try 'cozy modern living room with natural light and plants'."
  },
  {
    title: "Use Reference Images",
    description: "Upload photos of your actual space for more accurate results. The AI will consider your room's layout and lighting."
  },
  {
    title: "Experiment with Styles",
    description: "Don't be afraid to try different style combinations. Mix modern with traditional or add bohemian touches to industrial designs."
  },
  {
    title: "Consider Lighting",
    description: "Mention the type of lighting in your space (natural, warm, bright) to get more suitable color recommendations."
  },
  {
    title: "Think About Function",
    description: "Include how you use the space (work from home, family gatherings, relaxation) for more practical design suggestions."
  },
  {
    title: "Start Simple",
    description: "If you're unsure, start with basic preferences and refine in subsequent generations based on what you like or dislike."
  }
];

export default function DesignGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6"
            >
              <BookOpen className="mr-2 h-3 w-3" />
              Design Guide
            </motion.div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              Master InnDesign AI
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Everything you need to know to create stunning interior designs with our AI-powered platform.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Start Designing
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Step-by-Step Tutorials
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Follow these guides to unlock the full potential of InnDesign AI
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <tutorial.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tutorial.description}
                    </p>
                  </div>
                </div>

                <ol className="space-y-2 ml-16">
                  {tutorial.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start gap-3 text-sm">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {stepIndex + 1}
                      </span>
                      <span className="text-muted-foreground pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Pro Tips
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get the most out of InnDesign AI with these expert recommendations
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Put your new knowledge to work and create stunning designs in minutes.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Start Designing Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/support">
                  Get Help
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
