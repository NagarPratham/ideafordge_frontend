"use client"

import { motion } from "framer-motion"
import { TrendingUp, Users, DollarSign, Newspaper, ExternalLink, Target, AlertCircle, CheckCircle2, Code, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RealWorldDataProps {
  data?: {
    marketSize: string
    addressableMarket?: string
    marketGrowth: string
    competitors?: Array<{ 
      name: string
      description: string
      similarity?: number
      website?: string
      funding?: string
    }>
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
}

export function RealWorldData({ data }: RealWorldDataProps) {
  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Market Size and Growth */}
      <div className="grid gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Total Market
              </CardTitle>
              <CardDescription>Industry market size</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  ${data.marketSize} <span className="text-lg text-muted-foreground">B</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Growth:</span>
                  <span className="font-semibold text-green-600">{data.marketGrowth}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {data.addressableMarket && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Addressable Market
                </CardTitle>
                <CardDescription>Your solution's TAM</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    ${data.addressableMarket} <span className="text-lg text-muted-foreground">B</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {((parseFloat(data.addressableMarket) / parseFloat(data.marketSize)) * 100).toFixed(1)}% of total market
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {data.fundingInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Funding Landscape
                </CardTitle>
                <CardDescription>Typical funding for your stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-primary">{data.fundingInfo.averageFunding}</div>
                  <div className="flex flex-wrap gap-2">
                    {data.fundingInfo.typicalInvestors.map((investor, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                      >
                        {investor}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Competitors */}
      {data.competitors && data.competitors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Market Competitors
              </CardTitle>
              <CardDescription>Real competitors in your industry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.competitors.slice(0, 6).map((competitor, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-semibold truncate">{competitor.name}</div>
                        {competitor.similarity !== undefined && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground whitespace-nowrap">
                            {competitor.similarity}% similar
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">{competitor.description}</div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {competitor.funding && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {competitor.funding}
                          </span>
                        )}
                        {competitor.website && (
                          <a
                            href={competitor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Market Validation */}
      {data.marketValidation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Market Validation Signals
              </CardTitle>
              <CardDescription>Real market interest and validation data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.marketValidation.searchTrends && (
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Search Interest</div>
                      <div className="text-sm text-muted-foreground">{data.marketValidation.searchTrends}</div>
                    </div>
                  </div>
                )}
                {data.marketValidation.discussionActivity && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium mb-1">Discussion Activity</div>
                      <div className="text-sm text-muted-foreground">{data.marketValidation.discussionActivity}</div>
                    </div>
                  </div>
                )}
                {data.marketValidation.existingProducts && data.marketValidation.existingProducts.length > 0 && (
                  <div>
                    <div className="font-medium mb-2">Existing Similar Products ({data.marketValidation.existingProducts.length})</div>
                    <div className="space-y-2">
                      {data.marketValidation.existingProducts.map((product, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="font-medium">{product.name}</span>
                          <span className="text-muted-foreground">on {product.platform}</span>
                          {product.url && (
                            <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-auto">
                              <ExternalLink className="h-3 w-3 inline" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Technical Feasibility */}
      {data.technicalFeasibility && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Technical Feasibility
              </CardTitle>
              <CardDescription>Build complexity and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="font-medium mb-2">Complexity Level</div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    data.technicalFeasibility.complexity === "high" 
                      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      : data.technicalFeasibility.complexity === "medium"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  }`}>
                    {data.technicalFeasibility.complexity.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Required Resources</div>
                  <div className="flex flex-wrap gap-2">
                    {data.technicalFeasibility.requiredResources.map((resource, idx) => (
                      <span key={idx} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-medium mb-2">Similar Tech Stack</div>
                  <div className="flex flex-wrap gap-2">
                    {data.technicalFeasibility.similarTechStack.map((tech, idx) => (
                      <span key={idx} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Industry Insights */}
      {data.industryInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Industry Insights</CardTitle>
              <CardDescription>Trends, challenges, and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.industryInsights.opportunities && data.industryInsights.opportunities.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Opportunities
                    </div>
                    <div className="space-y-2">
                      {data.industryInsights.opportunities.map((opp, idx) => (
                        <div key={idx} className="flex gap-3 text-sm">
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                          <p className="text-muted-foreground">{opp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.industryInsights.trends && data.industryInsights.trends.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Current Trends
                    </div>
                    <div className="space-y-2">
                      {data.industryInsights.trends.map((trend, idx) => (
                        <div key={idx} className="flex gap-3 text-sm">
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                          <p className="text-muted-foreground">{trend}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {data.industryInsights.challenges && data.industryInsights.challenges.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      Challenges
                    </div>
                    <div className="space-y-2">
                      {data.industryInsights.challenges.map((challenge, idx) => (
                        <div key={idx} className="flex gap-3 text-sm">
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-yellow-600" />
                          <p className="text-muted-foreground">{challenge}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent Funding Rounds */}
      {data.fundingInfo?.recentRounds && data.fundingInfo.recentRounds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Recent Funding Activity
              </CardTitle>
              <CardDescription>Recent funding rounds in your industry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.fundingInfo.recentRounds.map((round, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                    <div>
                      <div className="font-medium">{round.company}</div>
                      <div className="text-sm text-muted-foreground">{round.date}</div>
                    </div>
                    <div className="text-lg font-bold text-primary">{round.amount}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Industry Trends (Legacy) */}
      {data.industryTrends && data.industryTrends.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Industry Trends & Insights</CardTitle>
              <CardDescription>Current market trends based on real data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.industryTrends.map((trend, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <p className="text-sm text-muted-foreground">{trend}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recent News */}
      {data.recentNews && data.recentNews.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                Recent Industry News
              </CardTitle>
              <CardDescription>Latest news affecting your industry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentNews.map((news, idx) => (
                  <div key={idx} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{news.title}</h4>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{news.source}</span>
                          <span>•</span>
                          <span>{new Date(news.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
