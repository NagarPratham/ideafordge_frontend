"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, TrendingUp, Target, DollarSign, Lightbulb, BarChart3, ArrowRight } from "lucide-react"
import { useChat, Chat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

// AI Co-Founder Avatar - Premium founder-inspired robot (no background)
export function CoFounderAvatar({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClasses = {
    sm: "h-7 w-7 sm:h-8 sm:w-8",
    md: "h-8 w-8 sm:h-10 sm:w-10",
    lg: "h-16 w-16 sm:h-20 sm:w-20",
  }

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      animate={{
        filter: [
          "drop-shadow(0 0 12px rgba(59, 130, 246, 0.7)) drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
          "drop-shadow(0 0 16px rgba(59, 130, 246, 0.9)) drop-shadow(0 4px 12px rgba(0,0,0,0.2))",
          "drop-shadow(0 0 12px rgba(59, 130, 246, 0.7)) drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
        ],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      {/* Premium Founder Robot - Sophisticated, innovative, professional */}
      <div className="relative h-full w-full flex items-center justify-center overflow-visible">
        <svg
          viewBox="0 0 120 140"
          className="absolute inset-0 w-full h-full"
        >
          <defs>
            <linearGradient id="founderHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="founderTieGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <radialGradient id="eyeGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="70%" stopColor="#93c5fd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </radialGradient>
            <pattern id="techPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="0.5" fill="rgba(255,255,255,0.1)" />
            </pattern>
          </defs>

          {/* Premium rounded-square head with elegant bevel */}
          <motion.rect
            x="30"
            y="20"
            width="60"
            height="60"
            rx="14"
            ry="14"
            fill="url(#founderHeadGrad)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.5"
            animate={{
              y: [20, 18, 20],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Tech pattern overlay */}
          <rect x="30" y="20" width="60" height="60" rx="14" fill="url(#techPattern)" opacity="0.3" />

          {/* Elegant tech grid lines */}
          <g opacity="0.2" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
            <line x1="45" y1="20" x2="45" y2="80" />
            <line x1="60" y1="20" x2="60" y2="80" />
            <line x1="75" y1="20" x2="75" y2="80" />
            <line x1="30" y1="40" x2="90" y2="40" />
            <line x1="30" y1="60" x2="90" y2="60" />
          </g>

          {/* Premium smart glasses/visor */}
          <motion.g
            animate={{
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <rect
              x="35"
              y="42"
              width="22"
              height="18"
              rx="4"
              fill="none"
              stroke="rgba(147,197,253,0.6)"
              strokeWidth="2"
            />
            <rect
              x="63"
              y="42"
              width="22"
              height="18"
              rx="4"
              fill="none"
              stroke="rgba(147,197,253,0.6)"
              strokeWidth="2"
            />
            <line x1="57" y1="51" x2="63" y2="51" stroke="rgba(147,197,253,0.6)" strokeWidth="2" />
          </motion.g>

          {/* Intelligent AI eyes - sophisticated pulsing */}
          <motion.circle
            cx="46"
            cy="51"
            r="5"
            fill="url(#eyeGlowGrad)"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.circle
            cx="74"
            cy="51"
            r="5"
            fill="url(#eyeGlowGrad)"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.9, 1, 0.9],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />

          {/* Eye highlights for depth */}
          <circle cx="47" cy="50" r="2" fill="rgba(255,255,255,0.9)" />
          <circle cx="75" cy="50" r="2" fill="rgba(255,255,255,0.9)" />

          {/* Confident founder smile - elegant curve */}
          {size !== "sm" && (
            <motion.path
              d="M 38 68 Q 60 74 82 68"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1],
                opacity: [0, 0.8, 0.7],
              }}
              transition={{
                pathLength: { duration: 1, delay: 0.5 },
                opacity: {
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                },
              }}
            />
          )}

          {/* Professional suit collar */}
          <rect
            x="52"
            y="78"
            width="16"
            height="12"
            rx="2"
            fill="rgba(255,255,255,0.2)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />

          {/* Executive tie - premium founder look */}
          {size !== "sm" && (
            <motion.g
              animate={{
                y: [0, -1.5, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              {/* Tie knot */}
              <polygon
                points="58,82 66,82 64,88 60,88"
                fill="url(#founderTieGrad)"
              />
              {/* Tie body */}
              <rect x="61" y="88" width="2" height="35" fill="url(#founderTieGrad)" />
              {/* Tie tip */}
              <polygon
                points="60,120 64,120 62,128 58,128"
                fill="url(#founderTieGrad)"
              />
            </motion.g>
          )}

          {/* Innovation badge - founder achievement indicator */}
          {size === "lg" && (
            <motion.g
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <circle
                cx="100"
                cy="30"
                r="8"
                fill="rgba(59, 130, 246, 0.9)"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="1.5"
              />
              <path
                d="M 96 30 L 99 33 L 104 28"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          )}

          {/* Neural network connections - AI intelligence visualization */}
          {size === "lg" && (
            <g opacity="0.3">
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={105 + i * 4}
                  cy={15}
                  r="1.5"
                  fill="#93c5fd"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.25,
                  }}
                />
              ))}
            </g>
          )}
        </svg>
      </div>
    </motion.div>
  )
}

const quickActions = [
  { icon: TrendingUp, label: "Improve my pitch", prompt: "Help me improve my startup pitch" },
  { icon: Target, label: "Analyze competition", prompt: "Analyze potential competitors for my startup" },
  { icon: DollarSign, label: "Monetization ideas", prompt: "Suggest monetization strategies for my business" },
  { icon: Lightbulb, label: "Feature ideas", prompt: "Suggest key features to build first" },
]

const suggestionChips = [
  "How do I validate my market size?",
  "What metrics should I track?",
  "How to find early adopters?",
  "Best way to approach investors?",
]

export function ChatInterface() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [input, setInput] = useState("")

  // Create Chat instance with DefaultChatTransport for proper message handling
  const chat = useMemo(
    () =>
      new Chat({
        transport: new DefaultChatTransport({
          api: "/api/chat",
        }),
        onFinish: () => {
          setShowWelcome(false)
        },
      }),
    []
  )

  const { messages, sendMessage, status, error } = useChat({ chat })

  const isLoading = status === "submitted" || status === "streaming"
  const inputValue = input || ""
  const [apiError, setApiError] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle errors from the chat
  useEffect(() => {
    if (error) {
      console.error("Chat error:", error)
      // Extract error message from error object
      let errorMsg = "Failed to get response from AI. "
      if (typeof error === "string") {
        errorMsg = error
      } else if (error?.message) {
        errorMsg = error.message
      }
      
      // Check if it's an API key error
      if (errorMsg.includes("API key") || errorMsg.includes("Unauthenticated")) {
        setApiError(
          "⚠️ API Key Required\n\nTo use the AI Co-Founder, please set up an API key:\n\n" +
          "1. Google Gemini (Free): Set GOOGLE_GENERATIVE_AI_API_KEY\n" +
          "   Get key at: https://makersuite.google.com/app/apikey\n\n" +
          "2. OpenAI: Set OPENAI_API_KEY\n" +
          "   Get key at: https://platform.openai.com/api-keys\n\n" +
          "Then restart your dev server."
        )
      } else {
        setApiError(errorMsg)
      }
    } else {
      setApiError(null)
    }
  }, [error])

  const handleQuickAction = async (prompt: string) => {
    setShowWelcome(false)
    setInput("")
    // Send message using sendMessage - this should trigger the API call
    sendMessage({ text: prompt })
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    
    const messageText = inputValue.trim()
    setInput("")
    setShowWelcome(false)
    
    // Send message using sendMessage - this should trigger the API call and response
    sendMessage({ text: messageText })
  }

  // Format timestamp
  const formatTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Greyish Header (matching bottom area) */}
      <div className="bg-gray-100 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 flex items-center gap-2 sm:gap-3 border-b border-gray-200 shrink-0">
        <CoFounderAvatar size="md" />
        <h1 className="text-blue-900 font-bold text-sm sm:text-base">AI Co-founder</h1>
      </div>

      {/* White Main Chat Area - increased gap from navbar */}
      <div className="flex-1 overflow-y-auto bg-white px-3 sm:px-4 md:px-6 py-2 min-h-0 pt-3 sm:pt-4 md:pt-6">
        <div className="mx-auto max-w-3xl w-full">
          <AnimatePresence mode="wait">
            {showWelcome && messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-start px-2 sm:px-4 -mt-2 sm:-mt-4"
              >
                {/* AI Avatar */}
                <motion.div className="mb-0.5 sm:mb-1">
                  <CoFounderAvatar size="lg" />
                </motion.div>

                <h2 className="mb-0 text-lg sm:text-xl font-semibold text-gray-900 px-2">AI Co-founder</h2>
                <p className="mb-1.5 sm:mb-2 text-center text-gray-600 max-w-md text-xs sm:text-sm px-2">
                  Your AI Co-Founder. Ask me anything about your startup - from strategy to execution.
                </p>

                {/* Quick actions */}
                <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 w-full max-w-lg mb-1.5 sm:mb-2 px-2 sm:px-0">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white p-3 sm:p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50"
                    >
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-50 shrink-0">
                        <action.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{action.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Suggestion chips */}
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2">
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSuggestionClick(chip)}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-gray-900 whitespace-nowrap"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="messages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 sm:space-y-4">
                {/* Date separator for first message */}
                {messages.length > 0 && (
                  <div className="relative py-3 sm:py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 sm:px-3 text-[10px] sm:text-xs text-gray-500">Today</span>
                    </div>
                  </div>
                )}

                {messages.map((message, index) => {
                  const isBot = message.role === "assistant"
                  const messageTime = formatTime()

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 sm:gap-3 ${isBot ? "justify-start" : "justify-end"}`}
                    >
                      {isBot && (
                        <div className="shrink-0">
                          <CoFounderAvatar size="lg" />
                        </div>
                      )}

                      <div className={`max-w-[85%] sm:max-w-[80%] ${isBot ? "" : "flex flex-col items-end"}`}>
                        <div
                          className={`rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                            isBot
                              ? "bg-gray-100 border border-gray-200 text-gray-900"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed break-words">
                            {message.parts && Array.isArray(message.parts)
                              ? message.parts
                                  .filter((part: any) => part.type === "text")
                                  .map((part: any) => part.text || "")
                                  .join("")
                              : ""}
                          </p>
                        </div>
                        {/* Timestamp */}
                        <span className={`text-[10px] sm:text-xs text-gray-500 mt-1 px-1 ${isBot ? "text-left" : "text-right"}`}>
                          {messageTime}
                        </span>
                      </div>

                      {!isBot && (
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-blue-600">
                          <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}

                {/* Error message */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2 sm:gap-3 justify-start"
                  >
                    <div className="shrink-0">
                      <CoFounderAvatar size="lg" />
                    </div>
                    <div className="rounded-xl sm:rounded-2xl bg-red-50 border border-red-200 px-3 sm:px-4 py-2 sm:py-3 max-w-[85%] sm:max-w-[80%]">
                      <p className="text-xs sm:text-sm text-red-900 whitespace-pre-wrap leading-relaxed break-words">
                        {apiError}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Typing indicator */}
                {isLoading && !apiError && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 sm:gap-3 justify-start">
                    <div className="shrink-0">
                      <CoFounderAvatar size="lg" />
                    </div>
                    <div className="rounded-xl sm:rounded-2xl bg-gray-100 border border-gray-200 px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                          className="h-2 w-2 rounded-full bg-gray-400"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Light Gray Input/Action Area */}
      <div className="bg-gray-100 px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-200 shrink-0">
        <div className="mx-auto max-w-3xl w-full">

          {/* Input form */}
          <form onSubmit={onSubmit} className="flex gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Ask your AI co-founder anything..."
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl bg-white border-gray-200 pr-11 sm:pr-12 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !inputValue.trim()}
                className="absolute right-1 sm:right-1.5 top-1 sm:top-1.5 h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shrink-0"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </Button>
            </div>
          </form>

          {/* Bottom suggestions when chatting */}
          {messages.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2"
            >
              <button
                type="button"
                onClick={() => handleSuggestionClick("Tell me more about that")}
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50"
              >
                <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden xs:inline">Tell me more</span>
                <span className="xs:hidden">More</span>
              </button>
              <button
                type="button"
                onClick={() => handleSuggestionClick("Give me specific examples")}
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50"
              >
                <BarChart3 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden xs:inline">Give examples</span>
                <span className="xs:hidden">Examples</span>
              </button>
              <button
                type="button"
                onClick={() => handleSuggestionClick("How do I implement this?")}
                className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50"
              >
                <Lightbulb className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span className="hidden xs:inline">Implementation</span>
                <span className="xs:hidden">How to</span>
              </button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  )
}
