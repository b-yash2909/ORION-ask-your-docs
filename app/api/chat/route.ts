import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { question, documentName, relevantChunks } = await request.json()

    if (!question || !relevantChunks || !Array.isArray(relevantChunks)) {
      return NextResponse.json({ error: "Missing required fields or invalid chunks" }, { status: 400 })
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })

    const context = relevantChunks.map((chunk: any) =>
      `[Source: ${chunk.pageRange}]\n${chunk.text}`
    ).join("\n\n---\n\n")

    const systemPrompt = `You are "AskYourDocs", an AI assistant. Answer the user's question STRICTLY using the provided document context.
    
Document Name: "${documentName}"

CONTEXT FROM DOCUMENT:
${context}

INSTRUCTIONS:
1. Answer the question using ONLY the provided context.
2. If the answer is not in the context, say: "Not mentioned in the document."
3. At the end of your answer, list the specific sources used (e.g., "Sources: Section 1, Section 5").
4. Be concise and accurate.`

    const { text } = await generateText({
      model: google("gemini-flash-latest"),
      system: systemPrompt,
      prompt: question,
    })

    return NextResponse.json({ answer: text })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
