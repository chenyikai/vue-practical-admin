import MapboxTools, {
  MapboxToolsClass,
} from "@/plugins/composition/mapbox-tools";
import { getStopAreaList } from "@/api/oneMap";
import { feature } from "@turf/turf";
import { parse, stringify } from "wellknown";
import MapboxLayer from "@/plugins/composition/mapbox-layer";
import { ptStopAlarmAreaAdd, ptStopAlarmAreaUpdate } from "@/stopArea";

export default {
  data() {
    return {
      stopReportData: [],
    };
  },
  created() {
    this.getStopAreaList();
  },
  mounted() {
    MapboxTools.on("confirm", this.handleStopConfirm);
    MapboxTools.on("cancel", this.handleStopCancel);
  },
  beforeDestroy() {
    MapboxTools.off("confirm", this.handleStopConfirm);
    MapboxTools.off("cancel", this.handleStopCancel);
  },
  methods: {
    // 是否新增
    isStopAdd(id) {
      return this.stopReportData.findIndex((item) => item.id === id) === -1;
    },
    handleStopCancel(val) {
      const { "graphical-type": graphicalType } = val["properties"];
      if (graphicalType !== MapboxToolsClass.STOP) return;

      if (this.isStopAdd(val.id)) {
        MapboxTools.delete(val.id);
      } else {
        const stop = this.stopReportData.find((item) => item.id === val.id);
        const { geometry, properties } = stop;
        const _feature = feature(parse(geometry), JSON.parse(properties), {
          id: stop.id,
        });
        MapboxTools.update(_feature);
      }
    },
    handleStopConfirm(val) {
      const { "graphical-type": graphicalType } = val["properties"];
      if (graphicalType === MapboxToolsClass.STOP) {
        const isStopAdd =
          this.stopReportData.findIndex((item) => item.id === val.id) === -1;

        const { geometry, properties } = val;
        const params = {
          geometry: stringify(geometry),
          properties: JSON.stringify(properties),
          name: properties["name"],
          teamId: properties["teamId"],
          path: JSON.stringify(geometry.coordinates),
        };
        if (isStopAdd) {
          ptStopAlarmAreaAdd(params).then(() => {
            this.$message.success("添加成功");
            this.getStopAreaList();
          });
        } else {
          ptStopAlarmAreaUpdate({
            ...params,
            id: val.id,
          }).then(() => {
            this.$message.success("更新成功");
            this.getStopAreaList();
          });
        }
      }
    },
    getStopAreaList() {
      getStopAreaList().then(({ data }) => {
        this.stopReportData = data.data;

        const layerFeatures = this.stopReportData.map(
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
