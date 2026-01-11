"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, MessageSquare, BarChart3, Building2, Target, Lightbulb } from "lucide-react"

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [activeDashboardTab, setActiveDashboardTab] = useState("overview")
  const pathname = usePathname()
  const isDashboard = pathname === "/dashboard"

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        // At the top, always show
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Listen for tab changes from dashboard content
  useEffect(() => {
    if (!isDashboard) return

    const handleTabChange = (event: CustomEvent<{ tab: string }>) => {
      setActiveDashboardTab(event.detail.tab)
    }

    // Also listen for changes from internal dashboard tabs
    const handleInternalTabChange = () => {
      // This will be triggered by dashboard content when tabs change
      window.addEventListener("dashboard-internal-tab-change", handleTabChange as EventListener)
    }

    window.addEventListener("dashboard-tab-change", handleTabChange as EventListener)
    handleInternalTabChange()

    return () => {
      window.removeEventListener("dashboard-tab-change", handleTabChange as EventListener)
      window.removeEventListener("dashboard-internal-tab-change", handleTabChange as EventListener)
    }
  }, [isDashboard])

  const handleDashboardTabClick = (tab: string) => {
    setActiveDashboardTab(tab)
    // Dispatch a custom event that DashboardContent can listen to
    window.dispatchEvent(new CustomEvent('dashboard-tab-change', { detail: { tab } }))
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="backdrop-blur-xl border border-border/50 rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-6" style={{ backgroundColor: "oklch(0.96 0 0 / 0.8)" }}>
          <div className="flex h-12 sm:h-14 items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-foreground shrink-0">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-background" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-base sm:text-lg font-semibold tracking-tight text-foreground">IdeaForge</span>
          </Link>

          {/* Navigation Links - Dashboard Tabs when on /dashboard, otherwise default */}
          {isDashboard ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => handleDashboardTabClick("overview")}
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  activeDashboardTab === "overview"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Overview</span>
              </button>
              <button
                onClick={() => handleDashboardTabClick("market")}
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  activeDashboardTab === "market"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Market</span>
              </button>
              <button
                onClick={() => handleDashboardTabClick("analysis")}
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  activeDashboardTab === "analysis"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Analysis</span>
              </button>
              <button
                onClick={() => handleDashboardTabClick("strategy")}
                className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                  activeDashboardTab === "strategy"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Strategy</span>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2">
            <Link href="#features" className="text-xs sm:text-sm text-black hover:text-black/80 transition-colors">
              Features
            </Link>
            <Link href="#process" className="text-xs sm:text-sm text-black hover:text-black/80 transition-colors">
              Process
            </Link>
            <Link
              href="#stats"
              className="text-xs sm:text-sm text-black hover:text-black/80 transition-colors"
            >
              Stats
            </Link>
          </div>
          )}

          {/* CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/chat">
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 sm:gap-2 text-black hover:text-black/80 hover:bg-transparent text-xs sm:text-sm" style={{ color: '#000000' }}>
                <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: '#000000' }} />
                <span className="hidden md:inline">AI Co-Founder</span>
              </Button>
            </Link>
            {!isDashboard && (
            <Link href="/validate">
              <Button size="sm" className="rounded-full px-3 sm:px-4 md:px-5 gap-1 text-xs sm:text-sm h-9 sm:h-10">
                <span className="hidden sm:inline">Start Validating</span>
                <span className="sm:hidden">Validate</span>
                <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </Button>
            </Link>
            )}
          </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
