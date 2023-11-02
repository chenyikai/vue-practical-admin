<script>
export default {
  name: "LoginPage",
};
</script>

<script setup>
import { User, Lock, Warning } from "@element-plus/icons-vue";
import website from "@/config/website.js";
import { useRouter } from "vue-router";
import { onBeforeMount, reactive, ref } from "vue";
import { randomLenNum } from "@/utils/util.js";
import { userStore } from "@/store";
const router = useRouter();

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
        router.push({ path: website.indexPage });
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
});
</script>

<template>
  <div class="login-page">
    <div class="animation-content">
      <div class="login-content">
        <div class="illustration-layout">
          <img src="@/assets/images/login/illustration.png" />
        </div>
        <div class="form-content">
          <div class="login-content-title">{{ website.title }}</div>
          <div class="login-content-form">
            <el-form
              ref="form"
              :model="formData"
              :rules="rules"
              @submit.prevent="handleSubmit"
              :disabled="loading">
              <el-form-item prop="username" size="large">
                <el-input
                  v-model="formData.username"
                  :prefix-icon="User"
                  placeholder="请输入用户名"
                  autofocus
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item prop="password" size="large">
                <el-input
                  v-model="formData.password"
                  :prefix-icon="Lock"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item prop="code" size="large">
                <el-input
                  v-model="formData.code"
                  :prefix-icon="Warning"
                  placeholder="请输入验证码"
                  clearable>
                  <template v-slot:append>
                    <img
                      :src="`${codeUrl}?key=${formData.key}`"
                      @click="refreshCode" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item size="large">
                <el-button
                  class="login-button"
                  type="primary"
                  native-type="submit">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="login-content-footer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
