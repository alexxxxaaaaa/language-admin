import { useEffect, useState } from 'react'
import { Card, Col, Row, Spin, Statistic, Typography } from 'antd'
import {
  BookOutlined,
  FileTextOutlined,
  FolderOutlined,
  MessageOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import {
  aiApi,
  expressionFoldersApi,
  expressionsApi,
  foldersApi,
  notesApi,
  wordsApi,
} from '@/api'

interface Counts {
  folders: number
  words: number
  notes: number
  expressionFolders: number
  expressions: number
  aiTotalTokens: number
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [counts, setCounts] = useState<Counts>({
    folders: 0,
    words: 0,
    notes: 0,
    expressionFolders: 0,
    expressions: 0,
    aiTotalTokens: 0,
  })

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.allSettled([
      foldersApi.list(),
      wordsApi.list(),
      notesApi.list(),
      expressionFoldersApi.list(),
      expressionsApi.list(),
      aiApi.usage(30),
    ])
      .then(([f, w, n, ef, e, ai]) => {
        if (cancelled) return
        setCounts({
          folders: f.status === 'fulfilled' ? f.value.length : 0,
          words: w.status === 'fulfilled' ? w.value.length : 0,
          notes: n.status === 'fulfilled' ? n.value.length : 0,
          expressionFolders: ef.status === 'fulfilled' ? ef.value.length : 0,
          expressions: e.status === 'fulfilled' ? e.value.length : 0,
          aiTotalTokens:
            ai.status === 'fulfilled' ? ai.value.total?.totalTokens ?? 0 : 0,
        })
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Spin spinning={loading}>
      <Typography.Title level={4} style={{ marginTop: 0 }}>
        概览
      </Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card">
            <Statistic
              title="单词分类"
              value={counts.folders}
              prefix={<FolderOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card">
            <Statistic
              title="单词总数"
              value={counts.words}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card">
            <Statistic
              title="笔记篇数"
              value={counts.notes}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card">
            <Statistic
              title="口语分类"
              value={counts.expressionFolders}
              prefix={<FolderOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card">
            <Statistic
              title="口语表达"
              value={counts.expressions}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="stat-card">
            <Statistic
              title="近 30 天 AI Tokens"
              value={counts.aiTotalTokens}
              prefix={<ThunderboltOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  )
}
