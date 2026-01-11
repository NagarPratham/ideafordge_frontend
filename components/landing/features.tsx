"use client"

import { motion } from "framer-motion"

const features = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="20" width="8" height="16" rx="2" fill="#06b6d4" />
        <rect x="16" y="12" width="8" height="24" rx="2" fill="#06b6d4" opacity="0.7" />
        <rect x="28" y="8" width="8" height="28" rx="2" fill="#06b6d4" opacity="0.5" />
        <path d="M8 16L20 8L32 12" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Market Analysis",
    description:
      "Deep market research powered by AI. Get comprehensive insights into market size, trends, and opportunities.",
    stat: { label: "DATA POINTS", value: "500K+" },
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 8L6 32H34L20 8Z" stroke="#f59e0b" strokeWidth="2.5" fill="#f59e0b" fillOpacity="0.2" />
        <path d="M20 16V24" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20" cy="28" r="1.5" fill="#f59e0b" />
      </svg>
    ),
    title: "Risk Assessment",
    description:
      "Identify potential risks and challenges before they become problems. Proactive risk mitigation strategies.",
    stat: { label: "RISK FACTORS", value: "50+" },
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="4" width="14" height="14" rx="2" fill="#22c55e" opacity="0.8" />
        <rect x="22" y="4" width="14" height="14" rx="2" fill="#3b82f6" opacity="0.8" />
        <rect x="4" y="22" width="14" height="14" rx="2" fill="#f59e0b" opacity="0.8" />
        <rect x="22" y="22" width="14" height="14" rx="2" fill="#ef4444" opacity="0.8" />
      </svg>
    ),
    title: "SWOT Generation",
    description: "Automated Strengths, Weaknesses, Opportunities, and Threats analysis tailored to your unique idea.",
    stat: { label: "INSIGHTS", value: "24+" },
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" stroke="#8b5cf6" strokeWidth="2" opacity="0.3" />
        <circle cx="20" cy="20" r="10" stroke="#8b5cf6" strokeWidth="2" opacity="0.6" />
        <circle cx="20" cy="20" r="4" fill="#8b5cf6" />
      </svg>
    ),
    title: "AI Co-Founder",
    description:
      "24/7 AI Co-Founder that understands your vision. Get strategic guidance and answers to your toughest questions.",
    stat: { label: "AVAILABLE", value: "24/7" },
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#22c55e" strokeWidth="2.5" />
        <path d="M20 12V20L26 24" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <text x="16" y="32" fill="#22c55e" fontSize="10" fontWeight="bold">
          $
        </text>
      </svg>
    ),
    title: "Revenue Models",
    description: "AI-suggested monetization strategies based on your market and business type. Optimize for growth.",
    stat: { label: "STRATEGIES", value: "12+" },
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M8 20H32" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="20" r="3" fill="#22c55e" />
        <circle cx="20" cy="20" r="3" fill="#f59e0b" />
        <circle cx="28" cy="20" r="3" fill="#8b5cf6" />
        <path d="M12 14V12M20 14V10M28 14V12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Product Roadmap",
    description: "AI-generated development milestones and feature priorities. Save 40+ hours of planning time.",
    stat: { label: "TIME SAVED", value: "40hrs" },
  },
]

export function Features() {
  return (
    <section id="features" className="pt-8 sm:pt-12 pb-12 sm:pb-16 md:pb-24" style={{ background: "linear-gradient(to bottom, oklch(0.97 0 0) 0%, oklch(0.97 0 0) 85%, oklch(0.98 0 0) 90%, oklch(0.985 0 0) 95%, oklch(0.99 0.002 240) 100%)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Capabilities
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 sm:mb-6 text-foreground px-2"
          >
            Everything you need to
            <br />
            validate and launch
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
          >
            Comprehensive AI-powered tools that transform your raw ideas into validated, investor-ready business
            concepts.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
            >
              {/* Decorative corner */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon and Title */}
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="shrink-0">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">{feature.title}</h3>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm">{feature.description}</p>

              {/* Break line */}
              <div className="border-t border-border mb-4" />

              {/* Stat data */}
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{feature.stat.label}</span>
                <div className="mt-1 text-lg font-semibold text-foreground">{feature.stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
