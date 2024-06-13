<script>
export default {
  name: "ShipTeam",
};
</script>

<script setup>
import { onBeforeMount } from "vue";
import { crudOption } from "./options.js";
import useCrud from "@/hooks/useCrud.js";
import PageButton from "package/Button/src/index.vue";
import website from "@/config/website.js";
import { ElMessage, ElMessageBox } from "element-plus";
import MainDialog from "./MainDialog.vue";
import {
  reqGetShipTeamPage,
  reqAddShipTeam,
  reqDeleteShipTeam,
  reqUpdateShipTeam,
} from "./api.js";

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
  ElMessageBox.confirm(`是否确认删除船队：${rowData.name}？ `, "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    dangerouslyUseHTMLString: true,
  })
    .then(() => {
      return reqDeleteShipTeam(rowData.id);
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
  reqAddShipTeam(formData)
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
  reqUpdateShipTeam(formData)
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
  funcList.page = reqGetShipTeamPage;
  getList();
});
</script>

<template>
  <page-container>
    <template #search>
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
    </template>
    <template #button>
      <page-button class="btn" type="create" @click.stop="onAdd()" />
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
        <template v-slot:color="{ row }">
          <div class="color-box">
            <div
              class="background"
              :style="`background:  ${row.color}; color: ${row.color}`">
              <span class="text">
                {{ row.color || "无颜色" }}
              </span>
            </div>
          </div>
        </template>
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
.color-box {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .background {
    width: 80%;
    height: 20px;
    background: #7f8c8d;
    background-color: currentColor;
    .text {
      font-size: 14px;
      line-height: 14px;
      font-weight: bold;
      filter: grayscale(1) contrast(999) invert(1);
    }
  }
}
</style>
