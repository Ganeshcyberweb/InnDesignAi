/**
 * ROI Calculator Components
 * Export all ROI-related components for easy imports
 */

export { ROICalculator } from './ROICalculator';
export { CostBreakdown } from './CostBreakdown';
export { ROIMetrics } from './ROIMetrics';
export { IndustryBenchmarks } from './IndustryBenchmarks';

// Re-export types for convenience
export type {
  ROICalculationInput,
  ROICalculationResult,
  CostBreakdown as CostBreakdownType,
  ROIMetrics as ROIMetricsType,
  MarketComparison,
  PropertyDetails,
  RenovationProject,
} from '@/app/types/roi';

// Re-export calculator utility
export { default as ROICalculatorEngine } from '@/lib/roi/calculator';