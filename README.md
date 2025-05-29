# 沟通助手 Communication Assistant

AI智能沟通回复生成器，集成DeepSeek V3模型，支持多场景对话回复生成。

🌐 **在线体验：** [https://chatok.app](https://chatok.app)

## ✨ 功能特点

- 🤖 **AI智能回复生成**：集成DeepSeek V3模型，生成高质量对话回复
- 🎯 **多场景支持**：职场沟通、客户服务、朋友聊天、陌生社交四大场景
- 🎚️ **语调调节**：1-10级语调强度调节，从委婉到强硬
- 📱 **移动端适配**：完全响应式设计，完美支持手机端使用
- 🎨 **WeChat风格UI**：采用微信绿色主题，界面简洁易用
- 💾 **本地存储**：用户设置和历史记录自动保存在本地
- ⚡ **实时交互**：复制成功提示、点赞动画、自动滚动等交互效果

## 🛠 技术栈

- **前端框架**：Next.js 15 + React 18
- **类型系统**：TypeScript
- **样式方案**：Tailwind CSS + shadcn/ui
- **包管理器**：Bun
- **AI模型**：DeepSeek V3（通过OpenRouter API）
- **部署平台**：Netlify
- **数据存储**：localStorage（无需数据库）

## 🚀 本地开发设置

### 环境要求

- Node.js 18.17+
- Bun 1.0+（推荐）或 npm/yarn

### 1. 克隆项目

```bash
git clone https://github.com/dspwell/communication-assistant.git
cd communication-assistant
```

### 2. 安装依赖

```bash
# 使用 Bun（推荐）
bun install

# 或使用 npm
npm install
```

### 3. 环境变量配置

复制环境变量示例文件并填入配置：

```bash
cp .env.example .env.local
```

在 `.env.local` 中配置：

```env
# OpenRouter API 配置
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 4. 启动开发服务器

```bash
# 使用 Bun
bun run dev

# 或使用 npm
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🔑 API配置说明

### OpenRouter API设置

1. 访问 [OpenRouter官网](https://openrouter.ai/) 注册账户
2. 在账户设置中生成API Key
3. 将API Key添加到 `.env.local` 文件中
4. 项目使用的模型：`deepseek/deepseek-chat`

### API使用限制

- 免费额度：每月一定数量的免费调用
- 付费计划：按使用量计费
- 请求频率：建议控制在合理范围内

## 🌐 部署指南

### Netlify部署（推荐）

1. 连接GitHub仓库到Netlify
2. 配置构建设置：
   - Build command: `bun run build`
   - Publish directory: `.next`
3. 添加环境变量：
   - `OPENROUTER_API_KEY`
4. 启用动态函数支持

### Vercel部署

1. 导入GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

### 其他平台

支持任何支持Next.js的部署平台，需要Node.js运行时环境。

## 💻 在Cursor中开发

### 1. 安装Cursor

从 [Cursor官网](https://cursor.sh/) 下载并安装Cursor编辑器。

### 2. 克隆并打开项目

```bash
# 克隆项目
git clone https://github.com/dspwell/communication-assistant.git

# 用Cursor打开项目
cursor communication-assistant
```

### 3. 开发环境配置

1. **安装依赖**：在Cursor终端中运行 `bun install`
2. **环境变量**：创建 `.env.local` 文件并配置API密钥
3. **启动开发**：运行 `bun run dev`

### 4. Cursor AI功能

- **代码补全**：智能代码建议和自动补全
- **代码解释**：选中代码按 `Ctrl+L` 获取AI解释
- **重构建议**：使用AI进行代码优化和重构
- **调试辅助**：AI协助问题诊断和解决

### 5. 推荐的Cursor扩展

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag

## 📁 项目结构

```
communication-assistant/
├── src/
│   ├── app/                    # App Router目录
│   │   ├── api/               # API路由
│   │   │   └── generate-reply/ # AI回复生成接口
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 布局组件
│   │   └── page.tsx           # 主页面
│   ├── components/            # UI组件
│   │   └── ui/               # shadcn/ui组件
│   └── lib/                  # 工具函数
├── public/                   # 静态资源
├── .env.example             # 环境变量示例
├── next.config.js           # Next.js配置
├── tailwind.config.ts       # Tailwind配置
├── components.json          # shadcn/ui配置
└── package.json             # 项目配置
```

## 🔧 主要组件说明

### 页面组件 (`src/app/page.tsx`)

主要功能组件，包含：
- 场景选择器
- 语调滑块
- 输入框
- AI回复展示
- 交互动画效果

### API路由 (`src/app/api/generate-reply/route.ts`)

处理AI回复生成的后端逻辑：
- 接收用户输入和配置
- 构建提示词
- 调用DeepSeek V3模型
- 解析和返回结果

## 🎨 样式和动画

- **主题色彩**：微信绿色风格 (`#07C160`)
- **动画效果**：CSS keyframes + Tailwind动画类
- **响应式设计**：移动端优先的设计理念
- **组件库**：shadcn/ui提供一致的设计系统

## 📊 数据存储

使用 `localStorage` 存储：
- 用户选择的场景
- 语调设置
- 历史回复记录
- 用户偏好设置

## 🤝 贡献指南

1. Fork本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 创建Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 📞 联系方式

- GitHub: [@dspwell](https://github.com/dspwell)
- 项目地址: [https://github.com/dspwell/communication-assistant](https://github.com/dspwell/communication-assistant)
- 在线体验: [https://chatok.app](https://chatok.app)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！