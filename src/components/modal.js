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
    resBtn.addEventListener('click', handleResultAction);
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
      'Your VybCall Video is now active! Call your number from another phone to see your video ringtone in action.',
      'Explore More Tones'
    );
  } else if (resType === 'insufficient') {
    showResult(
      'insufficient',
      'Insufficient Balance',
      'Your account balance is too low to complete this subscription. Please top up your account and try again.',
      'Recharge Now'
    );
  } else {
    showResult(
      'failed',
      'Connection Failed',
      'Unable to connect to the network. Please check your connection and try again.',
      'Retry Subscription'
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

  // 存储结果类型，用于后续操作
  btn.setAttribute('data-result-type', type);

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

function handleResultAction() {
  const resultType = document.getElementById('resBtn').getAttribute('data-result-type');

  resultModal.classList.remove('active');

  if (resultType === 'success') {
    // 成功后引导用户浏览更多铃声
    window.scrollTo({ top: document.querySelector('.grid-container').offsetTop - 100, behavior: 'smooth' });
  } else if (resultType === 'insufficient') {
    // 余额不足，引导充值（可以跳转到充值页面或显示充值提示）
    alert('Redirecting to recharge page... (Demo)');
    // window.location.href = 'recharge-url'; // 实际充值链接
  } else {
    // 失败后重新尝试订购
    handleSubscribe();
  }
}
