"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Heart,
  Target,
  Lightbulb,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { HeroHeader } from "@/components/smoothui/blocks/HeroHeader";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Heart,
    title: "User-Centered Design",
    description: "We believe everyone deserves access to professional interior design. Our mission is to democratize design through technology."
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We're constantly pushing the boundaries of what's possible with AI, creating tools that inspire creativity and simplify complexity."
  },
  {
    icon: Award,
    title: "Quality & Excellence",
    description: "Every design generated through our platform reflects our commitment to quality, aesthetics, and attention to detail."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We listen to our users and continuously improve based on their feedback, creating a product that truly serves their needs."
  }
];

const stats = [
  {
    number: "10K+",
    label: "Active Users"
  },
  {
    number: "50K+",
    label: "Designs Generated"
  },
  {
    number: "98%",
    label: "Satisfaction Rate"
  },
  {
    number: "24/7",
    label: "Support Available"
  }
];

const timeline = [
  {
    year: "2024",
    title: "InnDesign AI Launches",
    description: "We launched our AI-powered interior design platform, making professional design accessible to everyone."
  },
  {
    year: "2024 Q2",
    title: "10,000 Users Milestone",
    description: "Reached our first major milestone with 10,000 active users creating stunning designs daily."
  },
  {
    year: "2024 Q3",
    title: "Advanced Features",
    description: "Introduced custom color palettes, furniture selection, and ROI analysis features."
  },
  {
    year: "2024 Q4",
    title: "Growing Strong",
    description: "Expanding our team and continuously improving our AI models based on user feedback."
  }
];

export default function AboutPage() {
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
              About Us
            </motion.div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              Transforming Spaces with AI
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              We're on a mission to make professional interior design accessible to everyone through the power of artificial intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-lg text-muted-foreground text-left">
              <p>
                InnDesign AI was born from a simple observation: professional interior design is expensive, time-consuming, and often inaccessible to most people. We wondered, "What if we could use artificial intelligence to democratize design?"
              </p>
              <p>
                Our team of designers, engineers, and AI researchers came together to create a platform that makes professional-quality interior design available to everyone. By training our AI on thousands of real designs and incorporating best practices from leading interior designers, we've created a tool that understands both aesthetics and functionality.
              </p>
              <p>
                Today, InnDesign AI helps thousands of people transform their spaces. From homeowners looking to refresh a room to professional designers seeking inspiration, our platform serves anyone who dreams of creating beautiful, functional spaces.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Values
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-8 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
              By the Numbers
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our impact in the interior design community
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Our Journey
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Milestones in our mission to transform interior design
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-1/2" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-8 w-4 h-4 rounded-full bg-primary border-4 border-background md:left-1/2 md:-translate-x-1/2" />

                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} ml-16 md:ml-0`}>
                    <div className={`inline-block bg-card rounded-lg border border-border p-6 ${
                      index % 2 === 0 ? "md:mr-8" : "md:ml-8"
                    }`}>
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                        {item.year}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
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
              Join Our Community
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be part of the future of interior design. Start creating beautiful spaces today.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/features">
                  Explore Features
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
