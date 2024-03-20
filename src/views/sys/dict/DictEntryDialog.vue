<script>
export default {
  name: "DictEntryDialog",
};
</script>

<script setup>
import { onBeforeMount } from "vue";
import useForm from "@/hooks/useForm.js";
const { loading, dialog } = useForm();
import useCrud from "@/hooks/useCrud.js";
import { dictItemCrudOption } from "@/views/sys/dict/options.js";
import website from "@/config/website.js";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  createDictItem,
  deleteDictItemById,
  getDictItemPage,
  updateDictItem,
} from "@/api/sys/dict/index.js";
import EntryMainDialog from "./EntryMainDialog.vue";

const pageInfo = {
  icon: new URL("/entry.svg", import.meta.url),
  label: "字典项管理",
};

const {
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
  setFreezeData,
  handelResetSearchForm,
} = useCrud();

function open({ id }) {
  setFreezeData("dictId", id);
  dialog.value.open();
  getList();
}

function onAdd() {
  dialog.value.open(website.pageStatus.CREATE);
}

function onDelete(rowData) {
  ElMessageBox.confirm(`是否确认删除字典项：${rowData.label}？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return deleteDictItemById(rowData.id);
    })
    .then(() => {
      ElMessage({
        message: "删除成功!",
        type: "success",
      });
      handleFilter();
    });
}

function onUpdate(rowData) {
  dialog.value.open(website.pageStatus.UPDATE, rowData);
}

function onDetail(rowData) {
  dialog.value.open(website.pageStatus.DETAIL, rowData);
}

function onCreateSubmit(formData, done) {
  createDictItem({ ...formData, dictId: listQuery.dictId })
    .then(() => {
      done(true);
      ElMessage({
        message: "新增成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "新增失败",
        type: "error",
      });
      done();
    });
}

function onUpdateSubmit(formData, done) {
  updateDictItem({ ...formData, dictId: listQuery.dictId })
    .then(() => {
      done(true);
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "修改失败",
        type: "error",
      });
      done();
    });
}

function onSearch() {
  handleFilter();
}

onBeforeMount(() => {
  funcList.page = getDictItemPage;
});

defineExpose({
  open,
});
</script>

<template>
  <page-dialog
    title="字典项管理"
    class="dict-entry-page-dialog"
    ref="dialog"
    width="1000px"
    :loading="loading"
    :show-footer="false">
    <page-container class="dict-entry-page-container" :page-info="pageInfo">
      <template #search>
        <el-form
          ref="searchForm"
          :model="listQuery"
          :inline="true"
          label-suffix=":">
          <el-form-item label="字典项名称" prop="label">
            <el-input
              v-model="listQuery.label"
              placeholder="字典项名称"></el-input>
          </el-form-item>
          <el-form-item>
            <page-button type="search" @click.stop="onSearch" />
            <page-button type="reset" @click.prevent="handelResetSearchForm" />
          </el-form-item>
        </el-form>
      </template>
      <template #button>
        <page-button type="create" @click.stop="onAdd" />
      </template>
      <template #crud>
        <avue-crud
          ref="crud"
          :page="pagination"
          :option="dictItemCrudOption"
          :data="mainTableData"
          :table-loading="tableLoading"
          @size-change="sizeChange"
          @current-change="currentChange"
          @sort-change="sortChange">
          <template v-slot:menu="{ row }">
            <page-button
              type="detail"
              direction="horizontal"
              @click.stop="onDetail(row)" />
            <page-button
              type="update"
              direction="horizontal"
              @click.stop="onUpdate(row)" />
            <page-button
              type="delete"
              direction="horizontal"
              @click.stop="onDelete(row)" />
          </template>
        </avue-crud>
      </template>
      <template #dialog>
        <entry-main-dialog
          ref="dialog"
          @[website.pageStatus.CREATE]="onCreateSubmit"
          @[website.pageStatus.UPDATE]="onUpdateSubmit" />
      </template>
    </page-container>
  </page-dialog>
</template>

<style lang="scss">
.dict-entry-page-dialog {
  .el-dialog__body {
    padding: 20px;
  }
}
</style>
