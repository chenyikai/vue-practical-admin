<script>
export default {
  name: "PageCrud",
};
</script>

<script setup>
import { ref, computed, useSlots, provide } from "vue";
import loadingIcon from "@/icons/loading.svg?raw";
import TableColumn from "package/Crud/src/TableColumn.vue";

defineOptions({
  name: "PageCrud",
});

const slots = useSlots();

const model = defineModel({ type: Array, default: () => [] });

const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object,
    default: () => {
      return {
        pageIndex: 0,
        pageSize: 10,
        total: 400,
        pageSizes: [],
      };
    },
  },
});

const emit = defineEmits(["row-click"]);

const currentPage = ref(1);
const pageSize = ref(10);
const disabled = ref(false);

const tableType = computed(() => {
  return props.config.type;
});

provide("slots", slots);
provide("config", props.config);
provide("getHeadSlot", getHeadSlot);
provide("getFilterIcon", getFilterIcon);

function getHeadSlot(prop) {
  return `${prop}Header`;
}

function getFilterIcon(prop) {
  return `${prop}FilterIcon`;
}

function onSizeChange(val) {
  console.log(val, "val");
}

function onCurrentChange(val) {
  console.log(val, "val");
}

function onRowClick(row) {
  emit("row-click", row);
}
</script>

<template>
  <section class="crud-container">
    <main class="crud-container-main">
      <el-table
        v-loading="loading"
        class="crud-admin-table"
        :element-loading-spinner="loadingIcon"
        element-loading-text="加载中"
        element-loading-svg-view-box="0 0 57 57"
        border
        row-class-name="crud-table-body-row"
        header-row-class-name="crud-table-header-row"
        v-bind="config"
        :data="model"
        style="width: 100%"
        @row-click="onRowClick">
        <el-table-column label="序号" :type="tableType" width="80px" align="center" />

        <!-- 数据column -->
        <template v-for="column in config.columns" :key="column.prop">
          <table-column :column="column">
            <!-- 单元格插槽 -->
            <template #[column.prop]="{ scope }">
              <slot :name="column.prop" :scope="scope" />
            </template>
          </table-column>
        </template>
      </el-table>
    </main>
    <footer class="crud-container-footer">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[100, 200, 300, 400]"
        size="default"
        :disabled="disabled"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
        @size-change="onSizeChange"
        @current-change="onCurrentChange" />
    </footer>
  </section>
</template>
