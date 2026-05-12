import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Result, Spin } from 'antd'
import { useAuthStore } from '@/store/auth'
import AdminLayout from '@/layouts/AdminLayout'
import DashboardPage from '@/pages/Dashboard'
import FoldersPage from '@/pages/Folders'
import WordsPage from '@/pages/Words'
import NotesPage from '@/pages/Notes'
import ExpressionFoldersPage from '@/pages/ExpressionFolders'
import ExpressionsPage from '@/pages/Expressions'
import AiUsagePage from '@/pages/AiUsage'

export default function App() {
  const ready = useAuthStore((s) => s.ready)
  const user = useAuthStore((s) => s.user)
  const bootstrap = useAuthStore((s) => s.bootstrap)

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  if (!ready) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
        <div style={{ color: '#8c8c8c' }}>连接服务中…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result
          status="warning"
          title="无法连接到服务"
          subTitle="确认 language/server 已启动（默认 http://localhost:3000），然后刷新页面"
        />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
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
