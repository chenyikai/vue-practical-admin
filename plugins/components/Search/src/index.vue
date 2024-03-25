<template>
  <div class="search-bar">
    <!--    <bar-nav class="bar-nav" v-model="active" />-->
    <search-input v-model="params.keyword" @search="handleSearch" />
    <result-list
      :value="params"
      ref="list"
      class="result-list"
      @click="handleClick" />
    <ship-details class="result-list" ref="details" />
  </div>
</template>

<script>
// import BarNav from "./BarNav.vue";
import SearchInput from "./SearchInput.vue";
import ResultList from "./ResultList.vue";
import ShipDetails from "./ShipDetails.vue";
export default {
  name: "SearchBar",
  components: {
    ResultList,
    SearchInput,
    // BarNav,
    ShipDetails,
  },
  data() {
    return {
      active: "ship",
      params: {
        page: 1,
        pageSize: 10,
        keyword: undefined,
      },
      resultList: [],
    };
  },
  methods: {
    handleSearch() {
      this.$refs.details.handleDetailClose();
      this.$refs.list.open();
    },
    handleClick(val) {
      this.$set(this.params, "keyword", val["cnname"] || val["enname"]);
      this.$refs.details.open(val.mmsi);
    },
  },
};
</script>

<style scoped lang="scss">
.search-bar {
  position: absolute;
  top: 15px;
  left: 26px;
  width: 350px;
  pointer-events: auto;
  .bar-nav {
    margin-bottom: 5px;
  }
  .result-list {
    margin-top: 5px;
  }
}
</style>
