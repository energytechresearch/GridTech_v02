import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { searchPortfolio, formatSearchResultsForAI } from "@/lib/embeddings"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, dataScope } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Invalid messages format" }, { status: 400 })
    }

    // Convert messages to a format suitable for the AI model
    const lastUserMessage = messages.filter((m: any) => m.role === "user").pop()?.content || ""

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-openai-api-key-here") {
      console.error("[Chat API] OpenAI API key not configured")
      return Response.json({
        error: "OpenAI API key not configured. Please add your API key to .env.local"
      }, { status: 500 })
    }

    // Search portfolio data using vector embeddings for relevant context
    let portfolioContext = ""
    let useEmbeddings = false

    try {
      const searchResults = await searchPortfolio(lastUserMessage, {
        matchThreshold: 0.5,
        matchCount: 10,
        dataScope: dataScope || "full-portfolio",
      })
      portfolioContext = formatSearchResultsForAI(searchResults)
      useEmbeddings = true
    } catch (embedError) {
      console.error("[Chat API] Embedding search error:", embedError)
      // Continue without portfolio context if search fails
      portfolioContext = "Note: Portfolio search is not available. Embeddings may not be generated yet. Please run: npx tsx scripts/generate-embeddings.ts"
    }

    // Create context-aware system prompt with actual portfolio data
    const systemContext = `You are an AI assistant for GridTech, a portfolio management platform for grid technology projects.
You help users analyze and understand their portfolio data including:
- Technology pilots and their status
- Risk assessments and scores
- Technology library and specifications
- Market intelligence and trends
- Project intake and portfolio management

Current data scope: ${dataScope || "full-portfolio"}

IMPORTANT: Use the portfolio data provided below to answer questions accurately. Only reference data that is explicitly provided in the context. If the data doesn't contain information to answer the question, acknowledge this limitation.

${portfolioContext}

Provide concise, actionable insights based on the actual portfolio data above.`

    const prompt = `${systemContext}\n\nUser question: ${lastUserMessage}`

    // Generate response using AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      maxTokens: 1000,
      temperature: 0.7,
    })

    return Response.json({ reply: text })
  } catch (error) {
    console.error("[Chat API] Error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
