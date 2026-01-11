"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: string
  delay: number
  inverted?: boolean
}

export function MetricCard({ title, value, icon: Icon, color, delay, inverted = false }: MetricCardProps) {
  const displayValue = inverted ? 100 - value : value

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className={`rounded-lg bg-${color}/10 p-2`}>
          <Icon className={`h-4 w-4 text-${color}`} />
        </div>
      </div>
      <div className="mb-2 text-2xl font-bold">{value}%</div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayValue}%` }}
          transition={{ delay: delay + 0.3, duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r from-${color} to-${color}/60`}
          style={{
            background: `linear-gradient(to right, var(--${color}), var(--${color}) 60%)`,
          }}
        />
      </div>
    </motion.div>
  )
}
