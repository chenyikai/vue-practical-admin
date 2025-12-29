<script>
export default {
  name: "CollapseMenu",
};
</script>

<script setup>
import { menuStore } from "@/store/index.js";
import { computed } from "vue";
import website from "@/config/website.js";
import CollapseMenuItem from "@/components/CollapseMenu/CollapseMenuItem.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const MenuStore = menuStore();
const menuProps = computed(() => website.menu.props);

defineOptions({
  name: "CollapseMenu",
});

const currentPath = computed(() => {
  return route.fullPath;
});

const defaultOpen = computed(() => {
  const menu = MenuStore.findMenu({ key: "path", value: currentPath.value });
  if (!menu) return [];

  const parent = MenuStore.findMenu({
    key: "id",
    value: menu[menuProps.value.fId],
  });
  return [parent.id];
});
</script>

<template>
  <el-menu
    :default-active="currentPath"
    :default-openeds="defaultOpen"
    class="collapse-menu"
    active-text-color="#ffd04b"
    background-color="var(--theme-color)"
    style="
      --el-menu-text-color: #fff;
      --el-menu-hover-text-color: #fff;
      --el-menu-hover-bg-color: var(--menu-hover-bg);
      --el-menu-active-color: #ffd04b;
      --el-menu-level: 0;
      --el-menu-border-color: transparent;
    "
    text-color="#fff">
    <collapse-menu-item
      :menus="MenuStore.menuList"
      :children="menuProps.children"
      :label="menuProps.label"
      :icon="menuProps.icon"
      :path="menuProps.path" />
  </el-menu>
</template>

<style scoped lang="scss"></style>
