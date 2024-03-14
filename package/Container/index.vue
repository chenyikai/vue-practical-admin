<script>
export default {
  name: "PageContainer",
};
</script>

<script setup>
import { computed } from "vue";
import { tabStore } from "@/store/index.js";
const TabStore = tabStore();
const label = computed(() => TabStore["tab"]["label"]);
const icon = computed(() => TabStore["tab"]["icon"]);
</script>

<template>
  <section class="page-container">
    <header class="page-container-header">
      <h1 class="page-title">
        <img class="icon" :src="icon" alt="" />
        <span class="label">{{ label }}</span>
      </h1>
      <div class="form-layout">
        <slot name="search"></slot>
      </div>
    </header>
    <el-divider class="divider-line" />
    <main class="page-container-main">
      <slot></slot>
    </main>
  </section>
</template>

<style lang="scss">
.page-container {
  width: 100%;
  border-radius: 2px;
  background-color: var(--theme-color);
  box-shadow: 0 0 2px 5px var(--theme-color);
  padding: 10px;
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
            .el-input {
              border: none;
              &__wrapper {
                background-color: var(--content-color);
                box-shadow: 0 0 2px var(--content-color);
                .el-input__inner {
                  color: var(--font-color);
                }
              }
            }
          }
        }
      }
    }
  }
  .divider-line {
    border-top: 1px solid #909399;
  }
}
</style>
