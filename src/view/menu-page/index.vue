<script>
export default {
  name: "MenuPage",
};
</script>

<script setup>
import analyze from "rgbaster";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
onMounted(() => {
  console.log(route.params.menu);
  setColor();
});

const menuList = ref([
  {
    id: 11,
    label: "菜单管理",
    icon: "menu.svg",
    url: "/sys/menu/index",
    bgColor: null,
    children: [],
  },
  {
    id: 12,
    label: "字典管理",
    icon: "dict.svg",
    bgColor: null,
    children: [],
  },
  {
    id: 13,
    label: "用户管理",
    icon: "user.svg",
    bgColor: null,
    children: [],
  },
  {
    id: 14,
    label: "权限管理",
    icon: "limit.svg",
    bgColor: null,
    children: [],
  },
  {
    id: 15,
    label: "角色管理",
    icon: "role.svg",
    bgColor: null,
    children: [],
  },
]);

function setColor() {
  menuList.value.forEach((item) => {
    analyze(item["icon"], { scale: 0.1 }).then((data) => {
      if (data.length > 0) item["bgColor"] = data[0]["color"];
    });
  });
}

function handleClick(menu) {
  router.push({ path: menu.url });
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
      <img :src="menu.icon" alt="" />
      <span class="label">{{ menu.label }}</span>
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
