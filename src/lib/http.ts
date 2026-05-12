import axios, { AxiosError } from 'axios'
import { message } from 'antd'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

export const http = axios.create({
  baseURL,
  timeout: 20_000,
})

const TOKEN_KEY = 'language-admin:token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

http.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (resp) => resp,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status
    const msg = error.response?.data?.message ?? error.message ?? '请求失败'
    if (status === 401) {
      clearToken()
      // 不自动跳转，交给应用层（auto-login）处理
    }
    if (!error.config?.headers?.['x-silent']) {
      message.error(msg)
    }
    return Promise.reject(error)
  },
)
