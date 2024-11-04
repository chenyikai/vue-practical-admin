<script>
export default {
  name: "MenuBar",
};
</script>

<script setup>
import website from "@/config/website.js";
import { computed, onMounted } from "vue";
import { menuStore } from "@/store/index.js";
import { go2MenuPage } from "@/router/index.js";
import SvgIcon from "package/SvgIcon/src/index.vue";

const MenuStore = menuStore();
const menuProps = computed(() => website.menu.props);

function handleClick(menu) {
  go2MenuPage(menu);
}

onMounted(() => {
  console.log(MenuStore.menuList);
});
</script>

<template>
  <div class="system-menu">
    <div
      class="menu-item"
      v-for="menu in MenuStore.menuList"
      :key="menu.id"
      :style="{ order: menu.sort }"
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
  gap: 10px;
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
  }
}
</style>
