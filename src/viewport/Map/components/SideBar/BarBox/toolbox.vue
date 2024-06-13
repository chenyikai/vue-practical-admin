<script setup>
import { ref } from "vue";
defineOptions({
  name: "ToolBox",
});

const drawer = ref(false);

function open(type = true) {
  drawer.value = type;
}

defineExpose({
  open,
});
</script>

<template>
  <div class="meteorology-box">
    <el-drawer
      :append-to-body="true"
      v-model="drawer"
      direction="rtl"
      size="20%">
      <template #header="{ titleId, titleClass }">
        <div :id="titleId" :class="`${titleClass} drawer-title-text`">
          工具功能
        </div>
      </template>
      <div>124</div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.meteorology-box {
  position: relative;
  ::v-global(.drawer-title-text) {
    font-size: 17px;
    color: #bdc3c7;
  }
}
</style>
