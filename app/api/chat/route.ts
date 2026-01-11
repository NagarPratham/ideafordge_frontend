import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"

// Create Google provider - v1beta supports systemInstruction, v1 has more models but no systemInstruction
// We'll handle system prompt in messages for v1, or use v1beta with supported models
const googleAI = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ? createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      // Use v1beta as it supports systemInstruction (system prompts)
      // baseURL defaults to v1beta which is correct for system prompts
    })
  : null


export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // DefaultChatTransport sends messages in a specific format
    // Handle both direct messages array and nested format
    let messages = body.messages || body
    
    // Ensure messages array exists and is properly formatted
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format. Received:", JSON.stringify(body, null, 2))
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Ensure we have at least one message
    if (messages.length === 0) {
      console.error("Empty messages array")
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const systemPrompt = `You are an AI Co-Founder named "AI Co-founder" for IdeaForge AI. You are a realistic, helpful, and knowledgeable AI Co-Founder that can answer ANY and EVERY question - not just about startups, but about anything the user asks.

Your personality:
- Friendly and conversational (use casual language like "Yo 👋" when appropriate)
- Knowledgeable and helpful on any topic - answer ANY question, not just startup-related ones
- When asked about startups, you're an expert AI Co-Founder
- When asked about other topics (science, history, coding, general knowledge, etc.), you answer helpfully and accurately
- Keep responses engaging, natural, and comprehensive
- Don't refuse to answer questions - you can answer anything the user asks

Your expertise includes (but you're not limited to):
- Startups, business, entrepreneurship
- Technology, programming, software development
- Science, history, general knowledge
- Creative writing, art, culture
- Personal advice, productivity, life tips
- ANY topic the user wants to discuss

Be helpful, specific, and actionable in your responses. Ask clarifying questions when needed. Use concrete examples and data points when possible. Keep responses conversational and natural.

When discussing startup ideas:
1. Be encouraging but honest about challenges
2. Provide specific, actionable advice
3. Reference relevant industry benchmarks when applicable
4. Suggest next steps the founder can take immediately

When asked about non-startup topics:
- Answer accurately and helpfully with detailed information
- Provide clear, useful information
- Be conversational and engaging
- Feel free to have natural conversations about anything
- Don't limit yourself to startup topics - answer ANY question comprehensively

Remember: You can answer ANY question on ANY topic, not just startup-related ones. Be a realistic, helpful AI Co-Founder that users can talk to about anything.`

    // Convert messages to the format expected by streamText
    // Handle both AI SDK format (with parts) and standard format
    const formattedMessages = messages.map((msg: any) => {
      // If message has parts (AI SDK format), extract text from parts
      if (msg.parts && Array.isArray(msg.parts)) {
        const textContent = msg.parts
          .filter((p: any) => p.type === "text")
          .map((p: any) => p.text || p.content || "")
          .join("")
        
        return {
          role: msg.role || "user",
          content: textContent || msg.content || msg.text || "",
        }
      }
      
      // Standard format
      return {
        role: msg.role || "user",
        content: msg.content || msg.text || "",
      }
    }).filter((msg: any) => msg.content && msg.content.trim().length > 0)

    // Ensure we have at least one valid message after filtering
    if (formattedMessages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Try to use Google Gemini first (free tier available), then OpenAI, then fallback
    let result
    let providerUsed = "none"
    
    try {
      // Try Google Gemini first if API key is available
      // FIRST: Call ListModels API to see what models are actually available
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        providerUsed = "gemini"
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
        
        // Add system prompt as first message to ensure compatibility
        const messagesWithSystem = formattedMessages.length > 0 && formattedMessages[0].role === "user"
          ? [
              {
                role: "user" as const,
                content: `${systemPrompt}\n\n---\n\nUser: ${(formattedMessages[0] as any).content || (formattedMessages[0] as any).text || ""}`,
              },
              ...formattedMessages.slice(1),
            ]
          : [
              {
                role: "user" as const,
                content: systemPrompt,
              },
              ...formattedMessages,
            ]
        
        // Call ListModels API to get actual available models
        let availableModels: string[] = []
        try {
          console.log(`[Gemini] Calling ListModels API to find available models...`)
          const listResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
            { method: "GET" }
          )
          
          if (listResponse.ok) {
            const listData = await listResponse.json()
            availableModels = (listData.models || [])
              .filter((m: any) => {
                // Only include models that:
                // 1. Are Gemini models (not embeddings, vision-only, etc)
                // 2. Support generateContent method
                // 3. Have a valid name
                const name = m.name?.replace("models/", "") || ""
                const isGemini = name.includes("gemini") && !name.includes("embedding")
                const supportsGenerateContent = m.supportedGenerationMethods?.includes("generateContent") || 
                                                m.supportedGenerationMethods?.includes("streamGenerateContent")
                return isGemini && supportsGenerateContent && name.length > 0
              })
              .map((m: any) => m.name?.replace("models/", "") || "")
            
            console.log(`[Gemini] Found ${availableModels.length} available models:`, availableModels.slice(0, 10))
            
            if (availableModels.length === 0) {
              throw new Error(`No Gemini models available with your API key. Please check:\n1. Enable Generative AI API in Google Cloud Console\n2. Verify API key permissions\n3. Check billing/quota settings`)
            }
          } else {
            const errorData = await listResponse.json().catch(() => ({}))
            throw new Error(`ListModels API failed: ${errorData.error?.message || `HTTP ${listResponse.status}`}`)
          }
        } catch (listError: any) {
          console.error(`[Gemini] ListModels failed:`, listError.message)
          throw new Error(`Failed to get available Gemini models: ${listError.message}\n\nPlease verify:\n1. Your API key is correct\n2. Generative AI API is enabled\n3. API key has proper permissions`)
        }
        
        // Try each available model until one works
        for (const modelName of availableModels) {
          try {
            if (!googleAI) {
              throw new Error("Google AI provider not initialized")
            }
            
            console.log(`[Gemini] Trying model: ${modelName}`)
            result = streamText({
              model: googleAI(modelName),
              messages: messagesWithSystem,
            })
            console.log(`[Gemini] ✓ Successfully using model: ${modelName}`)
            return result.toUIMessageStreamResponse()
          } catch (modelError: any) {
            const isNotFound = modelError.message?.includes("404") || 
                              modelError.message?.includes("NOT_FOUND") ||
                              modelError.statusCode === 404 ||
                              modelError.code === 404
            const errorMsg = modelError.message?.substring(0, 200) || String(modelError).substring(0, 200)
            console.log(`[Gemini] ✗ Model ${modelName} failed: ${errorMsg}`)
            
            // If it's not a 404, it might be auth/rate limit/etc - throw immediately
            if (!isNotFound) {
              throw modelError
            }
            // If 404, continue to next model (shouldn't happen since we listed them, but just in case)
          }
        }
        
        throw new Error(`All ${availableModels.length} available Gemini models failed. This is unusual. Please check:\n1. API key permissions\n2. Billing/quota settings\n3. Model access in Google Cloud Console`)
      }
      // Try OpenAI if API key is available
      else if (process.env.OPENAI_API_KEY) {
        providerUsed = "openai"
        result = streamText({
          model: openai("gpt-4o-mini"),
          system: systemPrompt,
          messages: formattedMessages,
        })
        return result.toUIMessageStreamResponse()
      }
      // Fallback: Use OpenAI Gateway format (for Vercel AI SDK Gateway)
      else if (process.env.AI_GATEWAY_API_KEY) {
        providerUsed = "gateway"
        result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
          messages: formattedMessages,
  })
        return result.toUIMessageStreamResponse()
      }
      // No API keys - require API key
      // Return error as a streaming response so chat interface can display it
      else {
        console.warn("No API keys found. API key required.")
        const errorMessage = "⚠️ API Key Required\n\nTo use the AI Co-Founder, please set up an API key in your environment variables:\n\n1. For Google Gemini (Recommended - Free tier available):\n   Set GOOGLE_GENERATIVE_AI_API_KEY\n   Get your key at: https://makersuite.google.com/app/apikey\n\n2. For OpenAI:\n   Set OPENAI_API_KEY\n   Get your key at: https://platform.openai.com/api-keys\n\nAfter setting the key, restart your development server."
        
        // Return as streaming response format so chat interface can display it
        result = streamText({
          model: {
            provider: 'error',
            modelId: 'error',
            doStream: async function* () {
              yield { type: 'text-delta', textDelta: errorMessage }
            },
            doGenerate: async function* () {
              yield { text: errorMessage }
            }
          } as any,
          system: systemPrompt,
          messages: formattedMessages,
        })
        return result.toUIMessageStreamResponse()
      }
    } catch (providerError: any) {
      console.error(`Provider error (${providerUsed}):`, providerError)
      
      // If first provider fails, try the next one as fallback
      try {
        if (providerUsed === "gemini" && process.env.OPENAI_API_KEY) {
          console.log("Gemini failed, trying OpenAI as fallback...")
          result = streamText({
            model: openai("gpt-4o-mini"),
            system: systemPrompt,
            messages: formattedMessages,
          })
  return result.toUIMessageStreamResponse()
        }
      } catch (fallbackError: any) {
        console.error("Fallback provider also failed:", fallbackError)
      }
      
      // If all providers fail, return a helpful error
      const errorResponse = {
        error: "AI provider error",
        message: providerError.message || "Failed to get response from AI provider",
        hint: providerUsed === "none" 
          ? "Please set GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY environment variable"
          : `The ${providerUsed} provider encountered an error. Please check your API key and try again.`,
      }
      return new Response(JSON.stringify(errorResponse), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
  } catch (error: any) {
    console.error("Chat API Error:", error)
    
    // Return a helpful error message
    const errorMessage = error.message || "Failed to process chat request"
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        hint: "Please check your API keys: GOOGLE_GENERATIVE_AI_API_KEY or OPENAI_API_KEY"
      }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
