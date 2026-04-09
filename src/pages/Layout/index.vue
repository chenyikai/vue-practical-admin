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
import { menuStore } from "@/store/index";
import { initRoutes } from "@/router/index";
import { getUserMenuAll } from "@/api/sys/user/index";

onBeforeMount(() => {
  initMenu().then((menu) => {
    initRoutes(menu);
    menuStore().setMenu(menu);
  });
});

function initMenu() {
  return new Promise((resolve) => {
    getUserMenuAll().then(({ data }) => {
      resolve(data.data);
    });
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
