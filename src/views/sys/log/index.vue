<script>
export default {
  name: "UserPage",
};
</script>

<script setup>
import website from "@/config/website";
import { onBeforeMount } from "vue";
import useCrud from "@/hooks/useCrud";
import { crudOption } from "./options";
import MainDialog from "./MainDialog.vue";
import { getLogPage } from "@/api/sys/log/index";

const {
  dialog,
  funcList,
  listQuery,
  pagination,
  mainTableData,
  tableLoading,
  getList,
  sortChange,
  sizeChange,
  handleFilter,
  currentChange,
  handelResetSearchForm,
} = useCrud();

function onDetail(rowData) {
  dialog.value.open(website.pageStatus.DETAIL, rowData);
}
function onSearch() {
  handleFilter();
}

onBeforeMount(() => {
  funcList.page = getLogPage;
  getList();
});
</script>

<template>
  <page-container class="dict-page-container">
    <template #search>
      <el-form ref="searchForm" :model="listQuery" :inline="true" label-suffix=":">
        <el-form-item label="请求接口" prop="url">
          <el-input v-model="listQuery.url" placeholder="请输入请求接口" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="listQuery.ip" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item>
          <page-button type="search" @click.stop="onSearch" />
          <page-button type="reset" @click.prevent="handelResetSearchForm" />
        </el-form-item>
      </el-form>
    </template>
    <template #crud>
      <avue-crud
        ref="crud"
        :page="pagination"
        :option="crudOption"
        :data="mainTableData"
        :table-loading="tableLoading"
        @size-change="sizeChange"
        @current-change="currentChange"
        @sort-change="sortChange">
        <template #menu="{ row }">
          <page-button type="detail" direction="horizontal" @click.stop="onDetail(row)" />
        </template>
      </avue-crud>
    </template>
    <template #dialog>
      <main-dialog ref="dialog" />
    </template>
  </page-container>
</template>
