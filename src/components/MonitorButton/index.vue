<script>
export default {
  name: "MonitorButton",
};
</script>

<script setup>
import { Monitor } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const router = useRouter();

defineOptions({
  name: "MonitorButton",
});

function onClick() {
  router.push({ path: "/Map" });
}
</script>

<template>
  <div class="btn-layout" @click.stop="onClick">
    <el-icon :size="20"><Monitor /></el-icon>
  </div>
</template>
