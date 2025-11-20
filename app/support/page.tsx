"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  HelpCircle,
  Mail,
  MessageSquare,
  Send,
  ChevronRight,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { HeroHeader } from "@/components/smoothui/blocks/HeroHeader";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const faqs = [
  {
    question: "How does InnDesign AI work?",
    answer: "InnDesign AI uses advanced artificial intelligence to analyze your design preferences, room dimensions, and uploaded images. It then generates multiple design variations tailored to your style, incorporating your chosen color palette, furniture selections, and budget considerations."
  },
  {
    question: "What image formats are supported?",
    answer: "We support JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp), and GIF (.gif) formats. Each image should be under 10MB in size. You can upload up to 5 images per design generation to help the AI better understand your space and preferences."
  },
  {
    question: "How many designs can I generate?",
    answer: "Each generation creates 3 different design themes, with 2 views per theme (6 images total). You can generate unlimited designs with your account. All your designs are automatically saved to your history for easy access later."
  },
  {
    question: "Can I regenerate designs with different preferences?",
    answer: "Yes! You can regenerate any previous design with modified preferences. Click 'Regenerate' on any design in your history, adjust your settings, and create a new variation. The system tracks generation chains so you can see how your designs evolved."
  },
  {
    question: "What's included in each design theme?",
    answer: "Each theme includes two complementary views of your space with AI-generated furniture placement, color coordination, lighting suggestions, and decorative elements. Themes are generated based on your selected style (modern, traditional, bohemian, etc.) and incorporate your color palette and budget range."
  },
  {
    question: "How do I download my designs?",
    answer: "All generated designs can be viewed in full-screen mode by clicking on them. To download, simply right-click on the image and select 'Save Image As' or use your browser's download functionality. Designs are also stored in your history for future access."
  },
  {
    question: "Can I select specific furniture items?",
    answer: "Absolutely! Browse our furniture suggestions carousel and click on items you'd like to include. You can select up to 3 furniture pieces per generation. The AI will incorporate these items into your design layout, ensuring they fit your style and space."
  },
  {
    question: "What if I don't like the generated designs?",
    answer: "Try regenerating with more specific descriptions, different style preferences, or additional reference images. The more detail you provide about your vision, the better the AI can understand and deliver what you're looking for. You can also adjust color palettes, room sizes, and budget ranges."
  },
  {
    question: "How do custom color palettes work?",
    answer: "You can choose from preset color palettes (neutral, warm, cool, bold) or create your own custom palette with three colors of your choice. The AI will use these colors as the foundation for your design, applying them to walls, furniture, accessories, and decor."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take security seriously. All uploaded images and personal data are encrypted and stored securely. We never share your data with third parties. You can delete your designs and account at any time from your dashboard settings."
  },
  {
    question: "Can I use InnDesign for commercial projects?",
    answer: "Yes, InnDesign can be used for both personal and commercial interior design projects. Our Designer accounts include additional features tailored for professional use, such as client collaboration tools and higher generation limits."
  },
  {
    question: "What room types are supported?",
    answer: "We currently support living rooms, bedrooms, kitchens, bathrooms, dining rooms, and home offices. Each room type has specialized AI models trained on appropriate furniture, layouts, and design principles for that specific space."
  },
  {
    question: "How long does generation take?",
    answer: "Most design generations complete in 15-30 seconds, depending on the complexity of your requirements and the number of uploaded images. You'll see a progress indicator with AI thinking steps while your design is being created."
  },
  {
    question: "Can I share my designs with others?",
    answer: "Yes! You can download your designs and share them via any platform. We're also working on built-in sharing features that will let you send design links directly to friends, family, or clients."
  }
];

const categories = [
  {
    title: "Getting Started",
    icon: HelpCircle,
    description: "New to InnDesign? Start here",
    link: "/guide"
  },
  {
    title: "Design Guide",
    icon: MessageSquare,
    description: "Learn how to create better designs",
    link: "/guide"
  },
  {
    title: "Contact Support",
    icon: Mail,
    description: "Get help from our team",
    link: "#contact"
  }
];

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
              <HelpCircle className="mr-2 h-3 w-3" />
              Help & Support
            </motion.div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              How can we help you?
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Find answers to common questions or reach out to our support team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={category.link}
                  className="block bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about using InnDesign AI
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
              Still need help?
            </h2>
            <p className="text-lg text-muted-foreground">
              Send us a message and we'll get back to you within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-xl border border-border p-8"
          >
            {isSubmitted ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground">
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more..."
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            <p>
              You can also email us directly at{" "}
              <a href="mailto:support@inndesign.ai" className="text-primary hover:underline">
                support@inndesign.ai
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
