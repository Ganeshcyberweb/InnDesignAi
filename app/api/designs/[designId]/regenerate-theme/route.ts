/**
 * POST /api/designs/:designId/regenerate-theme
 *
 * Body: { themeKey: string, feedback?: string }
 *
 * Generates 2 fresh images for ONE theme of an existing design, using the
 * design's original context + the user's refinement feedback. Each new image
 * is uploaded to R2 server-side and a new `design_outputs` row is appended
 * (the older outputs are preserved as iteration history). Response is an
 * NDJSON stream so the client can show themes filling in progressively.
 *
 * Auth: required. The design must belong to the calling user.
 *
 * NOTE: THEMES / VIEWS are duplicated inline here to avoid coupling with the
 * inline constants in /api/ai/generate-themes/route.ts. When the
 * prompt-redesign branch lands (lib/gemini/themes.ts shared module), unify
 * this file's THEMES/VIEWS with that source of truth.
 */
import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "node:crypto"

import googleAI, { SYSTEM_INSTRUCTIONS } from "@/lib/gemini/ai"
import { Modality } from "@google/genai"
import { prisma } from "@/lib/prisma"
import { uploadImageToR2 } from "@/lib/r2-storage"
import { buildDesignPrompt } from "@/lib/utils/prompt-builder"
import { trackAiGeneration, type AiGenerationStatus } from "@/lib/analytics/track"

// ----- Local THEMES/VIEWS (mirror of generate-themes constants) -------------

const THEMES = [
  {
    theme: "modern",
    label: "Modern Minimalist",
    styleModifier:
      "modern minimalist style with clean lines, neutral colors, and contemporary furniture",
  },
  {
    theme: "cozy",
    label: "Cozy Traditional",
    styleModifier:
      "cozy traditional style with warm colors, comfortable textiles, and classic furniture",
  },
  {
    theme: "luxury",
    label: "Luxury Contemporary",
    styleModifier:
      "luxury contemporary style with premium materials, elegant finishes, and high-end furniture",
  },
] as const

type ThemeKey = (typeof THEMES)[number]["theme"]

const VIEWS = [
  { angle: "main", description: "Main view showing the full room layout from eye level" },
  { angle: "detail", description: "Detailed view focusing on key design elements and furniture arrangement" },
] as const

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_FEEDBACK_LEN = 500

// ----- Handler ---------------------------------------------------------------

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ designId: string }> }
) {
  const startTime = Date.now()
  const userId = request.headers.get("x-user-id")
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { designId } = await context.params
  if (!UUID_RE.test(designId)) {
    return NextResponse.json({ success: false, error: "Invalid design id" }, { status: 400 })
  }

  let body: { themeKey?: unknown; feedback?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 })
  }

  const themeKey = typeof body.themeKey === "string" ? body.themeKey.trim() : ""
  const theme = THEMES.find((t) => t.theme === themeKey) as (typeof THEMES)[number] | undefined
  if (!theme) {
    return NextResponse.json(
      { success: false, error: `Unknown themeKey — must be one of: ${THEMES.map((t) => t.theme).join(", ")}` },
      { status: 400 }
    )
  }

  const feedbackRaw = typeof body.feedback === "string" ? body.feedback.trim() : ""
  const feedback = feedbackRaw.slice(0, MAX_FEEDBACK_LEN)

  // Load the design (ownership + context).
  const design = await prisma.design.findUnique({
    where: { id: designId },
    select: {
      userId: true,
      description: true,
      roomType: true,
      size: true,
      budget: true,
      style: true,
      stylePreference: true,
      colorScheme: true,
      colorPalette: true,
      outputs: {
        select: { generationParameters: true },
      },
    },
  })
  if (!design) {
    return NextResponse.json({ success: false, error: "Design not found" }, { status: 404 })
  }
  if (design.userId !== userId) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
  }

  // Determine the next iteration number for this theme.
  let maxIteration = 1
  for (const o of design.outputs) {
    const p = (o.generationParameters as any) ?? null
    if (p?.theme === theme.theme && typeof p?.iteration === "number") {
      maxIteration = Math.max(maxIteration, p.iteration)
    }
  }
  const iteration = maxIteration + 1

  // Build the base prompt context. The feedback is appended to the user's
  // original description so the model has both the original intent and the
  // refinement direction.
  const promptText = [
    design.description ?? "",
    feedback ? `REFINEMENT FEEDBACK: ${feedback}` : null,
  ]
    .filter(Boolean)
    .join("\n\n")

  const customColors = Array.isArray(design.colorPalette) ? (design.colorPalette as string[]) : undefined

  const basePromptArgs = {
    prompt: promptText,
    roomType: design.roomType ?? "",
    roomSize: design.size ?? "",
    stylePreference: design.stylePreference ?? design.style ?? "",
    budgetRange: design.budget ? `~$${design.budget.toString()}` : "",
    colorPalette: design.colorScheme ?? "",
    customColors,
    selectedFurnitureItems: [], // not stored on Design; intentionally omitted here
  }

  // Per-request analytics state. Mirror /api/ai/generate-themes pattern.
  const tracking = {
    userId,
    guestSessionId: null,
    promptText,
    status: "failed" as AiGenerationStatus,
    themeCount: 1, // single-theme regeneration
    imageCount: 0,
    tokensInput: 0,
    tokensOutput: 0,
    errorMessage: null as string | null,
  }
  const writeAnalytics = () => {
    trackAiGeneration({
      ...tracking,
      tokensInput: tracking.tokensInput || null,
      tokensOutput: tracking.tokensOutput || null,
      durationMs: Date.now() - startTime,
    })
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      const send = (event: Record<string, unknown>) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"))
        } catch {
          // client closed — generation loop will detect and exit
        }
      }

      const newImageUrls: string[] = []

      try {
        send({
          type: "progress",
          step: `Refining ${theme.label}${feedback ? " with your feedback" : ""}…`,
        })

        for (const view of VIEWS) {
          const themePrompt = `${buildDesignPrompt(basePromptArgs)}\n\nSTYLE: ${theme.styleModifier}\nVIEW: ${view.description}`

          const response = await googleAI.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: { parts: [{ text: themePrompt }] },
            config: {
              responseModalities: [Modality.IMAGE],
              systemInstruction: SYSTEM_INSTRUCTIONS,
            },
          })

          const usage = (response as any)?.usageMetadata
          if (usage) {
            if (typeof usage.promptTokenCount === "number") tracking.tokensInput += usage.promptTokenCount
            if (typeof usage.candidatesTokenCount === "number") tracking.tokensOutput += usage.candidatesTokenCount
          }

          let imageData: string | null = null
          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                imageData = part.inlineData.data
                break
              }
            }
          }

          if (!imageData) {
            console.warn(`regenerate-theme: no image returned for ${theme.label} / ${view.angle}`)
            continue
          }

          // Upload to R2 (server-side) and append a new design_outputs row.
          const outputId = randomUUID()
          const upload = await uploadImageToR2({
            base64Data: `data:image/png;base64,${imageData}`,
            designId,
            outputId,
            viewType: view.angle as "main" | "detail",
          })

          if (!upload.success || !upload.url) {
            throw new Error(upload.error || "R2 upload failed")
          }

          await prisma.designOutput.create({
            data: {
              id: outputId,
              designId,
              outputImageUrl: upload.url,
              variationName: `${theme.label} - ${view.angle} (v${iteration})`,
              generationParameters: {
                theme: theme.theme,
                themeLabel: theme.label,
                view: view.angle,
                iteration,
                feedback: feedback || null,
                regeneratedAt: new Date().toISOString(),
              },
            },
          })

          newImageUrls.push(upload.url)
          send({ type: "image", url: upload.url, view: view.angle })

          // Brief pacing between calls to avoid Gemini rate limits.
          await new Promise((r) => setTimeout(r, 400))
        }

        if (newImageUrls.length === 0) {
          throw new Error("No images were generated — try again or simplify your feedback")
        }

        send({
          type: "done",
          themeKey: theme.theme,
          themeLabel: theme.label,
          iteration,
          images: newImageUrls,
        })

        tracking.status = "success"
        tracking.imageCount = newImageUrls.length
      } catch (error) {
        console.error("regenerate-theme failed:", error)
        tracking.status = "failed"
        tracking.errorMessage = error instanceof Error ? error.message : String(error)
        send({ type: "error", error: tracking.errorMessage })
      } finally {
        writeAnalytics()
        try {
          controller.close()
        } catch {
          // already closed
        }
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  })
}
