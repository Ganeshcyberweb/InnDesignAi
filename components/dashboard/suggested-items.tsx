'use client'

import { motion } from 'framer-motion'
import { Save, Download, Share } from 'lucide-react'

import { Button } from '@/components/ui/button'
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

interface SuggestedItem {
  id: string
  name: string
  price: number
}

export function SuggestedItems() {
  const suggestedItems: SuggestedItem[] = [
    { id: '1', name: 'Modern Sofa', price: 1299 },
    { id: '2', name: 'Coffee Table', price: 449 },
    { id: '3', name: 'Floor Lamp', price: 189 },
    { id: '4', name: 'Area Rug', price: 329 },
  ]

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
      className="space-y-6"
    >
      {/* Suggested Items Card */}
      <Card className="bg-card border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-foreground">
            Suggested Items
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              {/* Item Image Placeholder */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(item.price)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-black hover:bg-black/90 text-white">
          <Save className="mr-2 h-4 w-4" />
          Save Project
        </Button>
        <Button variant="outline" className="w-full border-border">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button variant="outline" className="w-full border-border">
          <Share className="mr-2 h-4 w-4" />
          Share Design
        </Button>
      </div>
    </motion.div>
  )
}