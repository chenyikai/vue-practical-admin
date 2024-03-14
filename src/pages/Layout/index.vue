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
import { addRoute } from "@/router/index.js";

onBeforeMount(() => {
  initMenu().then((menu) => {
    addRoute(menu, true);
    menuStore().setMenu(menu);
  });
});

function initMenu() {
  return new Promise((resolve) => {
    resolve([
      {
        id: 1,
        menuName: "设置",
        icon: "setting.svg",
        path: "/menu",
        children: [
          {
            id: 11,
            menuName: "菜单管理",
            icon: "menu.svg",
            path: "/sys/menu/index",
            children: [],
          },
          {
            id: 12,
            menuName: "字典管理",
            icon: "dict.svg",
            path: "/sys/dict/index",
            children: [],
          },
          {
            id: 13,
            menuName: "用户管理",
            path: "/sys/user/index",
            icon: "user.svg",
            children: [],
          },
          {
            id: 14,
            menuName: "权限管理",
            icon: "limit.svg",
            path: "",
            children: [],
          },
          {
            id: 15,
            menuName: "角色管理",
            path: "",
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
        <div class="content">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-page-container {
  width: 100%;
  height: 100%;
  .main {
    display: flex;
    flex-direction: column;
    padding: 0;
    .content {
      flex: 1;
      overflow: hidden;
      padding: 20px;
      background-color: var(--content-color);
    }
  }
}
</style>
