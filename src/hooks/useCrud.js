import { ref, reactive, computed } from "vue";
import { cleanVal, clearVal } from "@/utils/util.js";

export default () => {
  const searchForm = ref({});

  const mainTableData = reactive([{}]);
  const dialog = ref({});
  const pagination = reactive({
    pageIndex: 1,
    pageSize: 30,
    total: 0,
    pageSizes: [30, 50, 100, 200],
    orders: [],
  });
  let listQuery = reactive({});
  const tableLoading = ref(false);
  const queryParams = computed({
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
  });

  function handleFilter() {
    if (searchForm.value) {
      searchForm.value.validate((valid) => {
        if (!valid) return false;
        searchForm.value && searchForm.value.clearValidate();
        listQuery = cleanVal(listQuery);
        pagination.pageIndex = 1;
        this.$nextTick(() => {
          this.getList();
        });
      });
    } else {
      pagination.pageIndex = 1;
      this.$nextTick(() => {
        this.getList();
      });
    }
  }

  function handelResetSearchForm() {
    listQuery = clearVal(listQuery);
  }

  function sizeChange() {}

  function currentChange() {}

  function sortChange() {}

  return {
    dialog,
    tableLoading,
    mainTableData,
    pagination,
    listQuery,
    queryParams,
    handleFilter,
    sizeChange,
    currentChange,
    sortChange,
    handelResetSearchForm,
  };
};
