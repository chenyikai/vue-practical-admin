<script>
export default {
  name: "DirectivePage",
};
</script>

<script setup>
import { ElMessage } from "element-plus";

defineOptions({
  name: "DirectivePage",
});

function debounce() {
  ElMessage({
    message: "防抖防抖防抖",
    type: "success",
  });
}

function trailing() {
  ElMessage({
    message: "节流节流节流",
    type: "success",
  });
}
</script>

<template>
  <section class="directive-page-container">
    <admin-card title="防抖" class="button-card">
      <el-button v-debounce.trailing="debounce" type="primary">防抖</el-button>
    </admin-card>
    <admin-card title="节流" class="button-card">
      <el-button v-throttle:1000.leading="trailing" type="primary"
        >节流</el-button
      >
    </admin-card>
  </section>
</template>

<style scoped lang="scss">
.directive-page-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  .button-card {
    width: 200px;
  }
}
</style>
