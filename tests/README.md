# Tests

测试目录（预留）

## 📋 测试计划

此目录为未来测试代码预留，当前项目处于 Demo 阶段，暂无自动化测试。

## 🎯 未来测试策略

### 单元测试
- 工具函数测试（`src/utils/`）
- 埋点系统测试（`src/tracking/`）
- 组件逻辑测试

### 集成测试
- 页面流程测试
- 订购流程端到端测试
- 埋点数据完整性测试

### E2E 测试
- 用户完整路径测试
- 多模式流程测试（WiFi/Cellular）
- 跨浏览器兼容性测试

## 🛠️ 推荐测试框架

### 单元测试
```bash
npm install -D vitest @vitest/ui
```

**配置示例**：
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true
  }
})
```

### E2E 测试
```bash
npm install -D playwright @playwright/test
```

**测试示例**：
```javascript
// tests/e2e/subscription.spec.js
import { test, expect } from '@playwright/test'

test('complete subscription flow', async ({ page }) => {
  await page.goto('http://localhost:5173')
  await page.click('.subscribe-btn')
  await page.fill('#phoneInput', '712345678')
  await page.click('#getCodeBtn')
  // ...
})
```

## 📂 建议目录结构

```
tests/
├── unit/                    # 单元测试
│   ├── utils/
│   │   └── tracking.test.js
│   └── tracking/
│       └── homeTracking.test.js
├── integration/             # 集成测试
│   ├── verification-flow.test.js
│   └── subscription-flow.test.js
├── e2e/                     # 端到端测试
│   ├── wifi-user.spec.js
│   ├── cellular-user.spec.js
│   └── analytics.spec.js
├── fixtures/                # 测试数据
│   └── sample-events.json
└── helpers/                 # 测试辅助函数
    └── test-utils.js
```

## ✅ 测试清单

### 功能测试
- [ ] 视频轮播正常工作
- [ ] 视频播放/暂停/静音控制
- [ ] 手机号输入校验
- [ ] 验证码倒计时
- [ ] 订购成功/失败状态展示
- [ ] 多模式流程切换

### 埋点测试
- [ ] 页面浏览事件触发
- [ ] 视频交互事件触发
- [ ] 订购流程事件完整性
- [ ] localStorage 存储正常
- [ ] 事件参数完整性

### 性能测试
- [ ] 首屏加载时间 < 3s
- [ ] 视频自动播放延迟 < 500ms
- [ ] 页面切换动画流畅（60fps）

### 兼容性测试
- [ ] Chrome (最新版)
- [ ] Safari iOS (14+)
- [ ] Android WebView
- [ ] 竖屏/横屏适配

## 🚀 运行测试

```bash
# 单元测试
npm run test

# E2E 测试
npm run test:e2e

# 测试覆盖率
npm run test:coverage

# UI 模式（可视化）
npm run test:ui
```

## 📝 测试最佳实践

1. **测试金字塔**：70% 单元测试，20% 集成测试，10% E2E 测试
2. **测试隔离**：每个测试独立运行，不依赖其他测试
3. **Mock 外部依赖**：模拟 localStorage、网络请求
4. **清晰的断言**：使用有意义的错误信息
5. **持续集成**：在 GitHub Actions 中自动运行测试

## 📖 参考资源

- [Vitest 文档](https://vitest.dev/)
- [Playwright 文档](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

---

**最后更新**：2024-08-03
