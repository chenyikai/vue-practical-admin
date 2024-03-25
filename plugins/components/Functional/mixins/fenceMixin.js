import { getFenceAll } from "@/api/oneMap";
import { feature } from "@turf/turf";
import { parse, stringify } from "wellknown";
import MapboxLayer from "@/plugins/composition/mapbox-layer";
import {
  ptElectricFenceTeamGetAll,
  ptElectricFenceTeamAdd,
} from "@/api/fenceTeam";
import MapboxTools, {
  MapboxToolsClass,
} from "@/plugins/composition/mapbox-tools";
import { ptElectricFenceAdd, ptElectricFenceUpdate } from "@/api/fence";
import Vue from "vue";
import RulesDialog from "@/plugins/components/Functional/src/RulesDialog.vue";

const RulesDialogVue = Vue.extend(RulesDialog);
const dialog = new RulesDialogVue().$mount();

export default {
  data() {
    return {
      fenceData: [],
    };
  },
  created() {
    // 电子围栏
    this.getFenceAll();
    // 电子围栏分组
    this.ptElectricFenceTeamGetAll();
  },
  mounted() {
    MapboxTools.on("confirm", this.handleFenceConfirm);
    MapboxTools.on("addTeam", this.handleFenceAddTeam);
    MapboxTools.on("cancel", this.handleFenceCancel);
  },
  beforeDestroy() {
    MapboxTools.off("confirm", this.handleFenceConfirm);
    MapboxTools.off("addTeam", this.handleFenceAddTeam);
    MapboxTools.off("cancel", this.handleFenceCancel);
  },
  methods: {
    // 是否新增
    isFenceAdd(id) {
      return this.fenceData.findIndex((item) => item.id === id) === -1;
    },
    handleFenceCancel(val) {
      const { "graphical-type": graphicalType } = val["properties"];
      if (graphicalType !== MapboxToolsClass.FENCE) return;
      if (this.isFenceAdd(val.id)) {
        MapboxTools.delete(val.id);
      } else {
        const fence = this.fenceData.find((item) => item.id === val.id);
        const { geometry, properties } = fence;
        const _feature = feature(parse(geometry), JSON.parse(properties), {
          id: fence.id,
        });
        MapboxTools.update(_feature);
      }
    },
    handleFenceConfirm(val) {
      const { "graphical-type": graphicalType } = val["properties"];
      if (graphicalType === MapboxToolsClass.FENCE) {
        const { geometry, properties } = val;
        const params = {
          geometry: stringify(geometry),
          properties: JSON.stringify(properties),
          name: properties["name"],
          teamId: properties["teamId"],
          line: properties["line"],
          path: JSON.stringify(geometry.coordinates),
        };

        if (this.isFenceAdd(val.id)) {
          ptElectricFenceAdd(params).then(({ data }) => {
            this.$message.success("添加成功");
            this.getFenceAll();
            dialog.open(data.data);
          });
        } else {
          ptElectricFenceUpdate({
            ...params,
            id: val.id,
          }).then(() => {
            this.$message.success("更新成功");
            this.getFenceAll();
          });
        }
      }
    },
    handleFenceAddTeam({ type, val }) {
      if (type === MapboxToolsClass.FENCE) {
        this.ptElectricFenceTeamAdd(val);
      }
    },
    getFenceAll() {
      getFenceAll().then(({ data }) => {
        this.fenceData = data.data;

        const layerFeatures = this.fenceData.map(
          ({ geometry, properties, id }) => {
            return feature(parse(geometry), JSON.parse(properties), {
              id,
            });
          }
        );
        MapboxLayer.render(layerFeatures);
      });
    },
    ptElectricFenceTeamGetAll() {
      ptElectricFenceTeamGetAll().then(({ data }) => {
        MapboxTools.setTeam({
          type: MapboxToolsClass.FENCE,
          val: data.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          }),
        });
      });
    },
    // 添加电子围栏分组
    ptElectricFenceTeamAdd(val) {
      ptElectricFenceTeamAdd({ name: val }).then(() => {
        this.ptElectricFenceTeamGetAll();
      });
    },
    handleRule(rowData) {
      dialog.open(rowData.id);
    },
  },
};
