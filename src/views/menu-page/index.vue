<script>
export default {
  name: "MenuPage",
};
</script>

<script setup>
import website from "@/config/website.js";
import analyze from "rgbaster";
import { readonly, watch, ref, onBeforeMount } from "vue";
import { go2MenuPage } from "@/router/index.js";
import { menuStore } from "@/store/index.js";
import { useRoute } from "vue-router";
import SvgIcon from "package/SvgIcon/src/index.vue";
const route = useRoute();
const MenuStore = menuStore();

const menuProps = readonly(website.menu.props);
const menuList = ref([]);

watch(
  route,
  (val) => {
    if (val.name === "MenuPage") {
      init();
    }
  },
  {
    deep: true,
  },
);

onBeforeMount(() => {
  init();
});

function init() {
  menuList.value = MenuStore.getMenu(route.query.id)[menuProps.children];
  setColor();
}

function setColor() {
  menuList.value.forEach((item) => {
    const icon = new URL(`../../icons/${item.icon}.svg`, import.meta.url);
    analyze(icon["href"], { scale: 0.1 }).then((data) => {
      if (data.length > 0) item.bgColor = data[0].color;
    });
  });
}

function handleClick(menu) {
  go2MenuPage(menu);
}
</script>

<template>
  <ul class="menu-page-container">
    <li
      class="menu-page-item"
      v-for="menu in menuList"
      :key="menu.id"
      @click="handleClick(menu)">
      <div
        class="icon-layout"
        :style="{ backgroundColor: menu['bgColor'] }"></div>
      <svg-icon class="icon" :name="menu[menuProps['icon']]" />
      <span class="label">{{ menu[menuProps["label"]] }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.menu-page-container {
  @import "src/styles/variables";
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include container();
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
    .icon {
      position: absolute;
      width: 30px;
      height: 30px;
      bottom: 52px;
    }
    .label {
      font-size: 14px;
      //color: #d3d3d3;
      color: var(--font-color);
    }
    &:hover {
      background-color: rgba($color: #fff, $alpha: 0.1);
      border-color: rgba($color: #fff, $alpha: 0.4);
    }
  }
}
</style>
