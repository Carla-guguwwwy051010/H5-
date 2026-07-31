import './styles/main.css'
import { initCarousel } from './components/carousel.js'
import { initGrid } from './components/grid.js'
import { initModal } from './components/modal.js'

// 初始化所有组件
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initGrid();
  initModal();
});
