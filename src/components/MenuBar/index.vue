<script>
export default {
  name: "MenuBar",
};
</script>

<script setup>
import website from "@/config/website.js";
import { computed } from "vue";
import { menuStore } from "@/store/index.js";
import { go2MenuPage } from "@/router/index.js";
const menuProps = computed(() => website.menu.props);

function handleClick(menu) {
  go2MenuPage(menu);
}
</script>

<template>
  <div class="system-menu">
    <div
      class="menu-item"
      v-for="menu in menuStore().menuList"
      :key="menu.id"
      @click="handleClick(menu)">
      <img class="icon" :src="menu[menuProps['icon']]" alt="" />
      <span class="title">{{ menu[menuProps["label"]] }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.system-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  border: none;
  background-color: var(--theme-color);
  .menu-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 60px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      border-radius: 50%;
      background-color: var(--menu-hover-bg);
    }
    .icon {
      width: 25px;
      height: 25px;
      margin-bottom: 5px;
    }
    .title {
      font-size: 14px;
      color: #fff;
    }
    & + .menu-item {
      margin-top: 10px;
    }
  }
}
</style>
