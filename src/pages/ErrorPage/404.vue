<template>
  <div class="page-not-found">
    <img class="bg" src="@/assets/images/404/404-bg.svg" alt="" />
    <div class="btn-group">
      <el-button type="primary" @click.stop="retry">重试</el-button>
      <el-button @click.stop="handleGo2Index">首页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageNotFound",
};
</script>

<script setup>
import { onMounted } from "vue";
import { tabStore } from "@/store/index.js";
import { useRoute, useRouter } from "vue-router";
import website from "@/config/website.js";
import { validatenull } from "@/utils/validate.js";
const router = useRouter();
const route = useRoute();
const TabStore = tabStore();

function handleGo2Index() {
  TabStore.delete({ value: route.fullPath, ...route }, () => {
    router.push({ path: website.indexPage });
  });
}

function retry() {
  router.go(0);
}

onMounted(() => {
  const _route = router.getRoutes().find((item) => {
    return route.fullPath.indexOf(item.path) !== -1 && route.path === item.path;
  });
  if (!validatenull(_route)) {
    router.push({
      path: _route.path,
      query: route.query,
      params: route.params,
    });
  }
});
</script>

<style lang="scss" scoped>
@import "src/styles/variables";
.page-not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  @include container();
  .bg {
    width: 750px;
  }
}
</style>
