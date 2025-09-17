import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/app/lib/supabase/server';
import ROICalculator from '@/lib/roi/calculator';

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
    const roomType = searchParams.get('roomType') || 'living_room';
    const region = searchParams.get('region') || 'suburban';

    // Get market comparison data
    const benchmarks = ROICalculator.getMarketComparison(roomType, region);

    // Additional benchmark data by room type
    const roomTypeBenchmarks = {
      kitchen: {
        averageROI: 75,
        averageCost: 28000,
        averageTimeframe: 18,
        popularFeatures: ['quartz countertops', 'stainless steel appliances', 'subway tile backsplash'],
        costRange: { min: 15000, max: 50000 },
        roiRange: { min: 60, max: 90 },
      },
      bathroom: {
        averageROI: 70,
        averageCost: 20000,
        averageTimeframe: 12,
        popularFeatures: ['walk-in shower', 'double vanity', 'heated floors'],
        costRange: { min: 10000, max: 35000 },
        roiRange: { min: 55, max: 85 },
      },
      living_room: {
        averageROI: 60,
        averageCost: 16000,
        averageTimeframe: 10,
        popularFeatures: ['hardwood flooring', 'built-in storage', 'fireplace upgrade'],
        costRange: { min: 8000, max: 25000 },
        roiRange: { min: 45, max: 75 },
      },
      bedroom: {
        averageROI: 55,
        averageCost: 12000,
        averageTimeframe: 8,
        popularFeatures: ['closet organization', 'luxury flooring', 'ceiling fans'],
        costRange: { min: 5000, max: 20000 },
        roiRange: { min: 40, max: 70 },
      },
      dining_room: {
        averageROI: 50,
        averageCost: 10000,
        averageTimeframe: 6,
        popularFeatures: ['hardwood floors', 'crown molding', 'updated lighting'],
        costRange: { min: 4000, max: 18000 },
        roiRange: { min: 35, max: 65 },
      },
      home_office: {
        averageROI: 65,
        averageCost: 16000,
        averageTimeframe: 9,
        popularFeatures: ['built-in desk', 'upgraded lighting', 'sound insulation'],
        costRange: { min: 8000, max: 25000 },
        roiRange: { min: 50, max: 80 },
      },
      basement: {
        averageROI: 58,
        averageCost: 22000,
        averageTimeframe: 15,
        popularFeatures: ['waterproofing', 'finished ceiling', 'egress windows'],
        costRange: { min: 12000, max: 35000 },
        roiRange: { min: 45, max: 75 },
      },
      attic: {
        averageROI: 53,
        averageCost: 20000,
        averageTimeframe: 12,
        popularFeatures: ['insulation upgrade', 'dormer windows', 'HVAC extension'],
        costRange: { min: 10000, max: 32000 },
        roiRange: { min: 40, max: 70 },
      },
    };

    const detailedBenchmark = roomTypeBenchmarks[roomType as keyof typeof roomTypeBenchmarks] || roomTypeBenchmarks.living_room;

    // Regional cost adjustments
    const regionalData = {
      major_city: {
        costMultiplier: 1.3,
        marketTrends: 'High demand, premium pricing',
        topFeatures: ['luxury finishes', 'smart home integration', 'energy efficiency'],
      },
      suburban: {
        costMultiplier: 1.0,
        marketTrends: 'Steady demand, moderate pricing',
        topFeatures: ['family-friendly features', 'open floor plans', 'storage solutions'],
      },
      rural: {
        costMultiplier: 0.8,
        marketTrends: 'Value-focused, practical upgrades',
        topFeatures: ['durability', 'low maintenance', 'energy efficiency'],
      },
    };

    const regionalInfo = regionalData[region as keyof typeof regionalData] || regionalData.suburban;

    return NextResponse.json({
      success: true,
      data: {
        basic: benchmarks,
        detailed: detailedBenchmark,
        regional: regionalInfo,
        marketInsights: {
          trendingFeatures: detailedBenchmark.popularFeatures,
          costFactors: [
            'Material quality and availability',
            'Local labor costs',
            'Permit requirements',
            'Market demand',
          ],
          roiFactors: [
            'Property location and market',
            'Quality of renovation',
            'Current market conditions',
            'Property type and age',
          ],
        },
        lastUpdated: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error fetching benchmarks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}