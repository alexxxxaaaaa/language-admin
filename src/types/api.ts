export interface AuthUser {
  id: string
  username: string
  createdAt?: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export interface Folder {
  id: string
  name: string
  language: string
  wordCount?: number
}

export interface Word {
  id: string
  word: string
  reading: string
  meaning: string
  example: string
  note: string
  partOfSpeech: string
  language: string
  folderId: string
  sourceNoteId?: string | null
  createdAt: string
  folder?: { id: string; name: string; language: string }
  review?: {
    interval: number
    repetition: number
    easeFactor: number
    nextReviewDate: string
    lastReviewedAt: string | null
  } | null
}

export interface Note {
  id: string
  title: string
  content: string
  course: string
  lesson: string
  createdAt: string
}

export interface ExpressionFolder {
  id: string
  name: string
  language: string
}

export interface Expression {
  id: string
  zhText: string
  enCasual: string
  jpCasual: string
  sceneTag: string
  note: string
  isMastered: boolean
  folderId: string
  createdAt: string
  updatedAt: string
}

export interface AiUsageDay {
  date: string
  totalTokens: number
  promptTokens: number
  completionTokens: number
  count: number
}

export interface AiUsageSummary {
  days: AiUsageDay[]
  total: {
    totalTokens: number
    promptTokens: number
    completionTokens: number
    count: number
  }
  budget?: { daily: number; usedToday: number }
}
