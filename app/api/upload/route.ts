import { type NextRequest, NextResponse } from "next/server"

// Polyfill for DOMMatrix which is required by some PDF libraries in Node environments
if (typeof global.DOMMatrix === "undefined") {
  // @ts-ignore
  global.DOMMatrix = class DOMMatrix {
    constructor(init: any) {
      // Basic mock implementation
    }
  }
}

import PDFParser from "pdf2json"

// Helper function to extract text using pdf2json
async function extractTextFromPDF(buffer: Buffer): Promise<{ text: string; pageCount: number }> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true) // true = suppress error events/logs? actually usually it's used for something else. Let's use it as suggested by user but fix type.

    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError))
    pdfParser.on("pdfParser_dataReady", () => {
      const text = pdfParser.getRawTextContent()
      const pageCount = (pdfParser as any).pages?.length || 0
      resolve({ text, pageCount })
    })

    pdfParser.parseBuffer(buffer)
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Extract text using pdf2json
    const { text: textContent, pageCount } = await extractTextFromPDF(buffer)

    if (!textContent || textContent.trim().length === 0) {
      return NextResponse.json({
        error: "This document appears to be a scanned image or has complex formatting. For better results, please use a text-based PDF."
      }, { status: 400 })
    }

    // Chunking logic (700-1000 words per chunk)
    const words = textContent.split(/\s+/)
    const chunks: { id: string; text: string; pageRange: string }[] = []
    const wordsPerChunk = 850 // Targeting middle of 700-1000

    for (let i = 0; i < words.length; i += wordsPerChunk) {
      const chunkText = words.slice(i, i + wordsPerChunk).join(" ")
      const chunkId = `chunk-${chunks.length + 1}`

      // Since pdf-parse doesn't provide easy page mapping for text stream,
      // we estimate or use available metadata. For a more accurate page range,
      // deeper integration with pdf-parse's pagerender callback is needed.
      // For now, we'll provide a general range or metadata if available.
      chunks.push({
        id: chunkId,
        text: chunkText,
        pageRange: `Section ${chunks.length + 1}`, // Placeholder for specific page range
      })
    }

    return NextResponse.json({
      content: textContent,
      chunks: chunks,
      filename: file.name,
      size: file.size,
      pageCount: pageCount,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}
