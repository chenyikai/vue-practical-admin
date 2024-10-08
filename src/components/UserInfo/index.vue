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
import PasswordDialog from "./password/PasswordDialog.vue";
import { resetPassword } from "@/api/sys/auth/index.js";
import UserInfoDialog from "./info/UserInfoDialog.vue";
import { updateUser } from "@/api/sys/user/index.js";
import SvgIcon from "package/SvgIcon/src/index.vue";
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
const info = ref({});

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
  } else if (command === "info") {
    info.value.open(MODIFY, UserStore.userInfo);
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

function onInfoModifySubmit(formData, done) {
  updateUser(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      UserStore.getUserInfo();
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
    <el-dropdown @command="handleCommand">
      <div class="user-info">
        <span class="username">{{ UserStore.userInfo.username }}</span>
        <span class="user-role">{{ UserStore.userInfo.name }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="info">
            <svg-icon
              name="modifyInfo"
              style="width: 18px; height: 18px; margin-right: 5px" />
            <span>修改信息</span>
          </el-dropdown-item>
          <el-dropdown-item command="password">
            <svg-icon
              name="modifyPassword"
              style="width: 18px; height: 18px; margin-right: 5px" />
            <span>修改密码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <svg-icon class="logout-btn" name="logout" @click.stop="handleLogOut" />
    <password-dialog ref="password" @[MODIFY]="onModifySubmit" />
    <user-info-dialog ref="info" @[MODIFY]="onInfoModifySubmit" />
  </section>
</template>

<style scoped lang="scss">
.userinfo-container {
  display: flex;
  align-items: center;
  user-select: none;
  .user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    //color: var(--font-color);
    color: #fff;
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
