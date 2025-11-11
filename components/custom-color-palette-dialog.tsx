"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDesignFormStore } from "@/stores/design-form-store"

interface CustomColorPaletteDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function CustomColorPaletteDialog({ 
  open: controlledOpen, 
  onOpenChange: controlledOnOpenChange,
  children 
}: CustomColorPaletteDialogProps) {
  const { formData, updateCustomColor } = useDesignFormStore()
  const [internalOpen, setInternalOpen] = React.useState(false)
  
  // Use controlled or uncontrolled state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = controlledOnOpenChange || setInternalOpen

  const handleColorChange = (index: number, value: string) => {
    // Ensure the value is a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(value) || value.startsWith('#')) {
      updateCustomColor(index, value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Color Palette</DialogTitle>
          <DialogDescription>
            Choose three colors for your custom palette. These will be used to generate your design.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {formData.customColors.map((color, index) => (
            <div key={index} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`color-${index}`} className="text-right">
                Color {index + 1}
              </Label>
              <div className="col-span-3 flex gap-2">
                <div
                  className="w-10 h-10 rounded border border-stone-200 flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <Input
                  id={`color-${index}`}
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="h-10 w-20 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  placeholder="#000000"
                  className="h-10 flex-1 font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Reset to default custom colors
              formData.customColors.forEach((_, index) => {
                updateCustomColor(index, ["#000000", "#808080", "#ffffff"][index])
              })
            }}
          >
            Reset
          </Button>
          <Button onClick={() => setOpen(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
