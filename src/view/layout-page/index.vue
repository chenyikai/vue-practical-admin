<script>
export default {
  name: "LayoutPage",
};
</script>

<script setup>
import LayoutAside from "@/components/LayoutComponent/LayoutAside.vue";
import LayoutHeader from "@/components/LayoutComponent/LayoutHeader.vue";
import LayoutTab from "@/components/LayoutComponent/LayoutTab.vue";
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
