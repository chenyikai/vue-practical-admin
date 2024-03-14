import { clearVal, cleanVal } from "@/util/util.js";

export default {
  data() {
    return {
      mainTableData: [],
      tableLoading: false,
      pagination: {
        pageIndex: 1,
        pageSize: 30,
        total: 0,
        pageSizes: [30, 50, 100, 200],
        orders: [],
      },
      listQuery: {},
      selection: [],
    };
  },
  computed: {
    queryWrapper: {
      cache: false,
      get() {
        const { pageIndex, pageSize } = this.pagination;
        return {
          data: this.listQuery,
          params: {
            pageIndex,
            pageSize,
          },
        };
      },
    },
  },
  methods: {
    handleFilter() {
      if (this.$refs.searchForm) {
        this.$refs.searchForm.validate((valid) => {
          if (!valid) return false;
          this.$refs.searchForm && this.$refs.searchForm.clearValidate();
          this.listQuery = cleanVal(this.listQuery);
          this.$set(this.pagination, "pageIndex", 1);
          this.$nextTick(() => {
            this.getList();
          });
        });
      } else {
        this.$set(this.pagination, "pageIndex", 1);
        this.$nextTick(() => {
          this.getList();
        });
      }
    },
    getList() {
      this.tableLoading = true;
    },
    sizeChange(val) {
      this.$set(this.pagination, "pageIndex", 1);
      this.$set(this.pagination, "pageSize", val);
      this.getList();
    },
    currentChange(val) {
      this.$set(this.pagination, "pageIndex", val);
      this.getList();
    },
    sortChange({ prop, order }) {
      this.$set(this.pagination, "order", [
        { id: prop, type: order === "descending" ? "desc" : "asc" },
      ]);
      this.handleFilter();
    },
    handelResetSearchForm() {
      this.listQuery = clearVal(this.listQuery, this.resetIgnore);
    },
    selectionChange(e, key) {
      if (key) {
        this.selection = e.map((item) => item[key]);
      } else {
        this.selection = e;
      }
    },
  },
  created() {
    this.$nextTick(() => {
      this.handleFilter();
    });
  },
  mounted() {
    this.$refs["crud"] && this.$refs["crud"].doLayout();
  },
  activated() {
    this.$refs["crud"] && this.$refs["crud"].doLayout();
  },
};
