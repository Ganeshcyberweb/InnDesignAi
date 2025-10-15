"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, GitBranch } from "lucide-react";
import type { Design } from "@/lib/generated/prisma";

interface DesignRegenerationTimelineProps {
  designs: Design[];
  currentDesignId?: string;
  onSelectDesign?: (designId: string) => void;
  className?: string;
}

export function DesignRegenerationTimeline({
  designs,
  currentDesignId,
  onSelectDesign,
  className,
}: DesignRegenerationTimelineProps) {
  if (designs.length === 0) return null;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2 mb-3">
        <GitBranch className="w-4 h-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {designs.length} generation{designs.length !== 1 ? 's' : ''} in history
        </p>
      </div>
      
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {designs.map((design, index) => {
          const isCurrent = currentDesignId === design.id;
          const isRoot = !design.parentId;
          
          return (
            <div key={design.id} className="flex items-center">
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectDesign?.(design.id)}
                className={cn(
                  "flex items-center justify-center rounded-full transition-all",
                  "border-2 relative group",
                  isCurrent 
                    ? "w-12 h-12 bg-primary border-primary text-primary-foreground shadow-lg" 
                    : "w-10 h-10 bg-background border-muted-foreground/30 hover:border-primary/50 hover:bg-muted",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
              >
                {isRoot && (
                  <Sparkles className={cn(
                    "absolute -top-1 -right-1",
                    isCurrent ? "w-4 h-4 text-yellow-400" : "w-3 h-3 text-primary"
                  )} />
                )}
                <span className={cn(
                  "font-semibold",
                  isCurrent ? "text-sm" : "text-xs"
                )}>
                  {design.generationNumber}
                </span>
                
                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md border z-10">
                  Generation {design.generationNumber}
                  {isRoot && " (Original)"}
                </div>
              </motion.button>
              
              {/* Connector Line */}
              {index < designs.length - 1 && (
                <div className="w-8 h-0.5 bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
