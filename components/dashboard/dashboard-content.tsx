"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScoreGauge } from "./score-gauge"
import { MetricCard } from "./metric-card"
import { SwotAnalysis } from "./swot-analysis"
import { RadarChart } from "./radar-chart"
import { MonetizationStrategies } from "./monetization-strategies"
import { TargetAudience } from "./target-audience"
import { ProductRoadmap } from "./product-roadmap"
import { PitchTips } from "./pitch-tips"
import { RealWorldData } from "./real-world-data"
import { DataComparison } from "./data-comparison"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateComparisonScores } from "@/lib/comparison-utils"
import {
  Download,
  MessageSquare,
  TrendingUp,
  Shield,
  Target,
  AlertTriangle,
  Building2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Eye,
  Users,
  DollarSign,
  BarChart3,
  Sparkles,
  Zap,
  Award,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { generatePDFReport } from "@/lib/pdf-export"

interface FormData {
  startupName: string
  description: string
  problem: string
  solution: string
  targetMarket: string
  industry: string
  stage: string
}

interface AnalysisData {
  overallScore: number
  marketPotential: number
  feasibility: number
  competition: number
  riskLevel: number
  innovationIndex: number
  swot?: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  targetAudience?: Array<{ name: string; age: string; description: string }>
  monetizationStrategies?: Array<{ name: string; fit: number }>
  pitchTips?: string[]
  roadmap?: Array<{ phase: string; title: string; duration: string }>
  realWorldData?: {
    marketSize: string
    addressableMarket?: string
    marketGrowth: string
    competitors?: Array<{ name: string; description: string; similarity?: number; website?: string; funding?: string }>
    marketValidation?: {
      searchTrends?: string
      discussionActivity?: string
      existingProducts?: Array<{ name: string; platform: string; url?: string }>
    }
    industryInsights?: {
      trends: string[]
      challenges: string[]
      opportunities: string[]
    }
    fundingInfo?: {
      averageFunding: string
      typicalInvestors: string[]
      recentRounds?: Array<{ company: string; amount: string; date: string }>
    }
    technicalFeasibility?: {
      complexity: "low" | "medium" | "high"
      requiredResources: string[]
      similarTechStack: string[]
    }
    industryTrends?: string[]
    recentNews?: Array<{ title: string; source: string; date: string }>
  }
  [key: string]: any
}

const defaultAnalysis: AnalysisData = {
  overallScore: 82,
  marketPotential: 88,
  feasibility: 75,
  competition: 65,
  riskLevel: 42,
  innovationIndex: 79,
}

export function DashboardContent() {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisData>(defaultAnalysis)
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Listen for tab changes from navbar
  useEffect(() => {
    const handleTabChange = (event: CustomEvent<{ tab: string }>) => {
      setActiveTab(event.detail.tab)
    }

    window.addEventListener("dashboard-tab-change", handleTabChange as EventListener)

    return () => {
      window.removeEventListener("dashboard-tab-change", handleTabChange as EventListener)
    }
  }, [])

  // Notify navbar when tab changes (from internal state)
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('dashboard-internal-tab-change', { detail: { tab: activeTab } }))
  }, [activeTab])

  useEffect(() => {
    const latestData = localStorage.getItem("ideaForgeLatestData")

    if (latestData) {
      try {
        const dataEntry = JSON.parse(latestData)
        if (dataEntry.formData) {
          setFormData(dataEntry.formData)
        }
        if (dataEntry.analysisResult) {
          setAnalysisData(dataEntry.analysisResult)
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error)
      }
    }

    if (!latestData) {
    const storedFormData = sessionStorage.getItem("ideaForgeData")
    const storedAnalysis = sessionStorage.getItem("ideaForgeAnalysis")

    if (storedFormData) {
      setFormData(JSON.parse(storedFormData))
    }

    if (storedAnalysis) {
      setAnalysisData(JSON.parse(storedAnalysis))
      }
    }
  }, [])

  const startupName = formData?.startupName || "Your Startup"

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const isExpanded = (section: string) => expandedSections.has(section)

  // Calculate comparison scores if we have the data
  const comparisonScores = formData && analysisData.realWorldData
    ? calculateComparisonScores(formData, analysisData.realWorldData, analysisData)
    : null

  // Handle PDF Export
  const handleExportReport = async () => {
    if (!formData) {
      alert("No startup data available to export. Please validate your startup idea first.")
      return
    }

    try {
      await generatePDFReport({
        formData,
        analysisData,
        comparisonScores,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF report. Please try again.")
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent break-words">
            {startupName}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">AI-powered startup validation & market analysis</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="min-w-[100px] sm:min-w-[140px] hover:bg-primary hover:text-primary-foreground transition-colors text-xs sm:text-sm h-9 sm:h-10 px-2 sm:px-4" asChild>
            <Link href="/chat" className="flex items-center justify-center gap-1.5 sm:gap-2">
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">AI Co-Founder</span>
              <span className="sm:hidden">AI Chat</span>
            </Link>
          </Button>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 min-w-[100px] sm:min-w-[140px] flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm h-9 sm:h-10 px-2 sm:px-4" 
            onClick={handleExportReport}
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Export Report</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </motion.div>

      {/* Content Based on Active Tab - Controlled by Navbar */}
      {activeTab === "overview" && (
        <div className="space-y-4 sm:space-y-6">
          {/* Two Distinct Score Cards - Side by Side - Only in Overview */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Startup Health Score - Left Side - Distinct Design */}
        <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-primary/10 h-full shadow-lg">
                <CardHeader className="pb-4 bg-primary/10 rounded-t-xl border-b border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/30 p-2.5 ring-2 ring-primary/20">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-primary">Startup Health Score</CardTitle>
                        <CardDescription className="font-medium">Your idea's overall viability & potential</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
            <ScoreGauge score={analysisData.overallScore} />
          </div>
                    <div className="flex-1 w-full space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                          <div className="text-xs font-medium text-primary/70 mb-1">Market Potential</div>
                          <div className="text-xl font-bold text-chart-1">{analysisData.marketPotential}</div>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                          <div className="text-xs font-medium text-primary/70 mb-1">Feasibility</div>
                          <div className="text-xl font-bold text-chart-3">{analysisData.feasibility}</div>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                          <div className="text-xs font-medium text-primary/70 mb-1">Innovation</div>
                          <div className="text-xl font-bold text-accent">{analysisData.innovationIndex}</div>
                        </div>
                        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                          <div className="text-xs font-medium text-primary/70 mb-1">Risk Level</div>
                          <div className="text-xl font-bold text-chart-5">{analysisData.riskLevel}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
        </motion.div>

            {/* Market Alignment Score - Right Side - Distinct Design */}
            {comparisonScores && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 via-card to-accent/10 h-full shadow-lg">
                  <CardHeader className="pb-4 bg-accent/10 rounded-t-xl border-b border-accent/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-accent/30 p-2.5 ring-2 ring-accent/20">
                          <BarChart3 className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-accent">Market Alignment Score</CardTitle>
                          <CardDescription className="font-medium">Comparison with real-world market data</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-shrink-0 relative">
                        <div className="relative w-48 h-48">
                          <svg width="192" height="192" viewBox="0 0 192 192" className="transform -rotate-90">
                            <circle
                              cx="96"
                              cy="96"
                              r="80"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="10"
                              className="text-secondary/30"
                            />
                            <motion.circle
                              cx="96"
                              cy="96"
                              r="80"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="10"
                              strokeLinecap="round"
                              strokeDasharray={502.65}
                              initial={{ strokeDashoffset: 502.65 }}
                              animate={{ strokeDashoffset: 502.65 - (comparisonScores.overallComparisonScore / 100) * 502.65 }}
                              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                              className="text-accent"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 }}
                              className={`text-4xl font-bold ${
                                comparisonScores.overallComparisonScore >= 80 ? "text-green-600" :
                                comparisonScores.overallComparisonScore >= 65 ? "text-blue-600" :
                                comparisonScores.overallComparisonScore >= 50 ? "text-yellow-600" :
                                "text-red-600"
                              }`}
                            >
                              {comparisonScores.overallComparisonScore}
                            </motion.span>
                            <span className="text-xs text-muted-foreground">out of 100</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
                            <div className="text-xs font-medium text-accent/70 mb-1">Market Fit</div>
                            <div className="text-xl font-bold text-chart-1">{comparisonScores.marketAlignmentScore}</div>
                          </div>
                          <div className="p-3 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
                            <div className="text-xs font-medium text-accent/70 mb-1">Competition</div>
                            <div className="text-xl font-bold text-chart-2">{comparisonScores.competitionFitScore}</div>
                          </div>
                          <div className="p-3 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
                            <div className="text-xs font-medium text-accent/70 mb-1">Feasibility</div>
                            <div className="text-xl font-bold text-chart-3">{comparisonScores.technicalFeasibilityScore}</div>
                          </div>
                          <div className="p-3 rounded-lg border border-accent/20 bg-accent/5 hover:bg-accent/10 transition-colors">
                            <div className="text-xs font-medium text-accent/70 mb-1">Validation</div>
                            <div className="text-xl font-bold text-chart-4">{comparisonScores.marketValidationScore}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
          {/* Complete Startup Idea - Detailed View */}
          {formData && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Your Startup Idea - Complete Details
                </CardTitle>
                <CardDescription>Full information about your startup concept</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Problem</div>
                        <div className="text-sm leading-relaxed p-3 rounded-lg border border-border bg-card">{formData.problem || "Not provided"}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Solution</div>
                        <div className="text-sm leading-relaxed p-3 rounded-lg border border-border bg-card">{formData.solution || "Not provided"}</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Target Market</div>
                        <div className="text-sm leading-relaxed p-3 rounded-lg border border-border bg-card">{formData.targetMarket || "Not specified"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Industry</div>
                          <div className="text-sm font-medium p-3 rounded-lg border border-border bg-card">{formData.industry || "Not specified"}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Stage</div>
                          <div className="text-sm font-medium capitalize p-3 rounded-lg border border-border bg-card">{formData.stage || "Not specified"}</div>
                        </div>
                      </div>
                      {formData.description && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">Description</div>
                          <div className="text-sm leading-relaxed p-3 rounded-lg border border-border bg-card">{formData.description}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Market Potential"
            value={analysisData.marketPotential}
            icon={TrendingUp}
            color="chart-1"
              delay={0}
            />
            <MetricCard
              title="Feasibility"
              value={analysisData.feasibility}
              icon={Shield}
              color="chart-3"
              delay={0.1}
            />
          <MetricCard
              title="Innovation"
            value={analysisData.innovationIndex}
            icon={Target}
            color="accent"
              delay={0.2}
          />
          <MetricCard
            title="Risk Level"
            value={analysisData.riskLevel}
            icon={AlertTriangle}
            color="chart-5"
              delay={0.3}
            inverted
          />
          </div>

          {/* Full Comparison - Always Visible in Overview */}
          {comparisonScores && formData && analysisData.realWorldData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-primary" />
                  Market Comparison Analysis
                </CardTitle>
                <CardDescription>Complete comparison with real-world market data</CardDescription>
              </CardHeader>
              <CardContent>
                <DataComparison
                  formData={formData}
                  realWorldData={analysisData.realWorldData}
                  analysisData={analysisData}
                />
              </CardContent>
            </Card>
          )}

          {/* Radar Chart - Only in Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Performance Radar Chart
              </CardTitle>
              <CardDescription>Multi-dimensional analysis view of your startup</CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChart data={analysisData} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Market Tab - Only Market Data, No Graphs */}
      {activeTab === "market" && (
        <div className="space-y-6">

          {analysisData.realWorldData ? (
            <>
              {/* Market Overview Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-l-4 border-l-chart-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Market Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-chart-1 mb-1">
                      ${analysisData.realWorldData.marketSize || "N/A"}B
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Growth: {analysisData.realWorldData.marketGrowth || "N/A"}
                    </div>
                  </CardContent>
                </Card>

                {analysisData.realWorldData.addressableMarket && (
                  <Card className="border-l-4 border-l-accent">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Addressable Market</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-accent mb-1">
                        ${analysisData.realWorldData.addressableMarket}B
                      </div>
                      <div className="text-xs text-muted-foreground">Your TAM</div>
                    </CardContent>
                  </Card>
                )}

                {analysisData.realWorldData.competitors && (
                  <Card className="border-l-4 border-l-chart-5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Competitors Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-chart-5 mb-1">
                        {analysisData.realWorldData.competitors.length}
                      </div>
                      <div className="text-xs text-muted-foreground">In market</div>
                    </CardContent>
                  </Card>
                )}
      </div>

              {/* Competitors Section */}
              {analysisData.realWorldData.competitors && analysisData.realWorldData.competitors.length > 0 && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Users className="h-5 w-5 text-primary" />
                          Market Competitors ({analysisData.realWorldData.competitors.length})
                        </CardTitle>
                        <CardDescription>Companies offering similar solutions</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection("competitors")}
                        className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {isExpanded("competitors") ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Hide All
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            View All
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysisData.realWorldData.competitors.slice(0, isExpanded("competitors") ? undefined : 3).map((competitor, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm mb-1">{competitor.name}</div>
                            <div className="text-xs text-muted-foreground line-clamp-2">{competitor.description}</div>
                            {competitor.similarity !== undefined && (
                              <div className="mt-2 text-xs">
                                <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                  {competitor.similarity}% similar
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Industry Trends and Insights - Always Visible */}
              {analysisData.realWorldData?.industryInsights && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Industry Trends & Insights
                        </CardTitle>
                        <CardDescription>Key trends, challenges, and opportunities in your industry</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection("industryInsights")}
                        className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {isExpanded("industryInsights") ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Show All
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Current Trends - Always Show All When Expanded */}
                      {analysisData.realWorldData.industryInsights.trends && analysisData.realWorldData.industryInsights.trends.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 font-medium mb-3 text-sm">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Current Trends ({analysisData.realWorldData.industryInsights.trends.length})
                          </div>
                          <div className="space-y-3">
                            {(isExpanded("industryInsights") ? analysisData.realWorldData.industryInsights.trends : analysisData.realWorldData.industryInsights.trends.slice(0, 2)).map((trend, idx) => (
                              <div key={idx} className="flex gap-3">
                                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-normal break-words">{trend}</p>
                              </div>
                            ))}
                            {!isExpanded("industryInsights") && analysisData.realWorldData.industryInsights.trends.length > 2 && (
                              <div className="text-xs text-muted-foreground pt-2 italic">
                                Click "Show All" to view {analysisData.realWorldData.industryInsights.trends.length - 2} more trends
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <AnimatePresence>
                        {isExpanded("industryInsights") && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-4"
                          >
                            {/* Opportunities */}
                            {analysisData.realWorldData.industryInsights.opportunities && analysisData.realWorldData.industryInsights.opportunities.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 font-medium mb-3 text-sm">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  Opportunities
                                </div>
                                <div className="space-y-2">
                                  {analysisData.realWorldData.industryInsights.opportunities.map((opp, idx) => (
                                    <div key={idx} className="flex gap-3 text-sm">
                                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                                      <p className="text-muted-foreground">{opp}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Challenges */}
                            {analysisData.realWorldData.industryInsights.challenges && analysisData.realWorldData.industryInsights.challenges.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 font-medium mb-3 text-sm">
                                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                                  Challenges
                                </div>
                                <div className="space-y-2">
                                  {analysisData.realWorldData.industryInsights.challenges.map((challenge, idx) => (
                                    <div key={idx} className="flex gap-3 text-sm">
                                      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-yellow-600" />
                                      <p className="text-muted-foreground">{challenge}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Complete Market Data */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                        Complete Market Data
                      </CardTitle>
                      <CardDescription>Detailed market validation, technical analysis, and funding landscape</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("fullMarketData")}
                      className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {isExpanded("fullMarketData") ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          View Details
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <AnimatePresence>
                  {isExpanded("fullMarketData") && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="pt-0">
                        <RealWorldData data={analysisData.realWorldData} />
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No market data available</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          {/* SWOT Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                SWOT Analysis
              </CardTitle>
              <CardDescription>Strengths, Weaknesses, Opportunities, Threats</CardDescription>
            </CardHeader>
            <CardContent>
              {analysisData.swot ? (
          <SwotAnalysis data={analysisData.swot} />
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">No SWOT data available</div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Comparison */}
          {formData && analysisData.realWorldData && comparisonScores && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Detailed Comparison Analysis
                    </CardTitle>
                    <CardDescription>Comprehensive comparison with real-world market data</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection("detailedComparison")}
                    className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {isExpanded("detailedComparison") ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        View Details
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <AnimatePresence>
                {isExpanded("detailedComparison") && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <CardContent className="pt-0">
                      <DataComparison
                        formData={formData}
                        realWorldData={analysisData.realWorldData}
                        analysisData={analysisData}
                      />
                    </CardContent>
        </motion.div>
                )}
              </AnimatePresence>
              {!isExpanded("detailedComparison") && (
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Click "View Details" to see comprehensive comparison metrics, insights, and recommendations.
                  </div>
                </CardContent>
              )}
            </Card>
          )}
      </div>
      )}

      {/* Strategy Tab */}
      {activeTab === "strategy" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Target Audience */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-primary" />
                  Target Audience
                </CardTitle>
              </CardHeader>
              <CardContent>
          <TargetAudience data={analysisData.targetAudience} />
              </CardContent>
            </Card>

            {/* Monetization */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Monetization
                </CardTitle>
              </CardHeader>
              <CardContent>
          <MonetizationStrategies data={analysisData.monetizationStrategies} />
              </CardContent>
            </Card>

            {/* Pitch Tips */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Pitch Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
          <PitchTips data={analysisData.pitchTips} />
              </CardContent>
            </Card>
      </div>

          {/* Roadmap */}
          {analysisData.roadmap && analysisData.roadmap.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Product Roadmap
                </CardTitle>
                <CardDescription>Recommended development phases and timeline</CardDescription>
              </CardHeader>
              <CardContent>
        <ProductRoadmap data={analysisData.roadmap} />
              </CardContent>
            </Card>
          )}
          </div>
      )}
    </div>
  )
}
