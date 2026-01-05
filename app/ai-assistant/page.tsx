"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUser } from "@/lib/auth/hooks"
import {
  Layers,
  FileText,
  Database,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
}

type NavItem = {
  label: string
  href: string
}

type NavSection = {
  title: string
  icon: React.ComponentType<{ className?: string }>
  items: NavItem[]
}

const navigationSections: NavSection[] = [
  {
    title: "Technology Intake Portal",
    icon: FileText,
    items: [
      { label: "Submit New Technology Request", href: "/intake#submit-request" },
      { label: "My Submissions", href: "/intake#my-submissions" },
      { label: "Intake Review Queue", href: "/intake#review-queue" },
    ],
  },
  {
    title: "Technology Library",
    icon: Database,
    items: [
      { label: "All Technologies", href: "/library#all-technologies" },
      { label: "Archived / Evaluated Technologies", href: "/library#archived-technologies" },
      { label: "Tags & Categories", href: "/library#tags-categories" },
    ],
  },
  {
    title: "Pilot Management",
    icon: Layers,
    items: [
      { label: "Active Pilots", href: "/pilots#active-pilots" },
      { label: "Pilot Pipeline", href: "/pilots#pilot-pipeline" },
      { label: "Lessons Learned", href: "/pilots#lessons-learned" },
    ],
  },
  {
    title: "Market Intelligence Hub",
    icon: TrendingUp,
    items: [
      { label: "Technology Watchlist", href: "/market-intelligence#watchlist" },
      { label: "Vendor Landscape", href: "/market-intelligence#vendor-landscape" },
      { label: "Industry Insights", href: "/market-intelligence#industry-insights" },
    ],
  },
  {
    title: "AI Assistant",
    icon: Bot,
    items: [
      { label: "Portfolio Intelligence Chat", href: "/ai-assistant" },
    ],
  },
]

export default function AIAssistantPage() {
  const { user, loading: authLoading } = useUser()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [dataScope, setDataScope] = useState("full-portfolio")
  const [expandedSections, setExpandedSections] = useState<string[]>(["AI Assistant"])
  const [activeLink, setActiveLink] = useState<string>("/ai-assistant")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const suggestions = [
    "Show me active pilots with high risk scores",
    "Summarize hydrogen storage technologies",
    "What technologies moved to operations this quarter?",
  ]

  // Get user initials
  const getUserInitials = (name: string | undefined) => {
    if (!name) return "U"
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleLinkClick = (href: string) => {
    setActiveLink(href)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const newMessage: Message = { role: "user", content: input }
    const updated = [...messages, newMessage]

    setMessages(updated)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          dataScope,
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to get response")
      }

      const data = await res.json()

      setMessages([...updated, { role: "assistant", content: data.reply || "No response received." }])
    } catch (err) {
      console.error("[v0] Chat error:", err)
      setMessages([...updated, { role: "assistant", content: "⚠️ Error getting response. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  function handleSuggestionClick(suggestion: string) {
    setInput(suggestion)
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Navigation Pane */}
      <aside className="w-72 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Layers className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">GridTech</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navigationSections.map((section) => {
              const Icon = section.icon
              const isExpanded = expandedSections.includes(section.title)

              return (
                <div key={section.title} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      <span>{section.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Section Items */}
                  {isExpanded && (
                    <div className="ml-6 space-y-1 border-l border-border pl-3">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => handleLinkClick(item.href)}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-colors",
                            activeLink === item.href
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {getUserInitials(user?.user_metadata?.full_name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {user?.user_metadata?.full_name || user?.email || "User"}
              </div>
              <div className="text-xs text-muted-foreground">
                {user?.user_metadata?.department || "Team Member"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Panel */}
      <main className="flex flex-col flex-1">
        {/* Header */}
        <header className="border-b border-border bg-card p-4">
          <h1 className="text-lg font-semibold text-foreground">Portfolio Intelligence Chat</h1>
          <p className="text-sm text-muted-foreground">Ask questions about pilots, technologies, and risks.</p>
        </header>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h2 className="text-xl font-semibold text-foreground mb-2">Welcome to GridTech AI</h2>
                <p className="text-muted-foreground mb-6">
                  Ask questions about your portfolio, technologies, pilots, and market intelligence.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Try asking:</p>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="block w-full text-left px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`p-4 max-w-xl ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </Card>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <Card className="p-4 bg-muted">
                <p className="text-sm text-muted-foreground">Analyzing portfolio data…</p>
              </Card>
            </div>
          )}
        </div>

        {/* Suggested Prompts - shown when there are messages */}
        {messages.length > 0 && (
          <div className="border-t border-border bg-card px-4 py-3">
            <div className="flex gap-2 flex-wrap">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="border-t border-border bg-card p-4">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question about your portfolio…"
              disabled={loading}
              className="flex-1 border border-border rounded-lg px-4 py-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <Button type="submit" disabled={loading || !input.trim()} size="lg">
              Send
            </Button>
          </div>
        </form>
      </main>

      {/* Right Context Panel */}
      <aside className="w-72 border-l border-border bg-card p-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-4">Context</h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Data Scope</label>
              <select
                value={dataScope}
                onChange={(e) => setDataScope(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="full-portfolio">Full Portfolio</option>
                <option value="pilots-only">Pilots Only</option>
                <option value="technology-library">Technology Library</option>
                <option value="risk-register">Risk Register</option>
              </select>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Sources Used</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Technologies
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Pilots
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Risk Register
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Market Intelligence
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Role-based access enforced. Sensitive fields are hidden based on your permissions.
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground mb-2">About</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This AI assistant uses your portfolio data to answer questions and provide insights about technologies,
            pilots, and market trends.
          </p>
        </div>
      </aside>
    </div>
  )
}
