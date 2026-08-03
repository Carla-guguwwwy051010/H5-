/* ==================== 手机号验证页埋点管理器 ==================== */
import { track, trackPageView, trackPageExit } from '../utils/tracking.js';

/**
 * 初始化手机号验证页埋点
 */
export function initPhoneVerificationTracking() {
  const phoneInput = document.getElementById('phoneInput');
  const codeInput = document.getElementById('codeInput');
  const getCodeBtn = document.getElementById('getCodeBtn');
  const confirmBtn = document.getElementById('confirmSubscriptionBtn');

  let phoneInputStarted = false;
  let phoneInputCompleted = false;

  // 页面打开埋点（监听自定义事件）
  window.addEventListener('openPhoneVerification', () => {
    trackPageView('phone_verification', {
      country: 'KE'
    });

    phoneInputStarted = false;
    phoneInputCompleted = false;
  });

  // 手机号输入框聚焦
  if (phoneInput) {
    phoneInput.addEventListener('focus', () => {
      if (!phoneInputStarted) {
        track('phone_input_start', {
          country: 'KE'
        });
        phoneInputStarted = true;
      }
    });

    // 手机号输入完成（达到9位）
    phoneInput.addEventListener('input', () => {
      if (phoneInput.value.length === 9 && !phoneInputCompleted) {
        track('phone_input_complete', {
          country: 'KE',
          length: 9
        });
        phoneInputCompleted = true;
      }

      if (phoneInput.value.length < 9) {
        phoneInputCompleted = false;
      }
    });
  }

  // 获取验证码按钮
  if (getCodeBtn) {
    getCodeBtn.addEventListener('click', () => {
      const phone = phoneInput?.value || '';

      // 校验失败场景
      if (phone === '') {
        track('phone_validate_fail', {
          reason: 'empty_phone'
        });
        return;
      }

      if (!/^\d+$/.test(phone)) {
        track('phone_validate_fail', {
          reason: 'invalid_format'
        });
        return;
      }

      if (phone.length !== 9) {
        track('phone_validate_fail', {
          reason: 'invalid_length',
          actual_length: phone.length
        });
        return;
      }

      // 发送验证码点击
      track('sms_send_click', {
        country: 'KE',
        code: '+254',
        phone: '+254' + phone
      });

      // 模拟发送成功/失败
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95%成功率

        if (success) {
          track('sms_send_success', {
            country: 'KE'
          });
        } else {
          track('sms_send_fail', {
            reason: Math.random() > 0.5 ? 'network_error' : 'service_error'
          });
        }
      }, 800);
    });
  }

  // 确认订购按钮
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const phone = phoneInput?.value || '';
      const code = codeInput?.value || '';

      // 验证码提交
      track('verify_code_submit', {
        country: 'KE',
        has_phone: phone.length === 9,
        has_code: code.length > 0
      });
    });
  }

  // 页面关闭埋点
  const verifyBackBtn = document.getElementById('verifyBackBtn');
  if (verifyBackBtn) {
    verifyBackBtn.addEventListener('click', () => {
      trackPageExit('phone_verification');
    });
  }
}

/**
 * 验证成功埋点（由 verification.js 调用）
 */
export function trackVerifySuccess() {
  track('verify_success', {
    country: 'KE'
  });

  // 发起订购请求
  track('subscription_request', {
    country: 'KE'
  });
}

/**
 * 验证失败埋点（由 verification.js 调用）
 */
export function trackVerifyFailed(reason) {
  track('verify_fail', {
    reason: reason, // 'wrong_code' | 'expired_code'
    country: 'KE'
  });
}

/**
 * 订购成功埋点（由 verification.js 调用）
 */
export function trackSubscriptionSuccess(productName) {
  track('subscription_success', {
    product_id: productName.replace(/\s+/g, '_').toLowerCase(),
    product_name: productName,
    country: 'KE',
    price: '3 KSH/day'
  });
}

/**
 * 订购失败埋点（由 verification.js 调用）
 */
export function trackSubscriptionFailed(reason) {
  track('subscription_fail', {
    reason: reason, // 'network_error' | 'service_error' | 'timeout' | 'payment_failed'
    country: 'KE'
  });
}
