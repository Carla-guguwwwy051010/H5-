/* ==================== 手机号验证页面 ==================== */
import './VerificationPage.css';

const KE_PHONE_LENGTH = 9; // 肯尼亚本地手机号位数

export function initVerificationPage() {
  const verifyPage = document.getElementById('phoneVerificationPage');
  const verifyBackBtn = document.getElementById('verifyBackBtn');
  const phoneInput = document.getElementById('phoneInput');
  const phoneInputGroup = document.getElementById('phoneInputGroup');
  const phoneError = document.getElementById('phoneError');
  const codeInput = document.getElementById('codeInput');
  const codeError = document.getElementById('codeError');
  const getCodeBtn = document.getElementById('getCodeBtn');
  const confirmBtn = document.getElementById('confirmSubscriptionBtn');

  const verifyToneName = document.getElementById('verifyToneName');
  const verifyToneThumb = document.getElementById('verifyToneThumb');

  let countdownTimer = null;
  let phoneCompleteFired = false;
  let currentToneName = 'Magic Companion';
  let isCellularUser = false; // 是否为移动数据用户

  // 导出给 Result 页面使用
  let sharedState = {
    currentToneName: 'Magic Companion',
    retryCount: 0
  };

  // ---------- 页面打开：由 Subscribe 按钮触发 ----------
  window.addEventListener('openPhoneVerification', (e) => {
    const detail = e.detail || {};
    currentToneName = detail.toneName || 'Magic Companion';
    sharedState.currentToneName = currentToneName;
    verifyToneName.textContent = currentToneName;
    if (detail.toneThumb) verifyToneThumb.src = detail.toneThumb;

    // 根据 demo 控制器判断是否为移动数据用户
    const networkMode = document.getElementById('networkMode')?.value || 'A';
    isCellularUser = (networkMode === 'B');

    resetForm();
    updateUIForMode();
    verifyPage.classList.add('active');

    // 重置失败计数（重新打开验证页）
    sharedState.retryCount = 0;
  });

  // ---------- 返回首页 ----------
  verifyBackBtn.addEventListener('click', () => {
    closePage(verifyPage);
    stopCountdown();
  });

  // ---------- 手机号输入：仅允许数字 ----------
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, KE_PHONE_LENGTH);
    clearFieldError(phoneInputGroup, phoneError);

    // 重置标记（用于其他逻辑）
    if (phoneInput.value.length === KE_PHONE_LENGTH && !phoneCompleteFired) {
      phoneCompleteFired = true;
    }
    if (phoneInput.value.length < KE_PHONE_LENGTH) {
      phoneCompleteFired = false;
    }
  });

  // ---------- 验证码输入：仅允许数字 ----------
  codeInput.addEventListener('input', () => {
    codeInput.value = codeInput.value.replace(/\D/g, '');
    clearFieldError(codeInput, codeError);
  });

  // ---------- 获取验证码 ----------
  getCodeBtn.addEventListener('click', () => {
    const validation = validatePhone(phoneInput.value);
    if (!validation.valid) {
      showFieldError(phoneInputGroup, phoneError, validation.message);
      return;
    }

    startCountdown();
  });

  // ---------- 确认订购 ----------
  confirmBtn.addEventListener('click', () => {
    handleConfirm();
  });

  // ===================== 核心逻辑 =====================

  function handleConfirm() {
    // 再次校验手机号
    const phoneValidation = validatePhone(phoneInput.value);
    if (!phoneValidation.valid) {
      showFieldError(phoneInputGroup, phoneError, phoneValidation.message);
      return;
    }

    // 移动数据用户：直接订购（无需验证码）
    if (isCellularUser) {
      setConfirmProcessing(true);
      setTimeout(() => {
        setConfirmProcessing(false);
        // 触发订购结果处理
        window.dispatchEvent(new CustomEvent('processSubscription', {
          detail: { toneName: currentToneName }
        }));
      }, 1400);
      return;
    }

    // WiFi/新访客：需要验证码
    if (codeInput.value.trim() === '') {
      showFieldError(codeInput, codeError, 'Enter verification code');
      return;
    }

    // Processing 状态
    setConfirmProcessing(true);

    setTimeout(() => {
      setConfirmProcessing(false);
      // 触发订购结果处理
      window.dispatchEvent(new CustomEvent('processSubscription', {
        detail: { toneName: currentToneName }
      }));
    }, 1400);
  }

  // ===================== 校验 =====================

  function validatePhone(value) {
    if (value.trim() === '') {
      return { valid: false, message: 'Please enter phone number' };
    }
    if (!/^\d+$/.test(value)) {
      return { valid: false, message: 'Invalid phone number' };
    }
    if (value.length !== KE_PHONE_LENGTH) {
      return { valid: false, message: 'Invalid phone number' };
    }
    return { valid: true };
  }

  // ===================== 验证码倒计时 =====================

  function startCountdown() {
    let seconds = 60;
    getCodeBtn.disabled = true;
    getCodeBtn.textContent = seconds + 's';

    countdownTimer = setInterval(() => {
      seconds--;
      if (seconds <= 0) {
        stopCountdown();
        getCodeBtn.disabled = false;
        getCodeBtn.textContent = 'Resend Code';
      } else {
        getCodeBtn.textContent = seconds + 's';
      }
    }, 1000);
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  // ===================== UI 辅助 =====================

  function setConfirmProcessing(processing) {
    if (processing) {
      confirmBtn.disabled = true;
      confirmBtn.dataset.label = confirmBtn.textContent;
      confirmBtn.textContent = 'Processing...';
      confirmBtn.style.opacity = '0.7';
    } else {
      confirmBtn.disabled = false;
      confirmBtn.textContent = confirmBtn.dataset.label || 'Confirm Subscription';
      confirmBtn.style.opacity = '1';
    }
  }

  function showFieldError(field, errorEl, message) {
    field.classList.add('error');
    errorEl.textContent = message;
  }

  function clearFieldError(field, errorEl) {
    field.classList.remove('error');
    errorEl.textContent = '';
  }

  function resetForm() {
    phoneInput.value = '';
    codeInput.value = '';
    clearFieldError(phoneInputGroup, phoneError);
    clearFieldError(codeInput, codeError);
    phoneCompleteFired = false;
    stopCountdown();
    getCodeBtn.disabled = false;
    getCodeBtn.textContent = 'Get Code';
    setConfirmProcessing(false);
  }

  function updateUIForMode() {
    const codeSection = document.getElementById('codeSection');

    if (isCellularUser) {
      // 移动数据用户：隐藏验证码区域
      if (codeSection) codeSection.style.display = 'none';
      confirmBtn.textContent = 'Confirm Subscription (1-Click)';
    } else {
      // WiFi/新访客：显示验证码区域
      if (codeSection) codeSection.style.display = '';
      confirmBtn.textContent = 'Confirm Subscription';
    }
  }

  function closePage(page) {
    page.classList.remove('active');
  }

  // 返回共享状态，供其他模块访问
  return {
    getSharedState: () => sharedState,
    closeVerificationPage: () => closePage(verifyPage)
  };
}
