# ☕ Coffee Chat Companion

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A personal web app for managing coffee chats — track, learn, and grow from every conversation.

[中文介绍](#中文介绍)

---

## ✨ Features

- **Dashboard** — Overview stats (total contacts / planned / completed / pending follow-ups)
- **Contact Management** — Add, edit, delete contacts with coffee type avatars
- **Research Brief** — Background, career path, research lines, awards, publications
- **Auto Research** — Copy prompt to AI agents (ChatGPT/Claude/WorkBuddy) or configure API key
- **Question Preparation** — Tag-based organization (deep / resonate / open / career)
- **Talk Records** — Date, location, topics, notes, key insights
- **Follow-ups** — Action items with completion tracking
- **Coffee Handbook** — Visual recipe cards with ingredient proportions
- **Custom Coffee** — Upload your own coffee icons or build custom recipes
- **Theme Colors** — 8 preset + custom color backgrounds
- **Responsive Design** — Works on desktop and mobile

## 🚀 Quick Start

No build step required! Just open `src/index.html` in your browser.

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/coffee-chat-companion.git

# Open in browser (macOS)
open coffee-chat-companion/src/index.html

# Or simply double-click index.html
```

## 📁 Project Structure

```
coffee-chat-companion/
├── src/
│   ├── index.html          # Entry point
│   ├── app.js              # Main application logic
│   ├── styles.css          # Stylesheet
│   ├── data.js             # Seed data (demo contacts)
│   ├── quill.snow.css      # Rich text editor styles
│   └── onboarding-bg.jpg   # Onboarding background
├── LICENSE
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

- Pure HTML / CSS / JavaScript (no frameworks)
- localStorage for data persistence
- Quill.js for rich text editing
- SVG icons for coffee types

## 🎨 Screenshots

*(Add screenshots here)*

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs via Issues
- Suggest features
- Submit Pull Requests

## 📄 License

[MIT](LICENSE)

---

## 中文介绍

**Coffee Chat Companion** 是一个个人咖啡聊天管理工具，帮助你追踪、学习和成长于每一次对话。

### 核心功能

- **仪表盘** — 统计概览（总联系数 / 计划中 / 已完成 / 待跟进）
- **联系人管理** — 添加/编辑/删除，咖啡类型头像标识
- **研究简报** — 背景调查、职业路径、研究方向、奖项论文
- **自动调研** — 复制 Prompt 给 AI 助手，或配置 API 密钥一键生成
- **问题准备** — 标签分类（深度/共鸣/开放/职业）
- **谈话记录** — 日期、地点、话题、笔记、关键洞察
- **跟进事项** — 待办清单 + 完成状态追踪
- **咖啡图鉴** — 可视化配方卡片，标注成分比例
- **自定义咖啡** — 上传图片或构建配方
- **主题色** — 8 种预设 + 自定义背景色
- **响应式设计** — 桌面端和移动端适配

### 快速开始

无需构建步骤！直接用浏览器打开 `src/index.html` 即可使用。

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/coffee-chat-companion.git

# 在浏览器中打开（macOS）
open coffee-chat-companion/src/index.html
```

所有数据保存在浏览器 localStorage 中，建议定期导出备份。
