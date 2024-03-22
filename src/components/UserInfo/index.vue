<script>
export default {
  name: "UserInfo",
};
</script>

<script setup>
import website from "@/config/website.js";
import { ref, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { userStore } from "@/store/index.js";
import { useRoute, useRouter } from "vue-router";
import { validatenull } from "@/utils/validate.js";
import { encryption } from "@/utils/util.js";
import PasswordDialog from "@/components/UserInfo/PasswordDialog.vue";
import { resetPassword } from "@/api/sys/auth/index.js";
const router = useRouter();
const route = useRoute();
const UserStore = userStore();
const MODIFY = "modify";

const avatarUrl = computed(() => {
  const isMale = UserStore.userInfo.gender === website.gender.MALE;
  if (validatenull(UserStore.userInfo.avatar)) {
    return isMale ? website.defaultAvatar.male : website.defaultAvatar.female;
  }

  return UserStore.userInfo.avatar;
});

const password = ref({});

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

function handleCommand(command) {
  if (command === "password") {
    password.value.open(MODIFY);
  }
}

function onModifySubmit(formData, done) {
  const user = encryption({
    data: formData,
    key: website.iv,
    param: ["oldPassword", "newPassword"],
  });
  resetPassword(user)
    .then(() => {
      done(true);
      ElMessage({
        message: "修改成功",
        type: "success",
      });

      UserStore.fedLogOut().then(() => {
        router.push({ path: "/login", query: { redirect: route.path } });
      });
    })
    .catch(() => {
      ElMessage({
        message: "修改失败",
        type: "error",
      });
      done();
    });
}
</script>

<template>
  <section class="userinfo-container">
    <el-avatar class="avatar" :size="40" :src="avatarUrl" />
    <el-dropdown popper-class="tab-drop-popper" @command="handleCommand">
      <div class="user-info">
        <span class="username">{{ UserStore.userInfo.username }}</span>
        <span class="user-role">{{ UserStore.userInfo.name }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="info">修改信息</el-dropdown-item>
          <el-dropdown-item command="password">修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <img
      class="logout-btn"
      src="/logout.svg"
      alt=""
      @click.stop="handleLogOut" />
    <password-dialog ref="password" @[MODIFY]="onModifySubmit" />
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
    .username {
      margin-bottom: 5px;
    }
  }
  .logout-btn {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
}
</style>
