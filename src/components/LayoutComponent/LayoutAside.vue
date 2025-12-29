<script>
export default {
  name: "LayoutAside",
};
</script>

<script setup>
import MenuBar from "@/components/MenuBar/index.vue";
import CollapseMenu from "@/components/CollapseMenu/CollapseMenu.vue";
import { ref } from "vue";

defineOptions({
  name: "LayoutAside",
});

const menuType = ref("collapse");
</script>

<template>
  <div class="layout-aside-container">
    <collapse-menu v-if="menuType === 'collapse'" />
    <menu-bar v-if="menuType === 'icon'" />
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
