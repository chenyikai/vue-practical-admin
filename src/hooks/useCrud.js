import { ref, reactive, computed, nextTick } from "vue";
import { cleanVal, clearVal } from "@/utils/util.js";

export default () => {
  const funcList = reactive({
    search: null,
  });
  const mainTableData = ref([]);
  const dialog = ref({});
  const pagination = reactive({
    pageIndex: 1,
    pageSize: 15,
    total: 0,
    pageSizes: [15, 30, 50, 100],
    orders: [],
  });
  let listQuery = reactive({});
  const tableLoading = ref(false);
  const queryParams = computed(() => {
    const { pageIndex, pageSize } = pagination;
    return {
      data: listQuery,
      params: {
        pageIndex,
        pageSize,
      },
    };
  });

  async function handleFilter() {
    listQuery = cleanVal(listQuery);
    pagination.pageIndex = 1;
    await nextTick();
    getList();
  }

  function handelResetSearchForm() {
    listQuery = clearVal(listQuery);

    getList();
  }

  function sizeChange(val) {
    pagination.pageIndex = 1;
    pagination.pageSize = val;
    getList();
  }

  function currentChange(val) {
    pagination.pageIndex = val;
    getList();
  }

  function sortChange({ prop, order }) {
    pagination.order = [
      { id: prop, type: order === "descending" ? "desc" : "asc" },
    ];

    handleFilter();
  }

  function getList() {
    tableLoading.value = true;
    funcList.search(queryParams.value).then(({ data }) => {
      mainTableData.value = data.data.rows;
      pagination.total = Number(data.data.total);
      tableLoading.value = false;
    });
  }

  return {
    dialog,
    funcList,
    tableLoading,
    mainTableData,
    pagination,
    listQuery,
    queryParams,
    getList,
    handleFilter,
    sizeChange,
    currentChange,
    sortChange,
    handelResetSearchForm,
  };
};
