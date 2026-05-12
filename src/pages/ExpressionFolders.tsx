import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { expressionFoldersApi } from '@/api'
import type { ExpressionFolder } from '@/types/api'

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'jp', label: '日本語' },
  { value: 'zh', label: '中文' },
]

export default function ExpressionFoldersPage() {
  const [data, setData] = useState<ExpressionFolder[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm<{ name: string; language: string }>()

  const load = async () => {
    setLoading(true)
    try {
      setData(await expressionFoldersApi.list())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSubmit = async () => {
    const values = await form.validateFields()
    await expressionFoldersApi.create(values)
    message.success('已创建')
    setOpen(false)
    form.resetFields()
    load()
  }

  return (
    <>
      <Space style={{ justifyContent: 'space-between', display: 'flex', marginBottom: 12 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          口语分类
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          新建分类
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 20 }}
        columns={[
          { title: '名称', dataIndex: 'name' },
          {
            title: '语言',
            dataIndex: 'language',
            width: 120,
            render: (v: string) => <Tag>{v || '-'}</Tag>,
          },
        ]}
      />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        title="新建口语分类"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="语言" name="language" rules={[{ required: true }]}>
            <Select options={LANG_OPTIONS} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
