<script>
import { getShipByKeyword } from "@/api/search";
import { validatenull } from "@/util/validate";

export default {
  name: "ResultList",
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      loading: false,
      isSearch: false,
      resultList: [],
    };
  },
  methods: {
    open() {
      if (validatenull(this.value.keyword)) return;
      this.isSearch = true;
      this.loading = true;
      getShipByKeyword(this.value)
        .then(({ data }) => {
          const { data: result } = data.data;
          this.resultList = result;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleResultClick(val) {
      this.$emit("click", val);
      this.handleClose();
    },
    handleClose() {
      this.loading = false;
      this.isSearch = false;
      this.resultList = [];
    },
  },
};
</script>

<template>
  <div class="result-list-container">
    <div class="list-layout" v-loading="loading" v-show="isSearch">
      <template v-if="resultList.length !== 0">
        <div
          class="result"
          v-for="(item, index) in resultList"
          :key="index"
          @click="handleResultClick(item)">
          <img src="../assets/images/result-icon.png" alt="" />
          <div class="ship-name">
            {{ `船名:${item.cnname || item.enname || "--"}` }}
          </div>
          <div class="mmsi">{{ `mmsi:${item.mmsi ?? "--"}` }}</div>
        </div>
      </template>
      <div class="noData" v-else>
        <em class="icon iconfont icon-ship" />
        <span class="label">暂无数据</span>
      </div>
    </div>
    <div class="close-btn" @click="handleClose" v-show="isSearch">收起</div>
  </div>
</template>

<style scoped lang="scss">
.result-list-container {
  width: 100%;
  .list-layout {
    width: 100%;
    max-height: 400px;
    background-color: #fff;
    box-shadow: 0px 0px 4px 0px rgba(1, 24, 68, 0.19);
    border-radius: 4px;
    padding: 0 17px;
    overflow: auto;
    .result {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      border-bottom: 1px solid #f1f1f1;
      color: #000;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
      img {
        width: 16px;
        height: 16px;
        margin-right: 12px;
      }
      .ship-name {
        margin-right: 12px;
      }
    }
    .noData {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      color: #fff;
      .icon {
        font-size: 80px;
        margin-bottom: 7px;
      }
      .label {
        font-size: 30px;
      }
    }
    .el-loading-mask {
      .el-loading-spinner {
        .path {
          stroke: #fff;
          stroke-width: 7px;
        }
      }
    }
  }
  .close-btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #e7e7e7;
    color: #000;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
