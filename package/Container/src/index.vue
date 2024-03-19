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
      <h1 class="page-title">
        <img class="icon" :src="icon" alt="" />
        <span class="label">{{ label }}</span>
      </h1>
      <div class="form-layout" v-if="!validatenull(slots.search)">
        <slot name="search"></slot>
      </div>
    </header>
    <el-divider class="divider-line" v-if="!validatenull(slots.search)" />
    <div class="button-layout">
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  background-color: var(--theme-color);
  box-shadow: 0 0 2px 5px var(--theme-color);
  padding: 10px;
  overflow: hidden;
  &-header {
    width: 100%;
    .page-title {
      display: flex;
      align-items: center;
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #fff;
      .icon {
        width: 24px;
        height: 24px;
        margin-right: 6px;
      }
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
          &__label {
            color: #fff;
          }
          &__content {
            //.el-input {
            //  border: none;
            //  &__wrapper {
            //    background-color: var(--content-color);
            //    box-shadow: 0 0 2px var(--content-color);
            //    .el-input__inner {
            //      color: var(--font-color);
            //    }
            //  }
            //}
          }
        }
      }
    }
  }
  .divider-line {
    border-top: 1px solid var(--border-color);
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
