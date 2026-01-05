"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Layers,
  FileText,
  Database,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  Search,
  Tag,
  Archive,
  Grid3x3,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"
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

type Technology = {
  id: string
  tech_id: string
  title: string
  category: string
  tags: string[]
  status: string
  owner: string
  updated_at: string
  description: string
  type: string
  grid_layer: string | null
  benefits: string | null
  created_at: string
}


export default function LibraryPage() {
  const { user } = useUser()
  const [expandedSections, setExpandedSections] = useState<string[]>(["Technology Library"])
  const [activeLink, setActiveLink] = useState<string>("/library#all-technologies")
  const [activeTab, setActiveTab] = useState<"all" | "archived" | "tags">("all")
  const [search, setSearch] = useState("")
  const [filterTag, setFilterTag] = useState("")
  const [technologies, setTechnologies] = useState<Technology[]>([])
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
    fetchTechnologies()
  }, [])

  const fetchTechnologies = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/technologies')
      if (!response.ok) throw new Error('Failed to fetch technologies')
      const data = await response.json()
      setTechnologies(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching technologies:', err)
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
    if (href === "/library#all-technologies") setActiveTab("all")
    else if (href === "/library#archived-technologies") setActiveTab("archived")
    else if (href === "/library#tags-categories") setActiveTab("tags")
  }

  // Extract all unique tags
  const allTags = Array.from(new Set(technologies.flatMap((t) => t.tags))).sort()

  // Filter technologies based on active tab and filters
  const filtered = technologies.filter((t) => {
    const matchesTab = activeTab === "all" ? t.status === 'active' : t.status === 'archived'
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tech_id.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchesTag = !filterTag || t.tags.includes(filterTag)
    return (activeTab === "tags" ? true : matchesTab) && matchesSearch && matchesTag
  })

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
            <h1 className="text-2xl font-bold text-foreground">Technology Library</h1>
            <p className="text-sm text-muted-foreground">
              Centralized portfolio of New Grid Technologies - browse evaluated and in-flight technologies with tags &
              categories
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => {
                setActiveTab("all")
                setActiveLink("/library#all-technologies")
              }}
              variant={activeTab === "all" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "all" && "bg-card hover:bg-muted")}
            >
              <Database className="h-4 w-4" />
              All Technologies
            </Button>
            <Button
              onClick={() => {
                setActiveTab("archived")
                setActiveLink("/library#archived-technologies")
              }}
              variant={activeTab === "archived" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "archived" && "bg-card hover:bg-muted")}
            >
              <Archive className="h-4 w-4" />
              Archived / Evaluated
            </Button>
            <Button
              onClick={() => {
                setActiveTab("tags")
                setActiveLink("/library#tags-categories")
              }}
              variant={activeTab === "tags" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "tags" && "bg-card hover:bg-muted")}
            >
              <Tag className="h-4 w-4" />
              Tags & Categories
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <Card className="border-border">
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">Loading technologies...</p>
              </CardContent>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-destructive mb-4">Error: {error}</p>
                <Button onClick={fetchTechnologies} variant="outline">Retry</Button>
              </CardContent>
            </Card>
          )}

          {/* Search & Filter Bar - Show for All and Archived tabs */}
          {!loading && !error && activeTab !== "tags" && (
            <Card className="border-border mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10"
                      placeholder="Search by title, ID, or description"
                    />
                  </div>
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="px-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring w-full md:w-60"
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                  {(search || filterTag) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch("")
                        setFilterTag("")
                      }}
                      className="bg-card"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Technologies & Archived Views */}
          {!loading && !error && activeTab !== "tags" && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filtered.length} {activeTab === "all" ? "active" : "archived"} technolog
                  {filtered.length === 1 ? "y" : "ies"}
                </p>
              </div>

              {filtered.length === 0 ? (
                <Card className="border-border">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No technologies found</p>
                    <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((tech) => (
                    <Card key={tech.id} className="border-border hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {tech.tech_id}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {tech.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-foreground">{tech.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tech.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {tech.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-primary/5 text-primary text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-border text-xs text-muted-foreground">
                          <span>Owner: {tech.owner}</span>
                          <span>Updated: {new Date(tech.updated_at).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Tags & Categories Directory */}
          {!loading && !error && activeTab === "tags" && (
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Grid3x3 className="h-5 w-5 text-primary" />
                    Technology Taxonomy
                  </CardTitle>
                  <CardDescription>
                    Explore the technology taxonomy - select a tag to filter the library by that classification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* All Tags */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">All Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map((tag) => {
                          const count = technologies.filter((t) => t.tags.includes(tag)).length
                          return (
                            <Button
                              key={tag}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFilterTag(tag)
                                setActiveTab("all")
                                setActiveLink("/library#all-technologies")
                              }}
                              className="gap-2 bg-card hover:bg-primary/10 hover:text-primary hover:border-primary"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                              <Badge variant="secondary" className="ml-1 text-xs">
                                {count}
                              </Badge>
                            </Button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-3">Categories</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Array.from(new Set(technologies.map((t) => t.category)))
                          .sort()
                          .map((category) => {
                            const count = technologies.filter((t) => t.category === category).length
                            const activeTechs = technologies.filter(
                              (t) => t.category === category && t.status === "Active",
                            ).length
                            return (
                              <Card key={category} className="border-border hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-medium text-foreground text-sm">{category}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {count}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {activeTechs} active, {count - activeTechs} archived
                                  </p>
                                </CardContent>
                              </Card>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Technologies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">{technologies.length}</div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {technologies.filter((t) => t.status === 'active').length}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Archived</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-muted-foreground">
                      {technologies.filter((t) => t.status === 'archived').length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
