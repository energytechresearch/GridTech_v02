"use client"

import type React from "react"

import { useState } from "react"
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
      { label: "Submit New Technology Request", href: "#submit-request" },
      { label: "My Submissions", href: "#my-submissions" },
      { label: "Intake Review Queue", href: "#review-queue" },
    ],
  },
  {
    title: "Technology Library",
    icon: Database,
    items: [
      { label: "All Technologies", href: "#all-technologies" },
      { label: "Archived / Evaluated Technologies", href: "#archived-technologies" },
      { label: "Tags & Categories", href: "#tags-categories" },
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

export default function DashboardPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Technology Intake Portal"])
  const [activeLink, setActiveLink] = useState<string>("")

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
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault()
                            handleLinkClick(item.href)
                          }}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-colors",
                            activeLink === item.href
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          {item.label}
                        </a>
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
            <h1 className="text-2xl font-bold text-foreground">Portfolio Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's an overview of your portfolio.</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Projects</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">42</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">18</div>
                <p className="text-xs text-muted-foreground mt-1">+3 this quarter</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">7</div>
                <p className="text-xs text-muted-foreground mt-1">2 urgent items</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">At Risk</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">3</div>
                <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Overview Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Submissions</CardTitle>
                <CardDescription>Latest technology intake requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Advanced Metering Infrastructure", date: "2 hours ago", status: "Under Review" },
                    { name: "Grid Energy Storage System", date: "1 day ago", status: "Approved" },
                    { name: "Smart Grid Analytics Platform", date: "3 days ago", status: "Pending" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-0.5 rounded-full",
                          item.status === "Approved" && "bg-accent/10 text-accent",
                          item.status === "Under Review" && "bg-chart-2/10 text-chart-2",
                          item.status === "Pending" && "bg-muted text-muted-foreground",
                        )}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Active Pilots</CardTitle>
                <CardDescription>Currently running pilot programs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "EV Charging Infrastructure Pilot", progress: 75, team: "8 members" },
                    { name: "Microgrid Control System", progress: 45, team: "5 members" },
                    { name: "Renewable Integration Platform", progress: 90, team: "12 members" },
                  ].map((item, idx) => (
                    <div key={idx} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">{item.name}</p>
                        <span className="text-xs text-muted-foreground">{item.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>{item.team}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

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
