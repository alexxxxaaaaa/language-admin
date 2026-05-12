import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '@/store/auth'
import { getToken } from '@/lib/http'
import LoginPage from '@/pages/Login'
import AdminLayout from '@/layouts/AdminLayout'
import DashboardPage from '@/pages/Dashboard'
import FoldersPage from '@/pages/Folders'
import WordsPage from '@/pages/Words'
import NotesPage from '@/pages/Notes'
import ExpressionFoldersPage from '@/pages/ExpressionFolders'
import ExpressionsPage from '@/pages/Expressions'
import AiUsagePage from '@/pages/AiUsage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  if (loading && !user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe)

  useEffect(() => {
    if (getToken()) {
      fetchMe()
    }
  }, [fetchMe])

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="folders" element={<FoldersPage />} />
        <Route path="words" element={<WordsPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="expression-folders" element={<ExpressionFoldersPage />} />
        <Route path="expressions" element={<ExpressionsPage />} />
        <Route path="ai-usage" element={<AiUsagePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
