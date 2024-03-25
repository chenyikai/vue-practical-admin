<script>
import crudMixin from "@/mixins/crudMixin";
import { validatenull } from "@/util/validate";

export default {
  name: "DataTable",
  mixins: [crudMixin],
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: "",
    },
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler() {
        this.tableData = this.data;
      },
    },
  },
  data() {
    return {
      tableData: [],
      isFirst: true,
      crudOption: {
        header: false,
        selection: false,
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
            width: 200,
            slot: true,
          },
        ],
      },
    };
  },
  mounted() {
    setTimeout(() => {
      this.$refs.crud.toggleSelection(this.data);
      this.isFirst = false;
    }, 500);
  },
  methods: {
    getList() {
      if (validatenull(this.listQuery.name)) {
        this.tableData = this.data;
        return;
      }
      this.tableData = this.data.filter(
        (item) => item.name.indexOf(this.listQuery.name) !== -1
      );
    },
    handleSelectionChange(val) {
      if (!this.isFirst) {
        this.$emit("selection-change", val);
      }
    },
    handleEdit(rowData) {
      console.log(rowData);
      this.$emit("edit", rowData);
    },
    handleRule(rowData) {
      this.$emit("rule", rowData);
    },
    handlePosition(rowData) {
      this.$emit("position", rowData);
    },
    handleDelete(rowData) {
      this.$confirm(`是否确认删除：${rowData.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$emit("delete", rowData);
      });
    },
  },
};
</script>

<template>
  <div class="data-table-container">
    <AochenContainer type="primary">
      <el-form
        ref="searchForm"
        :model="listQuery"
        :inline="true"
        label-suffix=":"
        @submit.native.prevent="handleFilter">
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="listQuery.name"
            placeholder="名称"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <AochenButton type="search" />
          <AochenButton type="reset" @click="handelResetSearchForm" />
        </el-form-item>
      </el-form>
    </AochenContainer>
    <AochenContainer>
      <avue-crud
        ref="crud"
        :page.sync="pagination"
        :option="crudOption"
        :data="tableData"
        :table-loading="false"
        @size-change="sizeChange"
        @current-change="currentChange"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange">
        <template slot="menu" slot-scope="{ row }">
          <slot :row="row">
            <AvueFormButton
              v-if="type === 'Fence'"
              type="info"
              icon="el-icon-tickets"
              @click="handleRule(row)"
              >规则</AvueFormButton
            >
            <AvueFormButton
              type="update"
              icon="el-icon-edit"
              @click="handleEdit(row)"
              >编辑</AvueFormButton
            >
            <AvueFormButton
              type="success"
              icon="el-icon-position"
              @click="handlePosition(row)"
              >定位</AvueFormButton
            >
            <AvueFormButton
              type="delete"
              icon="el-icon-delete"
              @click="handleDelete(row)"
              >删除</AvueFormButton
            >
          </slot>
        </template>
      </avue-crud>
    </AochenContainer>
  </div>
</template>
