<script>
export default {
  name: "ThemeButton",
};
</script>

<script setup>
import { useDark, useToggle } from "@vueuse/core";
import { Sunny, Moon } from "@element-plus/icons-vue";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <el-switch
    :class="isDark ? 'dark' : 'light'"
    :model-value="isDark"
    :active-action-icon="Moon"
    :inactive-action-icon="Sunny"
    @change="toggleDark()" />
</template>

<style lang="scss">
.dark {
  .el-switch__action {
    background-color: var(--theme-color) !important;
    color: var(--font-color) !important;
  }
}
</style>
