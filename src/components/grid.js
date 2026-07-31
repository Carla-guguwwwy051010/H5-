/* ==================== 列表视频的声音切换 ==================== */

export function initGrid() {
  // 为所有带 data-video-toggle 属性的 media-box 添加点击事件
  const mediaBoxes = document.querySelectorAll('[data-video-toggle]');

  mediaBoxes.forEach(mediaBox => {
    mediaBox.addEventListener('click', () => {
      toggleVideoSound(mediaBox);
    });
  });
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
