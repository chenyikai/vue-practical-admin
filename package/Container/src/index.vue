<script>
export default {
  name: "PageContainer",
};
</script>

<script setup>
import { computed, useSlots } from "vue";
import { tabStore } from "@/store/index.js";
import { validatenull } from "@/utils/validate.js";
const props = defineProps({
  pageInfo: {
    type: Object,
    default: () => {},
  },
});
const slots = useSlots();
const TabStore = tabStore();

const label = computed(() => {
  if (validatenull(props.pageInfo)) {
    return TabStore.tab.label;
  } else {
    return props.pageInfo.label;
  }
});
const icon = computed(() => {
  if (validatenull(props.pageInfo)) {
    return TabStore.tab.icon;
  } else {
    return props.pageInfo.icon;
  }
});
</script>

<template>
  <section class="page-container">
    <header class="page-container-header">
      <div class="title-layout">
        <h1 class="page-title">
          <img class="icon" :src="icon" alt="" />
          <span class="label">{{ label }}</span>
        </h1>
        <slot name="title"></slot>
      </div>
      <div class="form-layout" v-if="!validatenull(slots.search)">
        <slot name="search"></slot>
      </div>
    </header>
    <el-divider class="divider-line" v-if="!validatenull(slots.search)" />
    <div class="button-layout" v-if="!validatenull(slots.button)">
      <slot name="button"></slot>
    </div>
    <main class="page-container-main">
      <slot name="crud"></slot>
    </main>
    <slot name="dialog" />
  </section>
</template>

<style lang="scss">
.page-container {
  @import "src/styles/variables";
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include container();
  &-header {
    width: 100%;
    .title-layout {
      display: flex;
      justify-content: space-between;
      .page-title {
        display: flex;
        align-items: center;
        margin: 0 0 20px 0;
        font-size: 16px;
        color: var(--font-color);
        .icon {
          width: 24px;
          height: 24px;
          margin-right: 6px;
        }
      }
      align-items: center;
    }
    .form-layout {
      width: 100%;
      padding: 0 10px;
      .el-form {
        display: flex;
        flex-wrap: wrap;
        row-gap: 20px;
        &-item {
          margin-bottom: 0;
        }
      }
    }
  }
  .button-layout {
    margin-bottom: 24px;
  }
  &-main {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
}
</style>
