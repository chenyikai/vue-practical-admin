<script>
export default {
  name: "MenuBar",
};
</script>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { setStore } from "@/utils/store.js";

const menuList = ref([
  {
    id: 1,
    label: "设置",
    icon: "setting.svg",
    url: "",
    children: [
      {
        id: 11,
        label: "菜单管理",
        icon: "menu.svg",
        url: "",
        children: [],
      },
      {
        id: 12,
        label: "字典管理",
        icon: "dict.svg",
        url: "",
        children: [],
      },
      {
        id: 13,
        label: "用户管理",
        url: "",
        icon: "user.svg",
        children: [],
      },
      {
        id: 14,
        label: "权限管理",
        icon: "limit.svg",
        url: "",
        children: [],
      },
      {
        id: 15,
        label: "角色管理",
        url: "",
        icon: "role.svg",
        children: [],
      },
    ],
  },
]);

onMounted(() => {
  setStore({ name: "menuData", content: menuList });
});

function handleClick(menu) {
  if (menu.children.length !== 0) {
    router.push({ name: "MenuPage", params: { menu: menu["id"] } });
  } else {
    console.log(menu, "直接跳转");
  }
}
</script>

<template>
  <div class="system-menu">
    <div
      class="menu-item"
      v-for="menu in menuList"
      :key="menu.id"
      @click="handleClick(menu)">
      <img class="icon" :src="menu.icon" alt="" />
      <span class="title">{{ menu.label }}</span>
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
      background-color: #202835;
    }
    .icon {
      width: 25px;
      height: 25px;
      margin-bottom: 5px;
    }
    .title {
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>
