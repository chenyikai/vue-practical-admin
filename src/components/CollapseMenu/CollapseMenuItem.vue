<script>
export default {
  name: "CollapseMenuItem",
};
</script>

<script setup>
import SvgIcon from "package/SvgIcon/src/index.vue";
import { go2MenuPage } from "@/router/index.js";

defineOptions({
  name: "CollapseMenuItem",
});

const { menus, label, path, icon, children } = defineProps({
  menus: {
    type: Array,
    default: () => {
      return [];
    },
  },
  label: {
    type: String,
    default: "label",
  },
  path: {
    type: String,
    default: "path",
  },
  icon: {
    type: String,
    default: "icon",
  },
  children: {
    type: String,
    default: "children",
  },
});

function isRenderSub(menu) {
  return !!menu[children]?.length;
}

function onItemClick(menu) {
  go2MenuPage(menu);
}

function getPath(da) {
  console.log(da);
  return da;
}
</script>

<template>
  <div class="collapse-menu-item-box">
    <template v-for="menu in menus" :key="menu[path]">
      <el-sub-menu :index="menu.id" v-if="isRenderSub(menu)">
        <template #title>
          <svg-icon class="icon" :name="menu[icon]" />
          <span class="title">{{ menu[label] }}</span>
        </template>
        <collapse-menu-item
          :menus="menu[children]"
          :label
          :children
          :path
          :icon />
      </el-sub-menu>
      <el-menu-item v-else :index="menu[path]" @click="onItemClick(menu)">
        <svg-icon class="icon" :name="menu[icon]" />
        <span class="title">{{ menu[label] }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
