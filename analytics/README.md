# Analytics Tools

数据分析工具集，用于查看和分析用户行为埋点数据。

## 📊 Tracking Viewer

实时查看埋点事件的可视化工具。

### 访问地址

**开发环境**：
```
http://localhost:5173/analytics/viewer.html
```

**生产环境**：
```
https://yourdomain.com/analytics/viewer.html
```

### 功能特性

- ✅ **实时统计** - 总事件数、订阅点击、转化率
- ✅ **事件列表** - 按时间倒序展示所有埋点事件
- ✅ **筛选功能** - 按事件类型筛选、关键词搜索
- ✅ **数据导出** - 导出 JSON 格式数据
- ✅ **自动刷新** - 每 5 秒自动更新数据

### 数据来源

埋点数据存储在浏览器 `localStorage` 中：
```javascript
localStorage.getItem('user_events')
```

### 使用方法

1. 打开主应用 http://localhost:5173
2. 浏览页面、点击按钮、完成订购流程
3. 打开 Tracking Viewer 查看生成的埋点数据
4. 使用筛选功能定位特定事件
5. 导出 JSON 进行深度分析

### 调试工具

在浏览器 Console 中可用：

```javascript
// 查看所有事件
window.__tracking__.getEvents()

// 清空数据
window.__tracking__.clearEvents()

// 导出数据
window.__tracking__.exportData()

// 查看配置
window.__tracking__.config

// 查看会话信息
window.__tracking__.session
```

## 📈 未来升级计划

当前的 `viewer.html` 是 Demo 阶段的简单工具，未来可升级为完整的 Dashboard：

```
analytics/
├── viewer.html              # 当前查看器
└── dashboard/               # 未来 Dashboard
    ├── index.html
    ├── scripts/
    │   ├── charts.js        # 图表库
    │   ├── filters.js       # 高级筛选
    │   └── export.js        # 导出工具
    └── styles/
        └── dashboard.css
```

### Dashboard 功能规划

- 📊 **可视化图表** - 折线图、饼图、漏斗图
- 🔍 **高级筛选** - 时间范围、用户分群、事件组合
- 📈 **指标看板** - 转化率、跳出率、平均停留时长
- 📥 **多格式导出** - JSON / CSV / Excel
- 🔔 **实时告警** - 异常事件自动提醒
- 🎯 **A/B 测试分析** - 对比不同版本效果

## 🚀 接入真实数据平台

详见 [TRACKING.md](../docs/TRACKING.md) 中的"接入真实平台"章节。

支持接入：
- Google Analytics (GA4)
- Firebase Analytics
- 自建 API

## 📝 数据格式

### 事件对象结构

```json
{
  "event": "subscribe_click",
  "timestamp": "2024-08-03T15:30:45.123Z",
  "time_ms": 1722698445123,
  "session_id": "session_1722698400000_abc123xyz",
  "country": "KE",
  "platform": "Web",
  "userAgent": "Mozilla/5.0...",
  "screenSize": "1920x1080",
  "viewportSize": "430x932",
  "video_id": "magic_companion",
  "source": "grid",
  "position": 1
}
```

### 核心事件类型

完整事件列表见 [TRACKING.md](../docs/TRACKING.md)。

主要类别：
- **页面浏览** - page_view, page_exit
- **视频交互** - video_play, video_pause, video_complete
- **推荐交互** - recommend_exposure, recommend_click
- **订购流程** - subscribe_click, subscription_success, subscription_fail

## 🛠️ 故障排查

### 问题：打开 viewer.html 显示空白

**原因**：没有生成埋点数据

**解决**：
1. 先访问主应用 http://localhost:5173
2. 随意操作（点击视频、订阅按钮等）
3. 再打开 viewer.html

### 问题：viewer.html 访问 404

**原因**：开发服务器未启动

**解决**：
```bash
npm run dev
```

### 问题：数据不更新

**刷新方法**：
- 点击页面上的 "🔄 Refresh" 按钮
- 或等待 5 秒自动刷新

### 问题：想清空所有数据

```javascript
// Console 执行
window.__tracking__.clearEvents()

// 或在 viewer.html 中点击 "🗑️ Clear All"
```

## 📧 联系方式

如有问题或建议，请联系项目负责人。

---

**文档版本**：v1.0  
**最后更新**：2024-08-03
