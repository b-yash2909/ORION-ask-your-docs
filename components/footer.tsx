import Link from "next/link"
import { FileText } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">AskYourDocs</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="/app" className="hover:text-foreground transition-colors">
              App
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">Powered by Google Gemini AI</p>
        </div>
      </div>
    </footer>
  )
}
