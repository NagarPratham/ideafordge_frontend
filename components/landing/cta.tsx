"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="relative pt-4 pb-16 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl" style={{ background: "linear-gradient(to bottom right, oklch(0.12 0.02 260), oklch(0.08 0.02 260))" }}>
          {/* Background orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

          <div className="relative py-12 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-wider text-white/60 mb-4"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Join 2,500+ founders today
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4"
        >
          Ready to validate your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/20">
            next big idea?
          </span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base text-white/60 max-w-xl mx-auto mb-8"
        >
          Stop second-guessing. Start building with confidence. Get AI-powered validation in under 3 minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/validate">
            <Button className="rounded-full px-8 h-14 bg-white hover:bg-white/90 gap-2" style={{ color: '#000000' }}>
              Get started
              <ArrowRight className="h-4 w-4" style={{ color: '#000000' }} />
            </Button>
          </Link>
          <Link href="/chat">
            <Button
              variant="outline"
              className="rounded-full px-8 h-14 border-white/20 text-white bg-transparent hover:bg-white/10"
            >
              Talk to AI Co-Founder
            </Button>
          </Link>
        </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
