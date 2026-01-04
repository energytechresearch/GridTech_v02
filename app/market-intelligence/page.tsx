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
  Search,
  AlertCircle,
  Building2,
  FileBarChart,
  Calendar,
  MapPin,
  Target,
  ExternalLink,
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
      { label: "Active Pilots", href: "/pilots#active-pilots" },
      { label: "Pilot Pipeline", href: "/pilots#pilot-pipeline" },
      { label: "Lessons Learned", href: "/pilots#lessons-learned" },
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

type WatchlistItem = {
  id: string
  technology: string
  vendor: string
  signal: string
  priority: string
  notes: string
  lastUpdated: string
}

type Vendor = {
  id: string
  name: string
  focus: string
  maturity: string
  region: string
  activePilots: number
  relatedTech: string[]
}

type Insight = {
  id: string
  title: string
  source: string
  date: string
  summary: string
  link: string
}

// Placeholder data - will be replaced with Supabase queries
const watchlist: WatchlistItem[] = [
  {
    id: "MI-001",
    technology: "Advanced Fault Location",
    vendor: "GridSense Labs",
    signal: "Emerging",
    priority: "High",
    notes: "Growing utility adoption in distribution automation pilots.",
    lastUpdated: "2025-12-18",
  },
  {
    id: "MI-007",
    technology: "Hydrogen Blending Sensors",
    vendor: "EnerTech Instruments",
    signal: "Monitoring",
    priority: "Medium",
    notes: "OEM partnerships under evaluation.",
    lastUpdated: "2025-10-02",
  },
  {
    id: "MI-012",
    technology: "AI-Powered Grid Analytics",
    vendor: "SmartGrid AI Corp",
    signal: "Mature",
    priority: "High",
    notes: "Multiple successful deployments across North America. Proven ROI.",
    lastUpdated: "2025-11-30",
  },
  {
    id: "MI-015",
    technology: "Dynamic Load Management",
    vendor: "PowerFlow Systems",
    signal: "Emerging",
    priority: "Medium",
    notes: "Field trials showing promising demand response capabilities.",
    lastUpdated: "2025-12-01",
  },
]

const vendors: Vendor[] = [
  {
    id: "V-102",
    name: "GridSense Labs",
    focus: "Grid Monitoring & Edge Analytics",
    maturity: "Growth",
    region: "North America",
    activePilots: 2,
    relatedTech: ["Edge Sensors", "Fault Detection"],
  },
  {
    id: "V-221",
    name: "EnerTech Instruments",
    focus: "Gas Infrastructure & Pipeline Sensors",
    maturity: "Early",
    region: "Europe",
    activePilots: 0,
    relatedTech: ["Hydrogen", "Instrumentation"],
  },
  {
    id: "V-305",
    name: "SmartGrid AI Corp",
    focus: "Machine Learning for Grid Operations",
    maturity: "Mature",
    region: "Global",
    activePilots: 3,
    relatedTech: ["AI/ML", "Predictive Analytics", "Optimization"],
  },
  {
    id: "V-412",
    name: "PowerFlow Systems",
    focus: "Demand Response & Load Control",
    maturity: "Growth",
    region: "North America",
    activePilots: 1,
    relatedTech: ["Load Management", "DR Programs"],
  },
]

const insights: Insight[] = [
  {
    id: "INS-301",
    title: "Utility Investment Trends in Grid Automation (2026 Outlook)",
    source: "Analyst Briefing",
    date: "2025-11-20",
    summary: "Capital flows shifting toward DER visibility, feeder automation, and substation analytics platforms.",
    link: "#",
  },
  {
    id: "INS-314",
    title: "Cybersecurity Considerations for AMI Modernization Programs",
    source: "Industry Report",
    date: "2025-09-14",
    summary: "Vendors increasingly embedding zero-trust patterns and secure telemetry pipelines into AMI stacks.",
    link: "#",
  },
  {
    id: "INS-320",
    title: "Renewable Integration Challenges in 2025: Lessons from Early Adopters",
    source: "Conference Presentation",
    date: "2025-10-08",
    summary:
      "Utilities face balancing challenges with high solar penetration. Energy storage and forecasting tools are critical enablers.",
    link: "#",
  },
  {
    id: "INS-328",
    title: "Emerging Hydrogen Infrastructure Standards",
    source: "Standards Body Update",
    date: "2025-12-15",
    summary:
      "New guidelines published for hydrogen blending in natural gas pipelines. Safety and measurement protocols defined.",
    link: "#",
  },
]

export default function MarketIntelligencePage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Market Intelligence Hub"])
  const [activeLink, setActiveLink] = useState<string>("#watchlist")
  const [activeTab, setActiveTab] = useState<"watchlist" | "vendors" | "insights">("watchlist")
  const [search, setSearch] = useState("")

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleLinkClick = (href: string) => {
    setActiveLink(href)
    // Map href to tab
    if (href === "#watchlist") setActiveTab("watchlist")
    else if (href === "#vendor-landscape") setActiveTab("vendors")
    else if (href === "#industry-insights") setActiveTab("insights")
  }

  // Filter data based on active tab and search
  const filteredWatchlist = watchlist.filter((item) => {
    const text = JSON.stringify(item).toLowerCase()
    return !search || text.includes(search.toLowerCase())
  })

  const filteredVendors = vendors.filter((item) => {
    const text = JSON.stringify(item).toLowerCase()
    return !search || text.includes(search.toLowerCase())
  })

  const filteredInsights = insights.filter((item) => {
    const text = JSON.stringify(item).toLowerCase()
    return !search || text.includes(search.toLowerCase())
  })

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case "Emerging":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "Monitoring":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "Mature":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "Medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "Low":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case "Mature":
        return "bg-primary/10 text-primary border-primary/20"
      case "Growth":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "Early":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
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
            <h1 className="text-2xl font-bold text-foreground">Market Intelligence Hub</h1>
            <p className="text-sm text-muted-foreground">
              Monitor the Technology Watchlist, assess the Vendor Landscape, and review Industry Insights across New
              Grid Technologies
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => {
                setActiveTab("watchlist")
                setActiveLink("#watchlist")
              }}
              variant={activeTab === "watchlist" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "watchlist" && "bg-card hover:bg-muted")}
            >
              <AlertCircle className="h-4 w-4" />
              Technology Watchlist
            </Button>
            <Button
              onClick={() => {
                setActiveTab("vendors")
                setActiveLink("#vendor-landscape")
              }}
              variant={activeTab === "vendors" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "vendors" && "bg-card hover:bg-muted")}
            >
              <Building2 className="h-4 w-4" />
              Vendor Landscape
            </Button>
            <Button
              onClick={() => {
                setActiveTab("insights")
                setActiveLink("#industry-insights")
              }}
              variant={activeTab === "insights" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "insights" && "bg-card hover:bg-muted")}
            >
              <FileBarChart className="h-4 w-4" />
              Industry Insights
            </Button>
          </div>

          {/* Search Bar */}
          <Card className="border-border mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search within current tab..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Technology Watchlist Tab */}
          {activeTab === "watchlist" && (
            <>
              {filteredWatchlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWatchlist.map((item) => (
                    <Card key={item.id} className="border-border hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.id}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs border", getSignalColor(item.signal))}>
                            {item.signal}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{item.technology}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Building2 className="h-3 w-3" />
                          Vendor: {item.vendor}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.notes}</p>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <Badge variant="outline" className={cn("border", getPriorityColor(item.priority))}>
                            Priority: {item.priority}
                          </Badge>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{item.lastUpdated}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                      <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No watchlist items found</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      {search
                        ? "No items match your search criteria. Try adjusting your filters."
                        : "The technology watchlist is empty. Add technologies to monitor market signals and trends."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Vendor Landscape Tab */}
          {activeTab === "vendors" && (
            <>
              {filteredVendors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVendors.map((vendor) => (
                    <Card key={vendor.id} className="border-border hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {vendor.id}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs border", getMaturityColor(vendor.maturity))}>
                            {vendor.maturity}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{vendor.name}</CardTitle>
                        <CardDescription className="text-xs">{vendor.focus}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>Region: {vendor.region}</span>
                        </div>
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs font-medium mb-2">Related Technologies:</p>
                          <div className="flex flex-wrap gap-2">
                            {vendor.relatedTech.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border">
                          <Target className="h-3 w-3" />
                          <span>Active Pilots: {vendor.activePilots}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No vendors found</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      {search
                        ? "No vendors match your search criteria. Try adjusting your filters."
                        : "The vendor landscape is empty. Add vendors to track partnerships and capabilities."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Industry Insights Tab */}
          {activeTab === "insights" && (
            <>
              {filteredInsights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInsights.map((insight) => (
                    <Card key={insight.id} className="border-border hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.id}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-muted">
                            {insight.source}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{insight.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          {insight.date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground leading-relaxed">{insight.summary}</p>
                        </div>
                        <a
                          href={insight.link}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          View source
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                      <FileBarChart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">No insights found</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      {search
                        ? "No insights match your search criteria. Try adjusting your filters."
                        : "No industry insights available. Add reports and briefings to stay informed on market trends."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Info Footer */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Note:</strong> Market intelligence data includes signals, priority levels, vendor maturity stages,
              related technologies, and insight sources. These fields align to common market-intelligence dimensions and
              map directly to your Supabase tables for seamless integration.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
