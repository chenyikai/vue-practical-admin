<template>
  <el-config-provider :locale="locale">
    <router-view class="container" />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
const locale = zhCn;
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
