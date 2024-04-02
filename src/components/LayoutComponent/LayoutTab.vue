<script>
export default {
  name: "LayoutTab",
};
</script>

<script setup>
import draggable from "vuedraggable";
import { computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
import { tabStore } from "@/store/index.js";
import website from "@/config/website.js";
import { getPath } from "@/router/index.js";
import { CloseBold } from "@element-plus/icons-vue";
const TabStore = tabStore();

const tabList = computed({
  get() {
    return TabStore.tabList;
  },
  set(val) {
    let indexPage = [];
    const index = val.findIndex(
      (item) => item.value === website.fistPage.value,
    );

    if (index !== 0) {
      indexPage = val.splice(index, 1);
    }

    TabStore.updateAll([...indexPage, ...val]);
  },
});

function handleClick(val) {
  let tab;
  if (val.name) {
    tab = TabStore.find(val.name).tag;
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
  if (tab.command === "close") {
    TabStore.delete(tab);
  } else if (tab.command === "close-others") {
    TabStore.deleteOther(tab);
  } else if (tab.command === "close-all") {
    TabStore.deleteAll();
  } else if (tab.command === "refresh") {
    router.go(0);
  } else if (tab.command === "close-right") {
    TabStore.deleteRight(tab);
  } else {
    console.warn("未匹配的命令");
  }
}

function isFixedPage(tab) {
  return tab.value === website.fistPage.value;
}

function getDropMenu(tab) {
  return [
    {
      id: 1,
      command: "close",
      visible: !isFixedPage(tab),
      label: "关闭标签页",
    },
    {
      id: 2,
      command: "refresh",
      visible: true,
      label: "刷新标签页",
    },
    {
      id: 3,
      command: "close-others",
      visible: true,
      label: "关闭其他标签页",
    },
    {
      id: 4,
      command: "close-all",
      visible: true,
      label: "关闭所有标签页",
    },
    {
      id: 5,
      command: "close-right",
      visible: true,
      label: "关闭右侧标签页",
    },
  ];
}
</script>

<template>
  <draggable
    class="layout-tab-container"
    v-model="tabList"
    group="people"
    animation="300"
    item-key="id">
    <template #item="{ element }">
      <el-dropdown
        trigger="contextmenu"
        popper-class="tab-drop-popper"
        @command="handleCommand">
        <div
          class="tab"
          :class="{ active: TabStore['tab']['value'] === element['value'] }"
          @click.stop="handleClick(element)">
          <div class="left-layout">
            <svg-icon
              class="icon"
              :name="element.icon || website.defaultTabIcon" />
            <span class="label">{{ element.label }}</span>
          </div>
          <el-icon
            v-if="!isFixedPage(element)"
            :size="12"
            class="close-btn"
            @click.stop="handleCommand({ ...element, command: 'close' })">
            <CloseBold />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <template v-for="item in getDropMenu(element)" :key="item.id">
              <el-dropdown-item
                v-if="item.visible"
                :command="{ ...element, command: item['command'] }"
                >{{ item["label"] }}</el-dropdown-item
              >
            </template>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </template>
  </draggable>
</template>

<style scoped lang="scss">
.layout-tab-container {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 45px;
  padding: 0 10px;
  border-radius: 8px 0 0 0;
  background-color: var(--tab-color);
  .tab {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 35px;
    padding: 0 10px;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
    color: var(--font-color);
    user-select: none;
    transition: all 0.3s;
    &:hover,
    &.active {
      background-color: var(--content-color);
      &:before {
        display: none;
      }
    }
    .left-layout {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 8px;
      .icon {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      .label {
        color: var(--font-color);
        font-size: 14px;
      }
    }
    .close-btn {
      width: 1.5em;
      height: 1.5em;
      border-radius: 50%;
      transition: all 0.3s;
      &:hover {
        background-color: var(--tab-color);
      }
    }
  }
}
</style>
