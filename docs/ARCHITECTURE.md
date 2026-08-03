# 技术架构文档

## 项目概览

Video RBT 是一个基于 Vite + Vanilla JavaScript 的现代化 H5 应用，采用页面级组织、模块化设计和独立埋点系统。

## 技术栈

- **构建工具**：Vite 5.0
- **核心语言**：Vanilla JavaScript (ES6+)
- **样式方案**：CSS3 (Glass Morphism, Aurora Gradient)
- **埋点系统**：自研 Tracking System
- **版本控制**：Git + GitHub

## 目录结构

```
Video-RBT-H5/
│
├── public/                         # 静态资源（预留）
│   └── README.md
│
├── src/
│   ├── pages/                      # 页面级组件
│   │   ├── Home/
│   │   │   ├── index.js            # 首页入口
│   │   │   ├── Carousel.js         # 视频轮播
│   │   │   ├── VideoGrid.js        # 推荐网格
│   │   │   ├── SubscribeModal.js   # 订阅入口
│   │   │   └── HomePage.css        # 首页样式
│   │   │
│   │   ├── Verification/
│   │   │   ├── index.js            # 验证页逻辑
│   │   │   └── VerificationPage.css
│   │   │
│   │   └── Result/
│   │       ├── index.js            # 结果页逻辑
│   │       └── ResultPage.css
│   │
│   ├── tracking/                   # 埋点管理器
│   │   ├── homeTracking.js         # 首页埋点
│   │   ├── verificationTracking.js # 验证页埋点
│   │   └── resultTracking.js       # 结果页埋点
│   │
│   ├── utils/                      # 工具函数
│   │   └── tracking.js             # 核心埋点引擎
│   │
│   ├── styles/                     # 全局样式
│   │   └── global.css              # 全局样式
│   │
│   └── main.js                     # 应用入口
│
├── analytics/                      # 数据分析工具
│   ├── viewer.html                 # 数据查看器
│   └── README.md
│
├── docs/                           # 项目文档
│   ├── README.md
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── USER_FLOW.md
│   ├── TRACKING.md
│   └── DELIVERY.md
│
├── tests/                          # 测试（预留）
│   └── README.md
│
├── index.html                      # 应用入口
├── vite.config.js                  # Vite 配置
├── package.json                    # 项目配置
└── README.md                       # 项目简介
```

## 核心模块

### 1. 页面层（Pages）

#### Home 首页
- **Carousel.js** (127行)：3D 视频轮播，支持滑动、自动播放
- **VideoGrid.js** (225行)：双列推荐网格，大屏播放器
- **SubscribeModal.js** (39行)：订阅入口，网络模式分发

#### Verification 验证页
- **index.js** (250行)：手机号输入、验证码、模式切换

#### Result 结果页
- **index.js** (250行)：订购结果展示、重试逻辑

### 2. 埋点系统（Tracking）

#### 核心引擎
- **tracking.js** (295行)：
  - 统一 `track()` 方法
  - localStorage 存储
  - 会话管理
  - 多平台适配（GA/Firebase/自建API）

#### 管理器
- **homeTracking.js** (215行)：首页所有埋点
- **verificationTracking.js** (173行)：验证页埋点
- **resultTracking.js** (55行)：结果页埋点

### 3. 数据工具（Analytics）

- **viewer.html**：可视化数据查看器
- 未来可升级为完整 Dashboard

## 设计模式

### 1. 页面级组织
- 每个页面独立目录
- 样式与逻辑同目录
- 降低耦合，便于维护

### 2. 事件驱动
```javascript
// 页面间通信通过自定义事件
window.dispatchEvent(new CustomEvent('openVerification', {
  detail: { toneName: 'Magic Companion' }
}))
```

### 3. 模块化导出
```javascript
// pages/Home/index.js
export { initCarousel } from './Carousel.js'
export { initGrid } from './VideoGrid.js'
```

### 4. 统一埋点
```javascript
// 所有埋点通过统一方法
track('subscribe_click', { video_id: 'xxx', source: 'grid' })
```

## 数据流

### 用户操作流程
```
用户点击 Subscribe
    ↓
SubscribeModal 分发模式
    ↓
派发 openVerification 事件
    ↓
Verification 页面打开
    ↓
用户输入 → 验证 → 订购
    ↓
派发 processSubscription 事件
    ↓
Result 页面显示结果
```

### 埋点数据流
```
用户操作
    ↓
触发埋点事件监听
    ↓
homeTracking/verificationTracking 调用
    ↓
track() 统一处理
    ↓
├─ Console 输出
├─ localStorage 存储
└─ 派发 tracking 事件
    ↓
Analytics Viewer 读取展示
```

## 性能优化

### 1. 资源优化
- Vite 构建优化
- CSS 按需加载（页面级）
- 无第三方库（保持轻量）

### 2. 代码分割
- 页面级天然分割
- 样式独立加载
- 埋点模块独立

### 3. 运行时优化
- IntersectionObserver（曝光埋点）
- 防抖节流（输入框）
- 事件委托（列表点击）

## 扩展性

### 1. 新增页面
```bash
# 创建新页面目录
mkdir src/pages/NewPage
touch src/pages/NewPage/index.js
touch src/pages/NewPage/NewPage.css

# 在 main.js 导入
import { initNewPage } from './pages/NewPage/index.js'
```

### 2. 新增埋点
```javascript
// src/tracking/newPageTracking.js
export function initNewPageTracking() {
  track('new_event', { param: 'value' })
}
```

### 3. 接入真实 API
```javascript
// src/utils/api.js
export async function subscribe(phone, code) {
  const res = await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify({ phone, code })
  })
  return res.json()
}
```

## 安全考虑

- 无敏感信息存储
- 埋点数据脱敏
- XSS 防护（textContent）
- HTTPS 强制

## 部署方案

### 开发环境
```bash
npm run dev
# http://localhost:5173
```

### 生产构建
```bash
npm run build
# 输出到 dist/
```

### 部署平台
- Netlify / Vercel（推荐）
- Cloudflare Pages
- AWS S3 + CloudFront
- 自建 Nginx

---

**文档版本**：v1.0  
**最后更新**：2024-08-03
