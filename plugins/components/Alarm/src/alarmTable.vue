<script>
import crudMixin from "@/mixins/crudMixin";

export default {
  name: "alarmTable",
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  mixins: [crudMixin],
};
</script>

<template>
  <avue-crud
    ref="crud"
    :page.sync="pagination"
    :option="option"
    :data="data"
    :table-loading="false"
    @size-change="sizeChange"
    @current-change="currentChange"
    @sort-change="sortChange">
    <template slot="menu" slot-scope="{ row }">
      <slot :row="row"></slot>
    </template>
  </avue-crud>
</template>
