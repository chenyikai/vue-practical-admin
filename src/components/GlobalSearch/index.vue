<script>
export default {
  name: "GlobalSearch",
};
</script>

<script setup>
import { ref, nextTick } from "vue";
import { Search, DArrowRight } from "@element-plus/icons-vue";
import { debounce } from "lodash";
import { menuStore } from "@/store";
import website from "@/config/website.js";

defineOptions({
  name: "GlobalSearch",
});
const MenuStore = menuStore();

const visible = ref(false);
const popoverVisible = ref(false);
const keyword = ref(null);
const input = ref({});
const resultList = ref({
  menu: [],
});

function onClick(val) {
  visible.value = val;
  nextTick().then(() => {
    input.value.focus();
  });
}

const onInput = debounce(
  function () {
    resultList.value.menu =
      MenuStore.findMenu({
        expression: (data) => {
          return data[website.menu.props.label].indexOf(keyword.value) !== -1;
        },
      }) || [];

    popoverVisible.value = true;
  },
  300,
  {},
);
</script>

<template>
  <section class="global-search-container" :class="{ active: visible }">
    <div class="btn-layout" v-if="!visible" @click.stop="onClick(true)">
      <el-icon :size="20"><Search /></el-icon>
    </div>
    <div class="input-layout" v-else>
      <el-popover
        :visible="popoverVisible"
        placement="bottom"
        title="搜索结果"
        :width="300">
        <template #default>
          <el-empty :image-size="80" />
        </template>
        <template #reference>
          <el-input
            ref="input"
            v-model="keyword"
            style="width: 100%"
            placeholder="请输入关键词搜索"
            @input="onInput">
            <template #prepend>
              <el-button :icon="DArrowRight" @click.stop="onClick(false)" />
            </template>
          </el-input>
        </template>
      </el-popover>
    </div>
  </section>
</template>

<style scoped lang="scss">
.global-search-container {
  width: 35px;
  transition: all 0.3s;
  &.active {
    width: 300px;
    border-radius: 17.5px;
    background-color: var(--theme-menu-hover-bg);
  }
  &:hover {
    border-radius: 17.5px;
    background-color: var(--theme-menu-hover-bg);
  }
  .input-layout {
  }
}
</style>
