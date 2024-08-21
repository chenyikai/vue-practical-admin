<script>
export default {
  name: "LockButton",
};
</script>

<script setup>
import { Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const router = useRouter();

defineOptions({
  name: "LockButton",
});

function onClick() {}
</script>

<template>
  <div class="btn-layout" @click.stop="onClick">
    <el-icon :size="20"><Lock /></el-icon>
  </div>
</template>

<style scoped lang="scss"></style>
