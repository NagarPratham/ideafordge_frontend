"use client"

import { Lightbulb } from "lucide-react"

const defaultTips = [
  "Lead with the problem, not the solution",
  "Include specific market size data",
  "Highlight competitive advantages",
  "Show clear path to profitability",
]

interface PitchTipsProps {
  data?: string[]
}

export function PitchTips({ data }: PitchTipsProps) {
  const tips = data || defaultTips

  return (
    <div className="rounded-2xl border border-border bg-card p-6 h-full">
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-chart-4" />
        <h2 className="text-lg font-semibold">Pitch Tips</h2>
      </div>
      <ul className="space-y-3">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
              {index + 1}
            </span>
            <span className="text-muted-foreground">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
