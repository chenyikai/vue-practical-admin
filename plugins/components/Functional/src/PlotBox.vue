<script>
import MapboxPlot, { MapboxPlotClass } from "@/plugins/composition/mapbox-plot";
import { plotFuncList } from "./config";
import {
  add,
  getListWithCollected,
  getMarkTeamList,
  markInfoDelete,
  update,
} from "@/api/plot";
import { parse, stringify } from "wellknown";
import DataTable from "@/plugins/components/Functional/src/DataTable.vue";
import MapboxDraw, { MapboxDrawClass } from "@/plugins/composition/mapbox-draw";
import { feature } from "@turf/turf";
import { markTeamAdd } from "@/api/plotTeam";
import MapboxLayer from "@/plugins/composition/mapbox-layer";

export default {
  name: "PlotBox",
  components: { DataTable },
  data() {
    return {
      plotFuncList,
      tabData: [],
    };
  },
  computed: {
    plotData() {
      return this.tabData.map((item) => item.data).flat();
    },
  },
  created() {
    this.init();
  },
  mounted() {
    MapboxPlot.on("confirm", this.handleConfirm);
    MapboxPlot.on("cancel", this.handleCancel);
    MapboxPlot.on("addTeam", this.handleAddTeam);
  },
  beforeDestroy() {
    MapboxPlot.off("confirm", this.handleConfirm);
    MapboxPlot.off("cancel", this.handleCancel);
    MapboxPlot.off("addTeam", this.handleAddTeam);
  },
  methods: {
    init() {
      // 标绘分组
      this.getMarkTeamList();
      // 标绘
      this.getListWithCollected();
    },
    // 是否新增
    isAdd(id) {
      return this.plotData.findIndex((item) => item.id === id) === -1;
    },
    // 保存
    handleConfirm(val) {
      if (this.isAdd(val.id)) {
        add(this.getParams(val)).then(() => {
          this.getListWithCollected();
          this.$message.success("添加成功");
        });
      } else {
        update({
          ...this.getParams(val),
          id: val.id,
        }).then(() => {
          this.getListWithCollected();
          this.$message.success("更新成功");
        });
      }
    },
    // 关闭
    handleCancel(val) {
      if (this.isAdd(val.id)) {
        MapboxPlot.delete(val.id);
      } else {
        const plot = this.plotData.find((item) => item.id === val.id);
        const { geometry, properties } = plot;
        const _feature = feature(parse(geometry), JSON.parse(properties), {
          id: plot.id,
        });
        MapboxPlot.update(_feature);
      }
    },
    handleAddTeam({ val }) {
      markTeamAdd({ name: val }).then(() => {
        this.getMarkTeamList();
      });
    },
    // 获取参数
    getParams({ geometry, properties }) {
      const data = {
        geometry: stringify(geometry),
        properties: JSON.stringify(properties),
        name: properties["name"],
        teamId: properties["teamId"],
      };
      if (MapboxPlotClass.POINT === geometry["type"]) {
        const [lon, lat] = geometry.coordinates;
        this.$set(data, "icon", properties["icon-image"]);
        this.$set(data, "lon", lon);
        this.$set(data, "lat", lat);
        this.$set(data, "type", 1);
      } else if (MapboxPlotClass.LINE === geometry["type"]) {
        this.$set(data, "path", JSON.stringify(geometry.coordinates));
        this.$set(data, "type", 2);
      } else if (MapboxPlotClass.POLYGON === geometry["type"]) {
        this.$set(data, "path", JSON.stringify(geometry.coordinates));
        this.$set(data, "type", 3);
      } else if (MapboxPlotClass.CIRCLE === geometry["type"]) {
        const [lon, lat] = properties["center"];
        this.$set(data, "path", JSON.stringify(geometry.coordinates));
        this.$set(data, "lon", lon);
        this.$set(data, "lat", lat);
        this.$set(data, "radius", properties["radius"]);
        this.$set(data, "type", 4);
      }

      //TODO 如果admin添加deptId

      return data;
    },
    handleClick({ mode, options }) {
      MapboxPlot.start(mode, options);
    },
    handleEdit(rowData) {
      MapboxDraw.getDraw().changeMode(MapboxDrawClass.SIMPLE_SELECT);
      MapboxDraw.selectGraphical(rowData.id);
      const { geometry, properties } = rowData;
      const _feature = feature(parse(geometry), JSON.parse(properties), {
        id: rowData.id,
      });
      MapboxPlot.edit(_feature);
    },
    handlePosition(rowData) {
      MapboxPlot.position(parse(rowData["geometry"]));
    },
    handleDelete(rowData) {
      markInfoDelete(rowData.id).then(() => {
        this.$message.success("删除成功");
        this.getListWithCollected();
      });
    },
    handleSelectionChange(val) {
      console.log(val);
      // MapboxPlot.filter(val.map((item) => item.id));
    },
    getMarkTeamList() {
      getMarkTeamList().then(({ data }) => {
        MapboxPlot.setTeam(
          data.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          })
        );
      });
    },
    getListWithCollected() {
      getListWithCollected().then(({ data }) => {
        this.tabData = data.data;

        const layerFeatures = this.plotData.map(
          ({ geometry, properties, id }) => {
            return feature(parse(geometry), JSON.parse(properties), {
              id,
            });
          }
        );

        MapboxLayer.render(layerFeatures);
      });
    },
  },
};
</script>

<template>
  <div class="plot-container">
    <div class="plot-box">
      <div
        class="plot"
        v-for="item in plotFuncList"
        :key="item.id"
        @click="handleClick(item)">
        <div class="icon-layout">
          <img :src="item.icon" alt="" />
        </div>
        <span class="label">{{ item.label }}</span>
      </div>
    </div>
    <el-divider>我的标绘</el-divider>
    <el-tabs type="border-card">
      <el-tab-pane v-for="item in tabData" :key="item.id" :label="item.name">
        <span slot="label">{{ item.name }}</span>
        <data-table
          :data="item.data"
          @selection-change="handleSelectionChange"
          @edit="handleEdit"
          @position="handlePosition"
          @delete="handleDelete" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.plot-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 600px;
  .plot-box {
    display: flex;
    align-items: center;
    width: max-content;
    .plot {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
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
        width: 20px;
        height: 20px;
        margin-bottom: 5px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .label {
        font-size: 16px;
      }
    }
  }
}
</style>
