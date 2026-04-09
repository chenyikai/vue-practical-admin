<template>
  <div class="page-not-found">
    <img class="bg" src="@/assets/images/404/404-bg.svg" alt="" />
    <span class="tips">很抱歉，您访问的页面不存在。</span>
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
import { tabStore } from "@/store/index";
import { useRoute, useRouter } from "vue-router";
import website from "@/config/website";
import { validatenull } from "@/utils/validate";
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
  .tips {
    margin: 20px 0;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
