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
        id: 0,
        menuName: "组件",
        icon: "component",
        path: "/component",
        sort: 9,
        children: [
          {
            id: 100,
            menuName: "上传组件",
            icon: "export",
            path: "/component/upload/index",
            sort: 9,
            children: [],
          },
        ],
      },
      {
        id: 1,
        menuName: "设置",
        icon: "setting",
        sort: -1,
        path: "/Layout",
        children: [
          {
            id: 11,
            menuName: "菜单管理",
            icon: "menu",
            path: "/sys/menu/index",
            children: [],
          },
          {
            id: 12,
            menuName: "字典管理",
            icon: "dict",
            path: "/sys/dict/index",
            children: [],
          },
          {
            id: 13,
            menuName: "用户管理",
            path: "/sys/user/index",
            icon: "user",
            children: [],
          },
          {
            id: 14,
            menuName: "权限管理",
            icon: "limit",
            path: "/sys/role/index",
            children: [],
          },
          {
            id: 15,
            menuName: "部门管理",
            icon: "department",
            path: "/sys/dept/index",
            children: [],
          },
          // {
          //   id: 16,
          //   menuName: "在线用户管理",
          //   icon: "online.svg",
          //   path: "/sys/live/index",
          //   children: [],
          // },
          {
            id: 17,
            menuName: "日志管理",
            icon: "log",
            path: "/sys/log/index",
            children: [],
          },
          // {
          //   id: 15,
          //   menuName: "角色管理",
          //   path: "",
          //   icon: "role.svg",
          //   children: [],
          // },
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
  .main {
    display: flex;
    flex-direction: column;
    padding: 0;
    flex-basis: 0;
    overflow: hidden;
    .content {
      flex: 1;
      overflow: hidden;
      padding: 20px;
      background-color: var(--content-color);
    }
  }
}
</style>
