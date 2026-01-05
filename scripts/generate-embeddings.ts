/**
 * Generate embeddings for existing Supabase data
 * Run this script to populate embeddings for all your portfolio data
 *
 * Usage: npx tsx scripts/generate-embeddings.ts
 */

import dotenv from "dotenv"
import path from "path"

// Load .env.local file (Next.js convention)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

console.log("OPENAI_API_KEY =", process.env.OPENAI_API_KEY);
console.log("CWD =", process.cwd());

import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Technology {
  id: string
  tech_id: string
  title: string
  category: string
  description: string
  status: string
  type?: string
  benefits?: string
  risks?: string
}

interface Pilot {
  id: string
  pilot_id: string
  title: string
  technology_id: string
  status: string
  sponsor?: string
  location?: string
  start_date?: string
  objectives?: string
  lessons_learned?: string
}

interface WatchlistItem {
  id: string
  technology: string
  vendor: string
  signal: string
  priority: string
  notes?: string
}

/**
 * Generate text content for embedding from a technology record
 */
function getTechnologyContent(tech: Technology): string {
  const parts = [
    `Technology: ${tech.title}`,
    `Category: ${tech.category}`,
    `Status: ${tech.status}`,
    `Description: ${tech.description}`,
  ]

  if (tech.type) parts.push(`Type: ${tech.type}`)
  if (tech.benefits) parts.push(`Benefits: ${tech.benefits}`)
  if (tech.risks) parts.push(`Risks: ${tech.risks}`)

  return parts.join("\n")
}

/**
 * Generate text content for embedding from a pilot record
 */
function getPilotContent(pilot: Pilot): string {
  const parts = [
    `Pilot: ${pilot.title}`,
    `Technology ID: ${pilot.technology_id}`,
    `Status: ${pilot.status}`,
  ]

  if (pilot.sponsor) parts.push(`Sponsor: ${pilot.sponsor}`)
  if (pilot.location) parts.push(`Location: ${pilot.location}`)
  if (pilot.objectives) parts.push(`Objectives: ${pilot.objectives}`)
  if (pilot.lessons_learned) parts.push(`Lessons Learned: ${pilot.lessons_learned}`)

  return parts.join("\n")
}

/**
 * Generate text content for embedding from a watchlist item
 */
function getWatchlistContent(item: WatchlistItem): string {
  const parts = [
    `Technology: ${item.technology}`,
    `Vendor: ${item.vendor}`,
    `Signal: ${item.signal}`,
    `Priority: ${item.priority}`,
  ]

  if (item.notes) parts.push(`Notes: ${item.notes}`)

  return parts.join("\n")
}

/**
 * Generate embedding for a text string
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  })

  return response.data[0].embedding
}

/**
 * Process technologies and generate embeddings
 */
async function processTechnologies() {
  console.log("📚 Processing technologies...")

  const { data: technologies, error } = await supabase
    .from("technologies")
    .select("*")

  if (error) {
    console.error("Error fetching technologies:", error)
    return
  }

  if (!technologies || technologies.length === 0) {
    console.log("No technologies found")
    return
  }

  let processed = 0
  for (const tech of technologies) {
    try {
      const content = getTechnologyContent(tech)
      const embedding = await generateEmbedding(content)

      const { error: updateError } = await supabase
        .from("technologies")
        .update({
          embedding,
          content_for_search: content
        })
        .eq("id", tech.id)

      if (updateError) {
        console.error(`Error updating technology ${tech.title}:`, updateError)
      } else {
        processed++
        console.log(`✅ Processed: ${tech.title}`)
      }

      // Rate limit: small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Error processing technology ${tech.title}:`, error)
    }
  }

  console.log(`\n✨ Processed ${processed}/${technologies.length} technologies\n`)
}

/**
 * Process pilots and generate embeddings
 */
async function processPilots() {
  console.log("🚀 Processing pilots...")

  const { data: pilots, error } = await supabase
    .from("pilots")
    .select("*")

  if (error) {
    console.error("Error fetching pilots:", error)
    return
  }

  if (!pilots || pilots.length === 0) {
    console.log("No pilots found")
    return
  }

  let processed = 0
  for (const pilot of pilots) {
    try {
      const content = getPilotContent(pilot)
      const embedding = await generateEmbedding(content)

      const { error: updateError } = await supabase
        .from("pilots")
        .update({
          embedding,
          content_for_search: content
        })
        .eq("id", pilot.id)

      if (updateError) {
        console.error(`Error updating pilot ${pilot.title}:`, updateError)
      } else {
        processed++
        console.log(`✅ Processed: ${pilot.title}`)
      }

      // Rate limit: small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Error processing pilot ${pilot.title}:`, error)
    }
  }

  console.log(`\n✨ Processed ${processed}/${pilots.length} pilots\n`)
}

/**
 * Process market intelligence watchlist and generate embeddings
 */
async function processWatchlist() {
  console.log("📊 Processing market intelligence watchlist...")

  const { data: watchlist, error } = await supabase
    .from("market_watchlist")
    .select("*")

  if (error) {
    console.error("Error fetching watchlist:", error)
    return
  }

  if (!watchlist || watchlist.length === 0) {
    console.log("No watchlist items found")
    return
  }

  let processed = 0
  for (const item of watchlist) {
    try {
      const content = getWatchlistContent(item)
      const embedding = await generateEmbedding(content)

      const { error: updateError } = await supabase
        .from("market_watchlist")
        .update({
          embedding,
          content_for_search: content
        })
        .eq("id", item.id)

      if (updateError) {
        console.error(`Error updating watchlist item ${item.technology}:`, updateError)
      } else {
        processed++
        console.log(`✅ Processed: ${item.technology}`)
      }

      // Rate limit: small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Error processing watchlist item:`, error)
    }
  }

  console.log(`\n✨ Processed ${processed}/${watchlist.length} watchlist items\n`)
}

/**
 * Main function to run all embedding generation
 */
async function main() {
  console.log("🎯 Starting embedding generation for GridTech portfolio data\n")
  console.log("=" .repeat(60))

  // Check environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY not found in environment variables")
    process.exit(1)
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Supabase credentials not found in environment variables")
    process.exit(1)
  }

  try {
    await processTechnologies()
    await processPilots()
    await processWatchlist()

    console.log("=" .repeat(60))
    console.log("✅ Embedding generation complete!")
    console.log("\nYour AI Assistant can now search and reference:")
    console.log("  • Technology library data")
    console.log("  • Pilot project information")
    console.log("  • Market intelligence watchlist")
  } catch (error) {
    console.error("❌ Error during embedding generation:", error)
    process.exit(1)
  }
}

// Run the script
main()
