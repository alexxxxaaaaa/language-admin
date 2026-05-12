import { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { foldersApi } from '@/api'
import type { Folder } from '@/types/api'

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'jp', label: '日本語' },
  { value: 'zh', label: '中文' },
]

export default function FoldersPage() {
  const [data, setData] = useState<Folder[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Folder | null>(null)
  const [form] = Form.useForm<{ name: string; language: string }>()

  const load = async () => {
    setLoading(true)
    try {
      setData(await foldersApi.list())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setOpen(true)
  }

  const openEdit = (row: Folder) => {
    setEditing(row)
    form.setFieldsValue({ name: row.name, language: row.language })
    setOpen(true)
  }

  const onSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      await foldersApi.update(editing.id, values)
      message.success('已更新')
    } else {
      await foldersApi.create(values)
      message.success('已创建')
    }
    setOpen(false)
    load()
  }

  const onDelete = async (id: string) => {
    await foldersApi.remove(id)
    message.success('已删除')
    load()
  }

  return (
    <>
      <Space style={{ justifyContent: 'space-between', display: 'flex', marginBottom: 12 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          单词分类
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建分类
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        columns={[
          { title: '名称', dataIndex: 'name' },
          {
            title: '语言',
            dataIndex: 'language',
            width: 120,
            render: (v: string) => <Tag>{v || '-'}</Tag>,
          },
          { title: '单词数', dataIndex: 'wordCount', width: 100 },
          {
            title: '操作',
            width: 160,
            render: (_v, row) => (
              <Space>
                <a onClick={() => openEdit(row)}>编辑</a>
                <Popconfirm
                  title="删除该分类？分类下的单词也会被删除"
                  okText="删除"
                  okType="danger"
                  cancelText="取消"
                  onConfirm={() => onDelete(row.id)}
                >
                  <a style={{ color: '#ff4d4f' }}>删除</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        title={editing ? '编辑分类' : '新建分类'}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="分类名称" />
          </Form.Item>
          <Form.Item label="语言" name="language" rules={[{ required: true }]}>
            <Select options={LANG_OPTIONS} placeholder="选择语言" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
