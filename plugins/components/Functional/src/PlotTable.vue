<script>
import crudMixin from "@/mixins/crudMixin";
import { markInfoDelete } from "@/api/plot";

export default {
  name: "PlotTable",
  mixins: [crudMixin],
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      crudOption: {
        header: false,
        addBtn: false,
        columnBtn: false,
        refreshBtn: false,
        index: true,
        border: true,
        stripe: true,
        menu: false,
        headerAlign: "center",
        align: "center",
        height: "400px",
        column: [
          {
            label: "名称",
            prop: "name",
          },
          {
            label: "操作",
            prop: "menu",
            width: 150,
            slot: true,
          },
        ],
      },
    };
  },
  methods: {
    handleEdit() {},
    handlePosition() {},
    handleDelete(rowData) {
      this.$confirm(`是否确认删除：${rowData.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return markInfoDelete(rowData.id);
        })
        .then(() => {
          this.$message.success("删除成功!");
          this.$emit("refresh");
        })
        .catch(() => {});
    },
  },
};
</script>

<template>
  <avue-crud
    ref="crud"
    :page.sync="pagination"
    :option="crudOption"
    :data="data"
    :table-loading="false"
    @size-change="sizeChange"
    @current-change="currentChange"
    @sort-change="sortChange">
    <template slot="menu" slot-scope="{ row }">
      <AvueFormButton type="update" icon="el-icon-edit" @click="handleEdit"
        >编辑</AvueFormButton
      >
      <AvueFormButton
        type="success"
        icon="el-icon-position"
        @click="handlePosition"
        >定位</AvueFormButton
      >
      <AvueFormButton
        type="delete"
        icon="el-icon-delete"
        @click="handleDelete(row)"
        >删除</AvueFormButton
      >
    </template>
  </avue-crud>
</template>
