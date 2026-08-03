/* ==================== 订购结果页埋点管理器 ==================== */
import { track, trackPageView, trackPageExit } from '../utils/tracking.js';

/**
 * 初始化订购结果页埋点
 */
export function initResultPageTracking() {
  const resultActionBtn = document.getElementById('resultActionBtn');
  const backHomeBtn = document.getElementById('backHomeBtn');

  let currentResult = null;

  // 监听结果页打开事件
  window.addEventListener('openResultPage', (e) => {
    const { result, productName } = e.detail || {};
    currentResult = result;

    trackPageView('subscription_result', {
      result: result, // 'success' | 'fail'
      product_name: productName
    });
  });

  // 主操作按钮点击
  if (resultActionBtn) {
    resultActionBtn.addEventListener('click', () => {
      const outcome = resultActionBtn.dataset.outcome;

      if (outcome === 'success') {
        track('result_action_click', {
          action: 'enjoy_now',
          result: 'success'
        });
        trackPageExit('subscription_result');
      } else if (outcome === 'retry_direct' || outcome === 'retry') {
        track('result_action_click', {
          action: 'try_again',
          result: 'fail',
          retry_type: outcome
        });
      }
    });
  }

  // 返回首页按钮点击
  if (backHomeBtn) {
    backHomeBtn.addEventListener('click', () => {
      track('result_action_click', {
        action: 'back_home',
        result: currentResult || 'fail'
      });
      trackPageExit('subscription_result');
    });
  }
}
