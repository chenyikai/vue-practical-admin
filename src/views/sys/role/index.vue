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
import VerticalStretchBox from "package/VerticalStretchBox/src/index.vue";

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
  <vertical-stretch-box :visible="isShow" left-width="500px">
    <template #left>
      <role-list-card ref="list" @setting="handleSetting" />
    </template>
    <template #right>
      <limit-setting-card
        ref="limit"
        :menu-data="allMenuTree"
        @setting="handleSetting" />
    </template>
  </vertical-stretch-box>
</template>
