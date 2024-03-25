<template>
  <alarm-table
    ref="formData"
    :option="yawOption"
    :data="poiOrChannelAlarmList" />
</template>

<script>
import { getPoiOrChannelAlarmList } from "@/api/alarm";
import AlarmTable from "@/plugins/components/Alarm/src/alarmTable.vue";
import { yawOption } from "@/plugins/components/Alarm/src/config";
export default {
  name: "yaw", //"偏航"
  data() {
    return {
      yawOption,
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
      getPoiOrChannelAlarmList({ type: "2" }).then(({ data }) => {
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
