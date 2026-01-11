"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const stats = [
  {
    value: "2,500+",
    numericValue: 2500,
    suffix: "+",
    label: "Ideas Validated",
    sublabel: "Founders trust us",
  },
  {
    value: "98%",
    numericValue: 98,
    suffix: "%",
    label: "Accuracy Rate",
    sublabel: "AI precision",
  },
  {
    value: "3 min",
    numericValue: 3,
    suffix: " min",
    label: "Analysis Time",
    sublabel: "Lightning fast",
  },
  {
    value: "4.9/5",
    numericValue: 4.9,
    suffix: "/5",
    label: "User Rating",
    sublabel: "Highly rated",
  },
]

function AnimatedNumber({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000
          const steps = 60
          const increment = value / steps
          const stepDuration = duration / steps
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setDisplayValue(value)
              clearInterval(timer)
            } else {
              setDisplayValue(current)
            }
          }, stepDuration)

          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [value])

  const formatValue = (val: number) => {
    if (decimals === 0) {
      return Math.floor(val).toLocaleString()
    }
    return val.toFixed(decimals)
  }

  return (
    <div ref={ref} className="text-4xl sm:text-5xl font-semibold tracking-tight mb-2 text-foreground">
      {formatValue(displayValue)}{suffix}
    </div>
  )
}

export function Stats() {
  return (
    <section id="stats" className="relative py-20 overflow-hidden" style={{ background: "linear-gradient(to bottom, oklch(0.08 0.02 260) 0%, oklch(0.12 0.02 260) 15%, oklch(0.2 0.02 260) 30%, oklch(0.4 0 0) 50%, oklch(0.6 0 0) 65%, oklch(0.75 0 0) 80%, oklch(0.88 0 0) 90%, oklch(0.95 0 0) 96%, oklch(0.98 0 0) 100%)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              {/* Decorative dot */}
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-secondary/50 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              </div>

              <AnimatedNumber value={stat.numericValue} suffix={stat.suffix} decimals={stat.numericValue === 4.9 ? 1 : 0} />
              <div className="text-sm font-medium mb-1 text-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
