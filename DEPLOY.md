# 《体考智训》Vercel 部署指南

## 快速部署步骤

### 方法一：通过 GitHub 自动部署（推荐）⭐

#### 第 1 步：准备 GitHub 仓库

1. 访问 [github.com](https://github.com) 并登录（没有账号就注册一个，免费）
2. 点击右上角 "+" → "New repository"
3. 填写仓库名称：`tikaozhixun`
4. 选择 "Public"（公开仓库）
5. 点击 "Create repository"

#### 第 2 步：上传代码到 GitHub

在你的项目根目录执行以下命令：

```bash
# 初始化 git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 体考智训 Web 应用"

# 关联远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/tikaozhixun.git

# 推送代码
git push -u origin main
```

#### 第 3 步：在 Vercel 部署

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Sign Up" → 选择 "Continue with GitHub"
3. 登录后点击 "Add New..." → "Project"
4. 找到 `tikaozhixun` 仓库，点击 "Import"
5. 保持默认配置，点击 "Deploy"
6. 等待 1-2 分钟，部署完成！

#### 第 4 步：配置环境变量（AI 教练功能需要）

部署完成后，需要配置环境变量才能使用 AI 教练功能：

1. 在 Vercel 项目页面，点击 "Settings" → "Environment Variables"
2. 添加以下两个变量：
   - `COZE_WORKLOAD_IDENTITY_API_KEY`：你的 Coze API Key
   - `COZE_INTEGRATION_MODEL_BASE_URL`：Coze 模型服务地址
3. 点击 "Save"
4. 重新部署（Vercel 会自动触发）

#### 第 5 步：访问你的应用

部署完成后，你会得到一个类似这样的链接：
```
https://tikaozhixun.vercel.app
```

这就是你的公开访问链接！任何人都可以直接访问，无需登录。

---

### 方法二：通过 Vercel CLI 部署

如果你熟悉命令行，可以使用 Vercel CLI：

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 按照提示操作即可
```

---

## 文件结构说明

```
/workspace/projects/
├── public/              # 前端静态文件（部署到 Vercel）
│   ├── index.html       # 主页面
│   ├── css/
│   │   └── style.css    # 样式文件
│   ├── js/
│   │   └── app.js       # 应用逻辑
│   └── videos/          # 视频目录（待上传）
├── api/                 # Serverless Functions
│   └── chat.py          # AI 教练 API
├── vercel.json          # Vercel 配置文件
└── requirements.txt     # Python 依赖
```

---

## 注意事项

### 1. AI 教练功能

AI 教练功能需要配置环境变量才能正常工作。如果没有配置，其他功能（测评、分析、训练计划等）都可以正常使用，只有 AI 教练对话会报错。

### 2. 视频上传

动作学习模块的视频目前是占位符。你需要：
1. 准备好 8 个项目的标准动作视频和慢动作分解视频（共 16 个）
2. 上传到 `public/videos/` 目录
3. 修改 `public/js/app.js` 中的视频 URL

### 3. 自定义域名（可选）

如果你想使用自己的域名（如 `tikaozhixun.com`）：
1. 在 Vercel 项目页面点击 "Settings" → "Domains"
2. 添加你的域名
3. 按照提示配置 DNS 解析

---

## 常见问题

### Q: 部署失败怎么办？
A: 检查以下几点：
- 确保 `vercel.json` 文件存在
- 确保 `public/` 目录包含所有前端文件
- 查看 Vercel 部署日志中的错误信息

### Q: AI 教练不工作？
A: 确保已配置环境变量：
- `COZE_WORKLOAD_IDENTITY_API_KEY`
- `COZE_INTEGRATION_MODEL_BASE_URL`

### Q: 如何更新代码？
A: 推送新的代码到 GitHub，Vercel 会自动重新部署。

---

## 需要帮助？

如果部署过程中遇到问题，可以：
1. 查看 Vercel 官方文档：[vercel.com/docs](https://vercel.com/docs)
2. 检查部署日志中的错误信息
3. 联系 Coze Coding 支持

---

**祝你部署顺利！🎉**
