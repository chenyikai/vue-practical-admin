<script>
export default {
  name: "MenuPage",
};
</script>

<script setup>
import website from "@/config/website.js";
import analyze from "rgbaster";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { menuStore } from "@/store/index.js";
const route = useRoute();
const router = useRouter();
const menuList = ref([]);
const menuProps = computed(() => website.menu.props);
onMounted(() => {
  menuList.value = menuStore().getSecondMenu(route.params["id"]);
  setColor();
});

function setColor() {
  menuList.value.forEach((item) => {
    analyze(item["icon"], { scale: 0.1 }).then((data) => {
      if (data.length > 0) item["bgColor"] = data[0]["color"];
    });
  });
}

function handleClick(menu) {
  const path = website.menu.props.path;
  router.push({ path: menu[path] });
}
</script>

<template>
  <div class="menu-page-container">
    <div
      class="menu-page-item"
      v-for="menu in menuList"
      :key="menu.id"
      @click="handleClick(menu)">
      <div
        class="icon-layout"
        :style="{ backgroundColor: menu['bgColor'] }"></div>
      <img :src="menu[menuProps['icon']]" alt="" />
      <span class="label">{{ menu[menuProps["label"]] }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu-page-container {
  display: flex;
  padding: 20px;
  .menu-page-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 105px;
    height: 105px;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 20px;
    border: 1px solid transparent;
    transition: background-color 0.3s;
    .icon-layout {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-bottom: 10px;
      opacity: 0.1;
    }
    img {
      position: absolute;
      width: 30px;
      height: 30px;
      bottom: 52px;
    }
    .label {
      font-size: 14px;
      color: #d3d3d3;
    }
    &:hover {
      background-color: rgba($color: #fff, $alpha: 0.1);
      border-color: rgba($color: #fff, $alpha: 0.4);
    }
  }
}
</style>
