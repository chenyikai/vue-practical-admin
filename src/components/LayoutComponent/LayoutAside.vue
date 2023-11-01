<script>
export default {
  name: "LayoutAside",
};
</script>

<script setup>
import MenuBar from "@/components/MenuBar/index.vue";
</script>

<template>
  <div class="layout-aside-container">
    <menu-bar />
  </div>
</template>

<style scoped lang="scss">
.layout-aside-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--theme-color);
}
</style>
