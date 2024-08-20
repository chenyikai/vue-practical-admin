<script>
export default {
  name: "LoginPage",
};
</script>

<script setup>
import { Promotion } from "@element-plus/icons-vue";
import website from "@/config/website.js";
import { useRoute, useRouter } from "vue-router";
import { computed, onBeforeMount, onBeforeUnmount, reactive, ref } from "vue";
import { randomLenNum } from "@/utils/util.js";
import { userStore } from "@/store";
import { validatenull } from "@/utils/validate.js";
import moment from "moment/moment.js";

const router = useRouter();
const route = useRoute();
const UserStore = userStore();

let timer = null;
const nowDate = ref("");
const nowTime = ref("");
const weekArr = [
  "星期天",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

const avatarUrl = computed(() => {
  const isMale = UserStore.userInfo.gender === website.gender.MALE;
  if (validatenull(UserStore.userInfo.avatar)) {
    return isMale ? website.defaultAvatar.male : website.defaultAvatar.female;
  }

  return UserStore.userInfo.avatar;
});

const codeUrl = ref(`${import.meta.env.VITE_API_PREFIX}/rest/auth/captcha`);
const formData = reactive({
  code: "",
  key: "",
  username: "",
  password: "",
});
const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
});
const loading = ref(false);
const form = ref();

function handleSubmit() {
  form.value.validate((valid) => {
    if (!valid) return;
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
  formData["key"] = randomLenNum(4, true);
  formData["code"] = "";
}

onBeforeMount(() => {
  refreshCode();

  timer = setInterval(() => {
    const time = new Date();
    nowDate.value = `${moment(time).format("MM月DD日")} ${weekArr[time.getDay()]}`;
    nowTime.value = moment(time).format("HH:mm:ss");
  }, 1000);
});

onBeforeUnmount(() => {
  timer && clearInterval(timer);
  timer = null;
});
</script>

<template>
  <section class="login-container">
    <!--    <div class="login-glass" />-->
    <img class="login-bg" src="/images/login/bg.webp" alt="" />
    <div class="date-time-box">
      <div class="title">{{ website.title }}</div>
      <div class="date">{{ nowDate }}</div>
      <div class="time">{{ nowTime }}</div>
    </div>
    <div class="login-form-box">
      <el-avatar class="avatar" :size="60" :src="avatarUrl" />
      <el-form
        class="login-form"
        ref="form"
        :model="formData"
        :rules="rules"
        @submit.prevent="handleSubmit"
        :disabled="loading">
        <el-form-item prop="username" size="large">
          <el-input
            class="login-input"
            v-model="formData.username"
            placeholder="请输入用户名"
            @keyup.enter="handleSubmit"
            autofocus>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" size="large">
          <el-input
            class="login-input"
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            @keyup.enter="handleSubmit">
            <template #append v-if="!validatenull(formData.password)">
              <el-button native-type="submit" :icon="Promotion" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" size="large">
          <el-input
            class="login-input code-input"
            v-model="formData.code"
            placeholder="请输入验证码"
            @keyup.enter="handleSubmit"
            clearable>
            <template v-slot:append>
              <img
                class="code-img"
                :src="`${codeUrl}?key=${formData.key}`"
                @click="refreshCode" />
            </template>
          </el-input>
        </el-form-item>
        <!--        <el-form-item size="large">-->
        <!--          <el-button class="login-button" type="primary" native-type="submit">-->
        <!--            登录-->
        <!--          </el-button>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
  </section>
</template>

<style scoped lang="scss"></style>
