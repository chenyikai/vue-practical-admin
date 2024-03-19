import { ref, reactive, computed, nextTick } from "vue";
import { cleanVal, clearVal } from "@/utils/util.js";

export default () => {
  const funcList = reactive({
    search: null,
    list: null,
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
  const freezeData = reactive({});
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

  function handleFilter() {
    listQuery = cleanVal(listQuery);
    pagination.pageIndex = 1;
    nextTick().then(() => {
      getList();
    });
  }

  function handelResetSearchForm() {
    listQuery = clearVal(listQuery);

    getList();
  }

  function setFreezeData(key, value) {
    freezeData[key] = value;
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
    for (const freezeDataKey in freezeData) {
      const value = freezeData[freezeDataKey];
      listQuery[freezeDataKey] = value;
    }
    if (funcList.search) {
      funcList.search(queryParams.value).then(({ data }) => {
        mainTableData.value = data.data.rows;
        pagination.total = Number(data.data.total);
        tableLoading.value = false;
      });
    }

    if (funcList.list) {
      funcList.list(listQuery).then(({ data }) => {
        mainTableData.value = data.data;
        tableLoading.value = false;
      });
    }
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
    setFreezeData,
    handelResetSearchForm,
  };
};
