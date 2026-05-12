import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { expressionFoldersApi, expressionsApi } from '@/api'
import type { Expression, ExpressionFolder } from '@/types/api'

export default function ExpressionsPage() {
  const [folders, setFolders] = useState<ExpressionFolder[]>([])
  const [folderId, setFolderId] = useState<string | undefined>()
  const [keyword, setKeyword] = useState('')
  const [data, setData] = useState<Expression[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Expression | null>(null)
  const [form] = Form.useForm()

  const folderOptions = useMemo(
    () => folders.map((f) => ({ value: f.id, label: `${f.name} (${f.language})` })),
    [folders],
  )

  const load = async () => {
    setLoading(true)
    try {
      const rows = await expressionsApi.list({
        folderId,
        q: keyword || undefined,
      })
      setData(rows)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    expressionFoldersApi.list().then(setFolders)
  }, [])

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    if (folderId) form.setFieldsValue({ folderId })
    setOpen(true)
  }

  const openEdit = (row: Expression) => {
    setEditing(row)
    form.setFieldsValue({
      zhText: row.zhText,
      enCasual: row.enCasual,
      jpCasual: row.jpCasual,
      sceneTag: row.sceneTag,
      note: row.note,
      isMastered: row.isMastered,
      folderId: row.folderId,
    })
    setOpen(true)
  }

  const onSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      await expressionsApi.update(editing.id, values)
      message.success('已更新')
    } else {
      await expressionsApi.create(values)
      message.success('已创建')
    }
    setOpen(false)
    load()
  }

  const onDelete = async (id: string) => {
    await expressionsApi.remove(id)
    message.success('已删除')
    load()
  }

  return (
    <>
      <Space style={{ justifyContent: 'space-between', display: 'flex', marginBottom: 12 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          口语表达
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
            placeholder="搜索中/英/日"
            allowClear
            style={{ width: 220 }}
            onSearch={(v) => {
              setKeyword(v)
              load()
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={load}>
            刷新
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新建表达
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
          { title: '中文', dataIndex: 'zhText', width: 240, ellipsis: true },
          { title: 'English', dataIndex: 'enCasual', ellipsis: true },
          { title: '日本語', dataIndex: 'jpCasual', ellipsis: true },
          {
            title: '场景',
            dataIndex: 'sceneTag',
            width: 120,
            render: (v: string) => (v ? <Tag color="purple">{v}</Tag> : '-'),
          },
          {
            title: '已掌握',
            dataIndex: 'isMastered',
            width: 90,
            render: (v: boolean) => (v ? <Tag color="green">是</Tag> : <Tag>否</Tag>),
          },
          {
            title: '更新时间',
            dataIndex: 'updatedAt',
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
                  title="删除该表达？"
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
        title={editing ? '编辑表达' : '新建表达'}
        width={640}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="分类" name="folderId" rules={[{ required: true }]}>
            <Select options={folderOptions} showSearch optionFilterProp="label" />
          </Form.Item>
          <Form.Item label="中文" name="zhText" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="English" name="enCasual">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="日本語" name="jpCasual">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Space.Compact block>
            <Form.Item label="场景标签" name="sceneTag" style={{ flex: 1, marginRight: 8 }}>
              <Input />
            </Form.Item>
            <Form.Item
              label="已掌握"
              name="isMastered"
              valuePropName="checked"
              style={{ width: 120 }}
            >
              <Switch />
            </Form.Item>
          </Space.Compact>
          <Form.Item label="备注" name="note">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
