"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Sparkles,
  Palette,
  Image as ImageIcon,
  History,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Brain,
  Layout,
  Wand2,
  DollarSign,
  ChevronRight
} from "lucide-react";
import { HeroHeader } from "@/components/smoothui/blocks/HeroHeader";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const mainFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Design",
    description: "Advanced artificial intelligence analyzes your preferences and generates professional-quality interior designs in seconds. Our models are trained on thousands of real designs.",
    color: "from-pink-500 to-purple-500"
  },
  {
    icon: Wand2,
    title: "Multiple Design Themes",
    description: "Get 3 unique design themes with every generation, each with 2 complementary views. Compare options and choose the perfect style for your space.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Palette,
    title: "Custom Color Palettes",
    description: "Choose from curated color schemes or create your own custom palette. The AI ensures harmonious color coordination throughout your design.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: ImageIcon,
    title: "Image Upload Support",
    description: "Upload photos of your actual space or inspiration images. The AI analyzes room layout, lighting, and existing elements for personalized results.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Layout,
    title: "Smart Furniture Placement",
    description: "Browse and select furniture items to include in your design. The AI intelligently places them with proper spacing, scale, and flow.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: History,
    title: "Design History & Regeneration",
    description: "All your designs are automatically saved. Regenerate any previous design with new preferences and track your design evolution.",
    color: "from-cyan-500 to-blue-500"
  }
];

const additionalFeatures = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get professional designs in 15-30 seconds"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and never shared"
  },
  {
    icon: Users,
    title: "Multi-User Support",
    description: "Client and Designer account types"
  },
  {
    icon: TrendingUp,
    title: "ROI Analysis",
    description: "Understand the value of your design choices"
  },
  {
    icon: DollarSign,
    title: "Budget Aware",
    description: "Get designs that match your budget range"
  },
  {
    icon: Sparkles,
    title: "Unlimited Generations",
    description: "Create as many designs as you want"
  }
];

const roomTypes = [
  "Living Rooms",
  "Bedrooms",
  "Kitchens",
  "Bathrooms",
  "Dining Rooms",
  "Home Offices"
];

const styleOptions = [
  "Modern",
  "Traditional",
  "Scandinavian",
  "Industrial",
  "Bohemian",
  "Mediterranean"
];

export default function FeaturesPage() {
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
              <Sparkles className="mr-2 h-3 w-3" />
              Features
            </motion.div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              Powerful AI Design Tools
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Everything you need to create stunning interior designs powered by advanced artificial intelligence.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Try It Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Core Features
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Professional-grade interior design tools accessible to everyone
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative bg-card rounded-2xl border border-border p-8 hover:shadow-xl transition-all group overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Even More Features
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Additional capabilities to enhance your design experience
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4 bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Rooms & Styles */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Room Types */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                <Layout className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-4">
                Supported Room Types
              </h2>

              <p className="text-muted-foreground mb-6">
                Specialized AI models trained for each type of space
              </p>

              <div className="grid gap-3">
                {roomTypes.map((room, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground font-medium">{room}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Style Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                <Palette className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-4">
                Design Styles
              </h2>

              <p className="text-muted-foreground mb-6">
                Choose from popular design styles or mix and match
              </p>

              <div className="grid gap-3">
                {styleOptions.map((style, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-foreground font-medium">{style}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
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
              Start creating professional interior designs with AI today. No credit card required.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/guide">
                  Learn More
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
