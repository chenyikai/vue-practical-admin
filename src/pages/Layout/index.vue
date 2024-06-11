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
import { getUserMenuAll } from "@/api/sys/menu/index.js";

onBeforeMount(() => {
  initMenu().then((menu) => {
    addRoute(menu, true);
    menuStore().setMenu(menu);
  });
});

const initMenu = () => getUserMenuAll().then(({ data }) => data.data);
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
