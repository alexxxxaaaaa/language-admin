import { http } from '@/lib/http'
import type {
  AiUsageSummary,
  Expression,
  ExpressionFolder,
  Folder,
  Note,
  Word,
} from '@/types/api'

export const foldersApi = {
  list: () => http.get<Folder[]>('/api/folders').then((r) => r.data),
  create: (data: { name: string; language: string }) =>
    http.post<Folder>('/api/folders', data).then((r) => r.data),
  update: (id: string, data: { name?: string; language?: string }) =>
    http.patch<Folder>(`/api/folders/${id}`, data).then((r) => r.data),
  remove: (id: string) =>
    http.delete<{ ok: boolean }>(`/api/folders/${id}`).then((r) => r.data),
}

export const wordsApi = {
  list: (params?: { folderId?: string; q?: string }) =>
    http.get<Word[]>('/api/words', { params }).then((r) => r.data),
  create: (data: Partial<Word> & { word: string; folderId: string }) =>
    http.post<Word>('/api/words', data).then((r) => r.data),
  update: (id: string, data: Partial<Word>) =>
    http.patch<Word>(`/api/words/${id}`, data).then((r) => r.data),
  remove: (id: string) =>
    http.delete<{ ok: boolean }>(`/api/words/${id}`).then((r) => r.data),
}

export const notesApi = {
  list: () => http.get<Note[]>('/api/notes').then((r) => r.data),
  detail: (id: string) => http.get<Note>(`/api/notes/${id}`).then((r) => r.data),
  create: (data: { title: string; content: string; course?: string; lesson?: string }) =>
    http.post<Note>('/api/notes', data).then((r) => r.data),
  update: (id: string, data: Partial<Note>) =>
    http.patch<Note>(`/api/notes/${id}`, data).then((r) => r.data),
}

export const expressionFoldersApi = {
  list: () =>
    http.get<ExpressionFolder[]>('/api/expressions/folders').then((r) => r.data),
  create: (data: { name: string; language: string }) =>
    http
      .post<ExpressionFolder>('/api/expressions/folders', data)
      .then((r) => r.data),
}

export const expressionsApi = {
  list: (params?: {
    q?: string
    folderId?: string
    sceneTag?: string
    isMastered?: boolean
  }) => http.get<Expression[]>('/api/expressions', { params }).then((r) => r.data),
  create: (data: Partial<Expression> & { zhText: string; folderId: string }) =>
    http.post<Expression>('/api/expressions', data).then((r) => r.data),
  update: (id: string, data: Partial<Expression>) =>
    http.patch<Expression>(`/api/expressions/${id}`, data).then((r) => r.data),
  remove: (id: string) =>
    http.delete<{ ok: boolean }>(`/api/expressions/${id}`).then((r) => r.data),
}

export const aiApi = {
  usage: (days = 14) =>
    http
      .get<AiUsageSummary>('/api/ai/usage', { params: { days } })
      .then((r) => r.data),
}
