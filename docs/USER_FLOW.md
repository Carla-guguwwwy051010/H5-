# 用户流程图

## 完整用户路径

```
广告点击
    ↓
═══════════════════════════════════════
        首页（Home Page）
═══════════════════════════════════════
    ↓
视频轮播自动播放（静音）
    ↓
用户浏览推荐网格
    ↓
点击 Subscribe Now
    ↓
═══════════════════════════════════════
    网络模式判断
═══════════════════════════════════════
    ↓
    ├─────────────┬─────────────┐
    ↓             ↓             ↓
Mode A/C      Mode B       
(WiFi)     (移动数据)
    ↓             ↓             
进入验证页    直接订购
    ↓             ↓             
输入手机号    显示结果
    ↓             
获取验证码
    ↓
输入验证码
    ↓
点击确认
    ↓
═══════════════════════════════════════
        订购处理
═══════════════════════════════════════
    ↓
    ├─────────────┬─────────────┐
    ↓             ↓             ↓
  成功          失败         验证码错误
    ↓             ↓             ↓
显示成功页    显示失败页    留在验证页
    ↓             ↓             显示错误
Enjoy Now    Try Again         ↓
    ↓             ↓             重新输入
返回首页      重试流程          ↓
              ↓             回到"输入验证码"
          连续失败2次？
              ↓
            显示 Back to Home
```

## 核心流程详解

### 1. 首页浏览流程

```
用户进入首页
    ↓
[埋点] page_view
    ↓
顶部视频自动播放（静音）
    ↓
等待 1 秒
    ↓
[埋点] video_exposure
    ↓
用户操作选择：
├─ 滑动切换视频 → 切换到新视频 → video_play
├─ 点击声音按钮 → video_sound_change
├─ 点击全屏 → 打开大屏播放器 → video_fullscreen_click
├─ 视频播放完成 → video_complete
├─ 滚动到推荐区 → recommend_exposure
├─ 点击推荐卡片 → recommend_click → 打开大屏播放器
└─ 点击 Subscribe → subscribe_click → 进入验证流程
```

### 2. WiFi 用户验证流程（Mode A/C）

```
点击 Subscribe
    ↓
[埋点] subscribe_click
    ↓
打开验证页
    ↓
[埋点] phone_page_view
    ↓
用户点击手机号输入框
    ↓
[埋点] phone_input_start
    ↓
输入手机号（9位数字）
    ↓
输入完成
    ↓
[埋点] phone_input_complete
    ↓
点击 Get Code
    ↓
[埋点] sms_send_click
    ↓
校验手机号格式
    ↓
├─ 校验失败 → [埋点] phone_validate_fail → 显示错误提示
└─ 校验通过 → 发送验证码
        ↓
    [埋点] sms_send_success/fail
        ↓
    倒计时 60 秒
        ↓
    用户输入验证码
        ↓
    点击 Confirm Subscription
        ↓
    [埋点] verify_code_submit
        ↓
    验证码校验
        ↓
    ├─ 错误/过期 → [埋点] verify_fail → 显示错误，留在验证页
    └─ 正确 → [埋点] verify_success
            ↓
        [埋点] subscription_request
            ↓
        订购处理 → 跳转到结果页
```

### 3. 移动数据用户流程（Mode B）

```
点击 Subscribe
    ↓
[埋点] subscribe_click
    ↓
自动识别移动数据用户
    ↓
跳过验证页
    ↓
[埋点] subscription_request
    ↓
直接订购处理
    ↓
显示结果页
```

### 4. 结果页流程

```
进入结果页
    ↓
[埋点] page_view (result)
    ↓
显示结果
    ↓
├─ 成功：🎉 Subscription Successful
│   ↓
│   [埋点] subscription_success
│   ↓
│   显示彩铃名称
│   ↓
│   用户点击 Enjoy Now
│   ↓
│   [埋点] result_action_click (enjoy_now)
│   ↓
│   返回首页
│
└─ 失败：💳/⚠️/📡/🛠️ 失败原因
    ↓
    [埋点] subscription_fail
    ↓
    用户点击 Try Again
    ↓
    [埋点] result_action_click (try_again)
    ↓
    retryCount++
    ↓
    判断用户类型：
    ├─ WiFi 用户 → 返回验证页
    └─ 移动数据用户 → 直接重试订购
        ↓
    retryCount >= 2？
        ↓
    显示 Back to Home 按钮
        ↓
    用户点击
        ↓
    [埋点] result_action_click (back_home)
        ↓
    返回首页
```

## 异常流程

### 验证码错误处理

```
用户输入错误验证码
    ↓
点击 Confirm
    ↓
Demo 控制器设置为 "Wrong Code"
    ↓
[埋点] verify_fail (wrong_code)
    ↓
不跳转结果页
    ↓
在验证页显示错误：Incorrect verification code
    ↓
用户重新输入
```

### 网络异常处理

```
订购过程中网络中断
    ↓
Demo 控制器设置为 "Network Error"
    ↓
[埋点] verify_fail (network_error)
    ↓
显示结果页：📡 Network Error
    ↓
用户点击 Try Again
    ↓
返回验证页重试
```

### 连续失败处理

```
第 1 次失败
    ↓
点击 Try Again → 重试
    ↓
第 2 次失败
    ↓
点击 Try Again → 重试
    ↓
retryCount = 2
    ↓
显示两个按钮：
├─ Try Again（继续重试）
└─ Back to Home（放弃返回）
```

## 页面跳转关系

```
首页 (Home)
    ↓ Subscribe
验证页 (Verification)
    ↓ Confirm / 1-Click
结果页 (Result)
    ↓ Enjoy Now / Back to Home
返回首页
```

## 埋点触发时机

完整埋点列表见 [TRACKING.md](./TRACKING.md)

### 自动触发
- `page_view` - 页面加载完成
- `video_exposure` - 视频可见 1 秒后
- `recommend_exposure` - 推荐卡片进入视口
- `phone_input_complete` - 手机号输入满 9 位
- `sms_send_success/fail` - 验证码发送结果（模拟）

### 用户触发
- `video_play/pause/complete` - 视频交互
- `video_sound_change` - 点击声音按钮
- `subscribe_click` - 点击订阅按钮
- `phone_input_start` - 点击手机号输入框
- `sms_send_click` - 点击获取验证码
- `verify_code_submit` - 点击确认订购
- `result_action_click` - 结果页按钮点击

## 关键决策点

### 决策点 1：网络模式识别
- **位置**：点击 Subscribe 时
- **判断依据**：Demo 控制器的 Network Mode
- **结果**：
  - Mode A/C → 打开验证页
  - Mode B → 直接订购

### 决策点 2：验证码校验
- **位置**：点击 Confirm 时
- **判断依据**：Demo 控制器的 Verify Outcome
- **结果**：
  - Success → 进入订购流程
  - Wrong/Expired → 留在验证页显示错误
  - Network Error → 跳转结果页

### 决策点 3：重试逻辑
- **位置**：结果页点击 Try Again
- **判断依据**：用户类型 + 失败次数
- **结果**：
  - WiFi 用户 → 返回验证页
  - 移动数据用户 → 直接重试订购
  - retryCount ≥ 2 → 显示 Back to Home

---

**文档版本**：v1.0  
**最后更新**：2024-08-03
