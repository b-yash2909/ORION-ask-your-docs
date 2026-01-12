"use client"

import { useState } from "react"
import { DocumentSidebar } from "./document-sidebar"
import { ChatInterface } from "./chat-interface"
import { DocumentUpload } from "./document-upload"
import { Button } from "@/components/ui/button"
import { FileText, Menu, X } from "lucide-react"
import Link from "next/link"

import { DocumentChunk } from "@/lib/utils"

export interface Document {
  id: string
  name: string
  category: string
  size: string
  content: string
  chunks: DocumentChunk[]
  uploadedAt: Date
  pageCount?: number
}

const AppLayout = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleDocumentUpload = (doc: Document) => {
    setDocuments((prev) => [...prev, doc])
    setSelectedDocument(doc)
    setShowUpload(false)
  }

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id))
    if (selectedDocument?.id === id) {
      setSelectedDocument(documents.length > 1 ? documents.find((d) => d.id !== id) || null : null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">AskYourDocs</span>
          </Link>
        </div>
        <Button onClick={() => setShowUpload(true)} size="sm">
          Upload PDF
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          fixed md:relative
          inset-y-14 md:inset-y-auto
          left-0
          w-72
          border-r border-border
          bg-card
          z-40
          transition-transform duration-200
          overflow-y-auto
        `}
        >
          <DocumentSidebar
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={(doc) => {
              setSelectedDocument(doc)
              setSidebarOpen(false)
            }}
            onDeleteDocument={handleDeleteDocument}
            onUploadClick={() => setShowUpload(true)}
          />
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-background/80 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface selectedDocument={selectedDocument} documents={documents} />
        </main>
      </div>

      {showUpload && <DocumentUpload onUpload={handleDocumentUpload} onClose={() => setShowUpload(false)} />}
    </div>
  )
}

export default AppLayout
