'use client'

import { motion } from 'framer-motion'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { Settings2, Shuffle, Target, Zap, Ban, Info } from 'lucide-react'

import type { GenerationParameters } from '@/app/types/design'

interface AdvancedSettingsProps {
  parameters: GenerationParameters
  onChange: (parameters: GenerationParameters) => void
}

export function AdvancedSettings({ parameters, onChange }: AdvancedSettingsProps) {
  const updateParameter = (key: keyof GenerationParameters, value: any) => {
    onChange({
      ...parameters,
      [key]: value
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center space-x-2">
        <Settings2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Advanced Parameters</h3>
        <Badge variant="outline" className="text-xs">Expert Mode</Badge>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          These settings provide fine-grained control over the AI generation process.
          Default values work well for most use cases.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seed */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center space-x-2">
            <Shuffle className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Seed</Label>
            <Badge variant="secondary" className="text-xs">Optional</Badge>
          </div>
          <Input
            type="number"
            placeholder="Random (leave empty)"
            value={parameters.seed || ''}
            onChange={(e) => updateParameter('seed', e.target.value ? Number(e.target.value) : undefined)}
            min={0}
            max={2147483647}
          />
          <p className="text-xs text-muted-foreground">
            Use the same seed to reproduce identical results. Leave empty for random generation.
          </p>
        </motion.div>

        {/* Guidance Scale */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Guidance Scale</Label>
            <Badge variant="outline" className="text-xs">
              {parameters.guidance_scale || 7.5}
            </Badge>
          </div>
          <Slider
            min={1}
            max={20}
            step={0.5}
            value={[parameters.guidance_scale || 7.5]}
            onValueChange={(values) => updateParameter('guidance_scale', values[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Creative (1)</span>
            <span>Balanced (7.5)</span>
            <span>Precise (20)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Higher values follow your prompt more closely but may reduce creativity.
          </p>
        </motion.div>

        {/* Inference Steps */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <Label className="font-medium">Inference Steps</Label>
            <Badge variant="outline" className="text-xs">
              {parameters.num_inference_steps || 50}
            </Badge>
          </div>
          <Slider
            min={10}
            max={150}
            step={5}
            value={[parameters.num_inference_steps || 50]}
            onValueChange={(values) => updateParameter('num_inference_steps', values[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Fast (10)</span>
            <span>Quality (50)</span>
            <span>Max (150)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            More steps usually improve quality but increase generation time and cost.
          </p>
        </motion.div>

        {/* Style Strength */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="h-4 w-4 text-muted-foreground font-bold text-xs">S</span>
            <Label className="font-medium">Style Strength</Label>
            <Badge variant="outline" className="text-xs">
              {parameters.style_strength || 0.8}
            </Badge>
          </div>
          <Slider
            min={0.1}
            max={1.0}
            step={0.1}
            value={[parameters.style_strength || 0.8]}
            onValueChange={(values) => updateParameter('style_strength', values[0])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtle (0.1)</span>
            <span>Moderate (0.8)</span>
            <span>Strong (1.0)</span>
          </div>
          <p className="text-xs text-muted-foreground">
            How strongly the selected style influences the final design.
          </p>
        </motion.div>
      </div>

      <Separator />

      {/* Negative Prompt */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center space-x-2">
          <Ban className="h-4 w-4 text-muted-foreground" />
          <Label className="font-medium">Negative Prompt</Label>
          <Badge variant="outline" className="text-xs">Optional</Badge>
        </div>
        <Textarea
          placeholder="Describe what you DON'T want in the design (e.g., 'cluttered, dark, outdated furniture, bad lighting')"
          value={parameters.negative_prompt || ''}
          onChange={(e) => updateParameter('negative_prompt', e.target.value)}
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground">
          Specify elements to avoid in the generated design. This helps exclude unwanted features.
        </p>
      </motion.div>

      {/* Composition Strength */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="h-4 w-4 text-muted-foreground font-bold text-xs">C</span>
          <Label className="font-medium">Composition Strength</Label>
          <Badge variant="outline" className="text-xs">
            {parameters.composition_strength || 0.6}
          </Badge>
        </div>
        <Slider
          min={0.1}
          max={1.0}
          step={0.1}
          value={[parameters.composition_strength || 0.6]}
          onValueChange={(values) => updateParameter('composition_strength', values[0])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Flexible (0.1)</span>
          <span>Balanced (0.6)</span>
          <span>Rigid (1.0)</span>
        </div>
        <p className="text-xs text-muted-foreground">
          How closely the layout follows traditional design composition rules.
        </p>
      </motion.div>

      {/* Parameters Summary */}
      <motion.div
        variants={itemVariants}
        className="bg-muted/50 rounded-lg p-4 space-y-2"
      >
        <h4 className="font-medium text-sm">Current Settings Summary</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Seed:</span>
            <span>{parameters.seed || 'Random'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Guidance:</span>
            <span>{parameters.guidance_scale || 7.5}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Steps:</span>
            <span>{parameters.num_inference_steps || 50}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Style:</span>
            <span>{parameters.style_strength || 0.8}</span>
          </div>
          <div className="flex justify-between col-span-2">
            <span className="text-muted-foreground">Composition:</span>
            <span>{parameters.composition_strength || 0.6}</span>
          </div>
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h4 className="font-medium text-sm">Pro Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <p className="font-medium">For photorealistic results:</p>
            <p className="text-muted-foreground">
              • Higher guidance scale (10-15)
              • More inference steps (70-100)
              • Lower style strength (0.4-0.6)
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">For creative exploration:</p>
            <p className="text-muted-foreground">
              • Lower guidance scale (3-7)
              • Standard steps (50)
              • Higher style strength (0.8-1.0)
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}