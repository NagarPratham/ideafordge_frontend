"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Sparkles, Lightbulb, Target, Users, Rocket } from "lucide-react"
import { useRouter } from "next/navigation"
import { CoFounderAvatar } from "@/components/chat/chat-interface"

interface FormData {
  startupName: string
  description: string
  problem: string
  solution: string
  targetMarket: string
  industry: string
  stage: string
}

const steps = [
  { id: 1, title: "Basic Info", icon: Lightbulb },
  { id: 2, title: "Problem & Solution", icon: Target },
  { id: 3, title: "Market", icon: Users },
  { id: 4, title: "Stage", icon: Rocket },
]

const stages = [
  { value: "idea", label: "Just an Idea", description: "Concept stage, no development yet" },
  { value: "mvp", label: "Building MVP", description: "Currently developing minimum viable product" },
  { value: "launched", label: "Launched", description: "Product is live with early users" },
  { value: "growing", label: "Growing", description: "Established product with traction" },
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Entertainment",
  "Food & Beverage",
  "Real Estate",
  "Transportation",
  "Other",
]

export function ValidationWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    startupName: "",
    description: "",
    problem: "",
    solution: "",
    targetMarket: "",
    industry: "",
    stage: "",
  })

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const timestamp = new Date().toISOString()
      const dataEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp,
        formData,
        analysisResult: null as any,
      }

      if (response.ok) {
        const analysisResult = await response.json()
        dataEntry.analysisResult = analysisResult
        
        // Store in localStorage for persistence
        const existingData = localStorage.getItem("ideaForgeValidationData")
        const allData = existingData ? JSON.parse(existingData) : []
        allData.push(dataEntry)
        
        // Keep only the last 50 entries to prevent localStorage overflow
        const recentData = allData.slice(-50)
        localStorage.setItem("ideaForgeValidationData", JSON.stringify(recentData))
        
        // Also set the latest entry for immediate dashboard access
        localStorage.setItem("ideaForgeLatestData", JSON.stringify(dataEntry))
        
        // Backward compatibility: also store in sessionStorage
        sessionStorage.setItem("ideaForgeData", JSON.stringify(formData))
        sessionStorage.setItem("ideaForgeAnalysis", JSON.stringify(analysisResult))
      } else {
        // Store form data even if API fails
        const existingData = localStorage.getItem("ideaForgeValidationData")
        const allData = existingData ? JSON.parse(existingData) : []
        allData.push(dataEntry)
        const recentData = allData.slice(-50)
        localStorage.setItem("ideaForgeValidationData", JSON.stringify(recentData))
        localStorage.setItem("ideaForgeLatestData", JSON.stringify(dataEntry))
        sessionStorage.setItem("ideaForgeData", JSON.stringify(formData))
      }
    } catch (error) {
      // Store form data even if API fails
      const timestamp = new Date().toISOString()
      const dataEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp,
        formData,
        analysisResult: null,
      }
      const existingData = localStorage.getItem("ideaForgeValidationData")
      const allData = existingData ? JSON.parse(existingData) : []
      allData.push(dataEntry)
      const recentData = allData.slice(-50)
      localStorage.setItem("ideaForgeValidationData", JSON.stringify(recentData))
      localStorage.setItem("ideaForgeLatestData", JSON.stringify(dataEntry))
      sessionStorage.setItem("ideaForgeData", JSON.stringify(formData))
    }

    router.push("/dashboard")
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.startupName.trim() && formData.description.trim()
      case 2:
        return formData.problem.trim() && formData.solution.trim()
      case 3:
        return formData.targetMarket.trim() && formData.industry
      case 4:
        return formData.stage
      default:
        return false
    }
  }

  if (isAnalyzing) {
    return <AnalyzingAnimation />
  }

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-4 md:px-6">
      {/* Progress indicator */}
      <div className="mb-6 sm:mb-8 md:mb-12">
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: currentStep >= step.id ? "var(--primary)" : "var(--secondary)",
                    scale: currentStep === step.id ? 1.1 : 1,
                  }}
                  className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full transition-colors"
                >
                  <step.icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${currentStep >= step.id ? "text-primary-foreground" : "text-muted-foreground"}`}
                  />
                </motion.div>
                <span
                  className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-medium text-center ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-1 sm:mx-2 h-px w-8 sm:w-12 md:w-24 bg-border">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                    className="h-full bg-primary"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="rounded-xl sm:rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Tell us about your startup</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Start with the basics of your business idea.</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startupName" className="text-sm sm:text-base">Startup Name</Label>
                    <Input
                      id="startupName"
                      placeholder="e.g., TechFlow"
                      value={formData.startupName}
                      onChange={(e) => updateFormData("startupName", e.target.value)}
                      className="text-sm sm:text-base h-10 sm:h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm sm:text-base">Brief Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your startup in 2-3 sentences..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => updateFormData("description", e.target.value)}
                      className="text-sm sm:text-base resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Problem & Solution</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">What problem are you solving and how?</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="problem" className="text-sm sm:text-base">Problem Statement</Label>
                    <Textarea
                      id="problem"
                      placeholder="What problem does your startup solve?"
                      rows={3}
                      value={formData.problem}
                      onChange={(e) => updateFormData("problem", e.target.value)}
                      className="text-sm sm:text-base resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="solution" className="text-sm sm:text-base">Your Solution</Label>
                    <Textarea
                      id="solution"
                      placeholder="How does your product/service solve this problem?"
                      rows={3}
                      value={formData.solution}
                      onChange={(e) => updateFormData("solution", e.target.value)}
                      className="text-sm sm:text-base resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Target Market</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Who are your customers and what industry are you in?</p>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetMarket" className="text-sm sm:text-base">Target Audience</Label>
                    <Textarea
                      id="targetMarket"
                      placeholder="Describe your ideal customer (age, profession, needs...)"
                      rows={3}
                      value={formData.targetMarket}
                      onChange={(e) => updateFormData("targetMarket", e.target.value)}
                      className="text-sm sm:text-base resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Industry</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2">
                      {industries.map((industry) => (
                        <button
                          key={industry}
                          type="button"
                          onClick={() => updateFormData("industry", industry)}
                          className={`rounded-lg border px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm transition-colors ${
                            formData.industry === industry
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          {industry}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Current Stage</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Where is your startup in its journey?</p>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  {stages.map((stage) => (
                    <button
                      key={stage.value}
                      type="button"
                      onClick={() => updateFormData("stage", stage.value)}
                      className={`w-full rounded-lg sm:rounded-xl border p-3 sm:p-4 text-left transition-all ${
                        formData.stage === stage.value
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="font-medium text-sm sm:text-base">{stage.label}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{stage.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-6 sm:mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1} className="text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-4">
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Back</span>
          </Button>
          <Button onClick={nextStep} disabled={!isStepValid()} className="text-sm sm:text-base h-9 sm:h-10 px-4 sm:px-6">
            {currentStep === 4 ? (
              <>
                <span className="hidden sm:inline">Analyze with AI</span>
                <span className="sm:hidden">Analyze</span>
                <Sparkles className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function AnalyzingAnimation() {
  const analysisSteps = [
    "Analyzing market potential...",
    "Evaluating competition...",
    "Assessing feasibility...",
    "Calculating innovation index...",
    "Generating SWOT analysis...",
    "Creating recommendations...",
  ]

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col items-center justify-center py-20">
        {/* Animated brain/AI icon */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
            style={{ width: 160, height: 160 }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-4 rounded-full border-2 border-dashed border-accent/30"
            style={{ width: 128, height: 128 }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="relative flex h-40 w-40 items-center justify-center"
          >
            <CoFounderAvatar size="lg" />
          </motion.div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                delay: i * 0.3,
              }}
              className="absolute inset-0"
              style={{ transformOrigin: "center" }}
            >
              <div
                className="absolute h-3 w-3 rounded-full bg-primary"
                style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
              />
            </motion.div>
          ))}
        </div>

        <h2 className="mb-4 text-2xl font-bold">Analyzing Your Idea</h2>
        <p className="mb-8 text-center text-muted-foreground">
          Our AI is evaluating your startup idea across multiple dimensions
        </p>

        {/* Analysis steps */}
        <div className="w-full max-w-sm space-y-3">
          {analysisSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.6 }}
              className="flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.6 + 0.3 }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: index * 0.2 }}
                  className="h-2 w-2 rounded-full bg-primary"
                />
              </motion.div>
              <span className="text-sm text-muted-foreground">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
