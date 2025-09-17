import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { CostTracker } from '@/lib/ai/cost-tracker';
import { z } from 'zod';

const estimateSchema = z.object({
  provider: z.enum(['replicate', 'openai']),
  model: z.string(),
  options: z.object({
    numOutputs: z.number().min(1).max(10).optional().default(1),
    width: z.number().optional().default(1024),
    height: z.number().optional().default(1024),
    quality: z.string().optional().default('standard'),
    numInferenceSteps: z.number().optional().default(50),
  }).optional().default({}),
});

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'summary') {
      // Get user's cost summary
      const summary = await CostTracker.getUserCostSummary(user.id);

      return NextResponse.json({
        success: true,
        data: {
          summary,
          usage: {
            dailyUsagePercentage: (summary.todayCost / summary.dailyLimit) * 100,
            monthlyUsagePercentage: (summary.monthCost / summary.monthlyLimit) * 100,
            generationsToday: summary.generationCount,
            canGenerate: summary.canGenerate,
            remainingBudget: summary.remainingDailyBudget,
          },
        },
      });

    } else if (action === 'check-limit') {
      // Check if user can perform a generation
      const estimatedCost = parseFloat(searchParams.get('cost') || '0');

      const check = await CostTracker.checkCostLimit(user.id, estimatedCost);

      return NextResponse.json({
        success: true,
        data: {
          allowed: check.allowed,
          reason: check.reason,
          currentCost: check.currentCost,
          limit: check.limit,
          estimatedCost,
          afterGeneration: check.currentCost + estimatedCost,
          remainingBudget: check.limit - check.currentCost,
        },
      });

    } else {
      // Default: return user's cost summary
      const summary = await CostTracker.getUserCostSummary(user.id);

      return NextResponse.json({
        success: true,
        data: summary,
      });
    }

  } catch (error: any) {
    console.error('Error in cost API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const cookieStore = await cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'estimate') {
      // Estimate cost for a generation request
      const validatedData = estimateSchema.parse(body);

      const estimatedCost = CostTracker.estimateGenerationCost(
        validatedData.provider,
        validatedData.model,
        validatedData.options
      );

      // Check if user can afford this generation
      const check = await CostTracker.checkCostLimit(user.id, estimatedCost);

      return NextResponse.json({
        success: true,
        data: {
          estimatedCost,
          canAfford: check.allowed,
          reason: check.reason,
          breakdown: {
            provider: validatedData.provider,
            model: validatedData.model,
            numOutputs: validatedData.options?.numOutputs || 1,
            costPerImage: estimatedCost / (validatedData.options?.numOutputs || 1),
          },
          limits: {
            currentDailyCost: check.currentCost,
            dailyLimit: check.limit,
            remainingDailyBudget: check.limit - check.currentCost,
            afterGeneration: check.currentCost + estimatedCost,
          },
        },
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error in cost estimation:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Admin endpoint for cost analytics (would need admin auth in production)
export async function PATCH(request: NextRequest) {
  try {
    // This would need admin authentication in production
    const body = await request.json();
    const { action } = body;

    if (action === 'analytics') {
      const topUsers = await CostTracker.getTopUsers(10);
      const dailyTrend = await CostTracker.getDailyCostTrend(30);

      return NextResponse.json({
        success: true,
        data: {
          topUsers,
          dailyTrend,
          analytics: {
            totalUsers: topUsers.length,
            totalCost: topUsers.reduce((sum, user) => sum + user.totalCost, 0),
            totalGenerations: topUsers.reduce((sum, user) => sum + user.generationCount, 0),
            averageCostPerUser: topUsers.length > 0
              ? topUsers.reduce((sum, user) => sum + user.totalCost, 0) / topUsers.length
              : 0,
          },
        },
      });

    } else if (action === 'cleanup-cache') {
      CostTracker.cleanupCache();

      return NextResponse.json({
        success: true,
        message: 'Cache cleanup completed',
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid admin action' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error in admin cost analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}