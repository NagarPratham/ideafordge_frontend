"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { NetworkVisualization } from "@/components/ui/network-visualization"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16 sm:pt-20 md:pt-24 bg-background">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* SDG Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-border bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm w-fit"
            >
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Supporting SDG 9: Industry & Innovation</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-semibold tracking-tight leading-[1.05] sm:leading-[1.1] text-foreground"
            >
              Validate your
              <br />
              <span className="relative inline-block">
                startup idea
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C50 4 100 2 150 4C200 6 250 8 298 6"
                    stroke="#06b6d4"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              in minutes
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              AI-powered market analysis, risk assessment, and actionable insights. Transform your idea into a validated
              business plan in under 3 minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <Link href="/validate">
                <Button size="lg" className="rounded-full px-6 sm:px-8 gap-2 h-12 sm:h-14 text-sm sm:text-base w-full sm:w-auto">
                  Start validating
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Content - Network Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative w-full h-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] bg-transparent overflow-hidden mt-6 lg:mt-0"
          >
            <NetworkVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
