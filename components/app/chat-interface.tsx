"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2, FileText, Sparkles, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import type { Document } from "./app-layout"
import { searchChunks } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  selectedDocument: Document | null
  documents: Document[]
}

export function ChatInterface({ selectedDocument, documents }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    if (documents.length === 0) {
      toast.error("Please upload a document first")
      return
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)



    try {
      // Determine what content to search
      let searchPool = []
      if (selectedDocument) {
        searchPool = selectedDocument.chunks
      } else {
        searchPool = documents.flatMap((d) => d.chunks)
      }

      // Retrieve top relevant chunks
      const relevantChunks = searchChunks(userMessage.content, searchPool, 5)

      if (relevantChunks.length === 0) {
        // Fallback for very short documents or generic questions
        // If no relevant chunks found via keyword, send a sample or broader context if small
        const fallbackChunks = searchPool.slice(0, 3)
        relevantChunks.push(...fallbackChunks)
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.content,
          relevantChunks: relevantChunks,
          documentName: selectedDocument?.name || "All documents",
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      toast.error(error.message || "Failed to get answer. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const suggestedQuestions = [
    "What are the key deadlines mentioned?",
    "Summarize the main points",
    "What are the rules for attendance?",
    "List all important dates",
  ]

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Document Context Bar */}
      {selectedDocument && (
        <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center gap-2 shrink-0">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm">
            Asking about: <span className="font-medium">{selectedDocument.name}</span>
          </span>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="max-w-3xl mx-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Ask Your Documents</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {documents.length > 0
                  ? "Ask any question about your uploaded documents. The AI will find answers directly from the content."
                  : "Upload a document first, then ask questions about its content."}
              </p>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedQuestions.map((question) => (
                      <Button
                        key={question}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(question)}
                        className="text-xs"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`
                    relative group max-w-[85%] rounded-2xl px-4 py-3
                    ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}
                  `}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.role === "assistant" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -right-10 top-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleCopy(message.content, message.id)}
                    >
                      {copiedId === message.id ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyzing documents...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card shrink-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                documents.length > 0
                  ? "Ask a question about your documents..."
                  : "Upload a document to start asking questions..."
              }
              disabled={documents.length === 0 || isLoading}
              className="min-h-[56px] max-h-[200px] pr-14 resize-none"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading || documents.length === 0}
              className="absolute right-2 bottom-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </form>
      </div>
    </div>
  )
}
