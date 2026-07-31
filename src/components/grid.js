/* ==================== 列表视频的声音切换 ==================== */

export function initGrid() {
  // 为所有带 data-video-toggle 属性的 media-box 添加点击事件
  const mediaBoxes = document.querySelectorAll('[data-video-toggle]');

  mediaBoxes.forEach(mediaBox => {
    mediaBox.addEventListener('click', () => {
      toggleVideoSound(mediaBox);
    });

    // 确保视频能够播放
    const video = mediaBox.querySelector('video');
    if (video) {
      // 尝试播放视频
      video.play().catch(err => {
        console.log('Autoplay prevented, will play on user interaction:', err);
      });

      // 添加视频加载错误处理
      video.addEventListener('error', (e) => {
        console.error('Video failed to load:', video.src, e);
      });

      video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully:', video.src);
        // 视频加载完成后尝试播放
        video.play().catch(() => {});
      });
    }
  });

  // 使用 Intersection Observer 来优化视频加载
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video');
        if (video) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      });
    }, { threshold: 0.5 });

    mediaBoxes.forEach(box => observer.observe(box));
  }
}

function toggleVideoSound(mediaBox) {
  const video = mediaBox.querySelector('video');
  const badge = mediaBox.querySelector('.sound-badge');
  if (!video) return;

  if (video.muted) {
    // 先暂停页面所有其他声音
    document.querySelectorAll('video').forEach(v => v.muted = true);
    document.querySelectorAll('.sound-badge').forEach(b => b.innerText = "🔇 Tap Sound");

    video.muted = false;
    if(badge) badge.innerText = "🔊 Playing Sound";
  } else {
    video.muted = true;
    if(badge) badge.innerText = "🔇 Tap Sound";
  }
}
