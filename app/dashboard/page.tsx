"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Layers,
  FileText,
  Database,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Users,
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
]

type DashboardStats = {
  activeProjects: number
  completed: number
  pendingReview: number
  atRisk: number
}

type Submission = {
  id: string
  submission_id: string
  technology_name: string
  status: string
  created_at: string
  updated_at: string
}

type Pilot = {
  id: string
  pilot_id: string
  title: string
  progress: number
  sponsor: string
  status: string
}

export default function DashboardPage() {
  const { user } = useUser()
  const [expandedSections, setExpandedSections] = useState<string[]>(["Technology Intake Portal"])
  const [activeLink, setActiveLink] = useState<string>("")

  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    completed: 0,
    pendingReview: 0,
    atRisk: 0
  })
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([])
  const [activePilots, setActivePilots] = useState<Pilot[]>([])
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
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, submissionsRes, pilotsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/intake'),
        fetch('/api/pilots')
      ])

      if (!statsRes.ok || !submissionsRes.ok || !pilotsRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const [statsData, submissionsData, pilotsData] = await Promise.all([
        statsRes.json(),
        submissionsRes.json(),
        pilotsRes.json()
      ])

      setStats(statsData)
      // Get latest 3 submissions
      setRecentSubmissions(submissionsData.slice(0, 3))
      // Get latest 3 active pilots
      const activeOnly = pilotsData.filter((p: Pilot) => p.status === 'active').slice(0, 3)
      setActivePilots(activeOnly)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleLinkClick = (href: string) => {
    setActiveLink(href)
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
            <h1 className="text-2xl font-bold text-foreground">Portfolio Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's an overview of your portfolio.</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Grid */}
          {loading ? (
            <Card className="border-border mb-8">
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-sm text-muted-foreground">Loading dashboard...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-border mb-8">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-sm text-destructive mb-2">Error: {error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="text-sm text-primary hover:underline"
                >
                  Try again
                </button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.activeProjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">Currently in execution</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.completed}</div>
                  <p className="text-xs text-muted-foreground mt-1">Successfully finished</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.pendingReview}</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting evaluation</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">At Risk</CardTitle>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.atRisk}</div>
                  <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Portfolio Overview Cards */}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Submissions</CardTitle>
                  <CardDescription>Latest technology intake requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentSubmissions.length > 0 ? (
                    <div className="space-y-4">
                      {recentSubmissions.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{item.technology_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "text-xs font-medium px-2.5 py-0.5 rounded-full capitalize",
                              item.status === "approved" && "bg-accent/10 text-accent",
                              item.status === "in-review" && "bg-chart-2/10 text-chart-2",
                              item.status === "pending" && "bg-muted text-muted-foreground",
                            )}
                          >
                            {item.status.replace('-', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No recent submissions</p>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Active Pilots</CardTitle>
                  <CardDescription>Currently running pilot programs</CardDescription>
                </CardHeader>
                <CardContent>
                  {activePilots.length > 0 ? (
                    <div className="space-y-4">
                      {activePilots.map((pilot) => (
                        <div key={pilot.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-foreground">{pilot.title}</p>
                            <span className="text-xs text-muted-foreground">{pilot.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${pilot.progress}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>Sponsor: {pilot.sponsor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No active pilots</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription>Common tasks and workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm">Submit Request</span>
                </Button>
                <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm">View Reports</span>
                </Button>
                <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
                  <Database className="h-4 w-4" />
                  <span className="text-sm">Browse Library</span>
                </Button>
                <Button variant="outline" className="justify-start gap-2 h-auto py-3 bg-transparent">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Market Insights</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
