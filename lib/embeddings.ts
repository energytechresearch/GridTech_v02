/**
 * Embedding utility functions for GridTech
 * Handles embedding generation and vector search operations
 */

import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Generate an embedding for a given text string
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    })

    return response.data[0].embedding
  } catch (error) {
    console.error("Error generating embedding:", error)
    throw new Error("Failed to generate embedding")
  }
}

/**
 * Search across all portfolio data using semantic similarity
 */
export async function searchPortfolio(
  query: string,
  options: {
    matchThreshold?: number
    matchCount?: number
    dataScope?: string
  } = {}
) {
  const {
    matchThreshold = 0.5,
    matchCount = 10,
    dataScope = "full-portfolio",
  } = options

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query)

  // Create Supabase client (server-side only)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Choose search function based on data scope
  let searchFunction = "match_portfolio"
  if (dataScope === "pilots-only") {
    searchFunction = "match_pilots"
  } else if (dataScope === "technology-library") {
    searchFunction = "match_technologies"
  } else if (dataScope === "risk-register" || dataScope === "market-intelligence") {
    searchFunction = "match_watchlist"
  }

  // Perform vector search
  const { data, error } = await supabase.rpc(searchFunction, {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount,
  })

  if (error) {
    console.error("Vector search error:", error)
    throw new Error("Failed to search portfolio data")
  }

  return data || []
}

/**
 * Format search results into context for the AI
 */
export function formatSearchResultsForAI(results: any[]): string {
  if (!results || results.length === 0) {
    return "No relevant data found in the portfolio."
  }

  const formatted = results
    .map((result, index) => {
      const source = result.source || "data"
      const title = result.title || result.name || "Untitled"
      const content = result.content || result.content_for_search || result.description || ""
      const similarity = (result.similarity * 100).toFixed(1)

      return `[${index + 1}] ${source.toUpperCase()}: ${title}\n${content}\n(Relevance: ${similarity}%)`
    })
    .join("\n\n---\n\n")

  return `RELEVANT PORTFOLIO DATA:\n\n${formatted}`
}

/**
 * Embed and store a new technology
 */
export async function embedTechnology(techData: {
  id: string
  name: string
  category: string
  description: string
  status: string
  use_case?: string
  benefits?: string
  risks?: string
}) {
  const content = [
    `Technology: ${techData.name}`,
    `Category: ${techData.category}`,
    `Status: ${techData.status}`,
    `Description: ${techData.description}`,
  ]

  if (techData.use_case) content.push(`Use Case: ${techData.use_case}`)
  if (techData.benefits) content.push(`Benefits: ${techData.benefits}`)
  if (techData.risks) content.push(`Risks: ${techData.risks}`)

  const contentText = content.join("\n")
  const embedding = await generateEmbedding(contentText)

  return {
    embedding,
    content_for_search: contentText,
  }
}

/**
 * Embed and store a new pilot
 */
export async function embedPilot(pilotData: {
  id: string
  name: string
  description: string
  technology: string
  status: string
  sponsor?: string
  location?: string
  objectives?: string
  outcomes?: string
}) {
  const content = [
    `Pilot: ${pilotData.name}`,
    `Technology: ${pilotData.technology}`,
    `Status: ${pilotData.status}`,
    `Description: ${pilotData.description}`,
  ]

  if (pilotData.sponsor) content.push(`Sponsor: ${pilotData.sponsor}`)
  if (pilotData.location) content.push(`Location: ${pilotData.location}`)
  if (pilotData.objectives) content.push(`Objectives: ${pilotData.objectives}`)
  if (pilotData.outcomes) content.push(`Outcomes: ${pilotData.outcomes}`)

  const contentText = content.join("\n")
  const embedding = await generateEmbedding(contentText)

  return {
    embedding,
    content_for_search: contentText,
  }
}

/**
 * Chunk long text into smaller pieces for embedding
 * Recommended: 300-800 tokens per chunk (~200-600 words)
 */
export function chunkText(text: string, maxWords: number = 500): string[] {
  const words = text.split(/\s+/)
  const chunks: string[] = []

  for (let i = 0; i < words.length; i += maxWords) {
    const chunk = words.slice(i, i + maxWords).join(" ")
    chunks.push(chunk)
  }

  return chunks
}
