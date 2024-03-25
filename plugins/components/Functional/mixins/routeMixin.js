import MapboxTools, {
  MapboxToolsClass,
} from "@/plugins/composition/mapbox-tools";
import { stringify, parse } from "wellknown";
import { feature } from "@turf/turf";

import {
  getRouteTeamList,
  routeTeamAdd,
  routeAdd,
  getRoutePage,
  updateRoute,
} from "@/api/route";
import mapboxLayer from "@/plugins/composition/mapbox-layer";

export default {
  data() {
    return {
      routeList: [],
    };
  },
  created() {
    this.getRouteTeamList();
    this.getRoutePage();
  },
  mounted() {
    MapboxTools.on("confirm", this.handleRouteConfirm);
    MapboxTools.on("addTeam", this.handleRouteAddTeam);
    MapboxTools.on("cancel", this.handleRouteCancel);
  },
  beforeDestroy() {
    MapboxTools.off("confirm", this.handleRouteConfirm);
    MapboxTools.off("addTeam", this.handleRouteAddTeam);
    MapboxTools.off("cancel", this.handleRouteCancel);
  },
  methods: {
    getRoutePage() {
      getRoutePage({}).then(({ data }) => {
        this.routeList = data.data.rows;

        const layerFeatures = this.routeList
          .map(({ geometry, properties, id }) => {
            if (!geometry) return;
            return feature(parse(geometry), JSON.parse(properties), {
              id,
            });
          })
          .filter((v) => v);
        mapboxLayer.render(layerFeatures);
      });
    },
    handleRouteConfirm(val) {
      const { "graphical-type": graphicalType } = val["properties"];
      if (graphicalType === MapboxToolsClass.ROUTE) {
        const { geometry, properties } = val;
        const params = {
          geometry: stringify(geometry),
          properties: JSON.stringify(properties),
          name: properties["name"],
          teamId: properties["teamId"],
          path: JSON.stringify(geometry.coordinates),
        };
        if (this.isRouteAdd(val.id)) {
          routeAdd(params).then(() => {
            this.$message.success("添加成功");
            this.getRoutePage();
          });
        } else {
          updateRoute({
            ...params,
            id: val.id,
          }).then(() => {
            this.$message.success("更新成功");
            this.getRoutePage();
          });
        }
      }
    },

    // 是否新增
    isRouteAdd(id) {
      return this.routeList.findIndex((item) => item.id === id) === -1;
    },
    handleRouteAddTeam({ type, val }) {
      if (type === MapboxToolsClass.ROUTE) {
        this.routeTeamAdd(val);
      }
    },
    getRouteTeamList() {
      getRouteTeamList().then(({ data }) => {
        MapboxTools.setTeam({
          type: MapboxToolsClass.ROUTE,
          val: data.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          }),
        });
      });
    },
    routeTeamAdd(val) {
      routeTeamAdd({ name: val }).then(() => {
        this.getRouteTeamList();
      });
    },
    // 关闭航线
    handleRouteCancel(val) {
      const { "graphical-type": graphicalType } = val["properties"];
      if (graphicalType !== MapboxToolsClass.ROUTE) return;
      if (this.isRouteAdd(val.id)) {
        MapboxTools.delete(val.id);
      } else {
        const route = this.routeList.find((item) => item.id === val.id);
        const { geometry, properties } = route;
        const _feature = feature(parse(geometry), JSON.parse(properties), {
          id: route.id,
        });
        MapboxTools.update(_feature);
      }
    },
  },
};
