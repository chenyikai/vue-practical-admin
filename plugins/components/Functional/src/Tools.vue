<script>
import { parse } from "wellknown";
import { ptElectricFenceDelete } from "@/api/fence";
import { deleteRoute } from "@/api/route.js";
import DataTable from "./DataTable.vue";
import { toolFuncList } from "./config";
import MapboxTools, {
  MapboxToolsClass,
} from "@/plugins/composition/mapbox-tools";
import MapboxDraw, { MapboxDrawClass } from "@/plugins/composition/mapbox-draw";
import { ptStopAlarmAreaDelete } from "@/api/stopReport";
import { feature } from "@turf/turf";
import FenceMixin from "../mixins/fenceMixin";
import stopMixin from "../mixins/stopMixin";
import routeMixin from "../mixins/routeMixin";

export default {
  name: "ToolsBox",
  components: { DataTable },
  mixins: [FenceMixin, stopMixin, routeMixin],
  data() {
    return {
      toolFuncList,
    };
  },
  computed: {
    tabDataList() {
      return [
        {
          id: 1,
          label: "航道",
          type: MapboxToolsClass.FENCE,
          data: this.fenceData,
        },
        {
          id: 2,
          label: "停报区域",
          type: MapboxToolsClass.STOP,
          data: this.stopReportData,
        },
        {
          id: 3,
          label: "航线绘制",
          type: MapboxToolsClass.ROUTE,
          data: this.routeList,
        },
      ];
    },
  },
  methods: {
    handleClick({ mode, options }) {
      MapboxTools.start(mode, options);
    },
    handleEdit(rowData) {
      MapboxDraw.getDraw().changeMode(MapboxDrawClass.SIMPLE_SELECT);
      MapboxDraw.selectGraphical(rowData.id);
      const { geometry, properties } = rowData;
      const _feature = feature(parse(geometry), JSON.parse(properties), {
        id: rowData.id,
      });
      MapboxTools.edit(_feature);
    },
    handlePosition(rowData) {
      MapboxTools.position(parse(rowData["geometry"]));
    },
    handleDelete({ id }, type) {
      if (MapboxToolsClass.STOP === type) {
        ptStopAlarmAreaDelete(id).then(() => {
          this.$message.success("删除成功");
          this.getStopAreaList();
        });
      } else if (MapboxToolsClass.FENCE === type) {
        ptElectricFenceDelete(id).then(() => {
          MapboxDraw.clearGraphicalData(id);
          this.$message.success("删除成功");
          this.getFenceAll();
        });
      } else if (MapboxToolsClass.ROUTE === type) {
        deleteRoute(id).then(() => {
          MapboxDraw.clearGraphicalData(id);
          this.$message.success("删除成功");
          this.getRoutePage();
        });
      }
    },
    handleSelectionChange(val, type) {
      console.log(val, type);
    },
  },
};
</script>

<template>
  <div class="tool-container">
    <div class="tool-box">
      <div
        class="tool"
        v-for="item in toolFuncList"
        :key="item.id"
        @click="handleClick(item)">
        <div class="icon-layout">
          <img :src="item.icon" alt="" />
        </div>
        <span class="label">{{ item.label }}</span>
      </div>
    </div>
    <el-divider>我的工具</el-divider>
    <el-tabs type="border-card">
      <el-tab-pane
        v-for="item in tabDataList"
        :key="item.id"
        :label="item.label">
        <data-table
          :data="item.data"
          :type="item.type"
          @edit="handleEdit"
          @rule="handleRule"
          @position="handlePosition"
          @delete="handleDelete($event, item.type)"
          @selection-change="handleSelectionChange($event, item.type)" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.tool-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 600px;
  .tool-box {
    display: flex;
    align-items: center;
    width: max-content;
    gap: 10px;
    .tool {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      //width: 50px;
      //height: 50px;
      border-radius: 8px;
      background-color: #fff;
      border: 1px solid #fcfcfc;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.2);
      }
      .icon-layout {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25px;
        height: 25px;
        margin-bottom: 5px;

        img {
          width: 100%;
          height: 100%;
        }
      }
      .label {
        font-size: 14px;
      }
    }
  }
}
</style>
