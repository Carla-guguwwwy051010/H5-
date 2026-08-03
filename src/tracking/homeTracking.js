/* ==================== 首页视频埋点管理器 ==================== */
import { track, trackExposure } from '../utils/tracking.js';

/**
 * 初始化首页埋点
 */
export function initHomeTracking() {
  // 页面浏览已在 main.js 统一处理

  // 初始化顶部轮播视频埋点
  initCarouselTracking();

  // 初始化推荐区域埋点
  initRecommendTracking();

  // 初始化订阅按钮埋点
  initSubscribeTracking();
}

/**
 * 顶部轮播视频埋点
 */
function initCarouselTracking() {
  const carouselCards = document.querySelectorAll('.carousel-card');

  carouselCards.forEach((card, index) => {
    const videoId = `carousel_${index + 1}`;
    const video = card.querySelector('video');

    if (!video) return;

    // 曝光埋点（卡片展示超过1秒）
    trackExposure(card.id || `carousel-card-${index}`, () => {
      track('video_exposure', {
        video_id: videoId,
        position: 'hero',
        index: index
      });
    }, 1000);

    // 视频播放埋点
    video.addEventListener('play', () => {
      track('video_play', {
        video_id: videoId,
        position: 'carousel',
        autoplay: video.autoplay,
        muted: video.muted
      });
    });

    // 视频暂停埋点
    video.addEventListener('pause', () => {
      track('video_pause', {
        video_id: videoId,
        position: 'carousel',
        current_time: Math.round(video.currentTime)
      });
    });

    // 视频播放完成埋点
    video.addEventListener('ended', () => {
      track('video_complete', {
        video_id: videoId,
        position: 'carousel',
        duration: Math.round(video.duration)
      });
    });
  });
}

/**
 * 推荐区域埋点
 */
function initRecommendTracking() {
  const recommendCards = document.querySelectorAll('.glass-card');

  recommendCards.forEach((card, index) => {
    const titleEl = card.querySelector('.media-title');
    const videoId = titleEl?.textContent?.trim().replace(/\s+/g, '_').toLowerCase() || `video_${index + 1}`;
    const mediaBox = card.querySelector('.media-box, .media-box-rect');

    if (!mediaBox) return;

    // 曝光埋点（卡片进入可视区域）
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          track('recommend_exposure', {
            video_id: videoId,
            position: index + 1,
            card_type: card.querySelector('.state-box') ? 'placeholder' : 'video'
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(card);

    // 点击埋点
    mediaBox.addEventListener('click', () => {
      track('recommend_click', {
        video_id: videoId,
        position: index + 1,
        source: 'grid'
      });
    });
  });
}

/**
 * 订阅按钮埋点
 */
function initSubscribeTracking() {
  const subscribeButtons = document.querySelectorAll('.subscribe-btn');

  subscribeButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.glass-card');
      const titleEl = card?.querySelector('.media-title');
      const videoId = titleEl?.textContent?.trim().replace(/\s+/g, '_').toLowerCase() || 'unknown';

      track('subscribe_click', {
        video_id: videoId,
        source: 'recommend_grid',
        position: index + 1
      });
    });
  });

  // Hero CTA按钮
  const heroBtn = document.getElementById('heroSubscribeBtn');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => {
      track('subscribe_click', {
        video_id: 'hero_video',
        source: 'hero_cta',
        position: 0
      });
    });
  }
}

/**
 * 大屏视频播放器埋点
 */
export function initVideoPlayerTracking() {
  const modal = document.getElementById('videoPlayerModal');
  const video = document.getElementById('modalVideo');
  const muteBtn = document.getElementById('modalMuteBtn');
  const playPauseBtn = document.getElementById('modalPlayPauseBtn');

  let currentVideoId = null;

  // 监听打开播放器事件
  window.addEventListener('openVideoPlayer', (e) => {
    currentVideoId = e.detail?.videoId || 'unknown';

    track('video_fullscreen_click', {
      video_id: currentVideoId
    });
  });

  // 视频播放
  video.addEventListener('play', () => {
    if (!currentVideoId) return;
    track('video_play', {
      video_id: currentVideoId,
      position: 'fullscreen',
      autoplay: false,
      muted: video.muted
    });
  });

  // 视频暂停
  video.addEventListener('pause', () => {
    if (!currentVideoId) return;
    track('video_pause', {
      video_id: currentVideoId,
      position: 'fullscreen',
      current_time: Math.round(video.currentTime)
    });
  });

  // 视频播放完成
  video.addEventListener('ended', () => {
    if (!currentVideoId) return;
    track('video_complete', {
      video_id: currentVideoId,
      position: 'fullscreen',
      duration: Math.round(video.duration)
    });
  });

  // 声音切换
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const before = video.muted ? 'mute' : 'unmute';
      const after = !video.muted ? 'mute' : 'unmute';

      track('video_sound_change', {
        video_id: currentVideoId,
        before: before,
        after: after
      });
    });
  }

  // 播放/暂停按钮
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      // play/pause 事件会自动触发上面的埋点
    });
  }
}
