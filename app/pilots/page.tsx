"use client"

import type React from "react"

import { useState } from "react"
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
      { label: "Technology Watchlist", href: "#watchlist" },
      { label: "Vendor Landscape", href: "#vendor-landscape" },
      { label: "Industry Insights", href: "#industry-insights" },
    ],
  },
]

type Pilot = {
  id: string
  technologyId: string
  title: string
  phase: string
  status: string
  sponsor: string
  startDate: string
  endDate: string
  location: string
  objectives: string
  lessons: string
}

// Placeholder data - will be replaced with Supabase queries
const pilots: Pilot[] = [
  {
    id: "PILOT-101",
    technologyId: "NGT-001",
    title: "Edge Sensor Field Deployment",
    phase: "Execution",
    status: "Active",
    sponsor: "Grid Operations",
    startDate: "2025-10-15",
    endDate: "2026-03-20",
    location: "Feeder Zone A",
    objectives: "Improve outage detection speed and fault localization.",
    lessons: "Initial calibration required site-specific tuning.",
  },
  {
    id: "PILOT-102",
    technologyId: "NGT-003",
    title: "Advanced Metering Analytics",
    phase: "Planning",
    status: "Pipeline",
    sponsor: "Data Strategy",
    startDate: "2026-01-15",
    endDate: "2026-06-30",
    location: "District 5",
    objectives: "Evaluate predictive maintenance capabilities using meter data patterns.",
    lessons: "",
  },
  {
    id: "PILOT-103",
    technologyId: "NGT-007",
    title: "Grid Storage Integration Test",
    phase: "Execution",
    status: "Active",
    sponsor: "Innovation Team",
    startDate: "2025-08-01",
    endDate: "2026-01-31",
    location: "Substation 12",
    objectives: "Test battery storage integration with existing grid infrastructure.",
    lessons: "Weather conditions significantly impact performance metrics.",
  },
  {
    id: "PILOT-204",
    technologyId: "NGT-014",
    title: "AMI Analytics Insights Trial",
    phase: "Completed",
    status: "Completed",
    sponsor: "Data Strategy",
    startDate: "2025-04-01",
    endDate: "2025-09-10",
    location: "Systemwide",
    objectives: "Evaluate anomaly detection for meter events.",
    lessons:
      "Value dependent on upstream data quality controls. Recommend establishing data governance framework before scaling.",
  },
  {
    id: "PILOT-205",
    technologyId: "NGT-009",
    title: "Smart Grid Communication Protocol",
    phase: "Initiation",
    status: "Pipeline",
    sponsor: "Engineering",
    startDate: "2026-02-01",
    endDate: "2026-08-15",
    location: "Test Lab",
    objectives: "Validate new communication protocols for grid devices.",
    lessons: "",
  },
  {
    id: "PILOT-206",
    technologyId: "NGT-012",
    title: "Renewable Integration Study",
    phase: "Completed",
    status: "Completed",
    sponsor: "Renewables Team",
    startDate: "2024-11-01",
    endDate: "2025-05-30",
    location: "Solar Farm A",
    objectives: "Assess grid stability with increased solar penetration.",
    lessons:
      "Forecasting accuracy improved with machine learning models. Need better tools for real-time grid balancing.",
  },
]

export default function PilotsPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Pilot Management"])
  const [activeLink, setActiveLink] = useState<string>("#active-pilots")
  const [activeTab, setActiveTab] = useState<"active" | "pipeline" | "lessons">("active")
  const [search, setSearch] = useState("")

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
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.technologyId.toLowerCase().includes(search.toLowerCase()) ||
      p.sponsor.toLowerCase().includes(search.toLowerCase())

    if (activeTab === "active") return p.status === "Active" && matchesSearch
    if (activeTab === "pipeline") return p.status === "Pipeline" && matchesSearch
    if (activeTab === "lessons") return p.lessons && p.lessons.length > 0 && matchesSearch
    return matchesSearch
  })

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "Execution":
        return "bg-primary/10 text-primary border-primary/20"
      case "Planning":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "Initiation":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "Completed":
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
                      {section.items.map((item) => (
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
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((pilot) => (
                <Card key={pilot.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {pilot.id}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs border", getPhaseColor(pilot.phase))}>
                        {pilot.phase}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{pilot.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Database className="h-3 w-3" />
                      Technology: {pilot.technologyId}
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
                          {pilot.startDate} → {pilot.endDate}
                        </span>
                      </div>
                    </div>

                    {activeTab !== "lessons" && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-start gap-1">
                          <Target className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground leading-relaxed">{pilot.objectives}</p>
                        </div>
                      </div>
                    )}

                    {activeTab === "lessons" && pilot.lessons && (
                      <div className="pt-2 border-t border-border">
                        <h4 className="text-xs font-semibold mb-1 flex items-center gap-1">
                          <Lightbulb className="h-3 w-3 text-primary" />
                          Lessons Learned
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{pilot.lessons}</p>
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
