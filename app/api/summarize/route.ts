import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { documentContent, documentName } = await request.json()

    if (!documentContent) {
      return NextResponse.json({ error: "Missing document content" }, { status: 400 })
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    })

    const systemPrompt = `Summarize the following document content.

Document: "${documentName}"

CONTENT:
${documentContent}`

    const { text } = await generateText({
      model: google("gemini-flash-latest"),
      prompt: systemPrompt,
    })

    return NextResponse.json({ summary: text })
  } catch (error) {
    console.error("Summarize error:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
