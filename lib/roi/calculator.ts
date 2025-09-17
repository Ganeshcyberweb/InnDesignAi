/**
 * ROI Calculator Engine
 * Handles all renovation cost estimation and ROI calculations
 */

import {
  ROICalculationInput,
  ROICalculationResult,
  CostBreakdown,
  ROIMetrics,
  MarketComparison,
  ROOM_BASE_COSTS,
  STYLE_MULTIPLIERS,
  SIZE_MULTIPLIERS,
  REGIONAL_ADJUSTMENTS,
} from '@/app/types/roi';

export class ROICalculator {
  /**
   * Calculate renovation cost based on room specifications
   */
  static calculateRenovationCost(
    roomType: string,
    size: string,
    style: string,
    squareFootage: number,
    region: string = 'suburban',
    qualityLevel: 'budget' | 'mid-range' | 'luxury' = 'mid-range'
  ): CostBreakdown {
    // Get base cost data
    const roomData = ROOM_BASE_COSTS[roomType] || ROOM_BASE_COSTS.living_room;
    const styleMultiplier = STYLE_MULTIPLIERS[qualityLevel] || STYLE_MULTIPLIERS.mid_range;
    const sizeMultiplier = SIZE_MULTIPLIERS[size] || SIZE_MULTIPLIERS.medium;
    const regionalAdjustment = REGIONAL_ADJUSTMENTS[region] || REGIONAL_ADJUSTMENTS.suburban;

    // Calculate base cost
    const baseCost = roomData.baseCostPerSqft * squareFootage;

    // Apply multipliers
    const adjustedCost = baseCost *
      styleMultiplier.costFactor *
      sizeMultiplier.factor *
      regionalAdjustment.costMultiplier *
      roomData.complexityFactor;

    // Break down costs
    const materials = adjustedCost * 0.4; // 40% materials
    const labor = adjustedCost * 0.35 * roomData.laborMultiplier * regionalAdjustment.laborMultiplier; // 35% labor
    const permits = adjustedCost * 0.05; // 5% permits
    const overhead = adjustedCost * 0.1; // 10% overhead
    const contingency = adjustedCost * 0.1; // 10% contingency

    const total = materials + labor + permits + overhead + contingency;

    return {
      materials: Math.round(materials),
      labor: Math.round(labor),
      permits: Math.round(permits),
      overhead: Math.round(overhead),
      contingency: Math.round(contingency),
      total: Math.round(total),
    };
  }

  /**
   * Estimate ROI based on investment and property details
   */
  static estimateROI(
    totalInvestment: number,
    currentPropertyValue: number,
    roomType: string,
    qualityLevel: 'budget' | 'mid-range' | 'luxury' = 'mid-range'
  ): ROIMetrics {
    // ROI percentages based on room type and quality
    const roiFactors: Record<string, Record<string, number>> = {
      kitchen: { budget: 0.65, 'mid-range': 0.75, luxury: 0.85 },
      bathroom: { budget: 0.60, 'mid-range': 0.70, luxury: 0.80 },
      living_room: { budget: 0.50, 'mid-range': 0.60, luxury: 0.70 },
      bedroom: { budget: 0.45, 'mid-range': 0.55, luxury: 0.65 },
      dining_room: { budget: 0.40, 'mid-range': 0.50, luxury: 0.60 },
      home_office: { budget: 0.55, 'mid-range': 0.65, luxury: 0.75 },
      basement: { budget: 0.50, 'mid-range': 0.60, luxury: 0.70 },
      attic: { budget: 0.45, 'mid-range': 0.55, luxury: 0.65 },
    };

    const roiFactor = roiFactors[roomType]?.[qualityLevel] || 0.60;
    const estimatedValueIncrease = totalInvestment * roiFactor;
    const roiPercentage = (estimatedValueIncrease / totalInvestment) * 100;

    // Calculate payback timeline (assuming rental income increase)
    const monthlyRentIncrease = estimatedValueIncrease * 0.01 / 12; // 1% annual return monthly
    const paybackTimelineMonths = monthlyRentIncrease > 0 ?
      Math.round(totalInvestment / monthlyRentIncrease) : 0;

    const annualReturn = estimatedValueIncrease * 0.01; // 1% of value increase annually
    const fiveYearProjection = currentPropertyValue + estimatedValueIncrease +
      (estimatedValueIncrease * 0.03 * 5); // 3% annual appreciation

    return {
      totalInvestment,
      estimatedValueIncrease: Math.round(estimatedValueIncrease),
      roiPercentage: Math.round(roiPercentage * 100) / 100,
      paybackTimelineMonths,
      annualReturn: Math.round(annualReturn),
      fiveYearProjection: Math.round(fiveYearProjection),
    };
  }

  /**
   * Get market comparison data
   */
  static getMarketComparison(
    roomType: string,
    region: string = 'suburban'
  ): MarketComparison {
    // Industry benchmark data
    const benchmarks: Record<string, { roi: number; cost: number; time: number }> = {
      kitchen: { roi: 72, cost: 25000, time: 18 },
      bathroom: { roi: 68, cost: 18000, time: 12 },
      living_room: { roi: 58, cost: 15000, time: 10 },
      bedroom: { roi: 52, cost: 12000, time: 8 },
      dining_room: { roi: 48, cost: 10000, time: 6 },
      home_office: { roi: 62, cost: 16000, time: 9 },
      basement: { roi: 55, cost: 20000, time: 15 },
      attic: { roi: 50, cost: 18000, time: 12 },
    };

    const benchmark = benchmarks[roomType] || benchmarks.living_room;
    const regionalMultiplier = REGIONAL_ADJUSTMENTS[region]?.costMultiplier || 1.0;

    return {
      averageROI: benchmark.roi,
      averageCost: Math.round(benchmark.cost * regionalMultiplier),
      averageTimeframe: benchmark.time,
      confidenceLevel: 85, // 85% confidence in estimates
    };
  }

  /**
   * Generate recommendations based on calculation results
   */
  static generateRecommendations(
    input: ROICalculationInput,
    costBreakdown: CostBreakdown,
    roiMetrics: ROIMetrics,
    marketComparison: MarketComparison
  ): string[] {
    const recommendations: string[] = [];

    // ROI-based recommendations
    if (roiMetrics.roiPercentage > marketComparison.averageROI) {
      recommendations.push('Excellent ROI potential - above market average');
    } else if (roiMetrics.roiPercentage < marketComparison.averageROI * 0.8) {
      recommendations.push('Consider reducing scope or budget to improve ROI');
    }

    // Cost-based recommendations
    if (costBreakdown.total > marketComparison.averageCost * 1.2) {
      recommendations.push('Project cost is above market average - consider alternative materials');
    }

    // Timeline recommendations
    if (roiMetrics.paybackTimelineMonths > 60) {
      recommendations.push('Long payback period - consider phased approach');
    }

    // Room-specific recommendations
    if (input.roomType === 'kitchen') {
      recommendations.push('Kitchen renovations typically provide strong ROI - focus on quality appliances');
    } else if (input.roomType === 'bathroom') {
      recommendations.push('Bathroom updates are cost-effective - consider modern fixtures');
    }

    // Quality recommendations
    if (input.qualityLevel === 'luxury' && roiMetrics.roiPercentage < 60) {
      recommendations.push('Luxury finishes may not provide proportional return in this market');
    }

    return recommendations;
  }

  /**
   * Generate risk factors
   */
  static generateRiskFactors(
    input: ROICalculationInput,
    costBreakdown: CostBreakdown
  ): string[] {
    const risks: string[] = [];

    // Budget risks
    if (costBreakdown.contingency / costBreakdown.total < 0.1) {
      risks.push('Low contingency budget may lead to cost overruns');
    }

    // Market risks
    if (input.roomType === 'basement' || input.roomType === 'attic') {
      risks.push('Conversion projects may face permitting delays');
    }

    // Timeline risks
    if (input.roomType === 'kitchen' || input.roomType === 'bathroom') {
      risks.push('Plumbing/electrical work may reveal hidden issues');
    }

    // Quality risks
    if (input.qualityLevel === 'budget') {
      risks.push('Budget materials may require earlier replacement');
    }

    return risks;
  }

  /**
   * Main calculation method
   */
  static calculateROI(input: ROICalculationInput): ROICalculationResult {
    const costBreakdown = this.calculateRenovationCost(
      input.roomType,
      input.roomSize,
      input.style,
      input.squareFootage,
      input.region,
      input.qualityLevel
    );

    const roiMetrics = this.estimateROI(
      costBreakdown.total,
      input.currentPropertyValue,
      input.roomType,
      input.qualityLevel
    );

    const marketComparison = this.getMarketComparison(
      input.roomType,
      input.region
    );

    const recommendations = this.generateRecommendations(
      input,
      costBreakdown,
      roiMetrics,
      marketComparison
    );

    const riskFactors = this.generateRiskFactors(input, costBreakdown);

    return {
      input,
      costBreakdown,
      roiMetrics,
      marketComparison,
      recommendations,
      riskFactors,
      createdAt: new Date(),
    };
  }

  /**
   * Calculate ROI for multiple rooms
   */
  static calculateMultiRoomROI(
    rooms: Array<ROICalculationInput & { priority: number }>,
    totalBudget: number
  ): {
    individual: ROICalculationResult[];
    combined: {
      totalCost: number;
      totalROI: number;
      weightedPayback: number;
      recommendations: string[];
    };
  } {
    const individual = rooms.map(room => this.calculateROI(room));

    const totalCost = individual.reduce((sum, result) => sum + result.costBreakdown.total, 0);
    const totalValueIncrease = individual.reduce((sum, result) => sum + result.roiMetrics.estimatedValueIncrease, 0);
    const totalROI = (totalValueIncrease / totalCost) * 100;

    const weightedPayback = individual.reduce((sum, result, index) => {
      const weight = result.costBreakdown.total / totalCost;
      return sum + (result.roiMetrics.paybackTimelineMonths * weight);
    }, 0);

    const combinedRecommendations = [
      `Total project cost: $${totalCost.toLocaleString()}`,
      `Combined ROI: ${totalROI.toFixed(1)}%`,
      `Weighted payback: ${Math.round(weightedPayback)} months`,
    ];

    if (totalCost > totalBudget) {
      combinedRecommendations.push('Consider phasing project to stay within budget');
    }

    return {
      individual,
      combined: {
        totalCost,
        totalROI,
        weightedPayback,
        recommendations: combinedRecommendations,
      },
    };
  }
}

export default ROICalculator;