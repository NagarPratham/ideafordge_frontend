"use client"

import { motion } from "framer-motion"

export function NetworkVisualization() {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">

      {/* Main visualization container */}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center">
        {/* Central dark circle */}
        <div className="absolute w-16 h-16 bg-foreground rounded-full z-10" />

        {/* Static rings (inner two) */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* First ring (innermost) */}
          <circle
            cx="250"
            cy="250"
            r="80"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-muted-foreground/40"
          />

          {/* Second ring (middle) */}
          <circle
            cx="250"
            cy="250"
            r="140"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="text-muted-foreground/40"
          />
        </svg>

        {/* Animated outer ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            transformOrigin: "center",
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="250"
              cy="250"
              r="200"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="text-muted-foreground/40"
            />
          </svg>
        </motion.div>

        {/* Radial nodes and connections */}
        <svg
          className="absolute inset-0 w-full h-full z-0"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top node (larger) */}
          <g>
            <line x1="250" y1="250" x2="250" y2="50" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
            <circle cx="250" cy="50" r="12" fill="currentColor" className="text-foreground" />
          </g>

          {/* Bottom node (medium) */}
          <g>
            <line x1="250" y1="250" x2="250" y2="450" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
            <circle cx="250" cy="450" r="8" fill="currentColor" className="text-foreground" />
          </g>

          {/* Top right nodes (small) */}
          <g>
            <line x1="250" y1="250" x2="380" y2="120" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
            <circle cx="380" cy="120" r="4" fill="currentColor" className="text-foreground" />
          </g>
          <g>
            <line x1="250" y1="250" x2="420" y2="150" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
            <circle cx="420" cy="150" r="4" fill="currentColor" className="text-foreground" />
          </g>

          {/* Left nodes (medium) */}
          <g>
            <line x1="250" y1="250" x2="100" y2="250" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
            <circle cx="100" cy="250" r="8" fill="currentColor" className="text-foreground" />
          </g>
          <g>
            <line x1="250" y1="250" x2="400" y2="250" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" />
            <circle cx="400" cy="250" r="8" fill="currentColor" className="text-foreground" />
          </g>
        </svg>

        {/* Data Cards */}
        {/* Market Size - Top Right */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute top-8 right-8 bg-white rounded-xl shadow-lg p-4 border border-border min-w-[140px] z-20"
        >
          <p className="text-xs text-muted-foreground mb-1">Market Size</p>
          <p className="text-2xl font-bold text-foreground">$2.4B</p>
        </motion.div>

        {/* Validation Score - Bottom Left */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="absolute bottom-8 left-8 bg-white rounded-xl shadow-lg p-4 border border-border min-w-[140px] z-20"
        >
          <p className="text-xs text-muted-foreground mb-1">Validation Score</p>
          <p className="text-2xl font-bold text-foreground">87 /100</p>
        </motion.div>
      </div>
    </div>
  )
}
