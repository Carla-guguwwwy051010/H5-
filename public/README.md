# Public Assets

此目录用于存放静态资源文件。

## 📁 目录结构（规划）

```
public/
├── videos/              # 视频文件
│   ├── magic-companion.mp4
│   ├── dance-party.mp4
│   └── ...
├── images/              # 图片资源
│   ├── thumbnails/      # 视频缩略图
│   ├── icons/           # 图标
│   └── banners/         # Banner图
├── fonts/               # 字体文件（可选）
└── favicon.ico          # 网站图标
```

## 🎯 使用说明

### 当前状态

项目目前使用**在线视频资源**（通过 URL 引用），因此 `public/` 目录暂时为空。

### 未来使用

当需要本地化视频资源时：

1. 将视频文件放入 `public/videos/`
2. 更新 `index.html` 中的视频路径：

```html
<!-- 修改前：在线资源 -->
<video src="https://example.com/video.mp4"></video>

<!-- 修改后：本地资源 -->
<video src="/videos/magic-companion.mp4"></video>
```

## 📦 资源优化建议

### 视频文件
- **格式**：推荐 MP4 (H.264 编码)
- **分辨率**：竖屏 720x1280 或 1080x1920
- **码率**：2-4 Mbps
- **大小**：单个文件 < 10MB

### 图片文件
- **格式**：WebP 优先，PNG/JPG 备用
- **缩略图**：建议 300x400px
- **压缩**：使用 TinyPNG 或 ImageOptim

### 性能优化
- 启用 CDN 加速
- 配置缓存策略
- 使用 lazy loading

## 🚀 Vite 处理方式

Vite 会自动处理 `public/` 目录：

- 开发环境：直接访问 `http://localhost:5173/videos/xxx.mp4`
- 生产构建：文件会被复制到 `dist/` 根目录

## 📝 注意事项

1. ⚠️ `public/` 中的文件**不会**被 Vite 编译或压缩
2. ⚠️ 大文件建议使用 CDN，不要放在此目录
3. ✅ 小于 1MB 的资源可以放在此目录
4. ✅ favicon、robots.txt 等必须放在此目录

---

**最后更新**：2024-08-03
