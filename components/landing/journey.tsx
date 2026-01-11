"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const journeySteps = [
  {
    number: "01",
    phase: "THE STRUGGLE",
    badge: "Before IdeaForge",
    badgeColor: "bg-orange-500",
    title: "Every founder knows this moment",
    description:
      "Late nights. Endless doubts. The fear of building something nobody wants. You've been there—staring at a blank screen, wondering if your idea has any real potential.",
    image: "/1.jpg",
  },
  {
    number: "02",
    phase: "THE DISCOVERY",
    badge: "With IdeaForge",
    badgeColor: "bg-emerald-500",
    title: "Meet your AI co-founder",
    description:
      "IdeaForge AI transforms uncertainty into clarity. Get instant market validation, competitor analysis, and a roadmap that turns your vision into a viable business.",
    image: "/2.avif",
  },
  {
    number: "03",
    phase: "THE SUCCESS",
    badge: "After IdeaForge",
    badgeColor: "bg-orange-500",
    title: "Present with conviction",
    description:
      "Walk into that investor meeting with data-backed confidence. Your validated idea, complete with market analysis and growth projections, speaks for itself.",
    image: "/3.jpg",
  },
]

export function Journey() {
  return (
    <section className="relative pt-4 pb-24 overflow-hidden" style={{ background: "linear-gradient(to bottom, oklch(0.985 0 0) 0%, oklch(0.97 0.005 260) 10%, oklch(0.85 0.01 260) 25%, oklch(0.5 0.015 260) 45%, oklch(0.2 0.02 260) 65%, oklch(0.12 0.02 260) 85%, oklch(0.08 0.02 260) 100%)" }}>
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-4 py-1.5 text-xs uppercase tracking-wider text-foreground mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
            {"The Founder's Journey"}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight mb-6 text-foreground"
          >
            From doubt to conviction
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-foreground max-w-2xl mx-auto"
          >
            We understand the emotional rollercoaster of entrepreneurship. Here's how IdeaForge transforms your journey.
          </motion.p>
        </div>

        {/* Journey Steps */}
        <div className="space-y-24">
          {journeySteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={`flex flex-col gap-12 items-center ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
            >
              {/* Image */}
              <div className="flex-1 w-full max-w-xl">
                <div className="relative rounded-2xl overflow-hidden">
                  <div
                    className={`absolute top-4 left-4 z-10 ${step.badgeColor} px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 text-white`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    {step.badge}
                  </div>
                  <Image
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-7xl font-bold" style={{ color: index === 1 ? "oklch(0.2 0 0)" : index === 2 ? "oklch(0.9 0 0)" : "oklch(0.4 0 0)" }}>{step.number}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-emerald-500 to-transparent" />
                </div>
                <p className={`text-xs uppercase tracking-[0.2em] mb-3 ${index === 1 ? "text-white/60" : index === 2 ? "text-white/40" : "text-foreground"}`}>{step.phase}</p>
                <h3 className={`text-3xl sm:text-4xl font-semibold mb-4 ${index === 1 ? "text-white" : index === 2 ? "text-white/70" : "text-foreground"}`}>{step.title}</h3>
                <p className={`text-lg leading-relaxed ${index === 1 ? "text-white/80" : index === 2 ? "text-white/60" : "text-foreground"}`}>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
