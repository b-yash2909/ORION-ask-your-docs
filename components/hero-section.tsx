import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Powered by Google Gemini AI</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
            Get Instant Answers from Your Documents
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Upload PDFs like syllabi, rules, circulars, and notices. Ask questions in plain English and get accurate
            answers powered by AI.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app">
              <Button size="lg" className="gap-2 text-base px-8">
                Start Asking Questions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base px-8 bg-transparent">
                See How it Works
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 md:mt-24 mx-auto max-w-5xl">
          <div className="relative rounded-xl border border-border bg-card shadow-2xl shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-10 bg-muted flex items-center gap-2 px-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-chart-4/60" />
                <div className="h-3 w-3 rounded-full bg-primary/60" />
              </div>
            </div>
            <div className="pt-10 p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-2">Uploaded Document</p>
                    <div className="flex items-center gap-3 p-3 rounded-md bg-background border border-border">
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">PDF</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Course_Syllabus_2024.pdf</p>
                        <p className="text-xs text-muted-foreground">2.4 MB</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <p className="text-sm font-medium mb-2">AI Response</p>
                    <div className="space-y-3">
                      <div className="p-3 rounded-md bg-background border border-border">
                        <p className="text-sm text-muted-foreground">What is the deadline for project submission?</p>
                      </div>
                      <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
                        <p className="text-sm">
                          The project submission deadline is{" "}
                          <span className="font-semibold text-primary">March 15, 2024</span>. Late submissions will
                          incur a 10% penalty per day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
