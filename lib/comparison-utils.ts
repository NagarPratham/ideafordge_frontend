/**
 * Utility functions for comparing stored validation data with real-world data
 */

export interface ComparisonMetrics {
  marketAlignmentScore: number
  competitionFitScore: number
  technicalFeasibilityScore: number
  marketValidationScore: number
  overallComparisonScore: number
  insights: string[]
}

/**
 * Calculate comparison scores between stored data and real-world data
 */
export function calculateComparisonScores(
  storedFormData: {
    startupName: string
    description: string
    problem: string
    solution: string
    targetMarket: string
    industry: string
    stage: string
  },
  realWorldData: {
    marketSize?: string
    addressableMarket?: string
    marketGrowth?: string
    competitors?: Array<{
      name: string
      description: string
      similarity?: number
      funding?: string
    }>
    marketValidation?: {
      searchTrends?: string
      discussionActivity?: string
      existingProducts?: Array<{ name: string; platform: string; url?: string }>
    }
    technicalFeasibility?: {
      complexity: "low" | "medium" | "high"
      requiredResources: string[]
      similarTechStack: string[]
    }
    industryInsights?: {
      trends: string[]
      challenges: string[]
      opportunities: string[]
    }
    fundingInfo?: {
      averageFunding: string
      typicalInvestors: string[]
    }
  },
  analysisData: {
    overallScore?: number
    marketPotential?: number
    feasibility?: number
    competition?: number
    innovationIndex?: number
  }
): ComparisonMetrics {
  const insights: string[] = []
  let marketAlignmentScore = 50 // Base score
  let competitionFitScore = 50
  let technicalFeasibilityScore = 50
  let marketValidationScore = 50

  // 1. Market Alignment Score (based on how well solution aligns with market size and growth)
  if (realWorldData.addressableMarket && realWorldData.marketGrowth) {
    const tamValue = parseFloat(realWorldData.addressableMarket)
    const growthValue = parseFloat(realWorldData.marketGrowth.replace("%", ""))
    
    // Higher TAM and growth = better alignment
    if (tamValue > 100) {
      marketAlignmentScore += 20
      insights.push("Your solution targets a large addressable market (>$100B)")
    } else if (tamValue > 50) {
      marketAlignmentScore += 10
      insights.push("Your solution targets a substantial addressable market (>$50B)")
    } else if (tamValue < 10) {
      marketAlignmentScore -= 15
      insights.push("Your solution targets a niche market - validate demand carefully")
    }
    
    if (growthValue > 15) {
      marketAlignmentScore += 15
      insights.push(`Market is growing rapidly (${realWorldData.marketGrowth})`)
    } else if (growthValue > 10) {
      marketAlignmentScore += 8
      insights.push(`Market shows healthy growth (${realWorldData.marketGrowth})`)
    } else if (growthValue < 5) {
      marketAlignmentScore -= 10
      insights.push("Market growth is slow - ensure strong product-market fit")
    }
  }

  // Use analysis score if available
  if (analysisData.marketPotential) {
    marketAlignmentScore = (marketAlignmentScore + analysisData.marketPotential) / 2
  }

  // 2. Competition Fit Score (based on competition and your solution's uniqueness)
  if (realWorldData.competitors && realWorldData.competitors.length > 0) {
    const avgSimilarity = realWorldData.competitors.reduce((sum, c) => 
      sum + (c.similarity || 50), 0
    ) / realWorldData.competitors.length
    
    if (avgSimilarity > 70) {
      // High similarity = need strong differentiation
      competitionFitScore = 40 - (realWorldData.competitors.length * 3)
      insights.push(`Strong competition detected - ${realWorldData.competitors.length} similar competitors with ${Math.round(avgSimilarity)}% average similarity`)
    } else if (avgSimilarity > 50) {
      competitionFitScore = 55
      insights.push(`Moderate competition - differentiate your solution clearly`)
    } else {
      competitionFitScore = 70 + (realWorldData.competitors.length < 3 ? 10 : 0)
      insights.push(`Lower competition - opportunity for market differentiation`)
    }
    
    // Fewer competitors = better
    if (realWorldData.competitors.length > 5) {
      competitionFitScore -= 15
    } else if (realWorldData.competitors.length < 3) {
      competitionFitScore += 10
      if (realWorldData.competitors.length === 0) {
        insights.push("No direct competitors found - validate market demand exists")
      }
    }
  } else {
    competitionFitScore = 60
    insights.push("Limited competitor data - market may be untapped or unvalidated")
  }

  // Use analysis competition score (inverted since higher competition = lower fit)
  if (analysisData.competition !== undefined) {
    const competitionFitFromAnalysis = 100 - analysisData.competition
    competitionFitScore = (competitionFitScore + competitionFitFromAnalysis) / 2
  }

  // 3. Technical Feasibility Score (based on complexity and stage)
  if (realWorldData.technicalFeasibility) {
    const complexity = realWorldData.technicalFeasibility.complexity
    const stage = storedFormData.stage
    
    if (complexity === "low") {
      technicalFeasibilityScore = 85
      insights.push("Low technical complexity - faster to market")
    } else if (complexity === "medium") {
      technicalFeasibilityScore = 65
      insights.push("Medium technical complexity - standard development timeline")
    } else {
      technicalFeasibilityScore = 45
      insights.push("High technical complexity - requires expert team and significant resources")
    }
    
    // Stage adjustments
    if (stage === "growing") {
      technicalFeasibilityScore += 15
      insights.push("You're already in growth stage - technical feasibility proven")
    } else if (stage === "launched") {
      technicalFeasibilityScore += 10
      insights.push("Product is launched - technical barriers overcome")
    } else if (stage === "mvp") {
      technicalFeasibilityScore += 5
    } else {
      technicalFeasibilityScore -= 10
      insights.push("Early stage - technical feasibility needs validation")
    }
  }

  // Use analysis feasibility score if available
  if (analysisData.feasibility) {
    technicalFeasibilityScore = (technicalFeasibilityScore + analysisData.feasibility) / 2
  }

  // 4. Market Validation Score (based on search trends and existing products)
  if (realWorldData.marketValidation) {
    const searchTrends = realWorldData.marketValidation.searchTrends || ""
    const discussionActivity = realWorldData.marketValidation.discussionActivity || ""
    const existingProducts = realWorldData.marketValidation.existingProducts || []
    
    if (searchTrends.toLowerCase().includes("high")) {
      marketValidationScore += 20
      insights.push("High search interest indicates validated market demand")
    } else if (searchTrends.toLowerCase().includes("moderate")) {
      marketValidationScore += 10
      insights.push("Moderate search interest - emerging market opportunity")
    } else {
      marketValidationScore -= 10
      insights.push("Low search interest - validate market demand before proceeding")
    }
    
    if (discussionActivity.toLowerCase().includes("high") || 
        discussionActivity.toLowerCase().includes("strong")) {
      marketValidationScore += 15
      insights.push("High discussion activity - strong market signal")
    } else if (discussionActivity.toLowerCase().includes("limited") ||
               discussionActivity.toLowerCase().includes("low")) {
      marketValidationScore -= 15
      insights.push("Limited discussion - market may be unvalidated")
    }
    
    // Existing products: few = good opportunity, many = saturated market
    if (existingProducts.length === 0) {
      marketValidationScore += 10
      insights.push("No existing similar products - blue ocean opportunity (validate demand)")
    } else if (existingProducts.length > 5) {
      marketValidationScore -= 15
      insights.push(`${existingProducts.length} existing products found - highly competitive market`)
    } else {
      marketValidationScore += 5
      insights.push(`${existingProducts.length} existing products - moderate competition`)
    }
  }

  // Calculate overall comparison score (weighted average)
  const overallComparisonScore = Math.round(
    marketAlignmentScore * 0.3 +
    competitionFitScore * 0.25 +
    technicalFeasibilityScore * 0.25 +
    marketValidationScore * 0.2
  )

  // Ensure scores are within bounds
  marketAlignmentScore = Math.max(0, Math.min(100, Math.round(marketAlignmentScore)))
  competitionFitScore = Math.max(0, Math.min(100, Math.round(competitionFitScore)))
  technicalFeasibilityScore = Math.max(0, Math.min(100, Math.round(technicalFeasibilityScore)))
  marketValidationScore = Math.max(0, Math.min(100, Math.round(marketValidationScore)))

  // Add overall insight based on comparison score
  if (overallComparisonScore >= 80) {
    insights.unshift("Excellent alignment with real-world market data - strong opportunity")
  } else if (overallComparisonScore >= 65) {
    insights.unshift("Good alignment with market data - viable opportunity with proper execution")
  } else if (overallComparisonScore >= 50) {
    insights.unshift("Moderate alignment - validate assumptions and refine strategy")
  } else {
    insights.unshift("Lower alignment with market data - consider pivoting or addressing gaps")
  }

  return {
    marketAlignmentScore,
    competitionFitScore,
    technicalFeasibilityScore,
    marketValidationScore,
    overallComparisonScore,
    insights,
  }
}
