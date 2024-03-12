<script>
export default {
  name: "LayoutTab",
};
</script>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { tabStore } from "@/store/index.js";
import website from "@/config/website.js";
import { getPath } from "@/router/index.js";

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

function handleClick(val) {
  let tab;
  if (val.name) {
    tab = tabStore().find(val.name).tag;
  } else {
    tab = val;
  }

  const path = getPath(
    {
      name: tab.label,
      src: tab.value,
    },
    tab.meta,
  );
  router.push({ path, query: tab.query });
}

function handleCommand(tab) {
  console.log(tab, "command");
}
</script>

<template>
  <div class="layout-tab-container">
    <el-dropdown
      trigger="contextmenu"
      popper-class="tab-drop-popper"
      v-for="tab in tabStore()['tabList']"
      :key="tab.id"
      @command="handleCommand">
      <div
        class="tab"
        :class="{ active: route.fullPath === tab['value'] }"
        @click.stop="handleClick(tab)">
        <div class="left-layout">
          <img :src="tab.icon || website.defaultTabIcon" alt="" />
          <span class="label">{{ tab.label }}</span>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in dropMenu"
            :key="item.id"
            :command="{ ...tab, command: item['command'] }"
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
