"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M4 12H28" stroke="currentColor" strokeWidth="2" />
        <path d="M10 18H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 22H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="26" cy="8" r="4" fill="#22c55e" />
        <path d="M24 8H28M26 6V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Describe your vision",
    description: "Enter your startup idea in plain language. Our AI understands context, nuance, and ambition.",
  },
  {
    number: "02",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#8b5cf6" strokeWidth="2" opacity="0.3" />
        <circle cx="16" cy="16" r="8" stroke="#8b5cf6" strokeWidth="2" opacity="0.6" />
        <circle cx="16" cy="16" r="4" fill="#8b5cf6" />
      </svg>
    ),
    title: "AI deep analysis",
    description: "Our advanced AI analyzes market conditions, competitors, and opportunities in real-time.",
  },
  {
    number: "03",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#22c55e" strokeWidth="2" />
        <path d="M10 16L14 20L22 12" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Get your insights",
    description: "Receive a comprehensive validation report with scores, risks, and recommendations.",
  },
  {
    number: "04",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4L4 28H28L16 4Z" stroke="#f59e0b" strokeWidth="2" fill="#f59e0b" fillOpacity="0.2" />
        <path d="M16 12V18" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 24H20" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Launch confidently",
    description: "Use your validation data to pitch investors, build your MVP, and grow with confidence.",
  },
]

export function Process() {
  return (
    <section id="process" className="pt-8 pb-16" style={{ background: "linear-gradient(to bottom, oklch(0.99 0.002 240) 0%, oklch(0.99 0.002 240) 100%)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            Process
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6 text-foreground"
          >
            From idea to validation
            <br />
            in four steps
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A streamlined process designed for founders who move fast and think big.
          </motion.p>
        </div>

        {/* Horizontal Card Flow */}
        <div className="relative">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 relative group"
              >
                {/* Step Card */}
                <div className="bg-white rounded-xl border border-border p-5 hover:border-foreground/30 hover:shadow-md transition-all duration-300 h-full">
                  {/* Number Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-8 h-8 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-bold">
                      {step.number}
                    </div>
                    <div className="text-foreground opacity-60">{step.icon}</div>
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-semibold mb-2 text-foreground leading-tight">{step.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{step.description}</p>
                </div>

                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-1.5 translate-y-[-50%] z-10">
                    <div className="w-3 h-3 rounded-full bg-border flex items-center justify-center">
                      <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/40" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
