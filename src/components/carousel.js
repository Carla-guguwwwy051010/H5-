/* ==================== 3D 滑动轮播逻辑 ==================== */

export function initCarousel() {
  const wrapper = document.getElementById('carouselWrapper');
  const track = document.getElementById('carouselTrack');
  const cards = Array.from(track.children);
  let currentIndex = 1; // 默认停在第 2 个 active 卡片

  let startX = 0;
  let isDragging = false;
  let autoplayTimer = null;
  let userInteracted = false;

  function updateCarousel() {
    const cardWidth = 150; // 卡片宽度 + margin
    const containerWidth = wrapper.offsetWidth;
    // 计算偏移让 active 卡片居中
    const offset = (containerWidth / 2) - (cardWidth / 2) - (currentIndex * cardWidth);

    track.style.transform = `translateX(${offset}px)`;

    cards.forEach((card, i) => {
      const video = card.querySelector('video');
      if (i === currentIndex) {
        card.classList.add('active');
        if (video) video.play().catch(()=>{});
      } else {
        card.classList.remove('active');
        if (video) video.pause();
      }
    });
  }

  // 自动轮播功能
  function startAutoplay() {
    stopAutoplay(); // 清除之前的定时器
    autoplayTimer = setInterval(() => {
      if (!userInteracted && !isDragging) {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
      }
    }, 3000); // 每3秒切换一次
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    userInteracted = true;
    stopAutoplay();
    // 用户交互后5秒重新启动自动播放
    setTimeout(() => {
      userInteracted = false;
      startAutoplay();
    }, 5000);
  }

  // 滑动事件监听
  wrapper.addEventListener('touchstart', touchStart);
  wrapper.addEventListener('touchend', touchEnd);
  wrapper.addEventListener('touchmove', touchMove);

  wrapper.addEventListener('mousedown', touchStart);
  wrapper.addEventListener('mouseup', touchEnd);
  wrapper.addEventListener('mouseleave', touchEnd);
  wrapper.addEventListener('mousemove', touchMove);

  function touchStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    resetAutoplay(); // 用户交互时重置自动播放
  }

  function touchMove(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diff = currentX - startX;
    if (Math.abs(diff) > 40) {
      if (diff < 0 && currentIndex < cards.length - 1) {
        currentIndex++;
        isDragging = false;
        updateCarousel();
      } else if (diff > 0 && currentIndex > 0) {
        currentIndex--;
        isDragging = false;
        updateCarousel();
      }
    }
  }

  function touchEnd() { isDragging = false; }
  function getPositionX(e) { return e.type.includes('touch') ? e.touches[0].clientX : e.clientX; }

  // 初始化轮播居中状态
  window.addEventListener('load', updateCarousel);
  window.addEventListener('resize', updateCarousel);

  // 立即调用一次
  updateCarousel();

  // 启动自动播放
  startAutoplay();
}
