"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Lightbulb, AlertTriangle } from "lucide-react"

interface SwotData {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

const defaultSwotData: SwotData = {
  strengths: ["Unique value proposition", "Strong technical foundation", "Clear target market"],
  weaknesses: ["Limited brand recognition", "Early stage development", "Resource constraints"],
  opportunities: ["Growing market demand", "Partnership potential", "Untapped segments"],
  threats: ["Competitive landscape", "Market volatility", "Regulatory changes"],
}

interface SwotAnalysisProps {
  data?: SwotData
}

export function SwotAnalysis({ data = defaultSwotData }: SwotAnalysisProps) {
  const swotData = data || defaultSwotData

  return (
    <div className="rounded-2xl border border-border bg-card p-6 h-full">
      <h2 className="mb-6 text-lg font-semibold">SWOT Analysis</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-chart-3/10 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-chart-3" />
            <span className="font-medium text-chart-3">Strengths</span>
          </div>
          <ul className="space-y-2 text-sm">
            {swotData.strengths.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-chart-5/10 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-chart-5" />
            <span className="font-medium text-chart-5">Weaknesses</span>
          </div>
          <ul className="space-y-2 text-sm">
            {swotData.weaknesses.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Opportunities */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-chart-4/10 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-chart-4" />
            <span className="font-medium text-chart-4">Opportunities</span>
          </div>
          <ul className="space-y-2 text-sm">
            {swotData.opportunities.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Threats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-accent/10 p-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-accent" />
            <span className="font-medium text-accent">Threats</span>
          </div>
          <ul className="space-y-2 text-sm">
            {swotData.threats.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
