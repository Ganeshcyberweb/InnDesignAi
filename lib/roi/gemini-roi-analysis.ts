/**
 * ROI Analysis utilities using Gemini AI
 * Provides intelligent ROI insights for interior design projects
 */

import googleAI from "@/lib/gemini/ai";

export interface ROIAnalysisInput {
  roomType: string;
  location?: string;
  budget?: string;
  currentADR?: number;
  propertyType?: string;
  guestProfile?: string;
  currentPerformance?: string;
}

export interface ROIInsights {
  themeAnalysis: ThemeROI[];
  overallRecommendation: string;
  marketInsights: string;
  riskAssessment: string;
}

export interface ThemeROI {
  theme: string;
  themeName: string;
  estimatedCost: {
    low: number;
    high: number;
    average: number;
  };
  revenueProjections: {
    adrIncrease: number;
    occupancyBoost: number;
    yearlyRevenue: number;
  };
  paybackPeriod: number;
  roiPercentage: number;
  riskLevel: 'low' | 'medium' | 'high';
  appeal: {
    score: number;
    targetGuests: string[];
  };
  recommendation: string;
}

/**
 * Generate comprehensive ROI analysis using Gemini
 */
export async function generateROIAnalysis(
  formData: ROIAnalysisInput,
  themes: Array<{ theme: string; label: string; images: string[] }>
): Promise<string> {
  
  const roiPrompt = createROIAnalysisPrompt(formData, themes);
  
  console.log('\n💰 === GENERATING ROI ANALYSIS ===');
  console.log('🎯 Property Type:', formData.propertyType || 'Hotel');
  console.log('🏠 Room Type:', formData.roomType);
  console.log('💵 Budget Range:', formData.budget || 'Not specified');
  console.log('📊 Analyzing', themes.length, 'themes...');

  try {
    const startTime = Date.now();
    
    // Use Gemini for ROI analysis with lower temperature for more consistent financial analysis
    const response = await googleAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: {
        parts: [{ text: roiPrompt }],
      },
      config: {
        temperature: 0.3, // Lower temperature for more consistent analysis
        maxOutputTokens: 4000, // Allow longer responses for detailed analysis
      }
    });

    const analysisTime = Date.now() - startTime;
    console.log(`⏱️ ROI Analysis Time: ${analysisTime}ms`);

    const roiAnalysis = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!roiAnalysis) {
      throw new Error('No ROI analysis generated');
    }

    console.log(`✅ ROI Analysis generated (${roiAnalysis.length} characters)`);
    console.log('===========================\n');

    return roiAnalysis;

  } catch (error) {
    console.error('❌ ROI Analysis Error:', error);
    console.error('===========================\n');
    
    // Return fallback analysis
    return generateFallbackROI(formData, themes);
  }
}

/**
 * Create detailed ROI analysis prompt for Gemini
 */
function createROIAnalysisPrompt(formData: ROIAnalysisInput, themes: Array<{ theme: string; label: string }>): string {
  const propertyType = formData.propertyType || 'hotel';
  const roomType = formData.roomType || 'guest room';
  const budget = formData.budget || 'moderate budget';
  const location = formData.location || 'mid-tier market';
  const currentADR = formData.currentADR || 'industry average';
  const guestProfile = formData.guestProfile || 'business and leisure travelers';

  return `
🏨 HOSPITALITY ROI ANALYSIS EXPERT

You are a hospitality industry ROI analyst with expertise in interior design impact on hotel performance. Analyze the ROI potential for interior design renovations.

PROPERTY CONTEXT:
- Property Type: ${propertyType}
- Room Type: ${roomType}
- Budget Range: ${budget}
- Location Market: ${location}
- Current ADR: $${currentADR}
- Target Guests: ${guestProfile}

DESIGN THEMES TO ANALYZE:
${themes.map((theme, index) => `${index + 1}. ${theme.label} - ${getThemeDescription(theme.theme)}`).join('\n')}

ANALYSIS REQUEST:
Provide a comprehensive ROI analysis for each theme. Consider industry benchmarks, market trends, and guest preferences.

FORMAT YOUR RESPONSE AS FOLLOWS:

📊 EXECUTIVE SUMMARY
[Brief overview of findings and top recommendation]

🎨 THEME ANALYSIS

**${themes[0]?.label || 'Modern Minimalist'}**
💰 Investment: $X,XXX - $XX,XXX per room
📈 Revenue Impact: +$XX/night ADR, +X% occupancy
⏰ Payback Period: XX months
📊 ROI: XX% annually
🎯 Appeal Score: X/10 (target: millennials, business travelers)
⚠️ Risk Level: Low/Medium/High
✅ Key Benefits: [specific advantages]
❌ Considerations: [potential drawbacks]

**${themes[1]?.label || 'Cozy Traditional'}**
[Same format as above]

**${themes[2]?.label || 'Luxury Contemporary'}**
[Same format as above]

🏆 RECOMMENDATION RANKING
1. [Best ROI theme] - [reason]
2. [Second choice] - [reason]  
3. [Third choice] - [reason]

🌍 MARKET INSIGHTS
- Current design trends in hospitality
- Guest booking behavior impact
- Competition analysis considerations
- Social media/Instagram potential

⚠️ RISK FACTORS
- Market volatility considerations
- Implementation challenges
- Maintenance cost implications
- Timeline and disruption factors

💡 OPTIMIZATION SUGGESTIONS
- Ways to enhance ROI for chosen theme
- Cost-saving opportunities
- Revenue maximization strategies
- Recommended implementation phases

Use specific dollar amounts, percentages, and timeframes. Base projections on hospitality industry standards and current market conditions.
`;
}

/**
 * Get theme description for prompt context
 */
function getThemeDescription(theme: string): string {
  const descriptions = {
    'modern': 'Clean lines, minimalist aesthetic, contemporary furniture, neutral colors',
    'cozy': 'Warm ambiance, traditional elements, comfortable textiles, inviting atmosphere',
    'luxury': 'Premium materials, high-end finishes, elegant furniture, sophisticated design'
  };
  return descriptions[theme as keyof typeof descriptions] || 'Contemporary design approach';
}

/**
 * Fallback ROI analysis when Gemini fails
 */
function generateFallbackROI(formData: ROIAnalysisInput, themes: Array<{ theme: string; label: string }>): string {
  return `
📊 EXECUTIVE SUMMARY
Based on industry benchmarks for ${formData.roomType} renovations, we've analyzed ROI potential for three design approaches.

🎨 THEME ANALYSIS

**Modern Minimalist**
💰 Investment: $8,000 - $15,000 per room
📈 Revenue Impact: +$20-35/night ADR, +6-10% occupancy
⏰ Payback Period: 18-24 months
📊 ROI: 25-35% annually
🎯 Appeal Score: 8/10 (millennials, tech professionals)
⚠️ Risk Level: Low
✅ Key Benefits: Instagram-worthy, easy maintenance, broad appeal
❌ Considerations: May feel cold to some guests

**Cozy Traditional**
💰 Investment: $6,000 - $12,000 per room
📈 Revenue Impact: +$15-25/night ADR, +4-8% occupancy
⏰ Payback Period: 20-30 months
📊 ROI: 20-30% annually
🎯 Appeal Score: 7/10 (families, older demographics)
⚠️ Risk Level: Low
✅ Key Benefits: Timeless appeal, guest comfort, cost-effective
❌ Considerations: May appear dated to younger guests

**Luxury Contemporary**
💰 Investment: $15,000 - $30,000 per room
📈 Revenue Impact: +$40-70/night ADR, +8-15% occupancy
⏰ Payback Period: 24-36 months
📊 ROI: 30-45% annually
🎯 Appeal Score: 9/10 (business travelers, affluent guests)
⚠️ Risk Level: Medium
✅ Key Benefits: Premium positioning, highest revenue potential
❌ Considerations: Higher investment, maintenance costs

🏆 RECOMMENDATION RANKING
1. Modern Minimalist - Best balance of cost and appeal
2. Luxury Contemporary - Highest revenue potential
3. Cozy Traditional - Most cost-effective option

This analysis is based on industry averages and should be refined with local market data.
`;
}

/**
 * Parse ROI metrics from Gemini response (for database storage)
 */
export function parseROIMetrics(roiAnalysis: string) {
  // Extract key metrics using regex patterns
  const costMatch = roiAnalysis.match(/\$([0-9,]+)\s*-\s*\$([0-9,]+)/);
  const roiMatch = roiAnalysis.match(/ROI:\s*([0-9]+)%/);
  const paybackMatch = roiAnalysis.match(/Payback.*?([0-9]+)\s*months/i);
  
  return {
    estimatedCost: costMatch ? parseInt(costMatch[2].replace(/,/g, '')) : null,
    roiPercentage: roiMatch ? parseInt(roiMatch[1]) : null,
    paybackTimeline: paybackMatch ? `${paybackMatch[1]} months` : null,
  };
}