import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface DocumentChunk {
  id: string
  text: string
  pageRange: string
}

export function searchChunks(query: string, chunks: DocumentChunk[], topK: number = 5): DocumentChunk[] {
  if (!query || !chunks.length) return []

  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2)

  const scoredChunks = chunks.map(chunk => {
    const chunkText = chunk.text.toLowerCase()
    let score = 0

    queryTerms.forEach(term => {
      if (chunkText.includes(term)) {
        score += 1
        // Bonus for exact occurrences
        const regex = new RegExp(`\\b${term}\\b`, 'g')
        const matches = chunkText.match(regex)
        if (matches) score += matches.length * 0.5
      }
    })

    return { chunk, score }
  })

  return scoredChunks
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk)
}
