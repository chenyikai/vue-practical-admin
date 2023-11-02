<script>
export default {
  name: "LayoutTab",
};
</script>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { tabStore } from "@/store/index.js";

const tabList = ref([
  {
    id: 10,
    label: "设置",
    icon: "setting.svg",
    url: "/menu",
  },
  {
    id: 11,
    label: "菜单管理",
    icon: "menu.svg",
    url: "/sys/menu/index",
  },
  {
    id: 12,
    label: "字典管理",
    icon: "dict.svg",
    url: "/sys/menu/index",
  },
  {
    id: 13,
    label: "用户管理",
    icon: "user.svg",
    url: "/sys/menu/index",
  },
  {
    id: 14,
    label: "权限管理",
    icon: "limit.svg",
    url: "/sys/menu/index",
  },
  {
    id: 15,
    label: "角色管理",
    icon: "role.svg",
    url: "/sys/menu/index",
  },
]);

const dropMenu = ref([
  {
    id: 1,
    command: "close",
    label: "关闭标签页",
  },
  {
    id: 2,
    command: "refresh",
    label: "刷新标签页",
  },
  {
    id: 3,
    command: "close-others",
    label: "关闭其他标签页",
  },
  {
    id: 4,
    command: "close-all",
    label: "关闭所有标签页",
  },
  {
    id: 5,
    command: "close-right",
    label: "关闭右侧标签页",
  },
]);

function handleClick(tab) {
  tabStore().add(tab);
}

function handleCommand(command, tab) {
  console.log(command, tab);
}
</script>

<template>
  <div class="layout-tab-container">
    <el-dropdown
      trigger="contextmenu"
      popper-class="tab-drop-popper"
      v-for="tab in tabList"
      :key="tab.id"
      @command="handleCommand($event, tab)">
      <div
        class="tab"
        :class="{ active: route.path === tab.url }"
        @click.stop="handleClick(tab)">
        <div class="left-layout">
          <img :src="tab.icon" alt="" />
          <span class="label">{{ tab.label }}</span>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in dropMenu"
            :key="item.id"
            :command="item['command']"
            >{{ item["label"] }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped lang="scss">
.layout-tab-container {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 45px;
  padding: 0 10px;
  background-color: #262f3f;
  .tab {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 35px;
    padding: 0 10px;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
    color: #fff;
    &:hover,
    &.active {
      background-color: rgba(50, 62, 82);
      &:before {
        display: none;
      }
    }
    .left-layout {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      .label {
        color: #fff;
        font-size: 12px;
      }
    }
  }
}
</style>
