"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Layers, FileText, Database, TrendingUp, ChevronRight, ChevronDown, Send, FileCheck, List } from "lucide-react"
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

type FormData = {
  submitterName: string
  submitterEmail: string
  department: string
  ideaTitle: string
  gridLayer: string
  description: string
  benefits: string
  vendors: string
  category: string
  technologyType: string
}

const initialFormData: FormData = {
  submitterName: "",
  submitterEmail: "",
  department: "",
  ideaTitle: "",
  gridLayer: "",
  description: "",
  benefits: "",
  vendors: "",
  category: "",
  technologyType: "",
}

type Submission = {
  idea: string
  title: string
  status: string
  updated: string
}

type ReviewQueueItem = {
  idea: string
  submissionDate: string
  submitter: string
  department: string
  title: string
  category: string
  technologyType: string
  status: string
  feasibility: string
}

export default function IntakePage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["Technology Intake Portal"])
  const [activeLink, setActiveLink] = useState<string>("#submit-request")
  const [activeTab, setActiveTab] = useState<"submit" | "mine" | "queue">("submit")
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  const handleLinkClick = (href: string) => {
    setActiveLink(href)
    // Map href to tab
    if (href === "#submit-request") setActiveTab("submit")
    else if (href === "#my-submissions") setActiveTab("mine")
    else if (href === "#review-queue") setActiveTab("queue")
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Replace with Supabase insert
    console.log("Submitting new technology request", formData)
    alert("Request submitted successfully! (Database integration pending)")
    setFormData(initialFormData)
  }

  // Mock data - will be replaced with Supabase queries
  const mySubmissions: Submission[] = []

  const reviewQueue: ReviewQueueItem[] = [
    {
      idea: "NGT-001",
      submissionDate: "2026-01-01",
      submitter: "Jane Doe",
      department: "Grid Ops",
      title: "Edge Sensor Pilot",
      category: "Grid Monitoring",
      technologyType: "Hardware",
      status: "In Review",
      feasibility: "High",
    },
    {
      idea: "NGT-002",
      submissionDate: "2025-12-28",
      submitter: "John Smith",
      department: "Engineering",
      title: "Smart Meter Analytics Platform",
      category: "Data Analytics",
      technologyType: "Software",
      status: "Pending",
      feasibility: "Medium",
    },
    {
      idea: "NGT-003",
      submissionDate: "2025-12-25",
      submitter: "Sarah Johnson",
      department: "IT",
      title: "Grid Optimization AI",
      category: "Artificial Intelligence",
      technologyType: "Software",
      status: "Approved",
      feasibility: "High",
    },
  ]

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
            <h1 className="text-2xl font-bold text-foreground">Technology Intake Portal</h1>
            <p className="text-sm text-muted-foreground">
              Centralized portfolio of New Grid Technologies - manage Intake, Library, Pilots, and Market Intelligence
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => {
                setActiveTab("submit")
                setActiveLink("#submit-request")
              }}
              variant={activeTab === "submit" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "submit" && "bg-card hover:bg-muted")}
            >
              <Send className="h-4 w-4" />
              Submit New Technology Request
            </Button>
            <Button
              onClick={() => {
                setActiveTab("mine")
                setActiveLink("#my-submissions")
              }}
              variant={activeTab === "mine" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "mine" && "bg-card hover:bg-muted")}
            >
              <FileCheck className="h-4 w-4" />
              My Submissions
            </Button>
            <Button
              onClick={() => {
                setActiveTab("queue")
                setActiveLink("#review-queue")
              }}
              variant={activeTab === "queue" ? "default" : "outline"}
              className={cn("gap-2", activeTab !== "queue" && "bg-card hover:bg-muted")}
            >
              <List className="h-4 w-4" />
              Intake Review Queue
            </Button>
          </div>

          {/* Submit New Technology Request */}
          {activeTab === "submit" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Submit New Technology Request</CardTitle>
                <CardDescription>Provide details about the new grid technology you'd like to propose</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="submitterName">Submitter Name *</Label>
                      <Input
                        id="submitterName"
                        name="submitterName"
                        value={formData.submitterName}
                        onChange={handleFormChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="submitterEmail">Submitter Email *</Label>
                      <Input
                        id="submitterEmail"
                        name="submitterEmail"
                        type="email"
                        value={formData.submitterEmail}
                        onChange={handleFormChange}
                        placeholder="your.email@company.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleFormChange}
                        placeholder="e.g., IT, Engineering, Grid Ops"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ideaTitle">Title of the Idea *</Label>
                      <Input
                        id="ideaTitle"
                        name="ideaTitle"
                        value={formData.ideaTitle}
                        onChange={handleFormChange}
                        placeholder="Brief title for your technology concept"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gridLayer">Layer of the Grid System</Label>
                      <Input
                        id="gridLayer"
                        name="gridLayer"
                        value={formData.gridLayer}
                        onChange={handleFormChange}
                        placeholder="e.g., Transmission, Distribution, Generation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        placeholder="e.g., Grid Monitoring, Data Analytics"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="technologyType">Technology Type</Label>
                      <Input
                        id="technologyType"
                        name="technologyType"
                        value={formData.technologyType}
                        onChange={handleFormChange}
                        placeholder="e.g., Hardware, Software, IoT"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description of Technology Concept</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Provide a detailed description of the technology concept"
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="benefits">Summary of Benefits & Potential Value</Label>
                    <Textarea
                      id="benefits"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleFormChange}
                      placeholder="Describe the expected benefits and value proposition"
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendors">Known Vendor(s)</Label>
                    <Textarea
                      id="vendors"
                      name="vendors"
                      value={formData.vendors}
                      onChange={handleFormChange}
                      placeholder="List any vendors or suppliers you're aware of"
                      rows={2}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData(initialFormData)}
                      className="bg-card"
                    >
                      Reset Form
                    </Button>
                    <Button type="submit" className="gap-2">
                      <Send className="h-4 w-4" />
                      Submit Request
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* My Submissions */}
          {activeTab === "mine" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">My Submissions</CardTitle>
                <CardDescription>Track the status of your technology requests</CardDescription>
              </CardHeader>
              <CardContent>
                {mySubmissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileCheck className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-foreground mb-2">No submissions yet</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Submit your first technology request to get started
                    </p>
                    <Button
                      onClick={() => {
                        setActiveTab("submit")
                        setActiveLink("#submit-request")
                      }}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Create New Request
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Idea #</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                            Last Updated
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {mySubmissions.map((submission) => (
                          <tr key={submission.idea} className="border-b border-border hover:bg-muted/50">
                            <td className="py-3 px-4 text-sm text-foreground">{submission.idea}</td>
                            <td className="py-3 px-4 text-sm text-foreground">{submission.title}</td>
                            <td className="py-3 px-4">
                              <Badge variant="outline">{submission.status}</Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{submission.updated}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Intake Review Queue */}
          {activeTab === "queue" && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Intake Review Queue</CardTitle>
                <CardDescription>Review and evaluate submitted technology requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Idea #</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Submission Date
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Submitter</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Department</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Title of the Idea
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Technology Type
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                          Doability Score
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviewQueue.map((item) => (
                        <tr key={item.idea} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 text-sm font-medium text-foreground">{item.idea}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{item.submissionDate}</td>
                          <td className="py-3 px-4 text-sm text-foreground">{item.submitter}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{item.department}</td>
                          <td className="py-3 px-4 text-sm text-foreground">{item.title}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{item.category}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{item.technologyType}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={cn(
                                item.status === "Approved" && "bg-accent/10 text-accent border-accent",
                                item.status === "In Review" && "bg-chart-2/10 text-chart-2 border-chart-2",
                                item.status === "Pending" && "bg-muted text-muted-foreground",
                              )}
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={cn(
                                item.feasibility === "High" && "bg-accent/10 text-accent border-accent",
                                item.feasibility === "Medium" && "bg-chart-2/10 text-chart-2 border-chart-2",
                                item.feasibility === "Low" && "bg-destructive/10 text-destructive border-destructive",
                              )}
                            >
                              {item.feasibility}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Queue columns align with your schema. Database integration pending.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
