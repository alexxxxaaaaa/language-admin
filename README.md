# Word Sprint Admin

[Word Sprint](https://github.com/) 主站的管理后台 —— 启动后自动用固定账号 `zyd / zyd370710` 登录（账号不存在时自动注册），可以表格化管理这个账号自己的单词分类、单词、笔记、口语分类、口语表达，并查看 AI 用量统计。

> 当前后端 API 是按登录用户过滤的，所以后台展示的数据范围就是 `zyd` 这个账号自己的数据。与主站 server 完全解耦，不需要改 server。
>
> 自动登录的账号/密码硬编码在 `src/lib/autoAuth.ts`，需要换的话改那一处即可。注意这是前端代码，密码会出现在打包产物里，仅用于个人/内部场景。

## 技术栈

- **React 19 + TypeScript + Vite**
- **Ant Design v6**（与主站 client 同源）
- **Zustand** 管理登录态
- **Axios** + JWT Bearer
- **React Router v7**

## 目录结构

```
language-admin/
├── src/
│   ├── api/           # 与 server 通信的薄封装
│   ├── layouts/       # AdminLayout（Sider + Header）
│   ├── lib/           # http client（注入 token / 401 自动跳登录）
│   ├── pages/         # 每个菜单一个页面
│   ├── store/         # zustand：auth
│   ├── styles/        # 全局样式
│   ├── types/         # API 类型
│   ├── App.tsx        # 路由
│   └── main.tsx
└── vite.config.ts     # 开发期 /api 反向代理到 http://localhost:3000
```

## 本地开发

前置：你已经在另一个仓库 `language` 里启动了 server（`http://localhost:3000`）。

```bash
# 安装依赖
npm install

# 启动 dev server（默认 http://localhost:5174）
npm run dev
```

打开 http://localhost:5174 ，会自动登录并进入概览页。

### 切换 API 地址

默认开发期通过 vite proxy 走 `/api → http://localhost:3000`。如果想直接指向远端：

```bash
cp .env.example .env
# 在 .env 里设置：
# VITE_API_BASE_URL=https://your-server.example.com
```

## 主要页面

| 路径 | 功能 |
|---|---|
| `/dashboard` | 数据概览：分类数、单词数、笔记数、口语数、近 30 天 Tokens |
| `/folders` | 单词分类 CRUD |
| `/words` | 单词 CRUD，可按分类筛选、按关键词搜索 |
| `/notes` | 课程笔记 CRUD（内容字段直接保存 HTML / 富文本源码，主站读取后用 Tiptap 渲染） |
| `/expression-folders` | 口语分类 |
| `/expressions` | 口语表达 CRUD，可按分类 / 关键词 / 场景过滤 |
| `/ai-usage` | OpenAI 用量统计（7/14/30 天可切换） |

## 构建

```bash
npm run build
```

产物输出到 `dist/`，可以直接丢到 Cloudflare Pages / Vercel / 任意静态托管。注意把 `VITE_API_BASE_URL` 设为你的 server 公网地址。
