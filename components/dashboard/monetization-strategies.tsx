"use client"

import { DollarSign, Check } from "lucide-react"

interface Strategy {
  name: string
  fit: number
}

const defaultStrategies: Strategy[] = [
  { name: "Subscription Model", fit: 92 },
  { name: "Freemium", fit: 78 },
  { name: "Enterprise Licensing", fit: 65 },
]

interface MonetizationStrategiesProps {
  data?: Strategy[]
}

export function MonetizationStrategies({ data }: MonetizationStrategiesProps) {
  const strategies = data || defaultStrategies

  return (
    <div className="rounded-2xl border border-border bg-card p-6 h-full">
      <div className="mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-chart-4" />
        <h2 className="text-lg font-semibold">Monetization</h2>
      </div>
      <div className="space-y-3">
        {strategies.map((strategy, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-chart-3" />
              <span className="text-sm">{strategy.name}</span>
            </div>
            <span className="text-sm font-medium text-primary">{strategy.fit}% fit</span>
          </div>
        ))}
      </div>
    </div>
  )
}
