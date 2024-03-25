<template>
  <div class="lon-lat-card">
    <div class="lon-lat-type-change-box">
      <span
        class="lon-lat-type-change-box-item"
        v-for="item in lonLatTypeList"
        :key="item.id"
        :class="{ cur: activeTab === item.value }"
        @click="handleChangeType(item)">
        {{ item.label }}
      </span>
    </div>
    <div class="lon-lat-item-box" ref="lonLatBox">
      <lon-lat-input-item
        class="lon-lat-input"
        v-for="(lonLat, index) in lonLatList"
        :key="index"
        :index="index"
        :lonLat="lonLat"
        :type="type"
        :length="lonLatList.length"
        :lon-lat-type="activeTab"
        @radius-change="handleRadiusChange"
        @change="handleChange"
        @delete="handleDelete" />
      <div v-if="isRender()" class="lon-lat-add-btn" @click="handleAdd">+</div>
    </div>
  </div>
</template>

<script>
import LonLatInputItem from "./lonLatInputItem.vue";
import _ from "lodash";
import { MapboxPlotClass } from "@/plugins/composition/mapbox-plot";

export default {
  name: "lonLatCard",
  components: { LonLatInputItem },
  inject: ["plotType"],
  props: {
    lonLatList: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      default: "",
    },
    radius: {
      type: Number,
      default: null,
    },
  },
  model: {
    prop: "lonLatList",
    event: "change",
  },
  data() {
    return {
      activeTab: undefined,
      lonLatTypeList: [
        {
          id: 1,
          value: "degree",
          label: "度",
        },
        {
          id: 2,
          value: "degreeMinute",
          label: "度分",
        },
        {
          id: 3,
          value: "degreeMinuteSecond",
          label: "度分秒",
        },
      ],
    };
  },
  created() {
    this.handleChangeType({
      id: 1,
      value: "degree",
      label: "度",
    });
  },
  beforeDestroy() {
    this.activeTab = undefined;
  },
  methods: {
    handleChangeType({ value }) {
      this.activeTab = value;
    },
    handleChange({ index, lngLat }) {
      const list = _.clone(this.lonLatList);
      list[index] = lngLat;
      this.$emit("change", list);
    },
    handleDelete(index) {
      const list = _.clone(this.lonLatList);
      list.splice(index, 1);
      this.$emit("change", list);
    },
    handleAdd() {
      const list = _.clone(this.lonLatList);
      list.push([0, 0]);
      this.$emit("change", list);
      this.$nextTick(() => {
        this.$refs.lonLatBox.scrollTo(0, this.$refs.lonLatBox.scrollHeight);
      });
    },
    handleRadiusChange(val) {
      this.$emit("radius-change", val);
    },
    isRender() {
      if (this.type === MapboxPlotClass.POINT) {
        return false;
      } else if (this.type === MapboxPlotClass.CIRCLE) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.lon-lat-card {
  .lon-lat-type-change-box {
    display: flex;
    width: 100%;
    height: 30px;
    background-color: #f5f7fa;
    &-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: 100%;
      border-right: 1px solid #e6e6e6;
      font-size: 12px;
      cursor: pointer;
      &.cur {
        color: #2583ff;
      }
      &:last-child {
        border: 0;
      }
    }
  }
  .lon-lat-item-box {
    width: 100%;
    //max-height: 331px;
    margin-top: 10px;
    //overflow: auto;
    &::-webkit-scrollbar {
      display: none;
      /* Chrome Safari */
    }
    .lon-lat-input {
      margin-bottom: 10px;
    }
    .lon-lat-add-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 36px;
      line-height: 1;
      background-color: #f5f7fa;
      color: #000;
      font-size: 24px;
      user-select: none;
      cursor: pointer;
      &:hover {
        background: rgba($color: #e8e8e8, $alpha: 0.8);
      }
    }
  }
}
</style>
