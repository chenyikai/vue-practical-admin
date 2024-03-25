<template>
  <alarm-table
    ref="formData"
    :option="obstacleOption"
    :data="poiOrChannelAlarmList" />
</template>

<script>
import { getPoiOrChannelAlarmList } from "@/api/alarm";
import AlarmTable from "@/plugins/components/Alarm/src/alarmTable.vue";
import { obstacleOption } from "@/plugins/components/Alarm/src/config";
export default {
  name: "obstacle", //碍航物
  data() {
    return {
      obstacleOption,
      poiOrChannelAlarmList: [],
    };
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: { AlarmTable },
  methods: {
    getPoiOrChannelAlarmList() {
      getPoiOrChannelAlarmList({ type: "1" }).then(({ data }) => {
        this.poiOrChannelAlarmList = data.data;
      });
    },
  },
  created() {
    // this.getPoiOrChannelAlarmList();
  },
  watch: {
    list(val) {
      this.poiOrChannelAlarmList = val;
    },
  },
};
</script>

<style></style>
