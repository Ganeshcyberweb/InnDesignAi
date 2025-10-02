/**
 * Utility functions for parsing budget range strings into numeric values
 */

export interface BudgetRange {
  min?: number;
  max?: number;
}

/**
 * Parse budget range string into min and max values
 * Examples:
 * - "$500 - $1,000" → { min: 500, max: 1000 }
 * - "$30,000+" → { min: 30000, max: undefined }
 */
export function parseBudgetRange(budgetString: string): BudgetRange {
  if (!budgetString) {
    return {};
  }

  // Remove spaces and convert to lowercase
  const cleaned = budgetString.replace(/\s/g, '').toLowerCase();

  // Handle "$30,000+" format
  if (cleaned.includes('+')) {
    const minMatch = cleaned.match(/\$?([\d,]+)\+/);
    if (minMatch) {
      const min = parseInt(minMatch[1].replace(/,/g, ''));
      return { min, max: undefined };
    }
  }

  // Handle "$min - $max" format
  const rangeMatch = cleaned.match(/\$?([\d,]+)-\$?([\d,]+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1].replace(/,/g, ''));
    const max = parseInt(rangeMatch[2].replace(/,/g, ''));
    return { min, max };
  }

  // Handle single "$amount" format
  const singleMatch = cleaned.match(/\$?([\d,]+)/);
  if (singleMatch) {
    const amount = parseInt(singleMatch[1].replace(/,/g, ''));
    return { min: amount, max: amount };
  }

  return {};
}

/**
 * Format a price number back to currency string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Check if a price falls within a budget range
 */
export function isPriceInRange(price: number, range: BudgetRange): boolean {
  const { min, max } = range;

  if (min !== undefined && price < min) {
    return false;
  }

  if (max !== undefined && price > max) {
    return false;
  }

  return true;
}

/**
 * Get a human-readable description of a budget range
 */
export function getBudgetRangeDescription(range: BudgetRange): string {
  const { min, max } = range;

  if (min !== undefined && max !== undefined) {
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  }

  if (min !== undefined && max === undefined) {
    return `${formatPrice(min)}+`;
  }

  if (min === undefined && max !== undefined) {
    return `Up to ${formatPrice(max)}`;
  }

  return 'Any budget';
}