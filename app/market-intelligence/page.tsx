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
  Search,
  AlertCircle,
  Building2,
  FileBarChart,
  Calendar,
  MapPin,
  Target,
  ExternalLink,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/lib/auth/hooks"

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

type WatchlistItem = {
  id: string
  watchlist_id: string
  technology: string
  vendor: string
  signal: string
  priority: string
  notes: string
  updated_at: string
  created_at: string
}

type Vendor = {
  id: string
  vendor_id: string
  name: string
  focus: string
  maturity: string
  region: string
  active_pilots: number
  related_technologies: string[]
  created_at: string
  updated_at: string
}

type Insight = {
  id: string
  insight_id: string
  title: string
  source: string
  date: string
  summary: string
  url: string
  created_at: string
  updated_at: string
}


export default function MarketIntelligencePage() {
  const { user } = useUser()
  const [expandedSections, setExpandedSections] = useState<string[]>(["Market Intelligence Hub"])
  const [activeLink, setActiveLink] = useState<string>("/market-intelligence#watchlist")
  const [activeTab, setActiveTab] = useState<"watchlist" | "vendors" | "insights">("watchlist")
  const [search, setSearch] = useState("")

  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get user initials
  const getUserInitials = (name: string | undefined) => {
    if (!name) return "U"
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  useEffect(() => {
    fetchMarketData()
  }, [])

  const fetchMarketData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [watchlistRes, vendorsRes, insightsRes] = await Promise.all([
        fetch('/api/market/watchlist'),
        fetch('/api/market/vendors'),
        fetch('/api/market/insights')
      ])

      if (!watchlistRes.ok || !vendorsRes.ok || !insightsRes.ok) {
        throw new Error('Failed to fetch market data')
      }

      const [watchlistData, vendorsData, insightsData] = await Promise.all([
        watchlistRes.json(),
        vendorsRes.json(),
        insightsRes.json()
      ])

      setWatchlist(watchlistData)
      setVendors(vendorsData)
      setInsights(insightsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching market data:', err)
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
    if (href === "/market-intelligence#watchlist") setActiveTab("watchlist")
    else if (href === "/market-intelligence#vendor-landscape") setActiveTab("vendors")
    else if (href === "/market-intelligence#industry-insights") setActiveTab("insights")
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
                setActiveLink("/market-intelligence#watchlist")
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
                setActiveLink("/market-intelligence#vendor-landscape")
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
                setActiveLink("/market-intelligence#industry-insights")
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
              {loading ? (
                <Card className="border-border">
                  <CardContent className="flex items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">Loading watchlist...</p>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-sm text-destructive mb-2">Error: {error}</p>
                    <button
                      onClick={fetchMarketData}
                      className="text-sm text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </CardContent>
                </Card>
              ) : filteredWatchlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWatchlist.map((item) => (
                    <Card key={item.id} className="border-border hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {item.watchlist_id}
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
                            <span>{new Date(item.updated_at).toLocaleDateString()}</span>
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
              {loading ? (
                <Card className="border-border">
                  <CardContent className="flex items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">Loading vendors...</p>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-sm text-destructive mb-2">Error: {error}</p>
                    <button
                      onClick={fetchMarketData}
                      className="text-sm text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </CardContent>
                </Card>
              ) : filteredVendors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVendors.map((vendor) => (
                    <Card key={vendor.id} className="border-border hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {vendor.vendor_id}
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
                            {vendor.related_technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-border">
                          <Target className="h-3 w-3" />
                          <span>Active Pilots: {vendor.active_pilots}</span>
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
              {loading ? (
                <Card className="border-border">
                  <CardContent className="flex items-center justify-center py-12">
                    <p className="text-sm text-muted-foreground">Loading insights...</p>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-sm text-destructive mb-2">Error: {error}</p>
                    <button
                      onClick={fetchMarketData}
                      className="text-sm text-primary hover:underline"
                    >
                      Try again
                    </button>
                  </CardContent>
                </Card>
              ) : filteredInsights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInsights.map((insight) => (
                    <Card key={insight.id} className="border-border hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {insight.insight_id}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-muted">
                            {insight.source}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{insight.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs">
                          <Calendar className="h-3 w-3" />
                          {new Date(insight.date).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground leading-relaxed">{insight.summary}</p>
                        </div>
                        <a
                          href={insight.url}
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
