<script>
export default {
  name: "MenuBar",
};
</script>

<script setup>
import { cloneDeep } from "lodash";
import website from "@/config/website.js";
import { computed } from "vue";
import { menuStore } from "@/store/index.js";
import { go2MenuPage } from "@/router/index.js";
import SvgIcon from "package/SvgIcon/src/index.vue";

const MenuStore = menuStore();
const menuProps = computed(() => website.menu.props);
const sortMenu = computed(() => {
  return cloneDeep(MenuStore.menuList).sort((a, b) => b.sort - a.sort);
});

function handleClick(menu) {
  go2MenuPage(menu);
}
</script>

<template>
  <div class="system-menu">
    <div
      class="menu-item"
      v-for="menu in sortMenu"
      :key="menu.id"
      @click="handleClick(menu)">
      <svg-icon class="icon" :name="menu.icon" />
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
  user-select: none;
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
      margin-bottom: 7px;
    }
    .title {
      font-size: 14px;
      //color: var(--font-color);
      color: #fff;
    }
    & + .menu-item {
      margin-top: 10px;
    }
  }
}
</style>
