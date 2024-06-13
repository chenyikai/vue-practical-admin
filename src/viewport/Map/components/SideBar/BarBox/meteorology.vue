<script setup>
import { ref } from "vue";
defineOptions({
  name: "MeteorologyBox",
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
    <el-drawer v-model="drawer" direction="rtl" size="30%">
      <template v-slot:[header]>
        <teleport></teleport>
      </template>
      <div>124</div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.meteorology-box {
  position: relative;
}
</style>
