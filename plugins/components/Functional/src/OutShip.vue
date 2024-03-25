<script>
import { lengthList } from "./config";
import { getDictData } from "@/util/util";
import MapboxShip from "@/plugins/composition/mapbox-ship";

export default {
  name: "OutShip",
  data() {
    return {
      activeNames: ["1", "2", "3"],
      checkTypeAll: true,
      typeIsIndeterminate: false,
      typeCheckList: getDictData("ship_type").map(({ value }) => value),

      checkStatusAll: true,
      statusIsIndeterminate: false,
      statusCheckList: getDictData("navigational_status").map(
        ({ value }) => value
      ),

      lengthList,
      lengthCheckList: [],
    };
  },
  methods: {
    getDictData,
    // 船舶类型
    handleType(val) {
      const _length = val.length;
      const dicLength = getDictData("ship_type").length;
      this.checkTypeAll = dicLength === _length;
      this.typeIsIndeterminate = _length > 0 && _length < dicLength;
      this.setFilter();
    },
    handleTypeCheckAllChange(val) {
      this.typeCheckList = val
        ? getDictData("ship_type").map((item) => item.value)
        : [];
      this.typeIsIndeterminate = false;
      this.setFilter();
    },
    // 航行状态
    handleStatus(val) {
      const _length = val.length;
      const dicLength = getDictData("navigational_status").length;
      this.checkStatusAll = dicLength === _length;
      this.statusIsIndeterminate = _length > 0 && _length < dicLength;
      this.setFilter();
    },
    handleStatusCheckAllChange(val) {
      this.statusCheckList = val
        ? getDictData("navigational_status").map((item) => item.value)
        : [];
      this.statusIsIndeterminate = false;
      this.setFilter();
    },
    setFilter() {
      MapboxShip.setFilter({
        type: MapboxShip.getOutType(),
        key: "typeId",
        value: this.typeCheckList.join(),
      });

      MapboxShip.setFilter({
        type: MapboxShip.getOutType(),
        key: "statusId",
        value: this.statusCheckList.join(),
      });
    },
  },
};
</script>

<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="船舶类型" name="1">
      <template slot="title">
        船舶类型<el-checkbox
          style="margin-left: 13px"
          :indeterminate="typeIsIndeterminate"
          v-model="checkTypeAll"
          @change="handleTypeCheckAllChange" />
      </template>
      <el-checkbox-group
        class="out-checkbox-group"
        v-model="typeCheckList"
        @change="handleType">
        <el-checkbox
          v-for="item in getDictData('ship_type')"
          :key="item.value"
          :label="item.value"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-collapse-item>
    <el-collapse-item title="航行状态" name="2">
      <template slot="title">
        船舶类型<el-checkbox
          style="margin-left: 13px"
          :indeterminate="statusIsIndeterminate"
          v-model="checkStatusAll"
          @change="handleStatusCheckAllChange" />
      </template>
      <el-checkbox-group
        class="out-checkbox-group"
        v-model="statusCheckList"
        @change="handleStatus">
        <el-checkbox
          v-for="item in getDictData('navigational_status')"
          :key="item.value"
          :label="item.value"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped lang="scss"></style>
