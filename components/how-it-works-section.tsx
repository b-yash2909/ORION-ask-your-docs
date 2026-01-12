const steps = [
  {
    number: "01",
    title: "Upload Your Documents",
    description: "Drag and drop your PDF files or browse to upload. Support for multiple documents.",
  },
  {
    number: "02",
    title: "Ask Your Questions",
    description: "Type your question in natural language. Our AI understands context and intent.",
  },
  {
    number: "03",
    title: "Get Instant Answers",
    description: "Receive accurate answers extracted directly from your documents with source references.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">How It Works</h2>
          <p className="mt-4 text-muted-foreground text-lg">Get started in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2" />
              )}
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                  <span className="text-2xl font-bold text-primary">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
