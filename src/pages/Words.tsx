import { useEffect, useMemo, useState } from 'react'
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
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { foldersApi, wordsApi } from '@/api'
import type { Folder, Word } from '@/types/api'

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'jp', label: '日本語' },
  { value: 'zh', label: '中文' },
]

export default function WordsPage() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [folderId, setFolderId] = useState<string | undefined>()
  const [keyword, setKeyword] = useState('')
  const [data, setData] = useState<Word[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Word | null>(null)
  const [form] = Form.useForm()

  const folderOptions = useMemo(
    () =>
      folders.map((f) => ({
        value: f.id,
        label: `${f.name} (${f.language})`,
        language: f.language,
      })),
    [folders],
  )

  const load = async () => {
    setLoading(true)
    try {
      const rows = await wordsApi.list({ folderId, q: keyword || undefined })
      setData(rows)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    foldersApi.list().then(setFolders)
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    if (folderId) {
      const f = folders.find((x) => x.id === folderId)
      form.setFieldsValue({ folderId, language: f?.language })
    }
    setOpen(true)
  }

  const openEdit = (row: Word) => {
    setEditing(row)
    form.setFieldsValue({
      word: row.word,
      reading: row.reading,
      meaning: row.meaning,
      partOfSpeech: row.partOfSpeech,
      example: row.example,
      note: row.note,
      language: row.language,
      folderId: row.folderId,
    })
    setOpen(true)
  }

  const onSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      await wordsApi.update(editing.id, values)
      message.success('已更新')
    } else {
      await wordsApi.create(values)
      message.success('已创建')
    }
    setOpen(false)
    load()
  }

  const onDelete = async (id: string) => {
    await wordsApi.remove(id)
    message.success('已删除')
    load()
  }

  return (
    <>
      <Space style={{ justifyContent: 'space-between', display: 'flex', marginBottom: 12 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          单词
        </Typography.Title>
        <Space>
          <Select
            allowClear
            placeholder="筛选分类"
            style={{ width: 220 }}
            value={folderId}
            onChange={(v) => setFolderId(v)}
            options={folderOptions}
          />
          <Input.Search
            placeholder="搜索单词 / 词义"
            allowClear
            style={{ width: 240 }}
            onSearch={(v) => {
              setKeyword(v)
              load()
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={load}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新建单词
          </Button>
        </Space>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        scroll={{ x: 1100 }}
        columns={[
          { title: '单词', dataIndex: 'word', width: 160, fixed: 'left' },
          { title: '读音', dataIndex: 'reading', width: 140 },
          {
            title: '词性',
            dataIndex: 'partOfSpeech',
            width: 100,
            render: (v: string) => (v ? <Tag>{v}</Tag> : '-'),
          },
          { title: '词义', dataIndex: 'meaning', ellipsis: true },
          { title: '例句', dataIndex: 'example', ellipsis: true },
          {
            title: '语言',
            dataIndex: 'language',
            width: 80,
            render: (v: string) => <Tag>{v}</Tag>,
          },
          {
            title: '分类',
            dataIndex: ['folder', 'name'],
            width: 140,
            render: (_v, r) => r.folder?.name ?? '-',
          },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 160,
            render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
          },
          {
            title: '操作',
            width: 140,
            fixed: 'right',
            render: (_v, row) => (
              <Space>
                <a onClick={() => openEdit(row)}>编辑</a>
                <Popconfirm
                  title="删除该单词？"
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
        title={editing ? '编辑单词' : '新建单词'}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Space.Compact block>
            <Form.Item
              label="单词"
              name="word"
              rules={[{ required: true }]}
              style={{ flex: 1, marginRight: 8 }}
            >
              <Input />
            </Form.Item>
            <Form.Item label="读音" name="reading" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </Space.Compact>
          <Space.Compact block>
            <Form.Item label="词性" name="partOfSpeech" style={{ flex: 1, marginRight: 8 }}>
              <Input placeholder="n. / v. / adj." />
            </Form.Item>
            <Form.Item
              label="语言"
              name="language"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Select options={LANG_OPTIONS} />
            </Form.Item>
          </Space.Compact>
          <Form.Item label="分类" name="folderId" rules={[{ required: true }]}>
            <Select options={folderOptions} placeholder="选择分类" showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item label="词义" name="meaning" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="例句" name="example">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="备注" name="note">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
