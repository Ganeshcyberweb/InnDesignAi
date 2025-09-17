import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CostEntry {
  userId: string;
  designId: string;
  provider: string;
  model: string;
  cost: number;
  timestamp: Date;
  parameters: any;
}

export interface CostSummary {
  totalCost: number;
  todayCost: number;
  monthCost: number;
  generationCount: number;
  lastGeneration?: Date;
  dailyLimit: number;
  monthlyLimit: number;
  canGenerate: boolean;
  remainingDailyBudget: number;
}

export class CostTracker {
  private static dailyLimit = 10.0; // $10 per day
  private static monthlyLimit = 200.0; // $200 per month
  private static cache = new Map<string, CostSummary>();
  private static cacheExpiry = new Map<string, number>();
  private static cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static async recordCost(entry: CostEntry): Promise<void> {
    try {
      // Store in database (you might want to create a separate costs table)
      // For now, we'll store in the design_outputs generation_parameters
      await prisma.designOutput.updateMany({
        where: {
          designId: entry.designId,
        },
        data: {
          generationParameters: JSON.stringify({
            ...entry.parameters,
            cost: entry.cost,
            provider: entry.provider,
            model: entry.model,
            timestamp: entry.timestamp,
          }),
        },
      });

      // Clear cache for this user
      this.clearUserCache(entry.userId);

      console.log(`Recorded cost: $${entry.cost.toFixed(4)} for user ${entry.userId}`);
    } catch (error) {
      console.error('Error recording cost:', error);
    }
  }

  static async getUserCostSummary(userId: string): Promise<CostSummary> {
    // Check cache first
    const cached = this.getCachedSummary(userId);
    if (cached) {
      return cached;
    }

    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get all design outputs for this user with cost information
      const designs = await prisma.design.findMany({
        where: {
          userId,
        },
        include: {
          designOutputs: true,
        },
      });

      let totalCost = 0;
      let todayCost = 0;
      let monthCost = 0;
      let generationCount = 0;
      let lastGeneration: Date | undefined;

      designs.forEach(design => {
        design.designOutputs.forEach(output => {
          try {
            const params = JSON.parse(output.generationParameters || '{}');
            const cost = parseFloat(params.cost || '0');
            const timestamp = new Date(params.timestamp || output.createdAt);

            if (!isNaN(cost) && cost > 0) {
              totalCost += cost;
              generationCount++;

              if (timestamp >= startOfDay) {
                todayCost += cost;
              }

              if (timestamp >= startOfMonth) {
                monthCost += cost;
              }

              if (!lastGeneration || timestamp > lastGeneration) {
                lastGeneration = timestamp;
              }
            }
          } catch (error) {
            console.error('Error parsing generation parameters:', error);
          }
        });
      });

      const summary: CostSummary = {
        totalCost,
        todayCost,
        monthCost,
        generationCount,
        lastGeneration,
        dailyLimit: this.dailyLimit,
        monthlyLimit: this.monthlyLimit,
        canGenerate: todayCost < this.dailyLimit && monthCost < this.monthlyLimit,
        remainingDailyBudget: Math.max(0, this.dailyLimit - todayCost),
      };

      // Cache the result
      this.setCachedSummary(userId, summary);

      return summary;

    } catch (error) {
      console.error('Error getting user cost summary:', error);
      // Return default summary on error
      return {
        totalCost: 0,
        todayCost: 0,
        monthCost: 0,
        generationCount: 0,
        dailyLimit: this.dailyLimit,
        monthlyLimit: this.monthlyLimit,
        canGenerate: true,
        remainingDailyBudget: this.dailyLimit,
      };
    }
  }

  static async checkCostLimit(userId: string, estimatedCost: number): Promise<{
    allowed: boolean;
    reason?: string;
    currentCost: number;
    limit: number;
  }> {
    const summary = await this.getUserCostSummary(userId);

    // Check daily limit
    if (summary.todayCost + estimatedCost > this.dailyLimit) {
      return {
        allowed: false,
        reason: 'Daily cost limit exceeded',
        currentCost: summary.todayCost,
        limit: this.dailyLimit,
      };
    }

    // Check monthly limit
    if (summary.monthCost + estimatedCost > this.monthlyLimit) {
      return {
        allowed: false,
        reason: 'Monthly cost limit exceeded',
        currentCost: summary.monthCost,
        limit: this.monthlyLimit,
      };
    }

    return {
      allowed: true,
      currentCost: summary.todayCost,
      limit: this.dailyLimit,
    };
  }

  static estimateGenerationCost(
    provider: string,
    model: string,
    options: {
      numOutputs?: number;
      width?: number;
      height?: number;
      quality?: string;
      numInferenceSteps?: number;
    } = {}
  ): number {
    const {
      numOutputs = 1,
      width = 1024,
      height = 1024,
      quality = 'standard',
      numInferenceSteps = 50,
    } = options;

    let baseCost = 0;

    if (provider === 'replicate') {
      if (model.includes('sdxl')) {
        baseCost = 0.002; // SDXL base cost
      } else if (model.includes('stable-diffusion')) {
        baseCost = 0.0012; // SD 1.5 base cost
      } else if (model.includes('openjourney')) {
        baseCost = 0.001; // OpenJourney base cost
      } else {
        baseCost = 0.002; // Default Replicate cost
      }

      // Adjust for inference steps
      const stepMultiplier = Math.max(1, numInferenceSteps / 50);
      baseCost *= stepMultiplier;

    } else if (provider === 'openai') {
      if (model === 'dall-e-3') {
        if (quality === 'hd') {
          if (width === 1024 && height === 1024) {
            baseCost = 0.08; // HD 1024x1024
          } else {
            baseCost = 0.12; // HD wide format
          }
        } else {
          if (width === 1024 && height === 1024) {
            baseCost = 0.04; // Standard 1024x1024
          } else {
            baseCost = 0.08; // Standard wide format
          }
        }
      } else if (model === 'dall-e-2') {
        if (width >= 1024 || height >= 1024) {
          baseCost = 0.02; // 1024x1024
        } else if (width >= 512 || height >= 512) {
          baseCost = 0.018; // 512x512
        } else {
          baseCost = 0.016; // 256x256
        }
      }
    }

    return baseCost * numOutputs;
  }

  static async getTopUsers(limit: number = 10): Promise<Array<{
    userId: string;
    totalCost: number;
    generationCount: number;
    lastGeneration: Date;
  }>> {
    try {
      // This would ideally be a separate costs table, but we'll aggregate from design outputs
      const designs = await prisma.design.findMany({
        include: {
          designOutputs: true,
        },
      });

      const userStats = new Map<string, {
        totalCost: number;
        generationCount: number;
        lastGeneration: Date;
      }>();

      designs.forEach(design => {
        if (!userStats.has(design.userId)) {
          userStats.set(design.userId, {
            totalCost: 0,
            generationCount: 0,
            lastGeneration: new Date(0),
          });
        }

        const stats = userStats.get(design.userId)!;

        design.designOutputs.forEach(output => {
          try {
            const params = JSON.parse(output.generationParameters || '{}');
            const cost = parseFloat(params.cost || '0');

            if (!isNaN(cost) && cost > 0) {
              stats.totalCost += cost;
              stats.generationCount++;

              const timestamp = new Date(params.timestamp || output.createdAt);
              if (timestamp > stats.lastGeneration) {
                stats.lastGeneration = timestamp;
              }
            }
          } catch (error) {
            console.error('Error parsing generation parameters:', error);
          }
        });
      });

      return Array.from(userStats.entries())
        .map(([userId, stats]) => ({ userId, ...stats }))
        .sort((a, b) => b.totalCost - a.totalCost)
        .slice(0, limit);

    } catch (error) {
      console.error('Error getting top users:', error);
      return [];
    }
  }

  static async getDailyCostTrend(days: number = 30): Promise<Array<{
    date: string;
    totalCost: number;
    generationCount: number;
  }>> {
    try {
      const now = new Date();
      const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

      const designs = await prisma.design.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        include: {
          designOutputs: true,
        },
      });

      const dailyStats = new Map<string, {
        totalCost: number;
        generationCount: number;
      }>();

      designs.forEach(design => {
        design.designOutputs.forEach(output => {
          try {
            const params = JSON.parse(output.generationParameters || '{}');
            const cost = parseFloat(params.cost || '0');
            const timestamp = new Date(params.timestamp || output.createdAt);
            const dateKey = timestamp.toISOString().split('T')[0];

            if (!dailyStats.has(dateKey)) {
              dailyStats.set(dateKey, { totalCost: 0, generationCount: 0 });
            }

            const stats = dailyStats.get(dateKey)!;
            if (!isNaN(cost) && cost > 0) {
              stats.totalCost += cost;
              stats.generationCount++;
            }
          } catch (error) {
            console.error('Error parsing generation parameters:', error);
          }
        });
      });

      return Array.from(dailyStats.entries())
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date));

    } catch (error) {
      console.error('Error getting daily cost trend:', error);
      return [];
    }
  }

  // Cache management
  private static getCachedSummary(userId: string): CostSummary | null {
    const cached = this.cache.get(userId);
    const expiry = this.cacheExpiry.get(userId);

    if (cached && expiry && Date.now() < expiry) {
      return cached;
    }

    return null;
  }

  private static setCachedSummary(userId: string, summary: CostSummary): void {
    this.cache.set(userId, summary);
    this.cacheExpiry.set(userId, Date.now() + this.cacheTimeout);
  }

  private static clearUserCache(userId: string): void {
    this.cache.delete(userId);
    this.cacheExpiry.delete(userId);
  }

  // Admin functions
  static setDailyLimit(limit: number): void {
    this.dailyLimit = limit;
    this.clearAllCache();
  }

  static setMonthlyLimit(limit: number): void {
    this.monthlyLimit = limit;
    this.clearAllCache();
  }

  private static clearAllCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // Cleanup function for expired cache entries
  static cleanupCache(): void {
    const now = Date.now();
    for (const [userId, expiry] of this.cacheExpiry.entries()) {
      if (now >= expiry) {
        this.cache.delete(userId);
        this.cacheExpiry.delete(userId);
      }
    }
  }
}