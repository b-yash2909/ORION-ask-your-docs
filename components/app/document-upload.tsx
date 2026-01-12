"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Document } from "./app-layout"

interface DocumentUploadProps {
  onUpload: (doc: Document) => void
  onClose: () => void
}

const categories = [
  { value: "academics", label: "Academics" },
  { value: "clubs", label: "Clubs" },
  { value: "exams", label: "Exams" },
  { value: "other", label: "Other" },
]

export function DocumentUpload({ onUpload, onClose }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState("academics")
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile)
    } else {
      toast.error("Please upload a PDF file")
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile)
    } else {
      toast.error("Please upload a PDF file")
    }
  }

  const [processingStatus, setProcessingStatus] = useState<string>("")

  const handleUpload = async () => {
    if (!file) return

    setIsProcessing(true)
    setProcessingStatus("Uploading to server...")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", category)

      setProcessingStatus("Extracting text and indexing...")
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to process document")
      }

      const data = await response.json()
      setProcessingStatus("Finalizing...")

      const doc: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        category,
        size: formatFileSize(file.size),
        content: data.content,
        chunks: data.chunks || [],
        uploadedAt: new Date(),
        pageCount: data.pageCount,
      }

      onUpload(doc)
      toast.success(`Document processed: ${data.chunks?.length || 0} chunks indexed.`)
    } catch (error: any) {
      toast.error(error.message || "Failed to process document. Please try again.")
    } finally {
      setIsProcessing(false)
      setProcessingStatus("")
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upload Document</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drop Zone */}
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragActive ? "border-primary bg-primary/5" : "border-border"}
              ${file ? "border-primary/50" : ""}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="ml-2">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">Drop your PDF here or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports PDF files up to 10MB</p>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {processingStatus || "Processing..."}
                </>
              ) : (
                "Upload & Process"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
