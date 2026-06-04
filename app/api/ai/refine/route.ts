/**
 * POST /api/ai/refine
 *
 * Pre-generation "smart intake": given the user's prompt + form data, decide
 * which 0–2 quick-pick questions would meaningfully improve the result.
 *
 * Rule-based on purpose — no Gemini call, no DB writes, fast and predictable.
 * The endpoint is public (no auth required): it's free to call, doesn't count
 * against a guest's prompt limit, and never reveals user data.
 */
import { NextRequest, NextResponse } from 'next/server'

interface RefineRequestBody {
  userPrompt?: string
  formData?: {
    stylePreference?: string
    budgetRange?: string
    mood?: string
    colorPalette?: string
  }
}

interface ChipOption {
  value: string
  label: string
}

interface RefinementQuestion {
  id: 'mood' | 'budget'
  label: string
  helper?: string
  options: ChipOption[]
  skipLabel: string
}

// Words that, if present in the prompt, indicate the user already has a
// mood/style preference — so we don't ask them about it.
const STYLE_KEYWORDS = [
  'modern',
  'minimalist',
  'minimal',
  'scandi',
  'scandinavian',
  'traditional',
  'contemporary',
  'industrial',
  'bohemian',
  'boho',
  'mediterranean',
  'rustic',
  'farmhouse',
  'mid-century',
  'midcentury',
  'art deco',
  'transitional',
  'coastal',
  'eclectic',
  'luxe',
  'luxury',
  'cozy',
  'warm',
  'minimal',
  'maximalist',
  'japandi',
]

// Words / patterns that suggest the user already has a budget in mind.
const BUDGET_PATTERNS = [
  /\$\s?\d/i,
  /\b\d{1,3}[,.]?\d{3}\b/, // "5,000", "10000"
  /\b\d+\s?k\b/i, // "5k", "10K"
  /\bbudget/i,
  /\bcheap\b/i,
  /\baffordable\b/i,
  /\bexpensive\b/i,
]

const MOOD_QUESTION: RefinementQuestion = {
  id: 'mood',
  label: 'What mood are you going for?',
  helper: 'Pick the closest — this steers the palette and finishes.',
  options: [
    { value: 'cozy', label: 'Cozy' },
    { value: 'modern minimalist', label: 'Modern' },
    { value: 'luxe', label: 'Luxe' },
    { value: 'rustic', label: 'Rustic' },
    { value: 'eclectic', label: 'Eclectic' },
  ],
  skipLabel: 'Skip — use what I gave you',
}

const BUDGET_QUESTION: RefinementQuestion = {
  id: 'budget',
  label: "What's your budget range?",
  helper: 'Helps us match furniture and finishes to the right tier.',
  options: [
    { value: 'Under $5,000', label: 'Under $5k' },
    { value: '$5,000 - $15,000', label: '$5k – $15k' },
    { value: '$15,000 - $50,000', label: '$15k – $50k' },
    { value: '$50,000+', label: '$50k+' },
  ],
  skipLabel: 'Skip — flexible',
}

function hasStyleKeyword(prompt: string): boolean {
  const lower = prompt.toLowerCase()
  return STYLE_KEYWORDS.some((k) => lower.includes(k))
}

function hasBudgetMention(prompt: string): boolean {
  return BUDGET_PATTERNS.some((p) => p.test(prompt))
}

export async function POST(request: NextRequest) {
  let body: RefineRequestBody
  try {
    body = (await request.json()) as RefineRequestBody
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const userPrompt = (body.userPrompt ?? '').toString()
  const formData = body.formData ?? {}

  const questions: RefinementQuestion[] = []

  // Mood: skip if the form already has a style preference OR the prompt
  // mentions a style keyword.
  const moodKnown =
    !!formData.stylePreference?.trim() ||
    !!formData.mood?.trim() ||
    hasStyleKeyword(userPrompt)

  if (!moodKnown) {
    questions.push(MOOD_QUESTION)
  }

  // Budget: skip if the form already has a budgetRange OR the prompt
  // mentions money-ish language.
  const budgetKnown =
    !!formData.budgetRange?.trim() || hasBudgetMention(userPrompt)

  if (!budgetKnown) {
    questions.push(BUDGET_QUESTION)
  }

  // Cap at 2 questions — anything more and people bounce.
  return NextResponse.json({ success: true, questions: questions.slice(0, 2) })
}
