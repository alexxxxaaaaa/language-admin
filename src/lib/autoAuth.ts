import { http, setToken } from './http'
import type { AuthUser, LoginResponse } from '@/types/api'

const ADMIN_USERNAME = 'zyd'
const ADMIN_PASSWORD = 'zyd370710'

async function tryLogin(): Promise<AuthUser | null> {
  try {
    const { data } = await http.post<LoginResponse>(
      '/api/auth/login',
      { username: ADMIN_USERNAME, password: ADMIN_PASSWORD },
      { headers: { 'x-silent': '1' } },
    )
    setToken(data.token)
    return data.user
  } catch {
    return null
  }
}

async function tryRegister(): Promise<AuthUser | null> {
  try {
    const { data } = await http.post<LoginResponse>(
      '/api/auth/register',
      { username: ADMIN_USERNAME, password: ADMIN_PASSWORD },
      { headers: { 'x-silent': '1' } },
    )
    setToken(data.token)
    return data.user
  } catch {
    return null
  }
}

export async function autoAuth(): Promise<AuthUser | null> {
  const loggedIn = await tryLogin()
  if (loggedIn) return loggedIn
  const registered = await tryRegister()
  if (registered) return registered
  // 第二次 login 兜底（注册时偶发 race）
  return tryLogin()
}
