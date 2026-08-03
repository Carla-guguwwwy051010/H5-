/* ==================== 订购入口：Subscribe → 手机号验证页 / 一键订购 ==================== */

export function initModal() {
  // 绑定所有网格卡片的订阅按钮
  const subscribeButtons = document.querySelectorAll('.subscribe-btn');
  subscribeButtons.forEach(btn => {
    btn.addEventListener('click', () => handleSubscribe(btn));
  });

  // 绑定 Hero CTA 按钮（若存在）
  const heroBtn = document.getElementById('heroSubscribeBtn');
  if (heroBtn) {
    heroBtn.addEventListener('click', () => handleSubscribe(heroBtn));
  }
}

// 点击 Subscribe：根据网络模式选择流程
function handleSubscribe(btn) {
  const card = btn.closest('.glass-card');
  const toneName = card?.querySelector('.media-title')?.textContent?.trim() || 'Video Ringtone';
  const toneThumb = card?.querySelector('.media-box-rect img')?.src
    || card?.querySelector('.media-box img')?.src
    || '';

  // 检查网络模式
  const networkMode = document.getElementById('networkMode')?.value || 'A';

  if (networkMode === 'B') {
    // Mode B：移动数据用户 → 一键订购（直接显示结果）
    window.dispatchEvent(new CustomEvent('directSubscribe', {
      detail: { toneName, toneThumb }
    }));
  } else {
    // Mode A / C：WiFi/新访客 → 手机号验证页
    window.dispatchEvent(new CustomEvent('openPhoneVerification', {
      detail: { toneName, toneThumb }
    }));
  }
}
