import { NextRequest, NextResponse } from "next/server";
import googleAI, { dataUrlToPart, urlToPart, SYSTEM_INSTRUCTIONS } from "@/lib/gemini/ai";
import { buildDesignPrompt } from "@/lib/utils/prompt-builder";
import { Modality } from "@google/genai";
import { generateROIAnalysis, parseROIMetrics } from "@/lib/roi/gemini-roi-analysis";
import {
  GUEST_PROMPT_LIMIT,
  getGuestCookieId,
  tryIncrementGuestPrompt,
} from "@/lib/guest/session";
import { trackAiGeneration, type AiGenerationStatus } from "@/lib/analytics/track";

// Theme configurations
const THEMES = [
  {
    theme: 'modern',
    label: 'Modern Minimalist',
    styleModifier: 'modern minimalist style with clean lines, neutral colors, and contemporary furniture'
  },
  {
    theme: 'cozy',
    label: 'Cozy Traditional',
    styleModifier: 'cozy traditional style with warm colors, comfortable textiles, and classic furniture'
  },
  {
    theme: 'luxury',
    label: 'Luxury Contemporary',
    styleModifier: 'luxury contemporary style with premium materials, elegant finishes, and high-end furniture'
  }
];

// View configurations for each theme
const VIEWS = [
  {
    angle: 'main',
    description: 'Main view showing the full room layout from eye level'
  },
  {
    angle: 'detail',
    description: 'Detailed view focusing on key design elements and furniture arrangement'
  }
];

/**
 * Streaming AI generation endpoint.
 *
 *  - Auth + guest-limit checks run BEFORE we open the stream so 401 / 429 can
 *    still be returned as a plain JSON response. Once the stream is open, all
 *    success and error signalling happens through NDJSON events.
 *  - Stream events (one JSON object per line, `\n` terminated):
 *      { type: 'progress', step: string }
 *      { type: 'theme', theme: { theme, label, images } }
 *      { type: 'roi',   roiAnalysis: string, roiMetrics: object }
 *      { type: 'done',  metadata: {...}, guest?: {...} }
 *      { type: 'error', error: string }
 *  - Analytics are written fire-and-forget exactly once, in the stream's
 *    finally block (or before any return for the early gate paths).
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
  const { userPrompt, images, formData } = body as {
    userPrompt?: string;
    images?: Array<{ url: string }>;
    formData?: any;
  };

  // Per-request analytics state. Mutated as we go, written to ai_generations
  // exactly once before any return (early gate) or in the stream finally.
  const tracking = {
    userId: null as string | null,
    guestSessionId: null as string | null,
    promptText: typeof userPrompt === 'string' ? userPrompt : null,
    status: 'failed' as AiGenerationStatus,
    themeCount: 0,
    imageCount: 0,
    tokensInput: 0,
    tokensOutput: 0,
    errorMessage: null as string | null,
  };

  const writeAnalytics = () => {
    trackAiGeneration({
      userId: tracking.userId,
      guestSessionId: tracking.guestSessionId,
      promptText: tracking.promptText,
      status: tracking.status,
      themeCount: tracking.themeCount,
      imageCount: tracking.imageCount,
      tokensInput: tracking.tokensInput || null,
      tokensOutput: tracking.tokensOutput || null,
      durationMs: Date.now() - startTime,
      errorMessage: tracking.errorMessage,
    });
  };

  // ---- Auth / guest-trial gate -------------------------------------------
  const authedUserId = request.headers.get('x-user-id');
  let isGuest = false;
  let guestPromptsRemaining: number | null = null;

  if (!authedUserId) {
    const guestId = await getGuestCookieId();
    if (!guestId) {
      tracking.status = 'auth_required';
      writeAnalytics();
      return NextResponse.json(
        { error: 'Sign in or continue as guest to generate designs.', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }
    tracking.guestSessionId = guestId;
    const newCount = await tryIncrementGuestPrompt(guestId);
    if (newCount === null) {
      tracking.status = 'limit_reached';
      writeAnalytics();
      return NextResponse.json(
        {
          error: "You've used your free guest prompts. Sign up to keep generating.",
          code: 'GUEST_LIMIT_REACHED',
          promptLimit: GUEST_PROMPT_LIMIT,
        },
        { status: 429 }
      );
    }
    isGuest = true;
    guestPromptsRemaining = Math.max(0, GUEST_PROMPT_LIMIT - newCount);
    console.log(`👤 Guest request — used ${newCount}/${GUEST_PROMPT_LIMIT} prompt(s), ${guestPromptsRemaining} remaining`);
  } else {
    tracking.userId = authedUserId;
  }
  // ------------------------------------------------------------------------

  console.log('\n🚀 === MULTI-THEME GENERATION (streaming) ===');
  console.log('📝 User Prompt:', userPrompt || '(empty)');

  const results: Array<{ theme: string; label: string; images: string[] }> = [];

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      const send = (event: Record<string, unknown>) => {
        try {
          controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
        } catch (e) {
          // Connection closed by client — silently swallow; the generation
          // loop will detect it on the next enqueue and we'll close out.
        }
      };

      let roiAnalysis = '';
      let roiMetrics: Record<string, unknown> = {};

      try {
        send({ type: 'progress', step: 'Preparing reference images…' });

        // Preprocess uploaded + furniture reference images.
        const uploadedImageParts: any[] = [];
        const furnitureImageParts: any[] = [];

        if (images && images.length > 0) {
          try {
            uploadedImageParts.push(dataUrlToPart(images[0].url));
          } catch (err) {
            console.error('❌ Failed to convert uploaded image:', err);
          }
        }

        const furnitureLimit = uploadedImageParts.length > 0 ? 2 : 3;
        const furnitureItems = formData?.selectedFurnitureItems || [];
        for (let i = 0; i < Math.min(furnitureItems.length, furnitureLimit); i++) {
          const item = furnitureItems[i];
          try {
            furnitureImageParts.push(await urlToPart(item.image_path));
          } catch (err) {
            console.error(`❌ Furniture image #${i + 1} failed:`, err);
          }
        }

        const allImageParts = [...uploadedImageParts, ...furnitureImageParts];

        // Generate themes — emit each completed theme as it finishes.
        for (const theme of THEMES) {
          send({ type: 'progress', step: `Generating ${theme.label}…` });

          const themeImages: string[] = [];
          for (const view of VIEWS) {
            try {
              const basePrompt = formData
                ? buildDesignPrompt({
                    ...formData,
                    prompt: userPrompt,
                    selectedFurnitureItems: formData.selectedFurnitureItems || [],
                  })
                : userPrompt;

              const themePrompt = `${basePrompt}\n\nSTYLE: ${theme.styleModifier}\nVIEW: ${view.description}`;

              const response = await googleAI.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: themePrompt }, ...allImageParts] },
                config: {
                  responseModalities: [Modality.IMAGE],
                  systemInstruction: SYSTEM_INSTRUCTIONS,
                },
              });

              const usage = (response as any)?.usageMetadata;
              if (usage) {
                if (typeof usage.promptTokenCount === 'number') {
                  tracking.tokensInput += usage.promptTokenCount;
                }
                if (typeof usage.candidatesTokenCount === 'number') {
                  tracking.tokensOutput += usage.candidatesTokenCount;
                }
              }

              let imageData: string | null = null;
              if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                  if (part.inlineData && part.inlineData.data) {
                    imageData = part.inlineData.data;
                    break;
                  }
                }
              }

              if (imageData) {
                themeImages.push(`data:image/png;base64,${imageData}`);
              }
            } catch (err) {
              console.error(`❌ ${theme.label} / ${view.angle} failed:`, err);
              // Continue with next view — partial results are still useful.
            }

            // Small breather between Gemini calls to avoid rate-limit spikes.
            await new Promise((r) => setTimeout(r, 500));
          }

          if (themeImages.length > 0) {
            const themeResult = {
              theme: theme.theme,
              label: theme.label,
              images: themeImages,
            };
            results.push(themeResult);
            send({ type: 'theme', theme: themeResult });
          }
        }

        // ROI analysis after all themes complete.
        if (results.length > 0 && formData) {
          try {
            send({ type: 'progress', step: 'Calculating ROI analysis…' });
            roiAnalysis = await generateROIAnalysis(
              {
                roomType: formData.roomType || 'guest room',
                location: formData.location,
                budget: formData.budgetRange?.label || formData.budget,
                propertyType: 'hotel',
                guestProfile: formData.guestProfile,
                currentADR: formData.currentADR,
              },
              results
            );
            roiMetrics = parseROIMetrics(roiAnalysis);
            send({ type: 'roi', roiAnalysis, roiMetrics });
          } catch (err) {
            console.error('⚠️ ROI analysis failed, continuing without it:', err);
          }
        }

        const totalDuration = Date.now() - startTime;
        const totalImages = results.reduce((acc, r) => acc + r.images.length, 0);

        send({
          type: 'done',
          metadata: {
            totalImages,
            totalDuration,
            themesGenerated: results.length,
            hasROIAnalysis: !!roiAnalysis,
          },
          guest: isGuest
            ? { promptLimit: GUEST_PROMPT_LIMIT, promptsRemaining: guestPromptsRemaining }
            : undefined,
        });

        tracking.status = 'success';
      } catch (error) {
        console.error('\n❌ === STREAMING GENERATION ERROR ===');
        console.error(error);
        tracking.status = 'failed';
        tracking.errorMessage = error instanceof Error ? error.message : String(error);
        send({ type: 'error', error: tracking.errorMessage });
      } finally {
        tracking.themeCount = results.length;
        tracking.imageCount = results.reduce((acc, r) => acc + r.images.length, 0);
        writeAnalytics();
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      // Hint to platform proxies (Vercel/CDN) to flush as soon as we emit.
      'X-Accel-Buffering': 'no',
    },
  });
}
