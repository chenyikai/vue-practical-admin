<script>
export default {
  name: "LayoutHeader",
};
</script>

<script setup>
import UserInfo from "@/components/UserInfo/index.vue";
import { useRouter } from "vue-router";
import website from "@/config/website.js";
import ThemeButton from "@/components/ThemeButton/index.vue";
const router = useRouter();

function handleGo2Index() {
  router.push({ path: website.indexPage });
}
</script>

<template>
  <div class="layout-header-container">
    <div class="system-info" @click.stop="handleGo2Index">
      <div class="logo-layout">
        <div class="logo-box">
          <img src="vite.svg" alt="" />
        </div>
      </div>
      <span class="system-title">后台管理系统</span>
    </div>
    <div class="right-layout">
      <theme-button />
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
        background-color: #fff;
        img {
          width: 60%;
          height: 60%;
        }
      }
    }
    .system-title {
      color: #fff;
      font-size: 20px;
    }
  }
  .right-layout {
    display: flex;
    align-items: center;
  }
}
</style>
