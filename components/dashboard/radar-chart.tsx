"use client"

import { motion } from "framer-motion"
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"

interface AnalysisData {
  marketPotential: number
  feasibility: number
  innovationIndex: number
  [key: string]: number
}

interface RadarChartProps {
  data?: AnalysisData
}

export function RadarChart({ data }: RadarChartProps) {
  const chartData = [
    { metric: "Market", value: data?.marketPotential || 88 },
    { metric: "Tech", value: data?.feasibility || 75 },
    { metric: "Team", value: 70 },
    { metric: "Finance", value: 65 },
    { metric: "Innovation", value: data?.innovationIndex || 79 },
    { metric: "Timing", value: 82 },
  ]

  return (
    <div className="rounded-2xl border border-border bg-card p-6 h-full">
      <h2 className="mb-4 text-lg font-semibold">Performance Overview</h2>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="value"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RechartsRadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
