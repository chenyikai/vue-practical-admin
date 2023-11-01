<script>
export default {
  name: "LayoutPage",
};
</script>

<script setup>
import { onBeforeMount } from "vue";
import LayoutAside from "@/components/LayoutComponent/LayoutAside.vue";
import LayoutHeader from "@/components/LayoutComponent/LayoutHeader.vue";
import LayoutTab from "@/components/LayoutComponent/LayoutTab.vue";
import { menuStore } from "@/store/index.js";

onBeforeMount(() => {
  initMenu().then((data) => {
    menuStore().setMenu(data);
  });
});

function initMenu() {
  return new Promise((resolve) => {
    resolve([
      {
        id: 1,
        label: "设置",
        icon: "setting.svg",
        url: "",
        children: [
          {
            id: 11,
            label: "菜单管理",
            icon: "menu.svg",
            url: "",
            children: [],
          },
          {
            id: 12,
            label: "字典管理",
            icon: "dict.svg",
            url: "",
            children: [],
          },
          {
            id: 13,
            label: "用户管理",
            url: "",
            icon: "user.svg",
            children: [],
          },
          {
            id: 14,
            label: "权限管理",
            icon: "limit.svg",
            url: "",
            children: [],
          },
          {
            id: 15,
            label: "角色管理",
            url: "",
            icon: "role.svg",
            children: [],
          },
        ],
      },
    ]);
  });
}
</script>

<template>
  <el-container class="layout-page-container">
    <el-header class="header">
      <layout-header />
    </el-header>
    <el-container class="container">
      <el-aside class="aside">
        <layout-aside />
      </el-aside>
      <el-main class="main">
        <layout-tab />
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-page-container {
  width: 100%;
  height: 100%;
  .main {
    background-color: rgba($color: #323e52, $alpha: 0.9);
    padding: 0px;
  }
}
</style>
