import { useEffect, useState } from 'react'
import {
  Button,
  Drawer,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { notesApi } from '@/api'
import type { Note } from '@/types/api'

export default function NotesPage() {
  const [data, setData] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Note | null>(null)
  const [form] = Form.useForm()
  const [viewNote, setViewNote] = useState<Note | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      setData(await notesApi.list())
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

  const openEdit = (row: Note) => {
    setEditing(row)
    form.setFieldsValue({
      title: row.title,
      course: row.course,
      lesson: row.lesson,
      content: row.content,
    })
    setOpen(true)
  }

  const onSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      await notesApi.update(editing.id, values)
      message.success('已更新')
    } else {
      await notesApi.create(values)
      message.success('已创建')
    }
    setOpen(false)
    load()
  }

  const openView = async (row: Note) => {
    const full = await notesApi.detail(row.id)
    setViewNote(full)
  }

  return (
    <>
      <Space style={{ justifyContent: 'space-between', display: 'flex', marginBottom: 12 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          课程笔记
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          新建笔记
        </Button>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={data}
        pagination={{ pageSize: 20, showSizeChanger: true }}
        columns={[
          { title: '标题', dataIndex: 'title', ellipsis: true },
          {
            title: '课程',
            dataIndex: 'course',
            width: 160,
            render: (v: string) => (v ? <Tag>{v}</Tag> : '-'),
          },
          { title: '课节', dataIndex: 'lesson', width: 120 },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            width: 160,
            render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
          },
          {
            title: '操作',
            width: 160,
            render: (_v, row) => (
              <Space>
                <a onClick={() => openView(row)}>查看</a>
                <a onClick={() => openEdit(row)}>编辑</a>
              </Space>
            ),
          },
        ]}
      />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={onSubmit}
        title={editing ? '编辑笔记' : '新建笔记'}
        width={720}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Space.Compact block>
            <Form.Item label="课程" name="course" style={{ flex: 1, marginRight: 8 }}>
              <Input />
            </Form.Item>
            <Form.Item label="课节" name="lesson" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </Space.Compact>
          <Form.Item
            label="内容（HTML / 富文本源码）"
            name="content"
            rules={[{ required: true }]}
            extra="主站 client 用 Tiptap 编辑器，这里直接保存源码字符串"
          >
            <Input.TextArea rows={10} />
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        open={!!viewNote}
        onClose={() => setViewNote(null)}
        title={viewNote?.title}
        width={720}
      >
        {viewNote && (
          <>
            <Space style={{ marginBottom: 12 }}>
              {viewNote.course && <Tag color="blue">课程：{viewNote.course}</Tag>}
              {viewNote.lesson && <Tag>课节：{viewNote.lesson}</Tag>}
              <Tag>{dayjs(viewNote.createdAt).format('YYYY-MM-DD HH:mm')}</Tag>
            </Space>
            <div
              style={{
                border: '1px solid #f0f0f0',
                borderRadius: 6,
                padding: 16,
                background: '#fafafa',
              }}
              dangerouslySetInnerHTML={{ __html: viewNote.content }}
            />
          </>
        )}
      </Drawer>
    </>
  )
}
