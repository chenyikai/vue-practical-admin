<script>
export default {
  name: "ShoreFoundationTypeBox",
};
</script>

<script setup>
import { onBeforeMount } from "vue";
import { crudOption } from "./options.js";
import useCrud from "@/hooks/useCrud.js";
import PageButton from "package/Button/src/index.vue";
import {
  createPoiTTypeShore,
  deletePoiTTypeShore,
  getPoiTTypeShorePage,
  updatePoiTTypeShore,
} from "@/api/type-manage/index.js";
import website from "@/config/website.js";
import { ElMessage, ElMessageBox } from "element-plus";
import MainDialog from "./MainDialog.vue";

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

function onSearch() {
  handleFilter();
}

function onAdd() {
  dialog.value.open(website.pageStatus.CREATE);
}

function onUpdate(rowData) {
  dialog.value.open(website.pageStatus.UPDATE, rowData);
}

function onDelete(rowData) {
  ElMessageBox.confirm(
    `是否确认删除类型：${rowData.name}？<div style="color:#ff4757">此操作将会导致所有相关数据一并删除！</div>`,
    "警告",
    {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
    },
  )
    .then(() => {
      return deletePoiTTypeShore(rowData.id);
    })
    .then(() => {
      ElMessage({
        message: "删除成功!",
        type: "success",
      });
      handleFilter();
    });
}

function onCreateSubmit(formData, done) {
  createPoiTTypeShore(formData)
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
  updatePoiTTypeShore(formData)
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

onBeforeMount(() => {
  funcList.page = getPoiTTypeShorePage;
  getList();
});
</script>

<template>
  <page-container class="shore-foundation-type-box">
    <template #search>
      <div class="index-page-container-header">
        <el-form
          ref="searchForm"
          :model="listQuery"
          :inline="true"
          label-suffix=":">
          <el-form-item label="名称" prop="name">
            <el-input
              v-model="listQuery.name"
              placeholder="请输入名称"
              clearable></el-input>
          </el-form-item>
          <el-form-item>
            <page-button type="search" @click.stop="onSearch" />
            <page-button type="reset" @click.prevent="handelResetSearchForm" />
          </el-form-item>
        </el-form>
        <div class="button-group">
          <page-button class="btn" type="create" @click.stop="onAdd()" />
        </div>
      </div>
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
        <template v-slot:menu="{ row }">
          <page-button
            type="update"
            direction="horizontal"
            @click.stop="onUpdate(row)" />
          <page-button
            class="btn"
            direction="horizontal"
            type="delete"
            @click.stop="onDelete(row)" />
        </template>
      </avue-crud>
    </template>
    <template #dialog>
      <main-dialog
        ref="dialog"
        @[website.pageStatus.CREATE]="onCreateSubmit"
        @[website.pageStatus.UPDATE]="onUpdateSubmit" />
    </template>
  </page-container>
</template>

<style scoped lang="scss">
.shore-foundation-type-box {
  .index-page-container-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .button-group {
      display: flex;
      align-content: flex-start;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 12px;
      flex-shrink: 0;
      width: 324px;
      height: 100%;

      .btn {
        margin: 0;
      }
    }
  }
}
</style>
