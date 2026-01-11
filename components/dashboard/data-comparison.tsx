"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "./metric-card"
import { TrendingUp, Users, Code, Activity, CheckCircle2, AlertCircle, Target } from "lucide-react"
import { calculateComparisonScores } from "@/lib/comparison-utils"

interface DataComparisonProps {
  formData: {
    startupName: string
    description: string
    problem: string
    solution: string
    targetMarket: string
    industry: string
    stage: string
  } | null
  realWorldData?: {
    marketSize?: string
    addressableMarket?: string
    marketGrowth?: string
    competitors?: Array<{
      name: string
      description: string
      similarity?: number
      funding?: string
      website?: string
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
  }
  analysisData: {
    overallScore?: number
    marketPotential?: number
    feasibility?: number
    competition?: number
    innovationIndex?: number
  }
}

export function DataComparison({ formData, realWorldData, analysisData }: DataComparisonProps) {
  if (!formData || !realWorldData) {
    return null
  }

  const comparison = calculateComparisonScores(formData, realWorldData, analysisData)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 65) return "text-blue-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 65) return "Good"
    if (score >= 50) return "Fair"
    return "Needs Work"
  }

  return (
    <div className="space-y-6">
      {/* Overall Comparison Score */}
      <div className="flex items-center justify-between p-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <div>
          <div className="text-sm text-muted-foreground mb-2">Overall Comparison Score</div>
          <div className={`text-5xl font-bold ${getScoreColor(comparison.overallComparisonScore)} mb-1`}>
            {comparison.overallComparisonScore}
          </div>
          <div className={`text-base font-semibold ${getScoreColor(comparison.overallComparisonScore)}`}>
            {getScoreLabel(comparison.overallComparisonScore)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-muted-foreground mb-2">Weighted Breakdown:</div>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <div>• Market Alignment (30%)</div>
            <div>• Competition Fit (25%)</div>
            <div>• Technical Feasibility (25%)</div>
            <div>• Market Validation (20%)</div>
          </div>
        </div>
      </div>

      {/* Comparison Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricCard
            title="Market Alignment"
            value={comparison.marketAlignmentScore}
            icon={TrendingUp}
            color="chart-1"
            delay={0}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricCard
            title="Competition Fit"
            value={comparison.competitionFitScore}
            icon={Users}
            color="chart-2"
            delay={0}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricCard
            title="Technical Feasibility"
            value={comparison.technicalFeasibilityScore}
            icon={Code}
            color="chart-3"
            delay={0}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MetricCard
            title="Market Validation"
            value={comparison.marketValidationScore}
            icon={Activity}
            color="chart-4"
            delay={0}
          />
        </motion.div>
      </div>

      {/* Insights */}
      {comparison.insights && comparison.insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Key Insights
              </CardTitle>
              <CardDescription>
                Analysis based on comparing your data with real-world market information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {comparison.insights.map((insight, idx) => {
                  const isPositive = 
                    insight.toLowerCase().includes("excellent") ||
                    insight.toLowerCase().includes("good") ||
                    insight.toLowerCase().includes("high") ||
                    insight.toLowerCase().includes("strong") ||
                    insight.toLowerCase().includes("opportunity") ||
                    insight.toLowerCase().includes("low competition") ||
                    insight.toLowerCase().includes("rapidly")
                  
                  const isWarning =
                    insight.toLowerCase().includes("needs work") ||
                    insight.toLowerCase().includes("lower") ||
                    insight.toLowerCase().includes("slow") ||
                    insight.toLowerCase().includes("validate") ||
                    insight.toLowerCase().includes("unvalidated") ||
                    insight.toLowerCase().includes("saturated")
                  
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        isPositive
                          ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/20"
                          : isWarning
                          ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/20"
                          : "bg-card border-border"
                      }`}
                    >
                      {isPositive ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                      ) : isWarning ? (
                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                      )}
                      <p className={`text-sm ${
                        isPositive
                          ? "text-green-900 dark:text-green-200"
                          : isWarning
                          ? "text-yellow-900 dark:text-yellow-200"
                          : "text-muted-foreground"
                      }`}>
                        {insight}
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Detailed Comparison Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Detailed Comparison Breakdown</CardTitle>
            <CardDescription>
              See how each metric compares between your data and real-world benchmarks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Market Alignment Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Market Alignment</span>
                  <span className={`font-bold ${getScoreColor(comparison.marketAlignmentScore)}`}>
                    {comparison.marketAlignmentScore}/100
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${comparison.marketAlignmentScore}%` }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className={`h-full ${
                      comparison.marketAlignmentScore >= 80
                        ? "bg-green-600"
                        : comparison.marketAlignmentScore >= 65
                        ? "bg-blue-600"
                        : comparison.marketAlignmentScore >= 50
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  />
                </div>
                {realWorldData.addressableMarket && (
                  <div className="text-xs text-muted-foreground">
                    Addressable Market: ${realWorldData.addressableMarket}B | 
                    Growth: {realWorldData.marketGrowth || "N/A"}
                  </div>
                )}
              </div>

              {/* Competition Fit Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Competition Fit</span>
                  <span className={`font-bold ${getScoreColor(comparison.competitionFitScore)}`}>
                    {comparison.competitionFitScore}/100
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${comparison.competitionFitScore}%` }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className={`h-full ${
                      comparison.competitionFitScore >= 80
                        ? "bg-green-600"
                        : comparison.competitionFitScore >= 65
                        ? "bg-blue-600"
                        : comparison.competitionFitScore >= 50
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  />
                </div>
                {realWorldData.competitors && (
                  <div className="text-xs text-muted-foreground">
                    Competitors Found: {realWorldData.competitors.length} | 
                    Avg Similarity: {realWorldData.competitors.length > 0 
                      ? Math.round(realWorldData.competitors.reduce((sum, c) => sum + (c.similarity || 0), 0) / realWorldData.competitors.length)
                      : 0}%
                  </div>
                )}
              </div>

              {/* Technical Feasibility Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Technical Feasibility</span>
                  <span className={`font-bold ${getScoreColor(comparison.technicalFeasibilityScore)}`}>
                    {comparison.technicalFeasibilityScore}/100
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${comparison.technicalFeasibilityScore}%` }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                    className={`h-full ${
                      comparison.technicalFeasibilityScore >= 80
                        ? "bg-green-600"
                        : comparison.technicalFeasibilityScore >= 65
                        ? "bg-blue-600"
                        : comparison.technicalFeasibilityScore >= 50
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  />
                </div>
                {realWorldData.technicalFeasibility && (
                  <div className="text-xs text-muted-foreground">
                    Complexity: {realWorldData.technicalFeasibility.complexity.toUpperCase()} | 
                    Stage: {formData.stage.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Market Validation Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Market Validation</span>
                  <span className={`font-bold ${getScoreColor(comparison.marketValidationScore)}`}>
                    {comparison.marketValidationScore}/100
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${comparison.marketValidationScore}%` }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    className={`h-full ${
                      comparison.marketValidationScore >= 80
                        ? "bg-green-600"
                        : comparison.marketValidationScore >= 65
                        ? "bg-blue-600"
                        : comparison.marketValidationScore >= 50
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  />
                </div>
                {realWorldData.marketValidation && (
                  <div className="text-xs text-muted-foreground">
                    Search Trends: {realWorldData.marketValidation.searchTrends || "N/A"} | 
                    Products Found: {realWorldData.marketValidation.existingProducts?.length || 0}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
