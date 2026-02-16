"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, BookOpen, HelpCircle, Sparkles, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about using InnDesign to transform your spaces
          </p>
        </div>

        {/* FAQ Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left hover:no-underline">
                How do I generate a design?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <ol className="list-decimal list-inside space-y-2 mt-2">
                  <li>Navigate to the Design Assistant from your dashboard</li>
                  <li>Upload 1-3 images of your space (JPG, PNG, or WebP format)</li>
                  <li>Describe your design vision in the prompt field</li>
                  <li>Fill in details like room type, design style, and budget</li>
                  <li>Click "Generate Design" and wait for AI to create your customized designs</li>
                </ol>
                <p className="mt-3">
                  The AI will generate multiple design variations with detailed ROI analysis for each option.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left hover:no-underline">
                What is ROI analysis and how does it work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">
                  ROI (Return on Investment) analysis helps you understand the financial impact of your design choices:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Current Property Value:</strong> Estimated market value before renovation</li>
                  <li><strong>Post-Renovation Value:</strong> Projected value after implementing the design</li>
                  <li><strong>Estimated Cost:</strong> Budget needed for materials, labor, and finishing</li>
                  <li><strong>Net Gain:</strong> Expected profit (Post-Renovation Value - Current Value - Cost)</li>
                  <li><strong>ROI Percentage:</strong> Return rate calculated as (Net Gain / Total Investment) × 100</li>
                </ul>
                <p className="mt-3 text-sm">
                  Note: These are AI-generated estimates. Always consult with professionals for accurate valuations.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left hover:no-underline">
                How many designs can I create?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-2">
                  The number of designs you can create depends on your subscription plan:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Free Plan:</strong> 3 designs per month</li>
                  <li><strong>Pro Plan:</strong> 50 designs per month</li>
                  <li><strong>Enterprise:</strong> Unlimited designs</li>
                </ul>
                <p className="mt-3">
                  Each design generation creates multiple theme variations, giving you several options to choose from.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left hover:no-underline">
                How do I download my designs?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-3">You can download designs in two ways:</p>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold">From Design Assistant (after generation):</p>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Click the download icon on individual images to save them separately</li>
                      <li>Click "Download All as ZIP" to get all images and ROI analysis in one package</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">From History page:</p>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Navigate to Dashboard → History</li>
                      <li>Find your design and click the "Download" button</li>
                      <li>A ZIP file will be created with all images, metadata, and ROI analysis</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left hover:no-underline">
                Can I regenerate or modify a design?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-2">
                  Yes! You can regenerate designs with different parameters:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Go to your design's detail page from History</li>
                  <li>Click "Regenerate Design"</li>
                  <li>Modify your prompt, style preferences, or budget</li>
                  <li>Generate new variations while keeping the original design saved</li>
                </ol>
                <p className="mt-3">
                  All regenerations are tracked so you can compare different versions and choose your favorite.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left hover:no-underline">
                What image formats are supported?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-2">InnDesign supports the following image formats:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>JPEG (.jpg, .jpeg)</li>
                  <li>PNG (.png)</li>
                  <li>WebP (.webp)</li>
                </ul>
                <p className="mt-3">
                  <strong>Best practices:</strong> Use high-quality images (at least 1024x1024 pixels) with good lighting
                  for the best AI-generated results. You can upload up to 3 images per design.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-6 bg-card">
              <AccordionTrigger className="text-left hover:no-underline">
                How long does it take to generate a design?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-2">
                  Design generation typically takes 30-90 seconds, depending on:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Number of images uploaded (1-3)</li>
                  <li>Complexity of your design prompt</li>
                  <li>Current server load</li>
                </ul>
                <p className="mt-3">
                  You'll see a progress indicator during generation. The page will update automatically when your designs are ready.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* User Guide Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold">User Guides & Tutorials</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Learn the basics of using InnDesign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">1. Create Your Account</h4>
                  <p>Sign up with your email and verify your account to get started.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">2. Prepare Your Images</h4>
                  <p>Take clear, well-lit photos of your space from different angles.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">3. Describe Your Vision</h4>
                  <p>Write a detailed prompt about what you want to achieve with your design.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">4. Review Your Designs</h4>
                  <p>Explore AI-generated variations and their ROI analysis to make informed decisions.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Using the Design Assistant</CardTitle>
                <CardDescription>Master the core features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Upload Multiple Views</h4>
                  <p>Upload up to 3 images to give the AI a complete picture of your space.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Be Specific in Prompts</h4>
                  <p>Include details like colors, materials, furniture styles, and atmosphere you want.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Set Realistic Budgets</h4>
                  <p>Provide your budget range for more accurate cost estimates and ROI calculations.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Compare Themes</h4>
                  <p>Review all generated theme variations side-by-side to find your perfect match.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Understanding Your Results</CardTitle>
                <CardDescription>Make the most of AI insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Design Variations</h4>
                  <p>Each generation creates multiple themes with 2 views each for comprehensive visualization.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">ROI Metrics</h4>
                  <p>Review financial projections including costs, value increase, and return percentage.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Chain of Thought</h4>
                  <p>Read the AI's reasoning process to understand design decisions and recommendations.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Save & Compare</h4>
                  <p>All designs are automatically saved to your history for future reference and comparison.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Managing Your Designs</CardTitle>
                <CardDescription>Organize and track your projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Access History</h4>
                  <p>Find all your past designs in the History section with search and filter options.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Download Options</h4>
                  <p>Download individual images or complete ZIP packages with all assets and analysis.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Regenerate Designs</h4>
                  <p>Create variations of existing designs with different parameters while keeping originals.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Track Progress</h4>
                  <p>View statistics on designs created, total ROI potential, and usage limits.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Support */}
        <section>
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Still Need Help?</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Our support team is here to assist you with any questions or issues.
                  </p>
                </div>
                <Link href="/support">
                  <Button size="lg" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
