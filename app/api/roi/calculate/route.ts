import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/app/lib/supabase/server';
import ROICalculator from '@/lib/roi/calculator';
import { ROICalculationInput, ROICalculationResult } from '@/app/types/roi';
import { z } from 'zod';

// Validation schema
const ROICalculationSchema = z.object({
  designId: z.string().optional(),
  input: z.object({
    roomType: z.string(),
    roomSize: z.string(),
    style: z.string(),
    currentPropertyValue: z.number().positive(),
    squareFootage: z.number().positive(),
    region: z.string().optional(),
    qualityLevel: z.enum(['budget', 'mid-range', 'luxury']).optional(),
    timeline: z.number().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { designId, input } = ROICalculationSchema.parse(body);

    // Calculate ROI
    const result = ROICalculator.calculateROI(input);

    // Save to database if designId is provided
    if (designId) {
      const { error: insertError } = await supabase
        .from('roi_calculations')
        .upsert({
          design_id: designId,
          estimated_cost: result.costBreakdown.total,
          roi_percentage: result.roiMetrics.roiPercentage,
          payback_timeline: `${result.roiMetrics.paybackTimelineMonths} months`,
          cost_breakdown: JSON.stringify(result.costBreakdown),
          notes: JSON.stringify({
            recommendations: result.recommendations,
            riskFactors: result.riskFactors,
            marketComparison: result.marketComparison,
            input: result.input,
          }),
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error saving ROI calculation:', insertError);
        return NextResponse.json(
          { error: 'Failed to save ROI calculation' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error('ROI calculation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const designId = searchParams.get('designId');

    if (!designId) {
      return NextResponse.json(
        { error: 'Design ID is required' },
        { status: 400 }
      );
    }

    // Get ROI calculation from database
    const { data: roiData, error } = await supabase
      .from('roi_calculations')
      .select('*')
      .eq('design_id', designId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'ROI calculation not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: roiData,
    });

  } catch (error) {
    console.error('Error fetching ROI calculation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { designId, input } = ROICalculationSchema.parse(body);

    if (!designId) {
      return NextResponse.json(
        { error: 'Design ID is required for updates' },
        { status: 400 }
      );
    }

    // Recalculate ROI
    const result = ROICalculator.calculateROI(input);

    // Update database
    const { error: updateError } = await supabase
      .from('roi_calculations')
      .update({
        estimated_cost: result.costBreakdown.total,
        roi_percentage: result.roiMetrics.roiPercentage,
        payback_timeline: `${result.roiMetrics.paybackTimelineMonths} months`,
        cost_breakdown: JSON.stringify(result.costBreakdown),
        notes: JSON.stringify({
          recommendations: result.recommendations,
          riskFactors: result.riskFactors,
          marketComparison: result.marketComparison,
          input: result.input,
        }),
        updated_at: new Date().toISOString(),
      })
      .eq('design_id', designId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error('Error updating ROI calculation:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}