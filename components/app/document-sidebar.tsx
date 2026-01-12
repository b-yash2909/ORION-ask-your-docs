"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Trash2, Upload, GraduationCap, Users, ClipboardList } from "lucide-react"
import type { Document } from "./app-layout"

interface DocumentSidebarProps {
  documents: Document[]
  selectedDocument: Document | null
  onSelectDocument: (doc: Document) => void
  onDeleteDocument: (id: string) => void
  onUploadClick: () => void
}

const categoryIcons: Record<string, React.ElementType> = {
  academics: GraduationCap,
  clubs: Users,
  exams: ClipboardList,
}

export function DocumentSidebar({
  documents,
  selectedDocument,
  onSelectDocument,
  onDeleteDocument,
  onUploadClick,
}: DocumentSidebarProps) {
  const groupedDocuments = documents.reduce(
    (acc, doc) => {
      const category = doc.category || "other"
      if (!acc[category]) acc[category] = []
      acc[category].push(doc)
      return acc
    },
    {} as Record<string, Document[]>,
  )

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <Button onClick={onUploadClick} className="w-full gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
              <p className="text-xs text-muted-foreground mt-1">Upload a PDF to get started</p>
            </div>
          ) : (
            Object.entries(groupedDocuments).map(([category, docs]) => {
              const Icon = categoryIcons[category] || FileText
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</h3>
                  </div>
                  <div className="space-y-2">
                    {docs.map((doc) => (
                      <div
                        key={doc.id}
                        className={`
                          group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                          ${selectedDocument?.id === doc.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted border border-transparent"
                          }
                        `}
                        onClick={() => onSelectDocument(doc)}
                      >
                        <div className="h-9 w-9 rounded bg-muted flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-semibold text-muted-foreground">PDF</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{doc.size}</span>
                            {doc.pageCount && (
                              <>
                                <span>•</span>
                                <span>{doc.pageCount} pages</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteDocument(doc.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
