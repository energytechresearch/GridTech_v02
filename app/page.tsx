import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, FileText, TrendingUp, Layers } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">GridTech</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#capabilities"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#platform"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Platform
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
            <Button variant="default" size="sm">
              Sign Up
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-primary"></span>
            Platform for New Grid Technologies
          </div>
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Unified platform to manage grid technology projects
          </h1>
          <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl leading-relaxed">
            Streamline intake, portfolio management, reporting, and market intelligence for IT, PMO, engineering, and
            leadership stakeholders across your organization.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="min-w-[200px] gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="container mx-auto px-6 py-20 md:py-28">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-4xl font-bold text-foreground md:text-5xl">
            Complete project management suite
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
            Everything your team needs to manage grid technology projects from inception to completion.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Project Intake</CardTitle>
              <CardDescription className="text-muted-foreground">
                Streamline project submission and approval workflows with automated routing and validation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Portfolio Management</CardTitle>
              <CardDescription className="text-muted-foreground">
                Gain comprehensive visibility into your project portfolio with real-time tracking and resource
                allocation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Advanced Reporting</CardTitle>
              <CardDescription className="text-muted-foreground">
                Generate executive-ready reports and dashboards with customizable metrics and KPIs.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-foreground">Market Intelligence</CardTitle>
              <CardDescription className="text-muted-foreground">
                Stay informed with competitive analysis, industry trends, and strategic insights.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section id="platform" className="container mx-auto px-6 py-20 md:py-28">
        <Card className="border-border bg-primary text-primary-foreground">
          <CardContent className="p-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
              Ready to transform your project management?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-primary-foreground/90 leading-relaxed">
              Join IT, PMO, and engineering teams already using GridTech to deliver grid technology projects faster and
              more efficiently.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="min-w-[200px] gap-2 bg-background text-foreground hover:bg-background/90"
              >
                Request Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Layers className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">GridTech</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Project management platform for New Grid Technologies.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 GridTech. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
