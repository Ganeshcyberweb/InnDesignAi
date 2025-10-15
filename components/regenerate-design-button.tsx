"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RefreshCw, Loader2 } from "lucide-react";
import { useDesignRegeneration } from "@/hooks/use-design-regeneration";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface RegenerateDesignButtonProps {
  designId: string;
  currentPrompt?: string;
  aiModelUsed?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onSuccess?: (newDesignId: string) => void;
  redirectToGenerate?: boolean;
}

export function RegenerateDesignButton({
  designId,
  currentPrompt = "",
  aiModelUsed = "gemini-2.5-flash-image",
  variant = "default",
  size = "default",
  className,
  onSuccess,
  redirectToGenerate = true,
}: RegenerateDesignButtonProps) {
  const router = useRouter();
  const { createRegeneration, isRegenerating } = useDesignRegeneration();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState(currentPrompt);
  const [error, setError] = useState<string | null>(null);

  const handleRegenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for the regeneration");
      return;
    }

    setError(null);

    try {
      const newDesign = await createRegeneration(
        designId,
        prompt,
        aiModelUsed
      );

      if (newDesign) {
        setIsOpen(false);
        
        if (onSuccess) {
          onSuccess(newDesign.id);
        }

        if (redirectToGenerate) {
          // Redirect to dashboard/generate page with the new design context
          router.push(`/dashboard?regenerateFrom=${newDesign.id}`);
        }
      } else {
        setError("Failed to create regeneration. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={cn(className)}
          disabled={isRegenerating}
        >
          {isRegenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Design
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Regeneration</DialogTitle>
          <DialogDescription>
            Modify the prompt to create a new variation of this design. 
            This will be saved as Generation {/* generation number will be calculated */} in the design history.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="prompt">Design Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the changes you'd like to make..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              {prompt.length} characters
            </p>
          </div>
          <div className="bg-muted rounded-lg p-3 space-y-1">
            <p className="text-sm font-medium">AI Model</p>
            <p className="text-sm text-muted-foreground">{aiModelUsed}</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isRegenerating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating || !prompt.trim()}
          >
            {isRegenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Create Regeneration
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
