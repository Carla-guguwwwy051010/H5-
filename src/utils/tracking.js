/* ==================== 统一埋点系统 ==================== */

/**
 * 埋点配置
 */
const TRACKING_CONFIG = {
  enabled: true,                    // 全局开关
  console: true,                    // 是否打印console
  storage: true,                    // 是否存储到localStorage
  storageKey: 'video_rbt_events',   // 统一 localStorage key（三页共享）
  maxStorageSize: 200,              // 最多保存200条
  debugMode: true,                  // Debug模式（Demo阶段）

  // 未来可扩展配置
  endpoints: {
    // ga: 'UA-XXXXXXX',
    // firebase: 'AIzaSyXXXXXXXXX',
    // custom: 'https://api.example.com/track'
  }
};

/**
 * 会话信息（页面生命周期内保持）
 */
let sessionInfo = {
  sessionId: generateSessionId(),
  startTime: Date.now(),
  country: 'KE',
  platform: detectPlatform(),
  userAgent: navigator.userAgent,
  screenSize: `${window.screen.width}x${window.screen.height}`,
  viewportSize: `${window.innerWidth}x${window.innerHeight}`
};

/**
 * 页面计时器（用于停留时长统计）
 */
let pageTimers = {};

/**
 * 核心埋点方法
 * @param {string} eventName - 事件名称
 * @param {object} eventParams - 事件参数
 */
export function track(eventName, eventParams = {}) {
  if (!TRACKING_CONFIG.enabled) return;

  const timestamp = Date.now();
  // 统一嵌套结构：{ event, timestamp, params:{...} }
  // params 内合并会话信息，session_id 提升到顶层方便读取端使用
  const eventData = {
    event: eventName,
    timestamp: new Date(timestamp).toISOString(),
    time_ms: timestamp,
    session_id: sessionInfo.sessionId,
    params: {
      ...sessionInfo,
      ...eventParams
    }
  };

  // 1. Console输出
  if (TRACKING_CONFIG.console) {
    console.log(
      `%c[Tracking]%c ${eventName}`,
      'color: #4CAF50; font-weight: bold; font-size: 12px;',
      'color: #333; font-weight: normal;',
      '\n📊 Params:', eventParams,
      '\n🔍 Full Data:', eventData
    );
  }

  // 2. 存储到localStorage
  if (TRACKING_CONFIG.storage) {
    saveToStorage(eventData);
  }

  // 3. 发送到数据平台（Demo阶段模拟）
  if (TRACKING_CONFIG.debugMode) {
    simulateSend(eventData);
  } else {
    // 未来对接真实平台
    // sendToGA(eventData);
    // sendToFirebase(eventData);
    // sendToCustomAPI(eventData);
  }

  // 4. 触发自定义事件（供其他模块监听）
  window.dispatchEvent(new CustomEvent('tracking', { detail: eventData }));
}

/**
 * 保存事件到localStorage
 */
function saveToStorage(eventData) {
  try {
    const stored = localStorage.getItem(TRACKING_CONFIG.storageKey);
    const data = stored ? JSON.parse(stored) : { events: [] };
    // 兼容异常/空结构
    if (!Array.isArray(data.events)) data.events = [];

    data.events.push(eventData);

    // 限制存储数量
    if (data.events.length > TRACKING_CONFIG.maxStorageSize) {
      data.events = data.events.slice(-TRACKING_CONFIG.maxStorageSize);
    }

    localStorage.setItem(TRACKING_CONFIG.storageKey, JSON.stringify(data));
  } catch (e) {
    console.error('[Tracking] Failed to save to localStorage:', e);
  }
}

/**
 * 模拟发送到服务器（Demo阶段）
 */
function simulateSend(eventData) {
  // 模拟网络延迟
  setTimeout(() => {
    if (Math.random() > 0.95) {
      console.warn('[Tracking] Simulated send failure:', eventData.event);
    }
  }, Math.random() * 100);
}

/**
 * 获取所有埋点记录
 */
export function getTrackingEvents() {
  try {
    const stored = localStorage.getItem(TRACKING_CONFIG.storageKey);
    if (!stored) return [];
    const data = JSON.parse(stored);
    return Array.isArray(data.events) ? data.events : [];
  } catch (e) {
    console.error('[Tracking] Failed to get events:', e);
    return [];
  }
}

/**
 * 统计摘要（供 admin / viewer 复用逻辑参考）
 * 注意：viewer/admin 为独立 HTML，会内联同一套读取逻辑；此处为应用侧调试用。
 */
export function getStats() {
  const events = getTrackingEvents();
  const count = (name) => events.filter(e => e.event === name).length;
  const pageViews = count('page_view');
  const subscribeClicks = count('subscribe_click') + count('fullscreen_subscribe_click');
  const success = count('subscription_success');

  // 今日访问（page_view，按本地日期）
  const today = new Date().toDateString();
  const todayViews = events.filter(e =>
    e.event === 'page_view' && new Date(e.timestamp).toDateString() === today
  ).length;

  return {
    totalEvents: events.length,
    todayViews,
    videoPlays: count('video_play'),
    subscribeClicks,
    subscriptionSuccess: success,
    conversionRate: subscribeClicks > 0 ? +((success / subscribeClicks) * 100).toFixed(1) : 0
  };
}

/**
 * 转化漏斗：page_view → video_play → subscribe_click → verify_success → subscription_success
 */
export function getFunnel() {
  const events = getTrackingEvents();
  const count = (name) => events.filter(e => e.event === name).length;
  return [
    { step: 'page_view', label: 'Page View', value: count('page_view') },
    { step: 'video_play', label: 'Video Play', value: count('video_play') },
    { step: 'subscribe_click', label: 'Subscribe Click', value: count('subscribe_click') + count('fullscreen_subscribe_click') },
    { step: 'verify_success', label: 'Verify Success', value: count('verify_success') },
    { step: 'subscription_success', label: 'Subscription Success', value: count('subscription_success') }
  ];
}

/**
 * 清空埋点记录
 */
export function clearTrackingEvents() {
  try {
    localStorage.removeItem(TRACKING_CONFIG.storageKey);
    console.log('[Tracking] Events cleared');
  } catch (e) {
    console.error('[Tracking] Failed to clear events:', e);
  }
}

/**
 * 导出埋点数据为JSON
 */
export function exportTrackingData() {
  const events = getTrackingEvents();
  const dataStr = JSON.stringify(events, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tracking_data_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  console.log('[Tracking] Data exported:', events.length, 'events');
}

/**
 * 页面浏览埋点
 */
export function trackPageView(pageName, extraParams = {}) {
  track('page_view', {
    page: pageName,
    country: sessionInfo.country,
    referrer: document.referrer,
    url: window.location.href,
    ...extraParams
  });

  // 开始页面计时
  pageTimers[pageName] = Date.now();
}

/**
 * 页面退出埋点
 */
export function trackPageExit(pageName) {
  const startTime = pageTimers[pageName];
  const stayTime = startTime ? Date.now() - startTime : 0;

  track('page_exit', {
    page: pageName,
    stay_time_ms: stayTime,
    stay_time_sec: Math.round(stayTime / 1000)
  });

  delete pageTimers[pageName];
}

/**
 * 曝光埋点（元素可见超过指定时长）
 */
export function trackExposure(elementId, callback, duration = 1000) {
  let timer = null;
  let isTracked = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isTracked) {
        timer = setTimeout(() => {
          callback();
          isTracked = true;
          observer.disconnect();
        }, duration);
      } else {
        if (timer) clearTimeout(timer);
      }
    });
  }, { threshold: 0.5 });

  const element = document.getElementById(elementId);
  if (element) {
    observer.observe(element);
  }

  return () => {
    if (timer) clearTimeout(timer);
    observer.disconnect();
  };
}

/**
 * 生成会话ID
 */
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 检测平台
 */
function detectPlatform() {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'Android';
  if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
  return 'Web';
}

/**
 * 未来：对接Google Analytics
 */
function sendToGA(eventData) {
  if (window.gtag) {
    window.gtag('event', eventData.event, eventData);
  }
}

/**
 * 未来：对接Firebase
 */
function sendToFirebase(eventData) {
  if (window.firebase && window.firebase.analytics) {
    window.firebase.analytics().logEvent(eventData.event, eventData);
  }
}

/**
 * 未来：对接自建API
 */
function sendToCustomAPI(eventData) {
  fetch(TRACKING_CONFIG.endpoints.custom, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  }).catch(e => console.error('[Tracking] API send failed:', e));
}

/**
 * 页面卸载时自动埋点
 */
window.addEventListener('beforeunload', () => {
  Object.keys(pageTimers).forEach(page => {
    trackPageExit(page);
  });
});

// Debug工具：全局暴露查看方法
if (TRACKING_CONFIG.debugMode) {
  window.__tracking__ = {
    getEvents: getTrackingEvents,
    clearEvents: clearTrackingEvents,
    exportData: exportTrackingData,
    config: TRACKING_CONFIG,
    session: sessionInfo
  };
  console.log(
    '%c[Tracking Debug]%c Available: window.__tracking__',
    'color: #FF9800; font-weight: bold;',
    'color: #666;'
  );
}
