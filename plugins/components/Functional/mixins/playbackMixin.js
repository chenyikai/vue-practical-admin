import MapboxTools, {
  MapboxToolsClass,
} from "@/plugins/composition/mapbox-tools";
import { getAreaShipTrajectory } from "@/api/ship";

export default {
  mounted() {
    MapboxTools.on("confirm", this.handlePlaybackConfirm);
  },
  beforeDestroy() {
    MapboxTools.off("confirm", this.handlePlaybackConfirm);
  },
  methods: {
    handlePlaybackConfirm(val) {
      const { "graphical-type": graphicalType } = val["properties"];
      if (graphicalType === MapboxToolsClass.PLAY_BACK) {
        const { geometry, properties } = val;
        getAreaShipTrajectory({
          startTime: properties["startTime"],
          endTime: properties["endTime"],
          polygon: JSON.stringify(geometry.coordinates),
        }).then(({ data }) => {
          this.$emit("play-back", {
            mmsis: data.data,
            startTime: properties["startTime"],
            endTime: properties["endTime"],
          });
        });
      }
    },
  },
};
