# 变更记录

本文档记录项目的所有重要变更和版本迭代。

## [未发布]

### 规划中
- [ ] 接入真实后端 API
- [ ] 接入 GA4 数据平台
- [ ] E2E 自动化测试
- [ ] 多语言支持（英语、斯瓦希里语）
- [ ] 性能监控接入

---

## [1.1.0] - 2024-08-03

### ✨ 新增
- **项目结构重构**：采用页面级组织，符合现代前端规范
- **完整文档体系**：新增 PRD、架构设计、用户流程等 7 篇文档
- **预留扩展目录**：public/, tests/, analytics/dashboard/

### 🔄 变更
- **目录结构调整**：
  - 创建 `src/pages/` 目录，按页面组织代码
  - 创建 `docs/` 目录，集中管理所有文档
  - 创建 `analytics/` 目录，独立数据分析工具
  - 创建 `public/` 和 `tests/` 预留目录
  
- **文件移动**：
  - `tracking-viewer.html` → `analytics/viewer.html`
  - `README.md` → `docs/README.md`
  - `TRACKING.md` → `docs/TRACKING.md`
  - `DELIVERY.md` → `docs/DELIVERY.md`
  - `src/components/carousel.js` → `src/pages/Home/Carousel.js`
  - `src/components/grid.js` → `src/pages/Home/VideoGrid.js`
  - `src/components/modal.js` → `src/pages/Home/SubscribeModal.js`
  - `src/styles/main.css` → `src/styles/global.css`
  - `src/styles/grid-video.css` → `src/pages/Home/HomePage.css`

- **文件拆分**：
  - `src/components/verification.js` (443行) 拆分为：
    - `src/pages/Verification/index.js` (~250行)
    - `src/pages/Result/index.js` (~250行)
  - `src/styles/verification.css` 拆分为：
    - `src/pages/Verification/VerificationPage.css`
    - `src/pages/Result/ResultPage.css`

### 🗑️ 删除
- **废弃文件清理**：
  - 删除 `src/components/analytics.js`（已被新埋点系统替代）
  - 删除空的 `src/components/` 目录

### 📝 文档
- 新增 `docs/PRD.md` - 产品需求文档
- 新增 `docs/ARCHITECTURE.md` - 技术架构文档
- 新增 `docs/USER_FLOW.md` - 用户流程图
- 新增 `docs/CHANGELOG.md` - 变更记录
- 新增 `docs/PROJECT_ANALYSIS.md` - 项目分析报告
- 新增 `analytics/README.md` - 数据工具使用说明
- 新增 `public/README.md` - 静态资源说明
- 新增 `tests/README.md` - 测试计划
- 新增根目录 `README.md`（简化版）

### 🔧 配置
- 更新 `vite.config.js`：支持多页面构建（main + viewer）
- 更新 `src/main.js`：调整导入路径，适配新目录结构

### 📊 统计
- **代码重组**：~2,300 行代码
- **文档新增**：~5,000 行文档
- **目录优化**：7 个新目录，19 个文件移动/拆分

---

## [1.0.0] - 2024-08-03

### ✨ 新增
- **核心功能完成**：
  - 视频轮播（3D 旋转木马效果）
  - 视频播放控制（播放/暂停/静音/全屏）
  - 双列推荐网格
  - 手机号验证流程
  - 验证码输入和倒计时
  - 订购结果页面
  - 多模式流程（WiFi / 移动数据）

- **埋点系统**：
  - 统一 `track()` 方法
  - 26 种核心埋点事件
  - localStorage 存储
  - 会话管理
  - 页面停留时长统计
  - 曝光埋点（IntersectionObserver）

- **数据工具**：
  - Tracking Viewer 可视化工具
  - 实时统计面板
  - 事件列表展示
  - 筛选和搜索功能
  - JSON 数据导出

- **Demo 控制器**：
  - 网络模式切换（WiFi / Cellular）
  - 订购结果模拟
  - 实时控制面板

### 🎨 UI/UX
- Aurora 渐变背景
- 玻璃态卡片设计
- 金色呼吸动画 CTA
- 流畅的页面切换动画
- 移动端优化

### 📝 文档
- `README.md` - 项目说明
- `TRACKING.md` - 埋点系统文档
- `DELIVERY.md` - 交付报告

### 🛠️ 技术栈
- Vite 5.0
- Vanilla JavaScript (ES6+)
- CSS3 (Glass Morphism)
- 无框架依赖

---

## [0.1.0] - 2024-07-31

### 🎬 项目初始化
- 创建 Vite 项目
- 基础 HTML 结构
- 初始 Git 提交

---

## 版本规范

遵循 [Semantic Versioning](https://semver.org/):

- **主版本号（Major）**：不兼容的 API 修改
- **次版本号（Minor）**：向下兼容的功能性新增
- **修订号（Patch）**：向下兼容的问题修正

## 变更类型

- ✨ **新增（Added）**：新功能
- 🔄 **变更（Changed）**：已有功能的变更
- 🗑️ **废弃（Deprecated）**：即将移除的功能
- ❌ **移除（Removed）**：已移除的功能
- 🐛 **修复（Fixed）**：Bug 修复
- 🔒 **安全（Security）**：安全相关修复
- 📝 **文档（Documentation）**：文档更新
- 🔧 **配置（Configuration）**：配置文件更新
- 📊 **统计（Statistics）**：数据统计信息

---

**维护者**：技术团队  
**最后更新**：2024-08-03
