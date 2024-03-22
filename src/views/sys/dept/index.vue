<script>
export default {
  name: "UserPage",
};
</script>

<script setup>
import website from "@/config/website.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, onBeforeMount, toRef } from "vue";
import useCrud from "@/hooks/useCrud.js";
import MainDialog from "./MainDialog.vue";
import {
  createDept,
  deleteDeptById,
  getDeptPage,
  updateDept,
} from "@/api/sys/dept/index.js";
import useOptions from "./useOptions.js";
const { crudOption } = useOptions();

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

const departTreeData = computed(() => [
  {
    deptName: "根节点",
    id: "-1",
    children: toRef(mainTableData).value,
  },
]);

function onAdd() {
  dialog.value.open(website.pageStatus.CREATE);
}

function onDelete(rowData) {
  ElMessageBox.confirm(`是否确认删除部门：${rowData.deptName}？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return deleteDeptById(rowData.id);
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
  createDept(formData)
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
  updateDept(formData)
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
  funcList.page = getDeptPage;
  getList();
});
</script>

<template>
  <page-container class="dict-page-container">
    <template #search>
      <el-form
        ref="searchForm"
        :model="listQuery"
        :inline="true"
        label-suffix=":">
        <el-form-item label="部门机构名称" prop="deptName">
          <el-input
            placeholder="请输入部门机构名称"
            v-model="listQuery.deptName"></el-input>
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
        :option="crudOption"
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
      <main-dialog
        ref="dialog"
        :departTreeData="departTreeData"
        @[website.pageStatus.CREATE]="onCreateSubmit"
        @[website.pageStatus.UPDATE]="onUpdateSubmit" />
    </template>
  </page-container>
</template>
