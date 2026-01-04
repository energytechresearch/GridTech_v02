"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronRight,
  Database,
  FileText,
  Layers,
  TrendingUp,
  Rocket,
  GitBranch,
  Lightbulb,
  Search,
  Calendar,
  MapPin,
  User,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
      { label: "Active Pilots", href: "#active-pilots" },
      { label: "Pilot Pipeline", href: "#pilot-pipeline" },
      { label: "Lessons Learned", href: "#lessons-learned" },
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
]

type Pilot = {
  id: string
  pilot_id: string
  technology_id: string | null
  title: string
  phase: string
  status: string
  sponsor: string
  start_date: string | null
  end_date: string | null
  location: string
  objectives: string
  progress: number
  lessons_learned: string | null
  created_at: string
  updated_at: string
}


export default function PilotsPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Pilot Management"])
  const [activeLink, setActiveLink] = useState<string>("#active-pilots")
  const [activeTab, setActiveTab] = useState<"active" | "pipeline" | "lessons">("active")
  const [search, setSearch] = useState("")
  const [pilots, setPilots] = useState<Pilot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPilots()
  }, [])

  const fetchPilots = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/pilots')
      if (!response.ok) throw new Error('Failed to fetch pilots')
      const data = await response.json()
      setPilots(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching pilots:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleLinkClick = (href: string) => {
    setActiveLink(href)
    // Map href to tab
    if (href === "#active-pilots") setActiveTab("active")
    else if (href === "#pilot-pipeline") setActiveTab("pipeline")
    else if (href === "#lessons-learned") setActiveTab("lessons")
  }

  // Filter pilots based on active tab and search
  const filtered = pilots.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.pilot_id.toLowerCase().includes(search.toLowerCase()) ||
      (p.technology_id && p.technology_id.toLowerCase().includes(search.toLowerCase())) ||
      p.sponsor.toLowerCase().includes(search.toLowerCase())

    if (activeTab === "active") return p.status === "active" && matchesSearch
    if (activeTab === "pipeline") return p.status === "pipeline" && matchesSearch
    if (activeTab === "lessons") return p.lessons_learned && p.lessons_learned.length > 0 && matchesSearch
    return matchesSearch
  })

  const getPhaseColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case "execution":
        return "bg-primary/10 text-primary border-primary/20"
      case "planning":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "initiation":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
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
                      {section.items.map((item) => {
                        const isExternalLink = item.href.startsWith('/')

                        if (isExternalLink) {
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "block rounded-md px-3 py-2 text-sm transition-colors",
                                activeLink === item.href
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              )}
                            >
                              {item.label}
                            </Link>
                          )
                        }

                        return (
                          <button
                            key={item.href}
                            onClick={() => handleLinkClick(item.href)}
                            className={cn(
                              "block w-full text-left rounded-md px-3 py-2 text-sm transition-colors",
                              activeLink === item.href
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {item.label}
                          </button>
                        )
                      })}
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
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">John Doe</div>
              <div className="text-xs text-muted-foreground">PMO Manager</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold text-foreground">Pilot Management Portal</h1>
            <p className="text-sm text-muted-foreground">
              Track Active Pilots, manage the Pilot Pipeline, and capture Lessons Learned across the New Grid Technology
              portfolio
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => {
                setActiveTab("active")
                setActiveLink("#active-pilots")
              }}
              variant={activeTab === "active" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "active" && "bg-card hover:bg-muted")}
            >
              <Rocket className="h-4 w-4" />
              Active Pilots
            </Button>
            <Button
              onClick={() => {
                setActiveTab("pipeline")
                setActiveLink("#pilot-pipeline")
              }}
              variant={activeTab === "pipeline" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "pipeline" && "bg-card hover:bg-muted")}
            >
              <GitBranch className="h-4 w-4" />
              Pilot Pipeline
            </Button>
            <Button
              onClick={() => {
                setActiveTab("lessons")
                setActiveLink("#lessons-learned")
              }}
              variant={activeTab === "lessons" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "lessons" && "bg-card hover:bg-muted")}
            >
              <Lightbulb className="h-4 w-4" />
              Lessons Learned
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="border-border mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pilots by title, ID, technology ID, or sponsor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pilots Grid */}
          {loading ? (
            <Card className="border-border">
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">Loading pilots...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-destructive mb-2">Error: {error}</p>
                <button
                  onClick={fetchPilots}
                  className="text-sm text-primary hover:underline"
                >
                  Try again
                </button>
              </CardContent>
            </Card>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pilot) => (
                <Card key={pilot.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {pilot.pilot_id}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs border", getPhaseColor(pilot.phase))}>
                        {pilot.phase.charAt(0).toUpperCase() + pilot.phase.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{pilot.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Database className="h-3 w-3" />
                      Technology: {pilot.technology_id || 'N/A'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate">{pilot.sponsor}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{pilot.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground col-span-2">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {pilot.start_date ? new Date(pilot.start_date).toLocaleDateString() : 'TBD'} → {pilot.end_date ? new Date(pilot.end_date).toLocaleDateString() : 'TBD'}
                        </span>
                      </div>
                    </div>

                    {activeTab !== "lessons" && (
                      <>
                        <div className="pt-2 border-t border-border">
                          <div className="flex items-start gap-1">
                            <Target className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-muted-foreground leading-relaxed">{pilot.objectives}</p>
                          </div>
                        </div>

                        {pilot.progress !== undefined && pilot.progress !== null && (
                          <div className="pt-2 border-t border-border">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium">Progress</span>
                              <span className="text-xs text-muted-foreground">{pilot.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${pilot.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {activeTab === "lessons" && pilot.lessons_learned && (
                      <div className="pt-2 border-t border-border">
                        <h4 className="text-xs font-semibold mb-1 flex items-center gap-1">
                          <Lightbulb className="h-3 w-3 text-primary" />
                          Lessons Learned
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{pilot.lessons_learned}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Rocket className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">No pilots found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  {search
                    ? "No pilots match your search criteria. Try adjusting your filters."
                    : activeTab === "active"
                      ? "There are currently no active pilots in execution."
                      : activeTab === "pipeline"
                        ? "The pilot pipeline is empty. Submit new technology requests to get started."
                        : "No lessons learned have been documented yet."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Info Footer */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Note:</strong> Pilot data includes Pilot ID, Technology ID, Sponsor, Phase, Status, Dates,
              Location, Objectives, and Lessons Learned. This schema maps directly to your Supabase pilot management
              table for seamless integration.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
