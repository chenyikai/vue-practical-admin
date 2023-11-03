<script>
export default {
  name: "LayoutHeader",
};
</script>

<script setup>
import { userStore } from "@/store/index.js";
import { useRouter } from "vue-router";
const rouer = useRouter();

function handleOut() {
  userStore()
    .fedLogOut()
    .then(() => {
      rouer.push({ path: "/login" });
    });
}
</script>

<template>
  <div class="layout-header-container">
    <div class="system-info">
      <div class="logo-layout">
        <div class="logo-box">
          <img src="vite.svg" alt="" />
        </div>
      </div>
      <span class="system-title">后台管理系统</span>
    </div>
    <div class="user-info" @click="handleOut">用户信息</div>
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
}
</style>
