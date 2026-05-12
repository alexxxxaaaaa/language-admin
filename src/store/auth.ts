import { create } from 'zustand'
import { http, clearToken } from '@/lib/http'
import { autoAuth } from '@/lib/autoAuth'
import type { AuthUser } from '@/types/api'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  ready: boolean
  bootstrap: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  ready: false,

  async bootstrap() {
    set({ loading: true })
    try {
      // 先尝试用 localStorage 里的 token 拉一下 /me
      try {
        const { data } = await http.get<AuthUser>('/api/auth/me', {
          headers: { 'x-silent': '1' },
        })
        set({ user: data })
        return
      } catch {
        // token 不存在 / 过期，走自动登录
      }
      const user = await autoAuth()
      set({ user })
    } finally {
      set({ loading: false, ready: true })
    }
  },

  logout() {
    clearToken()
    set({ user: null })
  },
}))
