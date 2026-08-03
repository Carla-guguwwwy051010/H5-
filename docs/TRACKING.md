# 视频彩铃订购H5 - 埋点系统文档

## 📋 目录

1. [系统架构](#系统架构)
2. [新增文件](#新增文件)
3. [修改文件](#修改文件)
4. [完整埋点事件表](#完整埋点事件表)
5. [页面埋点分布](#页面埋点分布)
6. [如何查看埋点数据](#如何查看埋点数据)
7. [未来接入真实平台](#未来接入真实平台)
8. [产品埋点方案说明](#产品埋点方案说明)

---

## 系统架构

### 设计原则

1. **统一管理**：所有埋点通过 `track()` 方法统一上报
2. **独立模块**：埋点代码与业务逻辑解耦，集中在 `src/tracking/` 目录
3. **自动触发**：通过事件监听自动触发，无需在业务代码中显式调用
4. **多端输出**：Console日志 + LocalStorage存储 + 自定义事件派发
5. **易于扩展**：预留GA/Firebase/自建API接口，无缝对接数据平台

### 架构图

```
src/
├── utils/
│   └── tracking.js                  # 核心埋点引擎
├── tracking/
│   ├── homeTracking.js              # 首页埋点管理
│   ├── verificationTracking.js      # 验证页埋点管理
│   └── resultTracking.js            # 结果页埋点管理
├── components/
│   ├── verification.js              # 业务逻辑（已解耦埋点）
│   ├── modal.js                     # 业务逻辑（已解耦埋点）
│   └── grid.js                      # 业务逻辑（已解耦埋点）
└── main.js                          # 统一初始化
```

---

## 新增文件

### 1. `src/utils/tracking.js`
**核心埋点引擎** - 统一方法 + 数据存储 + 多平台适配

**核心方法**：
- `track(eventName, eventParams)` - 统一埋点方法
- `trackPageView(pageName)` - 页面浏览
- `trackPageExit(pageName)` - 页面退出
- `trackExposure(elementId, callback, duration)` - 曝光埋点
- `getTrackingEvents()` - 获取所有记录
- `clearTrackingEvents()` - 清空记录
- `exportTrackingData()` - 导出JSON

**自动功能**：
- 会话ID生成
- 平台检测（Android/iOS/Web）
- 页面停留时长计算
- localStorage自动存储（最多200条）
- Console彩色输出

**全局调试工具**：
```javascript
// 在浏览器Console中可用
window.__tracking__.getEvents()      // 查看所有事件
window.__tracking__.clearEvents()    // 清空数据
window.__tracking__.exportData()     // 导出JSON
window.__tracking__.config           // 查看配置
window.__tracking__.session          // 查看会话信息
```

---

### 2. `src/tracking/homeTracking.js`
**首页埋点管理器** - 视频、推荐、订阅

**负责事件**：
- `video_exposure` - 视频曝光（可见超过1秒）
- `video_play` - 视频播放
- `video_pause` - 视频暂停
- `video_complete` - 视频播放完成
- `video_sound_change` - 声音切换
- `video_fullscreen_click` - 全屏点击
- `recommend_exposure` - 推荐卡片曝光
- `recommend_click` - 推荐卡片点击
- `subscribe_click` - 订阅按钮点击

**触发机制**：
- 通过 IntersectionObserver 监听曝光
- 通过原生Video事件监听播放状态
- 通过自定义事件监听页面交互

---

### 3. `src/tracking/verificationTracking.js`
**验证页埋点管理器** - 手机号输入、验证码、订购

**负责事件**：
- `phone_page_view` - 进入手机号验证页
- `phone_input_start` - 开始输入手机号
- `phone_input_complete` - 手机号输入完成（9位）
- `phone_validate_fail` - 手机号校验失败
- `sms_send_click` - 点击获取验证码
- `sms_send_success` - 验证码发送成功
- `sms_send_fail` - 验证码发送失败
- `verify_code_submit` - 提交验证码
- `verify_success` - 验证成功
- `verify_fail` - 验证失败
- `subscription_request` - 发起订购请求
- `subscription_success` - 订购成功
- `subscription_fail` - 订购失败

**导出方法**（供 verification.js 调用）：
- `trackVerifySuccess()`
- `trackVerifyFailed(reason)`
- `trackSubscriptionSuccess(productName)`
- `trackSubscriptionFailed(reason)`

---

### 4. `src/tracking/resultTracking.js`
**结果页埋点管理器** - 用户操作

**负责事件**：
- `page_view`（result页）
- `result_action_click` - 用户点击操作按钮

---

### 5. `tracking-viewer.html`
**埋点数据可视化工具** - 独立HTML页面

**功能**：
- 实时统计：总事件数、事件类型、订阅转化率
- 事件列表：时间倒序，支持筛选和搜索
- 数据导出：导出完整JSON
- 自动刷新：每5秒更新一次

**访问方式**：
```
http://localhost:5173/tracking-viewer.html
```

---

## 修改文件

### 1. `src/main.js`
- 移除旧的 `analytics.js` 引用
- 引入新的 `tracking.js` 和三个埋点管理器
- 统一初始化所有埋点模块

### 2. `src/components/verification.js`
- 移除内联埋点调用（`trackPhoneInputComplete()`等）
- 改为导入 `verificationTracking.js` 的导出方法
- 在关键节点调用统一方法

### 3. `src/components/modal.js`
- 移除 `trackSubscribeClick()` 调用
- 埋点逻辑已迁移到 `homeTracking.js`

### 4. `src/components/grid.js`
- 移除 `trackVideoExposure()` 等旧方法
- 曝光和播放埋点迁移到 `homeTracking.js`
- 保留业务逻辑，派发自定义事件供埋点监听

---

## 完整埋点事件表

| 事件名 | 触发时机 | 参数 | 所属页面 |
|--------|---------|------|---------|
| **页面浏览** |
| `page_view` | 进入页面 | `page`, `country`, `referrer`, `url` | 所有页面 |
| `page_exit` | 离开页面 | `page`, `stay_time_ms`, `stay_time_sec` | 所有页面 |
| **视频交互** |
| `video_exposure` | 视频可见超过1秒 | `video_id`, `position`, `index` | 首页 |
| `video_play` | 视频开始播放 | `video_id`, `position`, `autoplay`, `muted` | 首页 |
| `video_pause` | 视频暂停 | `video_id`, `position`, `current_time` | 首页 |
| `video_complete` | 视频播放完成 | `video_id`, `position`, `duration` | 首页 |
| `video_sound_change` | 点击声音按钮 | `video_id`, `before`, `after` | 首页 |
| `video_fullscreen_click` | 点击全屏 | `video_id` | 首页 |
| **推荐区域** |
| `recommend_exposure` | 推荐卡片曝光 | `video_id`, `position`, `card_type` | 首页 |
| `recommend_click` | 点击推荐卡片 | `video_id`, `position`, `source` | 首页 |
| **订阅流程** |
| `subscribe_click` | 点击订阅按钮 | `video_id`, `source`, `position` | 首页 |
| **手机号验证** |
| `phone_page_view` | 进入验证页 | `country` | 验证页 |
| `phone_input_start` | 开始输入手机号 | `country` | 验证页 |
| `phone_input_complete` | 手机号输入完成 | `country`, `length` | 验证页 |
| `phone_validate_fail` | 手机号校验失败 | `reason`, `actual_length` | 验证页 |
| **验证码** |
| `sms_send_click` | 点击获取验证码 | `country`, `code`, `phone` | 验证页 |
| `sms_send_success` | 验证码发送成功 | `country` | 验证页 |
| `sms_send_fail` | 验证码发送失败 | `reason` | 验证页 |
| `verify_code_submit` | 提交验证码 | `country`, `has_phone`, `has_code` | 验证页 |
| `verify_success` | 验证成功 | `country` | 验证页 |
| `verify_fail` | 验证失败 | `reason`, `country` | 验证页 |
| **订购结果** |
| `subscription_request` | 发起订购 | `country` | 验证页 |
| `subscription_success` | 订购成功 | `product_id`, `product_name`, `country`, `price` | 验证页 |
| `subscription_fail` | 订购失败 | `reason`, `country` | 验证页 |
| `result_action_click` | 结果页操作 | `action`, `result`, `retry_type` | 结果页 |

**参数枚举值**：

- `reason`（phone_validate_fail）：`empty_phone` | `invalid_format` | `invalid_length`
- `reason`（sms_send_fail）：`network_error` | `service_error`
- `reason`（verify_fail）：`wrong_code` | `expired_code` | `network_error`
- `reason`（subscription_fail）：`payment_failed` | `service_error` | `timeout`
- `action`（result_action_click）：`enjoy_now` | `try_again` | `back_home`

---

## 页面埋点分布

### 首页（Home）
```
[自动触发]
- page_view（进入页面）
- page_exit（离开页面）
- video_exposure（顶部轮播视频可见1秒后）
- recommend_exposure（推荐卡片进入可视区域）

[用户交互]
- video_play（视频播放）
- video_pause（视频暂停）
- video_complete（视频播放完成）
- video_sound_change（点击声音按钮）
- video_fullscreen_click（点击全屏）
- recommend_click（点击推荐卡片）
- subscribe_click（点击订阅按钮）
```

### 手机号验证页（Phone Verification）
```
[自动触发]
- phone_page_view（打开页面）
- phone_input_complete（输入满9位）
- sms_send_success/fail（发送验证码结果，模拟）

[用户交互]
- phone_input_start（首次点击输入框）
- phone_validate_fail（手机号校验失败）
- sms_send_click（点击获取验证码）
- verify_code_submit（点击确认订购）
- verify_success/fail（验证结果）
- subscription_request（发起订购）
- subscription_success/fail（订购结果）
```

### 订购结果页（Subscription Result）
```
[自动触发]
- page_view（result页，携带成功/失败状态）

[用户交互]
- result_action_click（点击Enjoy Now / Try Again / Back to Home）
- page_exit（离开结果页）
```

---

## 如何查看埋点数据

### 方法1：浏览器Console（实时）

打开 http://localhost:5173，按 F12 打开控制台，每次触发埋点会自动输出：

```
[Tracking] page_view
📊 Params: { page: 'home', country: 'KE' }
🔍 Full Data: { event: 'page_view', timestamp: '...', session_id: '...', ... }
```

### 方法2：Tracking Viewer（可视化）

访问 http://localhost:5173/tracking-viewer.html

**功能**：
- 📊 实时统计面板（总事件数、转化率等）
- 📋 事件列表（时间倒序，支持筛选）
- 🔍 搜索和过滤
- 📥 导出完整JSON
- 🔄 自动刷新（每5秒）

### 方法3：浏览器Console调试工具

```javascript
// 查看所有事件
window.__tracking__.getEvents()

// 筛选特定事件
window.__tracking__.getEvents().filter(e => e.event === 'subscribe_click')

// 统计订购成功率
const subscribeClicks = window.__tracking__.getEvents().filter(e => e.event === 'subscribe_click').length
const subscribeSuccess = window.__tracking__.getEvents().filter(e => e.event === 'subscription_success').length
console.log(`转化率: ${(subscribeSuccess / subscribeClicks * 100).toFixed(1)}%`)

// 导出JSON
window.__tracking__.exportData()

// 清空数据
window.__tracking__.clearEvents()

// 查看配置
window.__tracking__.config

// 查看会话信息
window.__tracking__.session
```

### 方法4：localStorage直接读取

```javascript
JSON.parse(localStorage.getItem('user_events'))
```

---

## 未来接入真实平台

### 1. Google Analytics (GA4)

#### 安装GA SDK
```html
<!-- 在 index.html <head> 中添加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### 修改 tracking.js
```javascript
// 在 tracking.js 中启用GA发送
const TRACKING_CONFIG = {
  enabled: true,
  console: true,
  storage: true,
  debugMode: false,  // 改为 false
  endpoints: {
    ga: 'G-XXXXXXXXXX'  // 填入实际GA ID
  }
};

// 取消注释 sendToGA 调用
function track(eventName, eventParams = {}) {
  // ...
  if (TRACKING_CONFIG.endpoints.ga) {
    sendToGA(eventData);
  }
}

// sendToGA 函数已预留，无需修改
```

---

### 2. Firebase Analytics

#### 安装Firebase SDK
```bash
npm install firebase
```

#### 初始化Firebase
```javascript
// 在 main.js 顶部添加
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "...",
  projectId: "...",
  // ...
};

const app = initializeApp(firebaseConfig);
window.firebaseAnalytics = getAnalytics(app);
```

#### 修改 tracking.js
```javascript
function sendToFirebase(eventData) {
  if (window.firebaseAnalytics) {
    window.firebaseAnalytics.logEvent(eventData.event, eventData);
  }
}

// 在 track() 中调用
if (window.firebaseAnalytics) {
  sendToFirebase(eventData);
}
```

---

### 3. 自建API接口

#### 后端接口示例（Node.js + Express）
```javascript
// server.js
app.post('/api/track', (req, res) => {
  const event = req.body;
  
  // 存储到数据库（MongoDB / PostgreSQL）
  db.collection('events').insertOne(event);
  
  // 实时推送到BI平台
  kafka.send('analytics', event);
  
  res.json({ success: true });
});
```

#### 修改 tracking.js
```javascript
const TRACKING_CONFIG = {
  endpoints: {
    custom: 'https://api.yourdomain.com/track'
  }
};

function sendToCustomAPI(eventData) {
  fetch(TRACKING_CONFIG.endpoints.custom, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
    keepalive: true  // 确保页面卸载时也能发送
  }).catch(e => console.error('[Tracking] API send failed:', e));
}

// 在 track() 中调用
if (TRACKING_CONFIG.endpoints.custom) {
  sendToCustomAPI(eventData);
}
```

---

### 4. 多平台同时上报

```javascript
function track(eventName, eventParams = {}) {
  // ...

  // 同时发送到多个平台
  if (TRACKING_CONFIG.endpoints.ga) sendToGA(eventData);
  if (window.firebaseAnalytics) sendToFirebase(eventData);
  if (TRACKING_CONFIG.endpoints.custom) sendToCustomAPI(eventData);
}
```

---

## 产品埋点方案说明

### 业务目标

通过埋点系统，回答以下产品问题：

1. **用户行为**：用户如何浏览和互动？哪些内容最吸引人？
2. **转化漏斗**：从浏览到订购的转化率？哪个环节流失最多？
3. **异常监控**：验证码失败率？订购失败原因分布？
4. **A/B测试**：不同版本/模式的效果对比？

---

### 核心漏斗分析

```
首页浏览 (page_view)
    ↓
视频曝光 (video_exposure) ───→ 推荐曝光 (recommend_exposure)
    ↓                              ↓
视频播放 (video_play)          推荐点击 (recommend_click)
    ↓                              ↓
            订阅点击 (subscribe_click) ← ← ← ← ←
                      ↓
        [分支：移动数据 vs WiFi]
                      ↓
    ┌─────────────────┴─────────────────┐
    │                                   │
[Mode B: 移动数据一键]          [Mode A/C: WiFi验证]
    │                                   │
    ↓                                   ↓
subscription_request          phone_page_view
    │                                   ↓
    │                          phone_input_complete
    │                                   ↓
    │                          sms_send_click
    │                                   ↓
    │                          verify_code_submit
    │                                   ↓
    │                          verify_success
    │                                   ↓
    └───────────→ subscription_success ←┘
```

**关键指标**：

- **订阅转化率** = `subscription_success` / `subscribe_click`
- **验证通过率** = `verify_success` / `verify_code_submit`
- **短信成功率** = `sms_send_success` / `sms_send_click`
- **视频观看率** = `video_play` / `video_exposure`
- **推荐点击率** = `recommend_click` / `recommend_exposure`

---

### 失败原因分析

**手机号输入失败**：
```sql
SELECT reason, COUNT(*) as count
FROM events
WHERE event = 'phone_validate_fail'
GROUP BY reason
```

**验证码失败**：
```sql
SELECT reason, COUNT(*) as count
FROM events
WHERE event = 'verify_fail'
GROUP BY reason
```

**订购失败**：
```sql
SELECT reason, COUNT(*) as count
FROM events
WHERE event = 'subscription_fail'
GROUP BY reason
```

---

### 用户留存分析

**多次订购失败后的行为**：
```javascript
// 统计点击 "Back to Home" 的用户占比
const totalFailures = events.filter(e => e.event === 'subscription_fail').length
const backHomeClicks = events.filter(e => 
  e.event === 'result_action_click' && e.action === 'back_home'
).length

console.log(`放弃率: ${(backHomeClicks / totalFailures * 100).toFixed(1)}%`)
```

---

### 会话分析

**每个会话的完整路径**：
```javascript
const sessionEvents = events.filter(e => e.session_id === 'session_xxx')
  .map(e => e.event)
  .join(' → ')

console.log(sessionEvents)
// 输出：page_view → video_exposure → video_play → subscribe_click → phone_page_view → ...
```

---

### A/B测试支持

在埋点中携带实验标识：

```javascript
track('subscribe_click', {
  video_id: 'xxx',
  ab_test: 'price_test_v2',  // 实验标识
  variant: 'group_A'          // 实验分组
})
```

分析不同分组的转化率：
```javascript
const groupA = events.filter(e => e.variant === 'group_A')
const groupB = events.filter(e => e.variant === 'group_B')

const conversionA = groupA.filter(e => e.event === 'subscription_success').length / 
                    groupA.filter(e => e.event === 'subscribe_click').length

const conversionB = groupB.filter(e => e.event === 'subscription_success').length / 
                    groupB.filter(e => e.event === 'subscribe_click').length

console.log(`Group A: ${(conversionA * 100).toFixed(1)}%`)
console.log(`Group B: ${(conversionB * 100).toFixed(1)}%`)
```

---

## 总结

### ✅ 已完成

1. ✅ 统一埋点引擎（`tracking.js`）
2. ✅ 三个页面的埋点管理器（独立模块）
3. ✅ 业务代码解耦（无内联埋点）
4. ✅ LocalStorage自动存储
5. ✅ Console彩色输出
6. ✅ 可视化数据查看器
7. ✅ 导出JSON功能
8. ✅ 会话管理和页面计时
9. ✅ 预留GA/Firebase/自建API接口

### 📊 埋点覆盖

- **26种核心事件**
- **3个页面完整覆盖**
- **用户行为路径完整**
- **失败原因详细追踪**

### 🚀 下一步

1. 根据真实业务场景调整事件参数
2. 接入生产环境数据平台（GA4 / Firebase）
3. 搭建数据看板（Grafana / Tableau）
4. 设置关键指标告警

---

**文档版本**：v1.0  
**更新时间**：2024  
**维护者**：前端团队
