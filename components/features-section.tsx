import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUp, MessageSquare, Sparkles, FolderOpen } from "lucide-react"

const features = [
  {
    icon: FileUp,
    title: "Easy Document Upload",
    description: "Upload PDF files instantly. Support for syllabi, rules, circulars, notices, and more.",
  },
  {
    icon: MessageSquare,
    title: "Natural Language Q&A",
    description: "Ask questions in plain English. Get accurate, context-aware answers from your documents.",
  },
  {
    icon: Sparkles,
    title: "Smart Summaries",
    description: "Generate concise summaries highlighting deadlines, key rules, and important points.",
  },
  {
    icon: FolderOpen,
    title: "Organized Categories",
    description: "Organize documents by category: Academics, Clubs, Exams, and more.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Everything You Need to Understand Your Documents
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Powerful features designed for students and organizations to extract knowledge efficiently.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
