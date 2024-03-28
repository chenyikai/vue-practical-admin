<script setup>
import { FullScreen } from "@element-plus/icons-vue";
import { useFullscreen } from "@vueuse/core";
import UserInfo from "@/components/UserInfo/index.vue";
import { useRouter } from "vue-router";
import website from "@/config/website.js";
import ThemeButton from "@/components/ThemeButton/index.vue";
const router = useRouter();
const { toggle } = useFullscreen();
defineOptions({
  name: "LayoutHeader",
});

function handleGo2Index() {
  router.push({ path: website.indexPage });
}
</script>

<template>
  <div class="layout-header-container">
    <div class="system-info" @click.stop="handleGo2Index">
      <div class="logo-layout">
        <div class="logo-box">
          <img :src="website.logo" alt="" />
        </div>
      </div>
      <span class="system-title">{{ website.title }}</span>
    </div>
    <div class="right-layout">
      <div class="full-btn-layout" @click.stop="toggle">
        <el-icon class="full-icon" :size="20"><FullScreen /></el-icon>
      </div>
      <theme-button v-if="false" />
      <user-info />
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--theme-color);
  .system-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    .logo-layout {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 80px;
      .logo-box {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 70%;
        height: 70%;
        border-radius: 50%;
        background-color: var(--system-avatar-bg);
        img {
          width: 60%;
          height: 60%;
        }
      }
    }
    .system-title {
      color: var(--font-color);
      font-size: 20px;
    }
  }
  .right-layout {
    display: flex;
    align-items: center;
    .full-btn-layout {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 35px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        border-radius: 50%;
        background-color: var(--theme-menu-hover-bg);
      }
    }
  }
}
</style>
