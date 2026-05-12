import { useEffect, useState } from 'react'
import { Card, Col, Row, Segmented, Spin, Statistic, Table, Typography } from 'antd'
import dayjs from 'dayjs'
import { aiApi } from '@/api'
import type { AiUsageSummary } from '@/types/api'

const RANGE_OPTIONS = [
  { label: '近 7 天', value: 7 },
  { label: '近 14 天', value: 14 },
  { label: '近 30 天', value: 30 },
]

export default function AiUsagePage() {
  const [days, setDays] = useState<number>(14)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AiUsageSummary | null>(null)

  useEffect(() => {
    setLoading(true)
    aiApi
      .usage(days)
      .then(setData)
      .finally(() => setLoading(false))
  }, [days])

  return (
    <Spin spinning={loading}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          AI 用量
        </Typography.Title>
        <Segmented
          options={RANGE_OPTIONS}
          value={days}
          onChange={(v) => setDays(Number(v))}
        />
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="总 Tokens" value={data?.total?.totalTokens ?? 0} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Prompt Tokens" value={data?.total?.promptTokens ?? 0} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic title="Completion Tokens" value={data?.total?.completionTokens ?? 0} />
          </Card>
        </Col>
        {data?.budget && (
          <Col xs={24}>
            <Card>
              <Statistic
                title={`今日已用 / 日预算`}
                value={`${data.budget.usedToday} / ${data.budget.daily}`}
              />
            </Card>
          </Col>
        )}
      </Row>
      <Card title="按日明细">
        <Table
          rowKey="date"
          dataSource={data?.days ?? []}
          pagination={false}
          size="middle"
          columns={[
            {
              title: '日期',
              dataIndex: 'date',
              render: (v: string) => dayjs(v).format('YYYY-MM-DD'),
            },
            { title: '调用次数', dataIndex: 'count' },
            { title: 'Prompt', dataIndex: 'promptTokens' },
            { title: 'Completion', dataIndex: 'completionTokens' },
            { title: '合计 Tokens', dataIndex: 'totalTokens' },
          ]}
        />
      </Card>
    </Spin>
  )
}
