<script>
export default {
  name: "SettingButton",
};
</script>

<script setup>
import { Setting } from "@element-plus/icons-vue";
import { ref } from "vue";

defineOptions({
  name: "SettingButton",
});

const visible = ref(false);

function onOpen() {
  visible.value = true;
}

function onClose() {
  visible.value = false;
}
</script>

<template>
  <div class="btn-layout" @click.stop="onOpen">
    <el-icon class="full-icon" :size="20"><Setting /></el-icon>
  </div>

  <el-drawer
    class="setting-drawer"
    append-to-body
    size="400px"
    v-model="visible"
    direction="rtl"
    :before-close="onClose">
    <template #header>
      <h4>系统设置</h4>
    </template>
    <template #default />
    <template #footer />
  </el-drawer>
</template>

<style lang="scss" scoped>
.setting-drawer {
  width: 300px;
}
</style>
