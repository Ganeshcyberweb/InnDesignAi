'use client'

import { motion } from 'framer-motion'
import { Calculator } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function ROICalculator() {
  const investmentData = {
    investment: 12500,
    propertyValueIncrease: 18750,
    expectedROI: 150,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-card border border-border h-fit">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground">
            ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Investment */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Investment</span>
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(investmentData.investment)}
            </span>
          </div>

          {/* Property Value Increase */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Property Value Increase</span>
            <span className="text-lg font-semibold text-foreground">
              +{formatCurrency(investmentData.propertyValueIncrease)}
            </span>
          </div>

          {/* Expected ROI */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Expected ROI</span>
            <span className="text-2xl font-bold text-foreground">
              {investmentData.expectedROI}%
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}