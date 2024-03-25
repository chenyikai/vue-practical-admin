<template>
  <alarm-table
    ref="formData"
    :option="collisionOption"
    :data="shipCollisionAlarmList" />
</template>

<script>
import { getShipCollisionAlarm } from "@/api/alarm";
import AlarmTable from "@/plugins/components/Alarm/src/alarmTable.vue";
import { collisionOption } from "@/plugins/components/Alarm/src/config";
export default {
  name: "collision",
  data() {
    return {
      collisionOption,
      shipCollisionAlarmList: [],
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
    // getShipCollisionAlarm() {
    //   getShipCollisionAlarm().then(({ data }) => {
    //     this.shipCollisionAlarmList = data.data;
    //   });
    // },
  },
  created() {
    // this.getShipCollisionAlarm();
  },
  watch: {
    list(val) {
      this.shipCollisionAlarmList = val;
    },
  },
};
</script>

<style>
</style>