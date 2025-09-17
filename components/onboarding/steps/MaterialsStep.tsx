"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TreePine, Hammer, Gem, Shirt, Coffee, Flower, CheckCircle2 } from "lucide-react";
import type { OnboardingData } from "../OnboardingWizard";

interface MaterialsStepProps {
  data: OnboardingData;
  updateData: (field: keyof OnboardingData, value: any) => void;
  onNext: () => void;
}

const MATERIALS = [
  {
    id: 'wood',
    label: 'Wood',
    description: 'Natural warmth and organic texture',
    icon: TreePine,
    color: 'bg-amber-50 border-amber-200 text-amber-900',
    iconColor: 'text-amber-600',
    examples: ['Oak', 'Walnut', 'Pine', 'Bamboo']
  },
  {
    id: 'metal',
    label: 'Metal',
    description: 'Modern industrial appeal and durability',
    icon: Hammer,
    color: 'bg-slate-50 border-slate-200 text-slate-900',
    iconColor: 'text-slate-600',
    examples: ['Steel', 'Brass', 'Copper', 'Iron']
  },
  {
    id: 'stone',
    label: 'Stone',
    description: 'Timeless elegance and natural beauty',
    icon: Gem,
    color: 'bg-muted border-gray-200 text-foreground',
    iconColor: 'text-muted-foreground',
    examples: ['Marble', 'Granite', 'Slate', 'Travertine']
  },
  {
    id: 'fabric',
    label: 'Fabric',
    description: 'Soft textures and comfort',
    icon: Shirt,
    color: 'bg-purple-50 border-purple-200 text-purple-900',
    iconColor: 'text-purple-600',
    examples: ['Linen', 'Velvet', 'Cotton', 'Wool']
  },
  {
    id: 'leather',
    label: 'Leather',
    description: 'Luxury and sophisticated appeal',
    icon: Coffee,
    color: 'bg-orange-50 border-orange-200 text-orange-900',
    iconColor: 'text-orange-600',
    examples: ['Full-grain', 'Suede', 'Nappa', 'Distressed']
  },
  {
    id: 'ceramic',
    label: 'Ceramic',
    description: 'Versatile and easy to maintain',
    icon: Flower,
    color: 'bg-primary/5 border-primary/20 text-blue-900',
    iconColor: 'text-primary',
    examples: ['Porcelain', 'Terracotta', 'Glazed', 'Mosaic']
  }
];

export function MaterialsStep({ data, updateData, onNext }: MaterialsStepProps) {
  const selectedMaterials = data.materialPreferences || [];

  const toggleMaterial = (materialId: string) => {
    const currentMaterials = [...selectedMaterials];
    const index = currentMaterials.indexOf(materialId);

    if (index > -1) {
      currentMaterials.splice(index, 1);
    } else {
      currentMaterials.push(materialId);
    }

    updateData('materialPreferences', currentMaterials);
  };

  const handleNext = () => {
    if (selectedMaterials.length > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Gem className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Select your preferred materials
          </h2>
          <p className="text-slate-600 text-lg">
            Choose one or more materials that appeal to you
          </p>
        </motion.div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {MATERIALS.map((material, index) => {
          const Icon = material.icon;
          const isSelected = selectedMaterials.includes(material.id);

          return (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected
                    ? 'ring-2 ring-blue-500 bg-primary/5 border-primary/20'
                    : 'hover:border-slate-300'
                }`}
                onClick={() => toggleMaterial(material.id)}
              >
                <div className="text-center space-y-4">
                  <div className={`w-16 h-16 rounded-full ${material.color} flex items-center justify-center mx-auto relative`}>
                    <Icon className={`w-8 h-8 ${material.iconColor}`} />

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-slate-900 mb-1">
                      {material.label}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {material.description}
                    </p>

                    {/* Examples */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {material.examples.map((example) => (
                        <span
                          key={example}
                          className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selection summary */}
      {selectedMaterials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <p className="text-primary font-medium">
            ✓ {selectedMaterials.length} material{selectedMaterials.length > 1 ? 's' : ''} selected
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {selectedMaterials.map((materialId) => {
              const material = MATERIALS.find(m => m.id === materialId);
              return (
                <span
                  key={materialId}
                  className="px-3 py-1 bg-primary/10 text-blue-800 text-sm rounded-full font-medium"
                >
                  {material?.label}
                </span>
              );
            })}
          </div>

          <Button
            onClick={handleNext}
            className="mt-4"
            size="lg"
          >
            Continue with Selected Materials
          </Button>
        </motion.div>
      )}

      {selectedMaterials.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-slate-500 text-sm">
            Select at least one material to continue
          </p>
        </motion.div>
      )}
    </div>
  );
}