<script>
export default {
  name: "LoginPage",
};
</script>

<script setup>
/* 引入 Element Plus 图标 */
import { User, Lock, Key } from "@element-plus/icons-vue";
import website from "@/config/website";
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, onBeforeUnmount, reactive, ref } from "vue";
import { randomLenNum } from "@/utils/util";
import { userStore } from "@/store";
import moment from "moment";

const router = useRouter();
const route = useRoute();
// const UserStore = userStore(); // 暂时注释，如果登录页不需要显示头像可忽略，需要的逻辑已保留

let timer = null;
const nowDate = ref("");
const nowTime = ref("");
const weekArr = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

const codeUrl = ref(`${import.meta.env.VITE_API_PREFIX}/rest/auth/captcha`);
const formData = reactive({
  code: "",
  key: "",
  username: "",
  password: "",
});

const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});

const loading = ref(false);
const formRef = ref(); // 变量名习惯改为 formRef

function handleSubmit() {
  formRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    loading.value = true;
    userStore()
      .userLoginByPassword(formData)
      .then(() => {
        router.push({ path: route.query.redirect || website.indexPage });
      })
      .catch(() => {
        refreshCode();
      })
      .finally(() => {
        loading.value = false;
      });
  });
}

function refreshCode() {
  formData.key = randomLenNum(4, true);
  formData.code = "";
}

function getTime() {
  const time = new Date();
  nowDate.value = `${moment(time).format("MM月DD日")} ${weekArr[time.getDay()]}`;
  nowTime.value = moment(time).format("HH:mm:ss"); // 增加秒数显示，更像监控大屏
}

onBeforeMount(() => {
  getTime();
  timer = setInterval(() => {
    getTime();
  }, 1000);
  refreshCode();
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
  timer = null;
});
</script>

<template>
  <div class="login-wrapper">
    <!-- 背景装饰层 -->
    <div class="bg-layer" />

    <!-- 顶部右上角时间显示 (政务风格常见布局) -->
    <div class="top-corner-time">
      <span>{{ nowDate }}</span>
      <span class="time-highlight">{{ nowTime }}</span>
    </div>

    <div class="login-container">
      <!-- 头部 Logo与标题 -->
      <div class="login-header">
        <div class="logo-box">
          <!-- 模拟政务徽章 SVG，可替换为 images/logo.png -->
          <svg viewBox="0 0 24 24" fill="none" class="logo-svg">
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round" />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round" />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round" />
          </svg>
        </div>
        <h1 class="system-title">
          {{ website.title || "智慧政务大数据管理平台" }}
        </h1>
        <p class="system-subtitle">INTELLIGENT GOVERNMENT MANAGEMENT SYSTEM</p>
      </div>

      <!-- 表单区域 -->
      <el-form ref="formRef" :model="formData" :rules="rules" class="login-form" @submit.prevent>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <div class="input-label">账号</div>
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
            class="gov-input"
            @keyup.enter="handleSubmit" />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <div class="input-label">密码</div>
          <el-input
            v-model="formData.password"
            type="password"
            show-password
            placeholder="请输入登录密码"
            size="large"
            :prefix-icon="Lock"
            class="gov-input"
            @keyup.enter="handleSubmit" />
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="code">
          <div class="input-label">验证码 / 点击刷新</div>
          <div class="captcha-row">
            <el-input
              v-model="formData.code"
              placeholder="请输入验证码"
              size="large"
              :prefix-icon="Key"
              class="gov-input captcha-input"
              @keyup.enter="handleSubmit" />
            <div class="captcha-img-box" @click="refreshCode" title="点击刷新">
              <img v-if="formData.key" :src="`${codeUrl}?key=${formData.key}`" alt="验证码" />
            </div>
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-button type="primary" class="btn-login" :loading="loading" @click="handleSubmit">
          {{ loading ? "系统登录中..." : "立即登录" }}
        </el-button>
      </el-form>
    </div>

    <!-- 底部版权 -->
    <div class="footer-copyright">
      <p>
        Copyright © {{ new Date().getFullYear() }} {{ website.copyright || "丛屿科技" }} All Rights
        Reserved.
      </p>
      <p>技术支持：{{ website.author || "项目部" }} | 建议使用 Chrome 或 Edge 浏览器访问</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 定义变量 - 方便后期换肤 */
$bg-dark: #002c5f;
$bg-light: #1c5c99;
$primary-color: #1890ff;
$text-title: #003366;

.login-wrapper {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, $bg-dark 0%, $bg-light 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-family: "Microsoft YaHei", sans-serif;

  /* 解决暗黑模式下文字可能继承白色的问题，强制重置为默认深色 */
  color: #333;

  /* 背景网格特效 */
  .bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size:
      30px 30px,
      100% 100%;
    z-index: 0;
    pointer-events: none;
  }
}

/* 右上角时间 */
.top-corner-time {
  position: absolute;
  top: 30px;
  right: 40px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  letter-spacing: 1px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 15px;

  .time-highlight {
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    font-family: Consolas, monospace;
  }
}

/* 登录卡片 */
.login-container {
  /* ========================================= */
  /* 关键修改：在此容器内强制重置 Element Plus 变量为亮色模式 */
  /* 这样即使 html 上有 class="dark"，这里的组件也会显示为亮色 */
  /* ========================================= */
  --el-color-white: #ffffff;
  --el-color-black: #000000;
  --el-bg-color: #ffffff;
  --el-bg-color-page: #f2f3f5;
  --el-bg-color-overlay: #ffffff;
  --el-text-color-primary: #303133;
  --el-text-color-regular: #606266;
  --el-text-color-secondary: #909399;
  --el-text-color-placeholder: #a8abb2;
  --el-border-color: #dcdfe6;
  --el-border-color-light: #e4e7ed;
  --el-border-color-lighter: #ebeef5;
  --el-fill-color-blank: #ffffff; /* 核心：输入框背景色 */
  --el-mask-color: rgba(255, 255, 255, 0.9);
  /* ========================================= */

  position: relative;
  z-index: 10;
  background: #ffffff; /* 强制白色背景 */
  width: 480px;
  height: auto;
  padding: 50px 45px;
  border-radius: 8px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);

  .login-header {
    text-align: center;
    margin-bottom: 35px;

    .logo-box {
      color: $text-title;
      margin-bottom: 15px;
      .logo-svg {
        width: 60px;
        height: 60px;
      }
    }

    .system-title {
      font-size: 26px;
      font-weight: 700;
      color: $text-title;
      margin: 0 0 5px;
      letter-spacing: 2px;
    }

    .system-subtitle {
      font-size: 12px;
      color: #888;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }
}

/* 表单样式调整 */
.login-form {
  .input-label {
    font-size: 14px;
    color: #333; /* 强制黑色文字 */
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 1;
  }

  /* 穿透 Element Plus 样式，定制输入框 */
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #dcdfe6 inset;
    background-color: #ffffff !important; /* 强制白色背景 */
    padding: 1px 15px;
    height: 42px;
    transition: all 0.3s;

    &.is-focus {
      box-shadow: 0 0 0 2px rgba($primary-color, 0.2) inset !important;
      border-color: $primary-color;
    }
  }

  :deep(.el-input__inner) {
    height: 42px;
    color: #333333 !important; /* 强制黑色输入文字 */
    background-color: transparent !important;

    /* 修复自动填充背景变色的问题（Chrome常见问题） */
    &:-webkit-autofill {
      box-shadow: 0 0 0 1000px #ffffff inset !important;
      -webkit-text-fill-color: #333 !important;
    }
  }

  /* 强制图标颜色 */
  :deep(.el-input__prefix-inner) {
    color: #909399;
  }
}

/* 验证码行布局 */
.captcha-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;

  .captcha-input {
    flex: 1;
  }

  .captcha-img-box {
    width: 120px;
    height: 44px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    background: #f5f7fa; /* 亮色背景 */
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

/* 登录按钮 */
.btn-login {
  width: 100%;
  height: 48px;
  margin-top: 15px;
  font-size: 18px;
  letter-spacing: 4px;
  background: linear-gradient(90deg, #1890ff 0%, #0056b3 100%);
  border: none;
  border-radius: 4px;
  color: #ffffff !important; /* 强制按钮白字 */

  &:hover {
    opacity: 0.9;
    background: linear-gradient(90deg, #40a9ff 0%, #1890ff 100%);
  }
}

/* 底部 */
.footer-copyright {
  position: absolute;
  bottom: 30px;
  width: 100%;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  z-index: 10;
  line-height: 1.8;
}
</style>
