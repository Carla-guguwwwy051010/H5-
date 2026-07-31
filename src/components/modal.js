/* ==================== 订购流程与模拟结果控制 ==================== */

const otpModal = document.getElementById('otpModal');
const loadingModal = document.getElementById('loadingModal');
const resultModal = document.getElementById('resultModal');

export function initModal() {
  // 绑定主 CTA 按钮
  const heroBtn = document.getElementById('heroSubscribeBtn');
  if (heroBtn) {
    heroBtn.addEventListener('click', handleSubscribe);
  }

  // 绑定所有网格卡片的订阅按钮
  const subscribeButtons = document.querySelectorAll('.subscribe-btn');
  subscribeButtons.forEach(btn => {
    btn.addEventListener('click', handleSubscribe);
  });

  // 绑定 OTP 确认按钮
  const confirmOtpBtn = document.getElementById('confirmOtpBtn');
  if (confirmOtpBtn) {
    confirmOtpBtn.addEventListener('click', submitOTP);
  }

  // 绑定结果 Modal 的关闭按钮
  const resBtn = document.getElementById('resBtn');
  if (resBtn) {
    resBtn.addEventListener('click', closeModal);
  }
}

function handleSubscribe() {
  const mode = document.getElementById('networkMode').value;
  if (mode === 'B') {
    showLoading("Connecting Network Operator...");
    setTimeout(() => {
      hideLoading();
      triggerResultByConfig();
    }, 1500);
  } else {
    otpModal.classList.add('active');
  }
}

function submitOTP() {
  otpModal.classList.remove('active');
  showLoading("Verifying PIN Code...");
  setTimeout(() => {
    hideLoading();
    triggerResultByConfig();
  }, 1200);
}

function triggerResultByConfig() {
  const resType = document.getElementById('resultType').value;
  if (resType === 'success') {
    showResult(
      'success',
      'Subscription Successful!',
      'Your Video RBT is active now. Call your phone number to test it out!',
      'Set Tone Now'
    );
  } else if (resType === 'insufficient') {
    showResult(
      'insufficient',
      'Insufficient Balance',
      'Your carrier balance is too low to complete this transaction. Please recharge.',
      'Recharge & Retry'
    );
  } else {
    showResult(
      'failed',
      'Subscription Failed',
      'Service temporarily unavailable due to carrier gateway timeout. Please try again.',
      'Try Again'
    );
  }
}

function showLoading(text) {
  document.getElementById('loadingText').innerText = text;
  loadingModal.classList.add('active');
}

function hideLoading() {
  loadingModal.classList.remove('active');
}

function showResult(type, title, desc, btnText) {
  const icon = document.getElementById('resIcon');
  const btn = document.getElementById('resBtn');

  if (type === 'success') {
    icon.className = "status-icon icon-success";
    icon.innerText = "✓";
  } else if (type === 'insufficient') {
    icon.className = "status-icon icon-insufficient";
    icon.innerText = "!";
  } else {
    icon.className = "status-icon icon-failed";
    icon.innerText = "✕";
  }

  document.getElementById('resTitle').innerText = title;
  document.getElementById('resDesc').innerText = desc;
  btn.innerText = btnText;
  resultModal.classList.add('active');
}

function closeModal() {
  resultModal.classList.remove('active');
}
