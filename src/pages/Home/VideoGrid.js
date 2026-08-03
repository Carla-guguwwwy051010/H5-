/* ==================== 双列彩铃推荐区域（竖向长方形+大屏播放器） ==================== */

export function initGrid() {
  // 为所有带 data-video-item 属性的 media-box 添加交互
  const mediaBoxes = document.querySelectorAll('[data-video-item]');
  const videoPlayerModal = document.getElementById('videoPlayerModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeVideoPlayer = document.getElementById('closeVideoPlayer');
  const audioControlPanel = document.getElementById('audioControlPanel');
  const videoPlayerControls = document.getElementById('videoPlayerControls');
  const startPlayBtn = document.getElementById('startPlayBtn');
  const audioOptionBtns = document.querySelectorAll('.audio-option-btn');
  const modalMuteBtn = document.getElementById('modalMuteBtn');
  const modalPlayPauseBtn = document.getElementById('modalPlayPauseBtn');

  let currentVideoSrc = '';
  let selectedMuted = true; // 默认静音
  let isPlaying = false;

  // 监听顶部轮播的打开大屏事件
  window.addEventListener('openVideoPlayer', (e) => {
    const { videoSrc, videoId } = e.detail;
    openVideoPlayer(videoSrc, videoId);
  });

  // 点击图片占位框打开大屏播放器
  mediaBoxes.forEach((mediaBox) => {
    const videoSrc = mediaBox.dataset.videoSrc;
    const posterSrc = mediaBox.dataset.poster;
    const videoId = mediaBox.dataset.videoItem;

    if (!videoSrc) return;

    // 点击打开大屏播放器
    mediaBox.addEventListener('click', () => {
      openVideoPlayer(videoSrc, videoId, posterSrc);
    });
  });

  // 音频选项按钮点击
  audioOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 移除其他按钮的选中状态
      audioOptionBtns.forEach(b => b.classList.remove('selected'));
      // 添加选中状态
      btn.classList.add('selected');
      // 获取选中的静音状态
      selectedMuted = btn.dataset.muted === 'true';
    });
  });

  // 默认选中静音选项
  audioOptionBtns[0].classList.add('selected');

  // 开始播放按钮
  if (startPlayBtn) {
    startPlayBtn.addEventListener('click', () => {
      startPlayback();
    });
  }

  // 静音按钮（播放中）
  if (modalMuteBtn) {
    modalMuteBtn.addEventListener('click', () => {
      toggleMute();
    });
  }

  // 播放/暂停按钮
  if (modalPlayPauseBtn) {
    modalPlayPauseBtn.addEventListener('click', () => {
      togglePlayPause();
    });
  }

  // 关闭播放器
  if (closeVideoPlayer) {
    closeVideoPlayer.addEventListener('click', () => {
      closePlayer();
    });
  }

  // 点击遮罩层关闭
  if (videoPlayerModal) {
    videoPlayerModal.addEventListener('click', (e) => {
      if (e.target === videoPlayerModal) {
        closePlayer();
      }
    });
  }

  // 打开视频播放器
  function openVideoPlayer(videoSrc, videoId, posterSrc) {
    currentVideoSrc = videoSrc;

    // 派发事件供埋点监听
    window.dispatchEvent(new CustomEvent('openVideoPlayer', {
      detail: { videoId, videoSrc, posterSrc }
    }));

    // 重置状态
    selectedMuted = true;
    audioOptionBtns.forEach(b => b.classList.remove('selected'));
    audioOptionBtns[0].classList.add('selected');

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

    // 设置视频源（先不显示视频画面，等用户选择音频后播放）
    modalVideo.style.display = 'block';
    modalVideo.src = videoSrc;
    modalVideo.muted = true;
    modalVideo.loop = true;

    // 显示音频控制面板，让用户先选择静音/有声
    audioControlPanel.style.display = 'block';
    videoPlayerControls.style.display = 'none';

    // 显示 Modal
    videoPlayerModal.classList.add('active');

    // 埋点：视频曝光（大屏）
    trackVideoExposure(videoId, 'fullscreen');
  }

  // 开始播放
  function startPlayback() {
    // 隐藏音频控制面板
    audioControlPanel.style.display = 'none';

    // 应用用户选择的静音状态
    modalVideo.muted = selectedMuted;

    // 更新静音按钮
    if (modalMuteBtn) {
      modalMuteBtn.textContent = selectedMuted ? '🔇' : '🔊';
    }

    // 播放视频
    modalVideo.play()
      .then(() => {
        isPlaying = true;
        // 显示播放控制条
        videoPlayerControls.style.display = 'flex';
        // 更新播放按钮
        if (modalPlayPauseBtn) {
          modalPlayPauseBtn.textContent = '⏸';
        }
      })
      .catch(err => {
        console.error('Failed to play video:', err);
        showToast('Failed to play video');
      });
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

  // 关闭播放器
  function closePlayer() {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = '';
    modalVideo.poster = '';
    modalVideo.style.display = 'block';
    isPlaying = false;

    // 清理背景图片
    const container = document.querySelector('.video-player-container');
    container.style.backgroundImage = 'none';

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
