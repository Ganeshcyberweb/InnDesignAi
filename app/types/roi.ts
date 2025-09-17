/**
 * ROI calculation types and interfaces
 */

export interface RoomCostData {
  roomType: string;
  baseCostPerSqft: number;
  laborMultiplier: number;
  complexityFactor: number;
}

export interface StyleMultiplier {
  style: string;
  costFactor: number;
  description: string;
}

export interface SizeMultiplier {
  size: string;
  factor: number;
  description: string;
}

export interface RegionalAdjustment {
  region: string;
  costMultiplier: number;
  laborMultiplier: number;
}

export interface CostBreakdown {
  materials: number;
  labor: number;
  permits: number;
  overhead: number;
  contingency: number;
  total: number;
}

export interface ROIMetrics {
  totalInvestment: number;
  estimatedValueIncrease: number;
  roiPercentage: number;
  paybackTimelineMonths: number;
  annualReturn: number;
  fiveYearProjection: number;
}

export interface MarketComparison {
  averageROI: number;
  averageCost: number;
  averageTimeframe: number;
  confidenceLevel: number;
}

export interface ROICalculationInput {
  roomType: string;
  roomSize: string;
  style: string;
  currentPropertyValue: number;
  squareFootage: number;
  region?: string;
  qualityLevel?: 'budget' | 'mid-range' | 'luxury';
  timeline?: number; // months
}

export interface ROICalculationResult {
  input: ROICalculationInput;
  costBreakdown: CostBreakdown;
  roiMetrics: ROIMetrics;
  marketComparison: MarketComparison;
  recommendations: string[];
  riskFactors: string[];
  createdAt: Date;
}

export interface PropertyDetails {
  currentValue: number;
  yearBuilt?: number;
  propertyType: 'single-family' | 'condo' | 'townhouse' | 'multi-family';
  location: {
    city: string;
    state: string;
    zipCode?: string;
  };
  marketTrends?: {
    appreciation: number;
    demand: 'high' | 'medium' | 'low';
  };
}

export interface RenovationProject {
  id: string;
  designId: string;
  propertyDetails: PropertyDetails;
  rooms: Array<{
    type: string;
    size: string;
    style: string;
    priority: number;
  }>;
  budget: {
    min: number;
    max: number;
    preferred: number;
  };
  timeline: {
    startDate?: Date;
    targetDate?: Date;
    flexibility: 'fixed' | 'flexible' | 'very-flexible';
  };
}

// Constants for calculations
export const ROOM_BASE_COSTS: Record<string, RoomCostData> = {
  kitchen: {
    roomType: 'kitchen',
    baseCostPerSqft: 300,
    laborMultiplier: 1.5,
    complexityFactor: 2.0,
  },
  bathroom: {
    roomType: 'bathroom',
    baseCostPerSqft: 250,
    laborMultiplier: 1.4,
    complexityFactor: 1.8,
  },
  living_room: {
    roomType: 'living_room',
    baseCostPerSqft: 120,
    laborMultiplier: 1.0,
    complexityFactor: 1.0,
  },
  bedroom: {
    roomType: 'bedroom',
    baseCostPerSqft: 100,
    laborMultiplier: 0.8,
    complexityFactor: 0.8,
  },
  dining_room: {
    roomType: 'dining_room',
    baseCostPerSqft: 110,
    laborMultiplier: 0.9,
    complexityFactor: 0.9,
  },
  home_office: {
    roomType: 'home_office',
    baseCostPerSqft: 130,
    laborMultiplier: 1.1,
    complexityFactor: 1.1,
  },
  basement: {
    roomType: 'basement',
    baseCostPerSqft: 90,
    laborMultiplier: 1.2,
    complexityFactor: 1.3,
  },
  attic: {
    roomType: 'attic',
    baseCostPerSqft: 95,
    laborMultiplier: 1.3,
    complexityFactor: 1.4,
  },
};

export const STYLE_MULTIPLIERS: Record<string, StyleMultiplier> = {
  budget: {
    style: 'budget',
    costFactor: 0.6,
    description: 'Basic materials and finishes',
  },
  mid_range: {
    style: 'mid_range',
    costFactor: 1.0,
    description: 'Standard materials and finishes',
  },
  luxury: {
    style: 'luxury',
    costFactor: 2.0,
    description: 'Premium materials and finishes',
  },
  custom: {
    style: 'custom',
    costFactor: 2.5,
    description: 'Custom materials and finishes',
  },
};

export const SIZE_MULTIPLIERS: Record<string, SizeMultiplier> = {
  small: {
    size: 'small',
    factor: 0.7,
    description: 'Under 100 sq ft',
  },
  medium: {
    size: 'medium',
    factor: 1.0,
    description: '100-200 sq ft',
  },
  large: {
    size: 'large',
    factor: 1.5,
    description: '200-400 sq ft',
  },
  extra_large: {
    size: 'extra_large',
    factor: 2.0,
    description: 'Over 400 sq ft',
  },
};

export const REGIONAL_ADJUSTMENTS: Record<string, RegionalAdjustment> = {
  major_city: {
    region: 'major_city',
    costMultiplier: 1.3,
    laborMultiplier: 1.4,
  },
  suburban: {
    region: 'suburban',
    costMultiplier: 1.0,
    laborMultiplier: 1.0,
  },
  rural: {
    region: 'rural',
    costMultiplier: 0.8,
    laborMultiplier: 0.9,
  },
};