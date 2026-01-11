import { generateObject } from "ai"
import { z } from "zod"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { fetchMarketData, fetchMarketSize, fetchFundingData } from "@/lib/data-sources"
import { performComprehensiveAnalysis, getFallbackCompetitors } from "@/lib/real-world-analysis"

// Create Google provider instance
const googleAI = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ? createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })
  : null

/**
 * Analyzes solution characteristics to ensure unique scoring
 */
function analyzeSolutionCharacteristics(solution: string, problem: string, industry: string): string {
  const solutionLower = solution.toLowerCase()
  const problemLower = problem.toLowerCase()
  
  const characteristics: string[] = []
  
  // Complexity analysis
  if (solutionLower.includes("ai") || solutionLower.includes("machine learning") || solutionLower.includes("ml")) {
    characteristics.push("- HIGH complexity: Requires AI/ML expertise and infrastructure")
  } else if (solutionLower.includes("blockchain") || solutionLower.includes("crypto") || solutionLower.includes("web3")) {
    characteristics.push("- HIGH complexity: Requires blockchain technology and expertise")
  } else if (solutionLower.includes("app") || solutionLower.includes("mobile") || solutionLower.includes("software")) {
    characteristics.push("- MEDIUM complexity: Software development required")
  } else if (solutionLower.includes("platform") || solutionLower.includes("saas") || solutionLower.includes("marketplace")) {
    characteristics.push("- MEDIUM-HIGH complexity: Platform/marketplace requires network effects")
  } else {
    characteristics.push("- MODERATE complexity: Standard development approach")
  }
  
  // Innovation analysis
  const innovativeKeywords = ["revolutionary", "breakthrough", "first", "only", "new", "unique", "novel", "innovative"]
  const isInnovative = innovativeKeywords.some(keyword => solutionLower.includes(keyword) || problemLower.includes(keyword))
  
  if (isInnovative || !solutionLower.includes("similar") && !solutionLower.includes("like")) {
    characteristics.push("- HIGH innovation potential: Novel approach or first-mover advantage possible")
  } else {
    characteristics.push("- MODERATE innovation: Incremental improvement on existing solutions")
  }
  
  // Market scope analysis
  if (solutionLower.includes("niche") || solutionLower.includes("specific") || solutionLower.includes("targeted")) {
    characteristics.push("- NICHE market scope: Targets specific segment")
  } else if (solutionLower.includes("global") || solutionLower.includes("everyone") || solutionLower.includes("all")) {
    characteristics.push("- BROAD market scope: Targets large addressable market")
  } else {
    characteristics.push("- MODERATE market scope: Standard market approach")
  }
  
  // Problem-solution fit
  if (solutionLower.includes(problemLower.split(" ")[0]) || problemLower.includes(solutionLower.split(" ")[0])) {
    characteristics.push("- STRONG problem-solution fit: Solution directly addresses stated problem")
  } else {
    characteristics.push("- MODERATE problem-solution fit: Solution addresses problem but connection may need validation")
  }
  
  // Industry-specific considerations
  if (industry === "Healthcare" && (solutionLower.includes("tele") || solutionLower.includes("remote"))) {
    characteristics.push("- Healthcare remote solutions: High demand post-COVID, but regulatory considerations")
  } else if (industry === "Finance" && (solutionLower.includes("payment") || solutionLower.includes("fintech"))) {
    characteristics.push("- Fintech solution: Highly competitive but large market opportunity")
  } else if (industry === "Education" && (solutionLower.includes("online") || solutionLower.includes("learn"))) {
    characteristics.push("- EdTech solution: Growing market but requires user engagement")
  }
  
  return characteristics.join("\n")
}

const analysisSchema = z.object({
  overallScore: z.number().min(0).max(100).describe("Overall startup validation score"),
  marketPotential: z.number().min(0).max(100).describe("Market potential score"),
  feasibility: z.number().min(0).max(100).describe("Technical and business feasibility score"),
  competition: z.number().min(0).max(100).describe("Competition intensity (higher = more competition)"),
  riskLevel: z.number().min(0).max(100).describe("Risk level (higher = more risky)"),
  innovationIndex: z.number().min(0).max(100).describe("Innovation and uniqueness score"),
  swot: z.object({
    strengths: z.array(z.string()).describe("Key strengths of the idea based on real market data"),
    weaknesses: z.array(z.string()).describe("Potential weaknesses compared to competitors"),
    opportunities: z.array(z.string()).describe("Market opportunities from real industry trends"),
    threats: z.array(z.string()).describe("Potential threats from actual market conditions"),
  }),
  targetAudience: z.array(
    z.object({
      name: z.string(),
      age: z.string(),
      description: z.string(),
    }),
  ),
  monetizationStrategies: z.array(
    z.object({
      name: z.string(),
      fit: z.number().min(0).max(100),
    }),
  ),
  pitchTips: z.array(z.string()).describe("Tips to improve the pitch"),
  roadmap: z.array(
    z.object({
      phase: z.string(),
      title: z.string(),
      duration: z.string(),
    }),
  ),
  realWorldData: z.object({
    marketSize: z.string().describe("Total industry market size in USD billions"),
    addressableMarket: z.string().optional().describe("Addressable market (TAM) for this solution in USD billions"),
    marketGrowth: z.string().describe("Market growth rate percentage"),
    competitors: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        similarity: z.number().optional().describe("Similarity score to this solution (0-100)"),
        website: z.string().optional(),
        funding: z.string().optional(),
      }),
    ),
    marketValidation: z.object({
      searchTrends: z.string().optional(),
      discussionActivity: z.string().optional(),
      existingProducts: z.array(z.object({
        name: z.string(),
        platform: z.string(),
        url: z.string().optional(),
      })).optional(),
    }).optional(),
    industryInsights: z.object({
      trends: z.array(z.string()),
      challenges: z.array(z.string()),
      opportunities: z.array(z.string()),
    }).optional(),
    fundingInfo: z.object({
      averageFunding: z.string(),
      typicalInvestors: z.array(z.string()),
      recentRounds: z.array(z.object({
        company: z.string(),
        amount: z.string(),
        date: z.string(),
      })).optional(),
    }),
    technicalFeasibility: z.object({
      complexity: z.enum(["low", "medium", "high"]),
      requiredResources: z.array(z.string()),
      similarTechStack: z.array(z.string()),
    }).optional(),
    industryTrends: z.array(z.string()).optional().describe("Industry trends for backward compatibility"),
    recentNews: z.array(z.object({
      title: z.string(),
      source: z.string(),
      date: z.string(),
    })).optional(),
  }),
})

export async function POST(req: Request) {
  const body = await req.json()
  const { startupName, description, problem, solution, targetMarket, industry, stage } = body

  try {
    // Perform comprehensive real-world analysis using multiple data sources
    const comprehensiveData = await performComprehensiveAnalysis(
      startupName,
      description,
      problem,
      solution,
      targetMarket,
      industry,
      stage,
    )

    // Also fetch legacy data for compatibility
    const [marketData, marketSize, fundingData] = await Promise.all([
      fetchMarketData(industry, problem, solution, targetMarket),
      fetchMarketSize(industry, targetMarket, solution),
      fetchFundingData(industry, stage),
    ])

    // Build comprehensive prompt with REAL-WORLD DATA from multiple sources
    const realDataContext = `
═══════════════════════════════════════════════════════════════
COMPREHENSIVE REAL-WORLD DATA ANALYSIS (FROM ACTUAL DATA SOURCES)
═══════════════════════════════════════════════════════════════

MARKET SIZE DATA (Real Industry Data):
- Total Industry Market: ${comprehensiveData.marketSize.total} billion USD
- Addressable Market (TAM) for THIS solution: ${comprehensiveData.marketSize.addressable} billion USD
- Market Growth Rate: ${comprehensiveData.marketSize.growth}
- Market Scope: ${parseFloat(comprehensiveData.marketSize.addressable) / parseFloat(comprehensiveData.marketSize.total) * 100 < 10 ? "Niche market" : "Broad market"}

COMPETITOR ANALYSIS (Based on Actual Market Research):
${comprehensiveData.competitors.length > 0 
  ? comprehensiveData.competitors.map((c, idx) => 
      `${idx + 1}. ${c.name} (Similarity: ${c.similarity}%)
   - Description: ${c.description}
   - ${c.funding ? `Funding: ${c.funding}` : ""}
   - ${c.website ? `Website: ${c.website}` : ""}
   - Similarity Score: ${c.similarity}% (higher = more similar to your solution)`
    ).join("\n\n")
  : `NO DIRECT COMPETITORS FOUND for "${solution.substring(0, 80)}"
   This indicates:
   - Either a blue ocean opportunity (score innovation 70-90, competition 20-40)
   - OR insufficient market validation (score market potential 30-50, risk 60-80)
   - Analyze which applies to this specific solution`}

MARKET VALIDATION SIGNALS (Real User Interest Data):
- Search Interest Trends: ${comprehensiveData.marketValidation.searchTrends}
- Discussion Activity: ${comprehensiveData.marketValidation.discussionActivity}
- Existing Products Found: ${comprehensiveData.marketValidation.existingProducts.length}
${comprehensiveData.marketValidation.existingProducts.length > 0
  ? `\nExisting Similar Products:
${comprehensiveData.marketValidation.existingProducts.map((p, idx) => `   ${idx + 1}. ${p.name} (${p.platform})${p.url ? ` - ${p.url}` : ""}`).join("\n")}`
  : "\nNo existing similar products found - validate market need carefully"}

INDUSTRY INSIGHTS (Current Market Conditions):
Trends:
${comprehensiveData.industryInsights.trends.map((t, idx) => `  ${idx + 1}. ${t}`).join("\n")}

Challenges:
${comprehensiveData.industryInsights.challenges.map((c, idx) => `  ${idx + 1}. ${c}`).join("\n")}

Opportunities:
${comprehensiveData.industryInsights.opportunities.map((o, idx) => `  ${idx + 1}. ${o}`).join("\n")}

FUNDING LANDSCAPE (Recent Activity):
- Average Raise for ${stage} stage: ${comprehensiveData.fundingLandscape.averageRaise}
- Typical Investors: ${comprehensiveData.fundingLandscape.investors.join(", ")}
Recent Funding Rounds in ${industry}:
${comprehensiveData.fundingLandscape.recentRounds.map((r, idx) => 
  `  ${idx + 1}. ${r.company}: ${r.amount} (${r.date})`
).join("\n")}

TECHNICAL FEASIBILITY ANALYSIS:
- Complexity Level: ${comprehensiveData.technicalFeasibility.complexity.toUpperCase()}
- Required Resources: ${comprehensiveData.technicalFeasibility.requiredResources.join(", ")}
- Similar Tech Stack Used: ${comprehensiveData.technicalFeasibility.similarTechStack.join(", ")}
- ${comprehensiveData.technicalFeasibility.complexity === "high" ? "HIGH complexity = Lower feasibility score (40-65)" : comprehensiveData.technicalFeasibility.complexity === "medium" ? "MEDIUM complexity = Moderate feasibility score (60-80)" : "LOW complexity = Higher feasibility score (75-95)"}

═══════════════════════════════════════════════════════════════
`

    // Pre-analyze solution characteristics to ensure unique scoring
    const solutionCharacteristics = analyzeSolutionCharacteristics(solution, problem, industry)
    
    // Create a unique identifier for this specific analysis
    const solutionFingerprint = `${solution.substring(0, 50).replace(/\s+/g, "-")}-${problem.substring(0, 30).replace(/\s+/g, "-")}-${targetMarket.substring(0, 20).replace(/\s+/g, "-")}`
    
    const prompt = `ANALYSIS REQUEST ID: ${solutionFingerprint}

You are analyzing a SPECIFIC startup idea. Each startup idea is UNIQUE and MUST receive DIFFERENT scores based on its specific characteristics. DO NOT use generic or default scores.

THIS ANALYSIS IS FOR: "${startupName}" - Analysis ID: ${solutionFingerprint}
Remember: Different startups with different solutions MUST get different scores. If you've analyzed another startup before, this one is DIFFERENT and should score DIFFERENTLY.

SOLUTION CHARACTERISTICS ANALYSIS:
${solutionCharacteristics}

Based on the above, this solution appears to be:
- Complexity Level: ${solutionCharacteristics.includes("high complexity") ? "HIGH" : solutionCharacteristics.includes("medium") ? "MEDIUM" : "LOW"}
- Innovation Level: ${solutionCharacteristics.includes("highly innovative") ? "HIGH" : solutionCharacteristics.includes("moderately") ? "MEDIUM" : "LOW"}
- Market Scope: ${solutionCharacteristics.includes("niche") ? "NICHE" : solutionCharacteristics.includes("broad") ? "BROAD" : "MODERATE"}

Use these characteristics to calculate DIFFERENT scores than you would for other startups.

=== STARTUP DETAILS (ANALYZE THESE SPECIFICALLY) ===
Startup Name: "${startupName}"
Full Description: "${description}"
Specific Problem Being Solved: "${problem}"
Exact Proposed Solution: "${solution}"
Target Market: "${targetMarket}"
Industry: "${industry}"
Current Development Stage: "${stage}"

=== REAL-WORLD MARKET CONTEXT (USE THIS DATA) ===
${realDataContext}

=== CRITICAL ANALYSIS REQUIREMENTS ===

1. SOLUTION-SPECIFIC ANALYSIS (MOST IMPORTANT):
   - Analyze the EXACT solution: "${solution}"
   - Evaluate how well it solves the SPECIFIC problem: "${problem}"
   - Rate feasibility based on THIS solution's complexity and requirements
   - Assess innovation based on how unique THIS solution is compared to competitors
   - Market potential should reflect THIS solution's addressable market, not generic industry data

2. COMPETITIVE ANALYSIS (USE REAL COMPETITOR DATA PROVIDED):
   - Compare THIS solution: "${solution.substring(0, 100)}" directly against EACH competitor listed above
   ${comprehensiveData.competitors.length > 0 
     ? `\n   DETAILED COMPETITOR COMPARISON REQUIRED:
${comprehensiveData.competitors.map((c, idx) => `   COMPETITOR ${idx + 1}: ${c.name} (${c.similarity}% similar to your solution)
      - Description: ${c.description}
      - Similarity: ${c.similarity}% (This is REAL similarity data from market research)
      - Your solution: "${solution.substring(0, 80)}"
      - Analysis Required:
        * Is "${solution.substring(0, 60)}" better than ${c.name}? How?
        * What are the key differentiators?
        * Does your solution address a gap ${c.name} doesn't?
      - Score Impact:
        * If similarity >70% AND your solution is better: Innovation +15-25, Competition -10-20
        * If similarity >70% AND your solution is worse/same: Innovation -15-25, Competition +10-20
        * If similarity <50%: Innovation +5-15, Competition -5-10 (different market)`).join("\n\n")}
   
   - COMPETITION SCORE CALCULATION:
     * Average competitor similarity: ${Math.round(comprehensiveData.competitors.reduce((sum, c) => sum + c.similarity, 0) / comprehensiveData.competitors.length)}%
     * Number of competitors: ${comprehensiveData.competitors.length}
     * If average similarity >60% with ${comprehensiveData.competitors.length}+ competitors: Competition = 70-90
     * If average similarity 40-60%: Competition = 50-70
     * If average similarity <40% or competitors <3: Competition = 25-55
     * Base score on ACTUAL similarity data provided above`
     : `   NO COMPETITORS FOUND in market research for "${solution.substring(0, 80)}"
   - Market validation shows: ${comprehensiveData.marketValidation.searchTrends}
   - Discussion activity: ${comprehensiveData.marketValidation.discussionActivity}
   - Analysis Required:
     * If market validation is "High" but no competitors: Blue ocean (Innovation: 75-90, Competition: 15-35, BUT validate market exists - Risk: 50-70)
     * If market validation is "Low": Unvalidated market (Market Potential: 30-50, Risk: 70-85, Competition: 10-30)
     * Analyze which scenario applies to: "${solution}" solving "${problem}"`}
   
   - Use the REAL competitor similarity scores provided to calculate competition intensity accurately

3. MARKET FIT ASSESSMENT (USE REAL MARKET DATA):
   - Target Market: "${targetMarket}"
   - Total Industry Market: ${comprehensiveData.marketSize.total}B USD
   - YOUR Solution's Addressable Market (TAM): ${comprehensiveData.marketSize.addressable}B USD
   - Market Growth: ${comprehensiveData.marketSize.growth}
   - Market Validation Signals:
     * Search Trends: ${comprehensiveData.marketValidation.searchTrends}
     * Discussion Activity: ${comprehensiveData.marketValidation.discussionActivity}
     * Existing Products Found: ${comprehensiveData.marketValidation.existingProducts.length}
   
   - MARKET POTENTIAL SCORE CALCULATION:
     * Addressable market of ${comprehensiveData.marketSize.addressable}B = ${parseFloat(comprehensiveData.marketSize.addressable) > 100 ? "Large" : parseFloat(comprehensiveData.marketSize.addressable) > 50 ? "Medium" : "Niche"} market
     * ${parseFloat(comprehensiveData.marketSize.addressable) > 100 ? "Large TAM → Market Potential: 70-90" : parseFloat(comprehensiveData.marketSize.addressable) > 50 ? "Medium TAM → Market Potential: 55-75" : "Niche TAM → Market Potential: 40-65"}
     * Growth rate ${comprehensiveData.marketSize.growth}: ${parseFloat(comprehensiveData.marketSize.growth) > 15 ? "+5-10 points" : parseFloat(comprehensiveData.marketSize.growth) > 10 ? "+3-5 points" : "No bonus"} to market potential
     * Validation signals: ${comprehensiveData.marketValidation.searchTrends.includes("High") ? "+5-10 points" : comprehensiveData.marketValidation.searchTrends.includes("Low") ? "-5-10 points" : "No adjustment"}
     * Calculate based on THIS solution's actual addressable market: ${comprehensiveData.marketSize.addressable}B

4. FEASIBILITY CALCULATION (USE TECHNICAL ANALYSIS DATA):
   - Technical Complexity: ${comprehensiveData.technicalFeasibility.complexity.toUpperCase()} (from real analysis)
   - Required Resources: ${comprehensiveData.technicalFeasibility.requiredResources.join(", ")}
   - Similar Tech Stack: ${comprehensiveData.technicalFeasibility.similarTechStack.join(", ")}
   - Current Stage: ${stage}
   
   - FEASIBILITY SCORE CALCULATION:
     * Complexity Level: ${comprehensiveData.technicalFeasibility.complexity}
     * ${comprehensiveData.technicalFeasibility.complexity === "high" ? "HIGH complexity → Feasibility: 35-60 (requires expert team, significant resources)" : comprehensiveData.technicalFeasibility.complexity === "medium" ? "MEDIUM complexity → Feasibility: 60-80 (standard development, moderate resources)" : "LOW complexity → Feasibility: 75-95 (straightforward build, minimal resources)"}
     * Stage Impact: ${stage === "idea" ? "Idea stage → -10-20 points (no validation)" : stage === "mvp" ? "MVP stage → Base score (some validation)" : stage === "launched" ? "Launched → +5-10 points (proven feasible)" : "Growing → +10-15 points (validated and scalable)"}
     * Required Resources Impact: ${comprehensiveData.technicalFeasibility.requiredResources.length > 3 ? "Many resources needed → -5-10 points" : "Standard resources → Base score"}
     * Calculate based on: Can "${solution.substring(0, 80)}" be built with ${comprehensiveData.technicalFeasibility.complexity} complexity at ${stage} stage?

5. RISK ASSESSMENT (USE COMPREHENSIVE DATA):
   - Stage: ${stage} (${stage === "idea" ? "HIGHEST risk" : stage === "growing" ? "LOWEST risk" : "MODERATE risk"})
   - Funding Landscape: ${comprehensiveData.fundingLandscape.averageRaise} average raise
   - Market Competition: ${comprehensiveData.competitors.length} competitors found
   - Market Validation: ${comprehensiveData.marketValidation.searchTrends}
   - Technical Complexity: ${comprehensiveData.technicalFeasibility.complexity}
   
   - RISK SCORE CALCULATION:
     * Base Risk by Stage:
       - Idea stage: 65-85 (no validation, high uncertainty)
       - MVP stage: 45-65 (some validation, moderate uncertainty)
       - Launched stage: 25-45 (market tested, lower uncertainty)
       - Growing stage: 15-35 (proven traction, minimal uncertainty)
     * Competition Risk: ${comprehensiveData.competitors.length > 5 ? "+15-25 points (saturated market)" : comprehensiveData.competitors.length > 2 ? "+5-15 points (moderate competition)" : "-5-10 points (low competition, but validate market)"}
     * Validation Risk: ${comprehensiveData.marketValidation.searchTrends.includes("High") ? "-5-10 points (validated market)" : comprehensiveData.marketValidation.searchTrends.includes("Low") ? "+10-20 points (unvalidated market)" : "No adjustment"}
     * Technical Risk: ${comprehensiveData.technicalFeasibility.complexity === "high" ? "+15-25 points (complex build)" : comprehensiveData.technicalFeasibility.complexity === "medium" ? "+5-10 points (moderate complexity)" : "-5-10 points (simple build)"}
     * Funding Risk: ${stage === "idea" && parseFloat(comprehensiveData.fundingLandscape.averageRaise.split("-")[0].replace(/[^0-9]/g, "")) > 100000 ? "+5 points (high funding requirements)" : "-5 points (reasonable funding needs)"}
     * Calculate total risk based on ALL factors above

6. INNOVATION SCORE (USE COMPETITOR SIMILARITY DATA):
   - Competitors Found: ${comprehensiveData.competitors.map(c => c.name).join(", ") || "None"}
   - Average Similarity to Competitors: ${comprehensiveData.competitors.length > 0 ? Math.round(comprehensiveData.competitors.reduce((sum, c) => sum + c.similarity, 0) / comprehensiveData.competitors.length) : 0}%
   - Existing Products: ${comprehensiveData.marketValidation.existingProducts.length} similar products found
   
   - INNOVATION SCORE CALCULATION:
     * If average similarity >70%: Innovation = 25-45 (similar to existing, incremental improvement)
     * If average similarity 40-70%: Innovation = 45-70 (moderate differentiation, some novelty)
     * If average similarity <40%: Innovation = 65-85 (unique approach, significant differentiation)
     * If no competitors found BUT market validation is high: Innovation = 75-95 (novel solution to validated problem)
     * If no competitors found AND market validation is low: Innovation = 50-70 (novel but unproven)
     * Existing Products Impact: ${comprehensiveData.marketValidation.existingProducts.length > 3 ? "-10-15 points (many similar products exist)" : comprehensiveData.marketValidation.existingProducts.length > 0 ? "-5-10 points (some similar products)" : "+5-10 points (no similar products found)"}
     * Base on ACTUAL similarity scores: ${comprehensiveData.competitors.length > 0 ? comprehensiveData.competitors.map(c => `${c.name} (${c.similarity}%)`).join(", ") : "No competitors - analyze uniqueness differently"}

=== SCORING GUIDELINES (CRITICAL: MUST BE UNIQUE FOR THIS STARTUP) ===

CALCULATE SCORES BASED ON THIS SPECIFIC SOLUTION, NOT GENERIC INDUSTRY AVERAGES:

1. Overall Score (0-100):
   - Simple/low-tech solutions: Typically 65-80 range
   - Complex/AI/tech-heavy solutions: Typically 45-70 range (lower due to higher risk)
   - Well-defined B2B SaaS: Typically 70-85 range
   - Consumer apps: Typically 55-75 range
   - Choose based on THIS solution: "${solution.substring(0, 80)}"

2. Market Potential (0-100):
   - If solution targets niche market: 50-70 (smaller but focused)
   - If solution targets broad consumer market: 65-85 (larger TAM)
   - If solution is B2B enterprise: 70-90 (high value per customer)
   - Base on: Target market "${targetMarket}" and addressable market size

3. Feasibility (0-100):
   - Simple app/website: 80-95 (easy to build)
   - Requires AI/ML: 40-70 (complex, requires expertise)
   - Requires hardware: 30-60 (very complex, capital intensive)
   - Software/SaaS: 65-85 (moderate complexity)
   - Score based on THIS solution's complexity: "${solution.substring(0, 80)}"

4. Competition (0-100) - HIGHER = MORE COMPETITION:
   - ${marketData.competitors?.length === 0 ? "No competitors found: Score 20-40 (low competition, but validate market exists)" : ""}
   - ${marketData.competitors && marketData.competitors.length <= 2 ? `${marketData.competitors.length} competitors: Score 40-60 (moderate competition)` : ""}
   - ${marketData.competitors && marketData.competitors.length > 2 ? `${marketData.competitors.length}+ competitors: Score 60-85 (high competition, must differentiate strongly)` : ""}
   - If this solution is similar to competitors: +10-20 to competition score
   - If this solution is unique: -10-20 to competition score

5. Risk Level (0-100) - HIGHER = MORE RISKY:
   - ${stage === "idea" ? "Idea stage: Score 60-80 (high risk, no validation)" : ""}
   - ${stage === "mvp" ? "MVP stage: Score 40-60 (moderate risk, some validation)" : ""}
   - ${stage === "launched" ? "Launched stage: Score 25-45 (lower risk, market tested)" : ""}
   - ${stage === "growing" ? "Growing stage: Score 15-35 (low risk, proven traction)" : ""}
   - Complex technical solution: +15-25 to risk
   - Simple solution: -10-15 to risk

6. Innovation Index (0-100):
   - If solution is identical to existing: Score 20-40
   - If solution is incremental improvement: Score 40-65
   - If solution is novel/unique: Score 65-90
   - If solution is revolutionary: Score 85-100
   - Compare THIS solution to competitors: ${marketData.competitors?.map(c => c.name).join(", ") || "none found"}

=== SWOT ANALYSIS (MUST USE REAL-WORLD DATA) ===
- Strengths: 
  * What are the SPECIFIC strengths of "${solution}"?
  * Consider: Technical feasibility (${comprehensiveData.technicalFeasibility.complexity}), market size (${comprehensiveData.marketSize.addressable}B TAM), unique features vs competitors
  * Reference actual competitor analysis above
  
- Weaknesses:
  * What are the SPECIFIC weaknesses compared to competitors: ${comprehensiveData.competitors.map(c => c.name).join(", ") || "none found"}?
  * Consider: ${comprehensiveData.technicalFeasibility.complexity === "high" ? "High technical complexity" : ""} ${comprehensiveData.competitors.length > 3 ? "Strong competition" : ""} ${comprehensiveData.marketValidation.searchTrends.includes("Low") ? "Unvalidated market" : ""}
  * Use competitor similarity scores to identify gaps
  
- Opportunities:
  * Market Opportunities: ${comprehensiveData.industryInsights.opportunities.join("; ")}
  * Industry Trends: ${comprehensiveData.industryInsights.trends.slice(0, 2).join("; ")}
  * Market Growth: ${comprehensiveData.marketSize.growth}
  * Funding Availability: ${comprehensiveData.fundingLandscape.averageRaise} for ${stage} stage
  * How can "${solution}" capitalize on these opportunities?
  
- Threats:
  * Competitors: ${comprehensiveData.competitors.length > 0 ? comprehensiveData.competitors.map(c => `${c.name} (${c.similarity}% similar)`).join(", ") : "No direct competitors but market validation needed"}
  * Industry Challenges: ${comprehensiveData.industryInsights.challenges.join("; ")}
  * Market Risks: ${comprehensiveData.marketValidation.searchTrends.includes("Low") ? "Low market validation" : "Competitive market"}
  * Technical Risks: ${comprehensiveData.technicalFeasibility.complexity === "high" ? "High complexity implementation" : "Standard technical challenges"}

=== CRITICAL REQUIREMENTS FOR SCORING ===
1. DIFFERENT solutions MUST receive DIFFERENT scores - NO TWO STARTUPS SHOULD HAVE IDENTICAL SCORES
2. The solution "${solution.substring(0, 100)}" is UNIQUE - score it uniquely
3. Compare your scores to these examples:
   - Simple "food delivery app" → Feasibility: 85, Innovation: 40, Competition: 75
   - Complex "AI-powered medical diagnosis" → Feasibility: 45, Innovation: 85, Competition: 60
   - These are DIFFERENT - your startup should also be DIFFERENT

4. SCORING VALIDATION:
   Before finalizing scores, ask yourself:
   - If I gave the same scores to a completely different startup, would that make sense? NO - so change them
   - Are these scores specific to "${startupName}" and "${solution.substring(0, 50)}"? If not, recalculate
   - Would a simple e-commerce site get the same feasibility as an AI platform? NO - so differentiate

5. SOLUTION-SPECIFIC ADJUSTMENTS:
   - If "${solution.toLowerCase().includes("ai") ? "THIS is an AI solution" : "THIS solution"}" → Adjust feasibility and innovation accordingly
   - If competitors list has ${marketData.competitors?.length || 0} entries → Competition score must reflect this number
   - If stage is "${stage}" → Risk score must reflect this stage (${stage === "idea" ? "higher" : stage === "growing" ? "lower" : "moderate"})

6. ENFORCE VARIATION:
   - Calculate scores as: base_industry_score + solution_specific_adjustment + problem_solution_fit_bonus
   - This ensures EVERY startup gets UNIQUE scores based on its characteristics
   - Do NOT return similar scores for different startups

7. FINAL CHECK:
   Write a one-sentence justification for EACH score explaining why it's specific to this startup:
   - "Overall Score is X because [specific reason related to this solution]"
   - "Feasibility is X because [specific technical requirement of this solution]"
   - "Innovation is X because [specific comparison to competitors]"

Provide a detailed, specific analysis that reflects this startup's unique characteristics. The scores MUST be different from any other startup analysis.`

    // Log solution details for debugging uniqueness
    console.log(`\n=== ANALYZING STARTUP: ${startupName} ===`)
    console.log(`Solution: ${solution.substring(0, 150)}`)
    console.log(`Problem: ${problem.substring(0, 100)}`)
    console.log(`Competitors found: ${marketData.competitors?.length || 0}`)
    console.log(`Market: ${marketSize.size}B (${marketSize.growthRate} growth)`)

    // Use Google Gemini if available, otherwise OpenAI, otherwise fallback
    let result
    if (googleAI) {
      result = await generateObject({
        model: googleAI("gemini-1.5-flash"),
        schema: analysisSchema,
        prompt,
        temperature: 0.9, // Higher temperature ensures variation between different startups
      })
    } else if (process.env.OPENAI_API_KEY) {
      result = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: analysisSchema,
        prompt,
        temperature: 0.9,
      })
    } else {
      // No API keys available - throw error to trigger fallback
      throw new Error("No API keys available")
    }
    
    // Log generated scores to verify uniqueness
    console.log(`Generated Scores:`)
    console.log(`  Overall: ${result.object.overallScore}`)
    console.log(`  Market Potential: ${result.object.marketPotential}`)
    console.log(`  Feasibility: ${result.object.feasibility}`)
    console.log(`  Competition: ${result.object.competition}`)
    console.log(`  Risk: ${result.object.riskLevel}`)
    console.log(`  Innovation: ${result.object.innovationIndex}\n`)

    // Add comprehensive real-world data to the response
    const enhancedResult = {
      ...result.object,
      realWorldData: {
        // Market data
        marketSize: comprehensiveData.marketSize.total,
        addressableMarket: comprehensiveData.marketSize.addressable,
        marketGrowth: comprehensiveData.marketSize.growth,
        
        // Competitors with similarity scores
        competitors: comprehensiveData.competitors.map(c => ({
          name: c.name,
          description: c.description,
          similarity: c.similarity,
          website: c.website,
          funding: c.funding,
        })),
        
        // Market validation
        marketValidation: {
          searchTrends: comprehensiveData.marketValidation.searchTrends,
          discussionActivity: comprehensiveData.marketValidation.discussionActivity,
          existingProducts: comprehensiveData.marketValidation.existingProducts,
        },
        
        // Industry insights
        industryInsights: comprehensiveData.industryInsights,
        
        // Funding information
        fundingInfo: {
          averageFunding: comprehensiveData.fundingLandscape.averageRaise,
          typicalInvestors: comprehensiveData.fundingLandscape.investors,
          recentRounds: comprehensiveData.fundingLandscape.recentRounds,
        },
        
        // Technical feasibility
        technicalFeasibility: {
          complexity: comprehensiveData.technicalFeasibility.complexity,
          requiredResources: comprehensiveData.technicalFeasibility.requiredResources,
          similarTechStack: comprehensiveData.technicalFeasibility.similarTechStack,
        },
        
        // Legacy support (for backward compatibility)
        industryTrends: marketData.trends || comprehensiveData.industryInsights.trends || [],
        recentNews: marketData.recentNews || [],
      },
    }

    return Response.json(enhancedResult)
  } catch (error: any) {
    console.error("Error in analyze route:", error)
    
    // Check if it's an authentication error (API key missing)
    const isAuthError = error?.message?.includes("Unauthenticated") || 
                        error?.message?.includes("API key") ||
                        error?.name === "GatewayAuthenticationError"
    
    if (isAuthError) {
      console.log("AI Gateway authentication failed - using mock analysis data")
      
      // Try to fetch real-world data first (doesn't require AI API)
      let comprehensiveData: any
      let marketData: any
      let marketSize: any
      let fundingData: any
      
      try {
        comprehensiveData = await performComprehensiveAnalysis(
          startupName,
          description,
          problem,
          solution,
          targetMarket,
          industry,
          stage,
        )
        const dataResults = await Promise.all([
          fetchMarketData(industry, problem, solution, targetMarket),
          fetchMarketSize(industry, targetMarket, solution),
          fetchFundingData(industry, stage),
        ])
        marketData = dataResults[0]
        marketSize = dataResults[1]
        fundingData = dataResults[2]
      } catch (dataError) {
        console.error("Error fetching real-world data:", dataError)
        // Use default values if data fetching fails
        comprehensiveData = {
          marketSize: { total: "1000", addressable: "100", growth: "10%" },
          competitors: [],
          marketValidation: { searchTrends: "Moderate", discussionActivity: "Moderate", existingProducts: [] },
          industryInsights: { trends: [], challenges: [], opportunities: [] },
          fundingLandscape: { averageRaise: "$1M", investors: ["Angel Investors"], recentRounds: [] },
          technicalFeasibility: { complexity: "medium" as const, requiredResources: [], similarTechStack: [] },
        }
        marketData = { competitors: [], trends: [], recentNews: [] }
        marketSize = { size: "1000", growthRate: "10%" }
        fundingData = { averageFunding: "$1M", investors: ["Angel Investors"] }
      }
      
      // Generate mock analysis based on form data and real-world data
      const mockAnalysis = generateMockAnalysis(
        startupName,
        description,
        problem,
        solution,
        targetMarket,
        industry,
        stage,
        comprehensiveData,
        marketData,
        marketSize,
        fundingData
      )
      
      return Response.json(mockAnalysis)
    }
    
    // For other errors, try the fallback AI call
    try {
      const prompt = `Analyze this startup idea and provide a comprehensive validation assessment:

Startup Name: ${startupName}
Description: ${description}
Problem: ${problem}
Solution: ${solution}
Target Market: ${targetMarket}
Industry: ${industry}
Current Stage: ${stage}

Note: Some real-world data could not be fetched. Provide analysis based on general industry knowledge.`

      console.log(`Fallback analysis for: ${startupName} - ${solution.substring(0, 50)}`)
      
      // Try with available providers
      let result
      if (googleAI) {
        result = await generateObject({
          model: googleAI("gemini-1.5-flash"),
          schema: analysisSchema,
          prompt,
          temperature: 0.9,
        })
      } else if (process.env.OPENAI_API_KEY) {
        result = await generateObject({
          model: openai("gpt-4o-mini"),
          schema: analysisSchema,
          prompt,
          temperature: 0.9,
        })
      } else {
        throw new Error("No API keys available for fallback")
      }

      return Response.json(result.object)
    } catch (fallbackError) {
      console.error("Fallback AI analysis also failed:", fallbackError)
      // Final fallback: return mock data
      const mockAnalysis = generateMockAnalysis(
        startupName,
        description,
        problem,
        solution,
        targetMarket,
        industry,
        stage,
        await performComprehensiveAnalysis(startupName, description, problem, solution, targetMarket, industry, stage).catch(() => ({
          marketSize: { total: "1000", addressable: "100", growth: "10%" },
          competitors: getFallbackCompetitors(solution, industry).map(c => ({ ...c, website: undefined, funding: undefined })),
          marketValidation: { searchTrends: "Moderate", discussionActivity: "Moderate", existingProducts: [] },
          industryInsights: { trends: [], challenges: [], opportunities: [] },
          fundingLandscape: { averageRaise: "$1M", investors: ["Angel Investors"], recentRounds: [] },
          technicalFeasibility: { complexity: "medium" as const, requiredResources: [], similarTechStack: [] },
        })),
        await fetchMarketData(industry, problem, solution, targetMarket).catch(() => ({ competitors: [], trends: [], recentNews: [] })),
        await fetchMarketSize(industry, targetMarket, solution).catch(() => ({ size: "1000", growthRate: "10%" })),
        await fetchFundingData(industry, stage).catch(() => ({ averageFunding: "$1M", investors: ["Angel Investors"] }))
      )
      return Response.json(mockAnalysis)
    }
  }
}

/**
 * Generate mock analysis data when AI API is unavailable
 */
function generateMockAnalysis(
  startupName: string,
  description: string,
  problem: string,
  solution: string,
  targetMarket: string,
  industry: string,
  stage: string,
  comprehensiveData: any,
  marketData: any,
  marketSize: any,
  fundingData: any
) {
  const solutionLower = solution.toLowerCase()
  const problemLower = problem.toLowerCase()
  
  // Calculate scores based on solution characteristics
  let overallScore = 65
  let marketPotential = 70
  let feasibility = 75
  let competition = 50
  let riskLevel = 45
  let innovationIndex = 70
  
  // Adjust based on solution complexity
  if (solutionLower.includes("ai") || solutionLower.includes("machine learning") || solutionLower.includes("ml")) {
    feasibility = 55
    innovationIndex = 80
    riskLevel = 60
  } else if (solutionLower.includes("blockchain") || solutionLower.includes("crypto")) {
    feasibility = 45
    innovationIndex = 75
    riskLevel = 70
  } else if (solutionLower.includes("app") || solutionLower.includes("mobile")) {
    feasibility = 80
    innovationIndex = 65
  }
  
  // Adjust based on stage
  if (stage === "growing") {
    riskLevel = 25
    overallScore = 80
  } else if (stage === "launched") {
    riskLevel = 35
    overallScore = 75
  } else if (stage === "mvp") {
    riskLevel = 50
    overallScore = 68
  } else {
    riskLevel = 65
    overallScore = 60
  }
  
  // Adjust based on competition
  if (comprehensiveData.competitors && comprehensiveData.competitors.length > 0) {
    const avgSimilarity = comprehensiveData.competitors.reduce((sum: number, c: any) => sum + (c.similarity || 50), 0) / comprehensiveData.competitors.length
    competition = Math.min(95, 40 + (avgSimilarity * 0.5) + (comprehensiveData.competitors.length * 5))
    innovationIndex = Math.max(30, 100 - avgSimilarity)
  }
  
  // Adjust market potential based on TAM
  if (comprehensiveData.marketSize?.addressable) {
    const tam = parseFloat(comprehensiveData.marketSize.addressable)
    if (tam > 100) {
      marketPotential = 85
    } else if (tam > 50) {
      marketPotential = 75
    } else if (tam < 10) {
      marketPotential = 55
    }
  }
  
  // Generate SWOT
  const strengths = [
    `Targeting ${targetMarket} with ${solution.substring(0, 50)}`,
    `Market size of $${comprehensiveData.marketSize?.addressable || "100"}B addressable market`,
    stage !== "idea" ? `Already at ${stage} stage - proven concept` : "Early stage opportunity"
  ]
  
  const weaknesses = [
    comprehensiveData.competitors?.length > 0 ? `${comprehensiveData.competitors.length} competitors identified` : "Market validation needed",
    stage === "idea" ? "Early stage - no market validation yet" : "",
    comprehensiveData.technicalFeasibility?.complexity === "high" ? "High technical complexity" : ""
  ].filter(Boolean)
  
  const opportunities = [
    ...(comprehensiveData.industryInsights?.opportunities || []).slice(0, 2),
    `Market growing at ${comprehensiveData.marketSize?.growth || "10%"}`
  ]
  
  const threats = [
    comprehensiveData.competitors?.length > 0 ? "Strong competition in market" : "Unvalidated market demand",
    ...(comprehensiveData.industryInsights?.challenges || []).slice(0, 2)
  ]
  
  return {
    overallScore,
    marketPotential,
    feasibility,
    competition,
    riskLevel,
    innovationIndex,
    swot: {
      strengths: strengths.slice(0, 4),
      weaknesses: weaknesses.slice(0, 4),
      opportunities: opportunities.slice(0, 4),
      threats: threats.slice(0, 4),
    },
    targetAudience: [
      {
        name: targetMarket.split(" ")[0] || "Primary Users",
        age: "25-45",
        description: targetMarket || "Target market users"
      }
    ],
    monetizationStrategies: [
      { name: "Subscription", fit: 75 },
      { name: "Freemium", fit: 65 },
      { name: "Transaction Fees", fit: 55 }
    ],
    pitchTips: [
      `Clearly articulate how ${solution.substring(0, 40)} solves ${problem.substring(0, 30)}`,
      "Highlight your target market and addressable market size",
      "Demonstrate technical feasibility",
      "Address competitive landscape"
    ],
    roadmap: [
      { phase: "Phase 1", title: "Validate Market Need", duration: "3-6 months" },
      { phase: "Phase 2", title: "Build MVP", duration: "6-9 months" },
      { phase: "Phase 3", title: "Launch & Iterate", duration: "9-12 months" },
      { phase: "Phase 4", title: "Scale", duration: "12+ months" }
    ],
    realWorldData: {
      marketSize: comprehensiveData.marketSize?.total || marketSize?.size || "1000",
      addressableMarket: comprehensiveData.marketSize?.addressable || "100",
      marketGrowth: comprehensiveData.marketSize?.growth || marketSize?.growthRate || "10%",
      competitors: (comprehensiveData.competitors?.length > 0 
        ? comprehensiveData.competitors 
        : marketData.competitors?.length > 0 
        ? marketData.competitors.map((c: any) => ({ ...c, similarity: 50 }))
        : getFallbackCompetitors(solution, industry).map(c => ({ ...c, website: undefined, funding: undefined }))
      ).slice(0, 6),
      marketValidation: comprehensiveData.marketValidation || {
        searchTrends: "Moderate interest",
        discussionActivity: "Moderate discussion",
        existingProducts: []
      },
      industryInsights: comprehensiveData.industryInsights || {
        trends: marketData.trends || [],
        challenges: [],
        opportunities: []
      },
      fundingInfo: {
        averageFunding: fundingData.averageFunding || "$1M",
        typicalInvestors: fundingData.investors || ["Angel Investors"],
        recentRounds: comprehensiveData.fundingLandscape?.recentRounds || []
      },
      technicalFeasibility: comprehensiveData.technicalFeasibility || {
        complexity: "medium" as const,
        requiredResources: ["Development Team"],
        similarTechStack: ["React", "Node.js"]
      },
      industryTrends: marketData.trends || [],
      recentNews: marketData.recentNews || []
    }
  }
}
