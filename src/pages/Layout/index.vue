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
import { initRoutes } from "@/router/index.js";
import { menuData } from "@/mock/module/menu.js";

onBeforeMount(() => {
  initMenu().then((menu) => {
    initRoutes(menu);
    menuStore().setMenu(menu);
  });
});

function initMenu() {
  return new Promise((resolve) => {
    resolve(menuData);
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
