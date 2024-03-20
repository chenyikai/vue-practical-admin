<script>
export default {
  name: "LimitPage",
};
</script>

<script setup>
import { ref, computed, nextTick, onBeforeMount } from "vue";
import RoleListCard from "./list/index.vue";
import { validatenull } from "@/utils/validate.js";
import LimitSettingCard from "./setting/index.vue";
import { getMenuAll } from "@/api/sys/menu/index.js";

const settingData = ref({});
const list = ref({});
const limit = ref({});
const allMenuTree = ref([]);
const isShow = computed(() => !validatenull(settingData.value));

function handleSetting(rowData) {
  settingData.value = rowData;
  if (!validatenull(rowData)) {
    nextTick().then(() => {
      limit.value.init(rowData);
    });
  }
  setTimeout(() => {
    list.value.resetTable();
  }, 300);
}

function getAll() {
  getMenuAll().then(({ data }) => {
    allMenuTree.value = data.data;
  });
}

onBeforeMount(() => {
  getAll();
});
</script>

<template>
  <section class="role-page-container">
    <role-list-card
      ref="list"
      class="role-list-card"
      :class="{ show: isShow }"
      @setting="handleSetting" />
    <limit-setting-card
      ref="limit"
      v-if="isShow"
      class="limit-setting"
      :menu-data="allMenuTree"
      :class="{ show: isShow }"
      @setting="handleSetting" />
  </section>
</template>

<style lang="scss">
.role-page-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  .role-list-card {
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: all 300ms;
    &.show {
      width: 500px;
      margin-right: 20px;
    }
  }
  .limit-setting {
    width: 0;
    height: 100%;
    overflow: hidden;
    &.show {
      flex: 1;
      width: auto;
    }
  }
}
</style>
