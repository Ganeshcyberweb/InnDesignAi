"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  Clock, 
  Sparkles, 
  ArrowRight,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download
} from "lucide-react";
import type { Design, DesignOutput } from "@/lib/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { R2Image } from "@/components/ui/r2-image";
import { downloadDesignPackage } from "@/lib/utils/download";
import { toast } from "sonner";

interface DesignWithOutputs extends Design {
  designOutputs?: DesignOutput[];
}

interface DesignRegenerationHistoryProps {
  designs: DesignWithOutputs[];
  currentDesignId?: string;
  onSelectDesign?: (designId: string) => void;
  className?: string;
}

export function DesignRegenerationHistory({
  designs,
  currentDesignId,
  onSelectDesign,
  className,
}: DesignRegenerationHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (e: React.MouseEvent, design: DesignWithOutputs) => {
    e.stopPropagation();

    if (downloadingId) {
      toast.warning('Please wait for the current download to complete');
      return;
    }

    setDownloadingId(design.id);
    toast.loading('Preparing download with fresh signed URLs...', { id: 'download' });

    try {
      // downloadDesignPackage now fetches fresh data from API internally
      await downloadDesignPackage(
        design,
        design.designOutputs || [],
        design.roiNotes || null
      );
      toast.success('Download complete!', { id: 'download' });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download design package. Please try again.', { id: 'download' });
    } finally {
      setDownloadingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "PROCESSING":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "FAILED":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isRootDesign = (design: DesignWithOutputs) => !design.parentId;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          <CardTitle>Design History</CardTitle>
        </div>
        <CardDescription>
          View and navigate through all regenerations of this design
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {designs.map((design, index) => {
              const isExpanded = expandedId === design.id;
              const isCurrent = currentDesignId === design.id;
              const isRoot = isRootDesign(design);

              return (
                <div key={design.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={cn(
                        "transition-all cursor-pointer hover:shadow-md",
                        isCurrent && "ring-2 ring-primary shadow-lg",
                        isRoot && "border-primary/50"
                      )}
                      onClick={() => onSelectDesign?.(design.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 flex-1">
                              {getStatusIcon(design.status)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-semibold text-sm">
                                    Generation {design.generationNumber}
                                  </h4>
                                  {isRoot && (
                                    <Badge variant="outline" className="text-xs">
                                      <Sparkles className="w-3 h-3 mr-1" />
                                      Original
                                    </Badge>
                                  )}
                                  {isCurrent && (
                                    <Badge variant="default" className="text-xs">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Created {formatDistanceToNow(new Date(design.createdAt), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn("text-xs", getStatusColor(design.status))}
                            >
                              {design.status}
                            </Badge>
                          </div>

                          {/* AI Model */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Sparkles className="w-3 h-3" />
                            <span>{design.customRequirements}</span>
                          </div>

                          {/* Prompt Preview */}
                          <div className="bg-muted/50 rounded-md p-2">
                            <p className="text-xs line-clamp-2 text-foreground/80">
                              {design.description}
                            </p>
                          </div>

                          {/* Expand/Collapse Button */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => handleDownload(e, design)}
                              disabled={downloadingId === design.id}
                              className="flex-1"
                            >
                              <Download className={cn(
                                "w-3 h-3 mr-1",
                                downloadingId === design.id && "animate-pulse"
                              )} />
                              Download
                            </Button>
                            {design.designOutputs && design.designOutputs.length > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 justify-between"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedId(isExpanded ? null : design.id);
                                }}
                              >
                                <span className="text-xs">
                                  {design.designOutputs.length} output{design.designOutputs.length !== 1 ? 's' : ''}
                                </span>
                                <ChevronRight 
                                  className={cn(
                                    "w-4 h-4 transition-transform",
                                    isExpanded && "rotate-90"
                                  )}
                                />
                              </Button>
                            )}
                          </div>

                          {/* Expanded Outputs */}
                          <AnimatePresence>
                            {isExpanded && design.designOutputs && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                  {design.designOutputs.map((output) => (
                                    <div 
                                      key={output.id}
                                      className="relative aspect-square rounded-md overflow-hidden border bg-muted group"
                                    >
                                      <R2Image
                                        src={output.outputImageUrl}
                                        alt={output.variationName || "Design output"}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                      />
                                      {output.variationName && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center">
                                          {output.variationName}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Connector Arrow */}
                  {index < designs.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowRight className="w-5 h-5 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {designs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No design history available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
