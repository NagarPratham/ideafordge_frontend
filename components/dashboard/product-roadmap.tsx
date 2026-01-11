"use client"

import { motion } from "framer-motion"
import { Calendar, CheckCircle2, Circle } from "lucide-react"

interface Milestone {
  phase: string
  title: string
  duration: string
}

const defaultMilestones: Milestone[] = [
  { phase: "Phase 1", title: "MVP Development", duration: "Month 1-2" },
  { phase: "Phase 2", title: "Beta Launch", duration: "Month 3-4" },
  { phase: "Phase 3", title: "Market Expansion", duration: "Month 5-6" },
  { phase: "Phase 4", title: "Scale & Optimize", duration: "Month 7-12" },
]

interface ProductRoadmapProps {
  data?: Milestone[]
}

export function ProductRoadmap({ data }: ProductRoadmapProps) {
  const milestones = data || defaultMilestones

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Product Roadmap</h2>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative flex gap-4 pl-8"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1">
                {index === 0 ? (
                  <div className="relative">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div
                className={`flex-1 rounded-xl p-4 ${index === 0 ? "bg-primary/10 border border-primary/30" : "bg-secondary/50"}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-primary">{milestone.phase}</span>
                  <span className="text-xs text-muted-foreground">{milestone.duration}</span>
                </div>
                <h3 className="font-medium">{milestone.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
