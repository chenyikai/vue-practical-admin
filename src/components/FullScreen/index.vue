<script>
export default {
  name: "FullScreen",
};
</script>

<script setup>
import { FullScreen } from "@element-plus/icons-vue";
import { useFullscreen } from "@vueuse/core";
const { toggle } = useFullscreen();

defineOptions({
  name: "FullScreen",
});
</script>

<template>
  <div class="btn-layout" @click.stop="toggle">
    <el-icon class="full-icon" :size="20"><FullScreen /></el-icon>
  </div>
</template>
