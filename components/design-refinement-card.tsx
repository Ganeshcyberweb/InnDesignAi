"use client"

import { useEffect, useState } from "react"
import { Sparkles, ArrowRight, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface RefinementChip {
  value: string
  label: string
}

export interface RefinementQuestion {
  id: "mood" | "budget"
  label: string
  helper?: string
  options: RefinementChip[]
  skipLabel: string
}

export type RefinementAnswers = Partial<Record<RefinementQuestion["id"], string>>

interface DesignRefinementCardProps {
  questions: RefinementQuestion[]
  onSubmit: (answers: RefinementAnswers) => void
  /** Optional cancel action — closes the card without generating. */
  onCancel?: () => void
  /** Tied to the underlying generation request so the button can show progress. */
  submitting?: boolean
  className?: string
}

/**
 * Inline card shown right after the user submits a prompt. Lets them pick from
 * 0–2 quick chip questions (mood, budget) to give the AI extra context before
 * generation kicks off. Power users can skip any question — every question
 * defaults to "no answer" and "Generate" is always enabled.
 */
export function DesignRefinementCard({
  questions,
  onSubmit,
  onCancel,
  submitting,
  className,
}: DesignRefinementCardProps) {
  const [answers, setAnswers] = useState<RefinementAnswers>({})

  // Reset selections when the question set changes (e.g. between two prompts).
  useEffect(() => {
    setAnswers({})
  }, [questions])

  if (questions.length === 0) return null

  const pick = (qId: RefinementQuestion["id"], value: string) =>
    setAnswers((prev) => ({
      ...prev,
      [qId]: prev[qId] === value ? undefined : value,
    }))

  const handleSubmit = () => onSubmit(answers)
  const handleSkipAll = () => onSubmit({})

  return (
    <Card className={cn("border-primary/20 bg-primary/5", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <CardTitle className="text-base">A couple of quick questions</CardTitle>
        </div>
        <CardDescription>
          These steer the result. Each one is optional — skip anything you don&apos;t care about.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {questions.map((q) => (
          <div key={q.id} className="space-y-2">
            <div>
              <p className="text-sm font-medium">{q.label}</p>
              {q.helper && (
                <p className="text-xs text-muted-foreground">{q.helper}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => pick(q.id, opt.value)}
                    aria-pressed={selected}
                    disabled={submitting}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                      selected
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background hover:bg-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={submitting}
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={submitting}
            onClick={handleSkipAll}
          >
            Skip — use what I gave you
          </Button>
          <Button type="button" size="sm" disabled={submitting} onClick={handleSubmit}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4" />
            )}
            Generate
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
