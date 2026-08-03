import './styles/global.css'
import { initCarousel, initGrid, initModal } from './pages/Home/index.js'
import { initVerificationPage } from './pages/Verification/index.js'
import { initResultPage } from './pages/Result/index.js'
import { trackPageView } from './utils/tracking.js'
import { initHomeTracking, initVideoPlayerTracking } from './tracking/homeTracking.js'
import { initPhoneVerificationTracking } from './tracking/verificationTracking.js'
import { initResultPageTracking } from './tracking/resultTracking.js'

// 初始化所有组件
document.addEventListener('DOMContentLoaded', () => {
  // 业务页面初始化
  initCarousel();
  initGrid();
  initModal();         // Subscribe 按钮 → 手机号验证页

  // 验证页和结果页初始化
  const verificationState = initVerificationPage();  // 手机号验证页
  initResultPage(verificationState);                 // 订购结果页

  // 埋点系统初始化
  trackPageView('home');           // 首页浏览埋点
  initHomeTracking();              // 首页视频、推荐、订阅埋点
  initVideoPlayerTracking();       // 大屏播放器埋点
  initPhoneVerificationTracking(); // 手机号验证页埋点
  initResultPageTracking();        // 订购结果页埋点
});
