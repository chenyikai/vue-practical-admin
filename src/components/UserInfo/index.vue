<script>
export default {
  name: "UserInfo",
};
</script>

<script setup>
import { ElMessageBox } from "element-plus";
import { userStore } from "@/store/index.js";
import { useRouter } from "vue-router";
const router = useRouter();
const UserStore = userStore();

function handleLogOut() {
  ElMessageBox.confirm("请确认是否要退出？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    UserStore.fedLogOut().then(() => {
      router.push({ path: "/login" });
    });
  });
}
</script>

<template>
  <section class="userinfo-container">
    <el-avatar class="avatar" :size="40" src="/user-man.svg" />
    <div class="user-info">
      <span class="username">admin</span>
      <span class="user-role">系统管理员</span>
    </div>
    <img
      class="logout-btn"
      src="/logout.svg"
      alt=""
      @click.stop="handleLogOut" />
  </section>
</template>

<style scoped lang="scss">
.userinfo-container {
  display: flex;
  align-items: center;
  padding: 0 20px;
  user-select: none;
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--font-color);
    font-size: 14px;
    margin: 0 10px;
  }
  .logout-btn {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}
</style>
