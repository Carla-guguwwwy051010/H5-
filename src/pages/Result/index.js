/* ==================== 订购结果页面 ==================== */
import './ResultPage.css';
import {
  trackVerifySuccess,
  trackVerifyFailed,
  trackSubscriptionSuccess,
  trackSubscriptionFailed
} from '../../tracking/verificationTracking.js';

export function initResultPage(verificationState) {
  const verifyPage = document.getElementById('phoneVerificationPage');
  const resultPage = document.getElementById('subscriptionResultPage');
  const resultActionBtn = document.getElementById('resultActionBtn');
  const backHomeBtn = document.getElementById('backHomeBtn');

  let retryCount = 0;
  let currentToneName = 'Magic Companion';

  // ---------- 一键订购：移动数据用户直接订购 ----------
  window.addEventListener('directSubscribe', (e) => {
    const detail = e.detail || {};
    currentToneName = detail.toneName || 'Magic Companion';

    // 重置失败计数
    retryCount = 0;

    // 直接显示订购结果（无需打开验证页）
    resolveOutcome();
  });

  // ---------- 处理订购请求 ----------
  window.addEventListener('processSubscription', (e) => {
    const detail = e.detail || {};
    currentToneName = detail.toneName || 'Magic Companion';

    // 如果从验证页传入状态，同步
    if (verificationState) {
      currentToneName = verificationState.getSharedState().currentToneName;
    }

    resolveOutcome();
  });

  // ---------- 结果页操作按钮 ----------
  resultActionBtn.addEventListener('click', () => {
    const outcome = resultActionBtn.dataset.outcome;

    if (outcome === 'back_home') {
      // 返回首页
      closePage(resultPage);
      closePage(verifyPage);
      retryCount = 0;
      return;
    }

    closePage(resultPage);

    if (outcome === 'success') {
      // 成功：回到首页浏览
      closePage(verifyPage);
      retryCount = 0;
    } else if (outcome === 'retry_direct') {
      // 移动数据用户失败：直接重试订购（不回验证页）
      retryCount++;
      resolveOutcome();
    } else {
      // WiFi/新访客失败：回到验证页重试（保留失败计数）
      retryCount++;
      verifyPage.classList.add('active');
    }
  });

  // ---------- 返回首页按钮 ----------
  backHomeBtn.addEventListener('click', () => {
    closePage(resultPage);
    closePage(verifyPage);
    retryCount = 0;
    backHomeBtn.style.display = 'none';
  });

  // ===================== 结果页展示 =====================

  function showResult(type) {
    const emoji = document.getElementById('resultEmoji');
    const title = document.getElementById('resultPageTitle');
    const toneNameEl = document.getElementById('resultPageToneName');
    const desc = document.getElementById('resultPageDesc');

    const config = getResultConfig(type);

    emoji.textContent = config.emoji;
    title.textContent = config.title;
    desc.textContent = config.desc;

    // 仅成功时显示彩铃名称
    if (config.showTone) {
      toneNameEl.textContent = currentToneName;
      toneNameEl.style.display = 'block';
    } else {
      toneNameEl.style.display = 'none';
    }

    resultActionBtn.textContent = config.btnText;

    // 根据用户类型设置不同的重试行为
    if (config.isSuccess) {
      resultActionBtn.dataset.outcome = 'success';
      backHomeBtn.style.display = 'none'; // 成功时隐藏返回按钮
    } else {
      // 检查当前是否为移动数据用户（通过 demo 控制器）
      const networkMode = document.getElementById('networkMode')?.value || 'A';
      resultActionBtn.dataset.outcome = (networkMode === 'B') ? 'retry_direct' : 'retry';

      // 连续失败2次后显示"Back to Home"按钮（所有用户类型）
      if (retryCount >= 2) {
        backHomeBtn.style.display = 'block';
      } else {
        backHomeBtn.style.display = 'none';
      }
    }

    // 重播入场动画
    emoji.style.animation = 'none';
    void emoji.offsetWidth;
    emoji.style.animation = '';

    // 触发结果页打开事件（供埋点监听）
    window.dispatchEvent(new CustomEvent('openResultPage', {
      detail: {
        result: config.isSuccess ? 'success' : 'fail',
        productName: currentToneName,
        resultType: type
      }
    }));

    resultPage.classList.add('active');
  }

  // 根据 demo 控制器选择的结果，模拟验证码验证 & 订购
  function resolveOutcome() {
    const outcome = document.getElementById('resultType').value;

    switch (outcome) {
      case 'success':
        trackVerifySuccess();
        trackSubscriptionSuccess(currentToneName);
        showResult('success');
        break;

      case 'payment_fail':
        trackVerifySuccess();
        trackSubscriptionFailed('payment_failed');
        showResult('payment_fail');
        break;

      case 'activate_fail':
        trackVerifySuccess();
        trackSubscriptionFailed('service_error');
        showResult('activate_fail');
        break;

      case 'wrong_code':
        // 验证码错误：留在当前页，输入框报错
        trackVerifyFailed('wrong_code');
        const codeInput = document.getElementById('codeInput');
        const codeError = document.getElementById('codeError');
        showFieldError(codeInput, codeError, 'Incorrect verification code');
        break;

      case 'expired_code':
        trackVerifyFailed('expired_code');
        const codeInput2 = document.getElementById('codeInput');
        const codeError2 = document.getElementById('codeError');
        showFieldError(codeInput2, codeError2, 'Verification code expired');
        break;

      case 'network_error':
        trackVerifyFailed('network_error');
        showResult('network_error');
        break;

      case 'service_unavailable':
        trackSubscriptionFailed('service_error');
        showResult('service_unavailable');
        break;

      default:
        trackVerifySuccess();
        trackSubscriptionSuccess(currentToneName);
        showResult('success');
    }
  }

  function getResultConfig(type) {
    switch (type) {
      case 'success':
        return {
          emoji: '🎉',
          title: 'Subscription Successful',
          desc: 'Subscription activated',
          btnText: 'Enjoy Now',
          isSuccess: true,
          showTone: true
        };
      case 'payment_fail':
        return {
          emoji: '💳',
          title: 'Payment Failed',
          desc: 'Insufficient balance or payment declined',
          btnText: 'Try Again',
          isSuccess: false,
          showTone: false
        };
      case 'activate_fail':
        return {
          emoji: '⚠️',
          title: 'Activation Failed',
          desc: 'Failed to activate subscription. Please contact support.',
          btnText: 'Try Again',
          isSuccess: false,
          showTone: false
        };
      case 'network_error':
        return {
          emoji: '📡',
          title: 'Network Error',
          desc: 'Please check your connection and try again',
          btnText: 'Try Again',
          isSuccess: false,
          showTone: false
        };
      case 'service_unavailable':
        return {
          emoji: '🛠️',
          title: 'Service Unavailable',
          desc: 'Our service is temporarily unavailable. Please try again later.',
          btnText: 'Try Again',
          isSuccess: false,
          showTone: false
        };
      default:
        return {
          emoji: '🎉',
          title: 'Subscription Successful',
          desc: 'Subscription activated',
          btnText: 'Enjoy Now',
          isSuccess: true,
          showTone: true
        };
    }
  }

  function showFieldError(field, errorEl, message) {
    field.classList.add('error');
    errorEl.textContent = message;
  }

  function closePage(page) {
    page.classList.remove('active');
  }
}
