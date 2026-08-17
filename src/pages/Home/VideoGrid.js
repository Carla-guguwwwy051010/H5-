/* ==================== 双列彩铃推荐区域（竖向长方形+大屏播放器） ==================== */

export function initGrid() {
  console.log('initGrid called');

  // 为所有带 data-video-item 属性的 media-box 添加交互
  const mediaBoxes = document.querySelectorAll('[data-video-item]');
  const videoPlayerModal = document.getElementById('videoPlayerModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeVideoPlayer = document.getElementById('closeVideoPlayer');
  const videoPlayerControls = document.getElementById('videoPlayerControls');
  const modalMuteBtn = document.getElementById('modalMuteBtn');
  const modalPlayPauseBtn = document.getElementById('modalPlayPauseBtn');

  console.log('Elements check:', {
    videoPlayerModal: !!videoPlayerModal,
    modalVideo: !!modalVideo,
    closeVideoPlayer: !!closeVideoPlayer,
    videoPlayerControls: !!videoPlayerControls,
    modalMuteBtn: !!modalMuteBtn,
    modalPlayPauseBtn: !!modalPlayPauseBtn
  });

  // 大屏底部订购信息区
  const fsToneName = document.getElementById('fsToneName');
  const fsSubscribeBtn = document.getElementById('fsSubscribeBtn');

  // 退出挽回弹窗
  const exitRetentionModal = document.getElementById('exitRetentionModal');
  const retentionSubscribeBtn = document.getElementById('retentionSubscribeBtn');
  const retentionContinueBtn = document.getElementById('retentionContinueBtn');

  let currentVideoSrc = '';
  let currentVideoId = '';
  let currentVideoName = 'Video Ringtone';
  let isPlaying = false;

  // 监听顶部轮播的打开大屏事件
  window.addEventListener('openVideoPlayer', (e) => {
    const { videoSrc, videoId, videoName } = e.detail;
    openVideoPlayer(videoSrc, videoId, undefined, videoName);
  });

  // 点击图片占位框打开大屏播放器
  mediaBoxes.forEach((mediaBox) => {
    const videoSrc = mediaBox.dataset.videoSrc;
    const posterSrc = mediaBox.dataset.poster;
    const videoId = mediaBox.dataset.videoItem;
    const videoName = getCardName(mediaBox);

    if (!videoSrc) return;

    // 点击封面（自带播放提示）打开大屏预览
    mediaBox.addEventListener('click', () => {
      // 埋点：预览点击
      window.dispatchEvent(new CustomEvent('previewClick', {
        detail: { videoId, videoName }
      }));
      openVideoPlayer(videoSrc, videoId, posterSrc, videoName);
    });
  });

  // 从卡片读取彩铃名称
  function getCardName(el) {
    const card = el?.closest ? el.closest('.glass-card') : el;
    return card?.querySelector('.media-title')?.textContent?.trim() || 'Video Ringtone';
  }

  // 大屏底部 Subscribe Now → 手机号验证（保持挂载状态供三态复用）
  if (fsSubscribeBtn) {
    fsSubscribeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startSubscribeFromFullscreen();
    });
  }

  // 退出挽回：Subscribe Now → 手机号验证
  if (retentionSubscribeBtn) {
    retentionSubscribeBtn.addEventListener('click', () => {
      exitRetentionModal.classList.remove('active');
      startSubscribeFromFullscreen();
    });
  }

  // 退出挽回：继续浏览 → 真正关闭大屏
  if (retentionContinueBtn) {
    retentionContinueBtn.addEventListener('click', () => {
      exitRetentionModal.classList.remove('active');
      doClosePlayer();
    });
  }

  // 从大屏发起订购：检查网络模式，Mode B 一键订购，否则手机验证
  function startSubscribeFromFullscreen() {
    window.dispatchEvent(new CustomEvent('fullscreenSubscribeClick', {
      detail: { videoId: currentVideoId, videoName: currentVideoName }
    }));
    doClosePlayer();

    // 检查网络模式（与卡片 Subscribe 逻辑一致）
    const networkMode = document.getElementById('networkMode')?.value || 'A';

    if (networkMode === 'B') {
      // Mode B：蜂窝数据用户 → 一键订购
      window.dispatchEvent(new CustomEvent('directSubscribe', {
        detail: { toneName: currentVideoName, toneThumb: modalVideo.poster || '' }
      }));
    } else {
      // Mode A / C：WiFi/新访客 → 手机号验证
      window.dispatchEvent(new CustomEvent('openPhoneVerification', {
        detail: { toneName: currentVideoName, toneThumb: modalVideo.poster || '' }
      }));
    }
  }

  // 静音按钮（播放中）
  if (modalMuteBtn) {
    console.log('Mute button found:', modalMuteBtn);
    modalMuteBtn.addEventListener('click', (e) => {
      console.log('Mute button clicked!');
      e.stopPropagation();
      toggleMute();
    });
  } else {
    console.error('Mute button NOT found!');
  }

  // 播放/暂停按钮
  if (modalPlayPauseBtn) {
    console.log('Play/Pause button found:', modalPlayPauseBtn);
    modalPlayPauseBtn.addEventListener('click', (e) => {
      console.log('Play/Pause button clicked!');
      e.stopPropagation();
      togglePlayPause();
    });
  } else {
    console.error('Play/Pause button NOT found!');
  }

  // 关闭播放器 → 先弹退出挽回弹窗
  if (closeVideoPlayer) {
    closeVideoPlayer.addEventListener('click', (e) => {
      e.stopPropagation();
      requestClosePlayer();
    });
  }

  // 点击遮罩层 → 弹退出挽回弹窗
  if (videoPlayerModal) {
    videoPlayerModal.addEventListener('click', (e) => {
      if (e.target === videoPlayerModal) {
        requestClosePlayer();
      }
    });
  }

  // 状态2：点击视频区域切换控制层显隐（Subscribe 常驻不受影响）
  if (modalVideo) {
    modalVideo.addEventListener('click', () => {
      // 切换控制层显隐
      const controlsVisible = videoPlayerControls.style.display !== 'none';
      videoPlayerControls.style.display = controlsVisible ? 'none' : 'flex';
    });
  }

  // 打开视频播放器
  function openVideoPlayer(videoSrc, videoId, posterSrc, videoName) {
    currentVideoSrc = videoSrc;
    currentVideoId = videoId || 'unknown';
    currentVideoName = videoName || 'Video Ringtone';

    // 填充底部信息区
    if (fsToneName) fsToneName.textContent = currentVideoName;

    // 派发进入大屏事件供埋点监听（独立事件名，避免与 openVideoPlayer 递归）
    window.dispatchEvent(new CustomEvent('fullscreenView', {
      detail: { videoId: currentVideoId, videoName: currentVideoName, videoSrc, posterSrc }
    }));

    const container = document.querySelector('.video-player-container');

    // 使用静态图片作为背景占位（播放前展示）
    if (posterSrc) {
      container.style.backgroundImage = `url(${posterSrc})`;
      container.style.backgroundSize = 'cover';
      container.style.backgroundPosition = 'center';
      modalVideo.poster = posterSrc;
    } else {
      container.style.backgroundImage = 'none';
    }

    // 设置视频源并立即静音自动播放
    modalVideo.style.display = 'block';
    modalVideo.src = videoSrc;
    modalVideo.muted = true;  // 默认静音
    modalVideo.loop = true;

    // 显示 Modal
    videoPlayerModal.classList.add('active');

    // 立即播放视频
    modalVideo.play()
      .then(() => {
        isPlaying = true;
        // 显示播放控制条
        videoPlayerControls.style.display = 'flex';
        console.log('Video playing, controls display:', videoPlayerControls.style.display);
        console.log('Controls visible:', window.getComputedStyle(videoPlayerControls).display);
        // 更新按钮状态
        if (modalMuteBtn) modalMuteBtn.textContent = '🔇';
        if (modalPlayPauseBtn) modalPlayPauseBtn.textContent = '⏸';
      })
      .catch(err => {
        console.error('Failed to play video:', err);
        showToast('Failed to play video');
      });

    // 埋点：视频曝光（大屏）
    trackVideoExposure(videoId, 'fullscreen');
  }

  // 切换静音
  function toggleMute() {
    modalVideo.muted = !modalVideo.muted;

    if (modalMuteBtn) {
      modalMuteBtn.textContent = modalVideo.muted ? '🔇' : '🔊';
    }
  }

  // 切换播放/暂停
  function togglePlayPause() {
    console.log('togglePlayPause called, paused:', modalVideo.paused);
    if (modalVideo.paused) {
      modalVideo.play().catch(() => {});
      isPlaying = true;
      if (modalPlayPauseBtn) {
        modalPlayPauseBtn.textContent = '⏸';
      }
    } else {
      modalVideo.pause();
      isPlaying = false;
      if (modalPlayPauseBtn) {
        modalPlayPauseBtn.textContent = '▶';
      }
    }
  }

  // 请求关闭 → 埋点 + 弹出退出挽回弹窗（状态3）
  function requestClosePlayer() {
    window.dispatchEvent(new CustomEvent('fullscreenExitClick', {
      detail: { videoId: currentVideoId, videoName: currentVideoName }
    }));
    // 暂停视频但不关闭，等待用户在弹窗中选择
    if (!modalVideo.paused) {
      modalVideo.pause();
      isPlaying = false;
      if (modalPlayPauseBtn) modalPlayPauseBtn.textContent = '▶';
    }
    exitRetentionModal.classList.add('active');
  }

  // 真正关闭播放器
  function doClosePlayer() {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = '';
    modalVideo.poster = '';
    modalVideo.style.display = 'block';
    isPlaying = false;

    // 清理背景图片
    const container = document.querySelector('.video-player-container');
    container.style.backgroundImage = 'none';

    // 重置控制层与信息区，避免下次打开残留
    videoPlayerControls.style.display = 'none';

    videoPlayerModal.classList.remove('active');
  }

  // 显示提示消息
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 2000);
  }
}
