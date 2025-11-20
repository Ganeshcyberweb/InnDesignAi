"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Crown,
  HelpCircle
} from "lucide-react";
import { HeroHeader } from "@/components/smoothui/blocks/HeroHeader";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    description: "Perfect for trying out InnDesign AI",
    price: {
      monthly: 0,
      annually: 0
    },
    icon: Sparkles,
    features: [
      "10 design generations per month",
      "3 themes with 2 views each",
      "Upload up to 3 images",
      "Basic color palettes",
      "Design history (30 days)",
      "Standard support"
    ],
    limitations: [
      "No custom color palettes",
      "Limited furniture selection",
      "No ROI analysis"
    ],
    cta: "Start Free",
    highlighted: false,
    popular: false
  },
  {
    name: "Pro",
    description: "For serious designers and homeowners",
    price: {
      monthly: 29,
      annually: 290
    },
    icon: Zap,
    features: [
      "Unlimited design generations",
      "3 themes with 2 views each",
      "Upload up to 5 images per design",
      "Custom color palettes",
      "Furniture catalog access",
      "Full design history",
      "ROI analysis",
      "Priority support",
      "HD downloads",
      "Advanced style mixing"
    ],
    limitations: [],
    cta: "Start Pro Trial",
    highlighted: true,
    popular: true
  },
  {
    name: "Designer",
    description: "For professional interior designers",
    price: {
      monthly: 79,
      annually: 790
    },
    icon: Crown,
    features: [
      "Everything in Pro",
      "Unlimited projects",
      "Client collaboration tools",
      "Team access (up to 3 members)",
      "White-label exports",
      "API access",
      "Custom branding",
      "Dedicated account manager",
      "24/7 priority support",
      "Early access to new features"
    ],
    limitations: [],
    cta: "Contact Sales",
    highlighted: false,
    popular: false
  }
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
  },
  {
    question: "What happens when I reach my generation limit?",
    answer: "On the Free plan, you'll need to wait for the next month or upgrade to Pro for unlimited generations."
  },
  {
    question: "Do annual plans save money?",
    answer: "Yes! Annual plans save you 2 months compared to paying monthly. That's over 16% savings."
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Pro plan comes with a 14-day free trial. No credit card required. Designer plan includes a personalized demo."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal. Enterprise customers can pay via invoice."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. Cancel anytime from your account settings. You'll retain access until the end of your billing period."
  }
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

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
              Pricing
            </motion.div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl mb-6">
              Simple, Transparent Pricing
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-8">
              Choose the perfect plan for your interior design needs. All plans include our core AI features.
            </p>

            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-4 p-1 rounded-full bg-muted"
            >
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annually")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all relative",
                  billingCycle === "annually"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Annually
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  Save 16%
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "relative rounded-2xl border p-8",
                  plan.highlighted
                    ? "border-primary shadow-xl scale-105 bg-card"
                    : "border-border bg-card hover:shadow-lg transition-shadow"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4",
                    plan.highlighted ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    <plan.icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-foreground">
                      ${billingCycle === "monthly" ? plan.price.monthly : plan.price.annually}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-muted-foreground">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    )}
                  </div>

                  {billingCycle === "annually" && plan.price.monthly > 0 && (
                    <p className="text-xs text-muted-foreground">
                      ${(plan.price.annually / 12).toFixed(2)} per month
                    </p>
                  )}
                </div>

                <Button
                  asChild
                  className="w-full mb-6"
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  <Link href={plan.name === "Designer" ? "/support" : "/signup"}>
                    {plan.cta}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}

                  {plan.limitations.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Not included:</p>
                      {plan.limitations.map((limitation, limIndex) => (
                        <div key={limIndex} className="flex items-start gap-3 mb-2">
                          <span className="text-muted-foreground text-xs">•</span>
                          <span className="text-xs text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Have questions? We've got answers.
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-lg border border-border p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {faq.question}
                </h3>
                <p className="text-muted-foreground">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <Button asChild variant="outline">
              <Link href="/support">
                Contact Support
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Start Designing Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users creating beautiful spaces with InnDesign AI
            </p>
            <Button asChild size="lg">
              <Link href="/signup">
                Get Started Free
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
