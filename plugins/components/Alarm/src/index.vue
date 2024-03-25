<template>
  <div style="margin-bottom: 100px">
    <el-popover
      placement="left"
      title="预警"
      trigger="manual"
      v-model="visible"
      content="">
      <i
        class="el-icon-close"
        @click="visible = !visible"
        style="
          position: absolute;
          right: 5px;
          top: 5px;
          font-size: 23px;
          cursor: pointer;
        "></i>
      <div class="alarm-box">
        <marquee class="alarm-message" scrolldelay="300" direction="up">
          <div
            class="alarm-message-item"
            v-for="item in alarmList"
            :key="item.id">
            <span class="alarm-text">
              {{ item.shipName }}：&nbsp;{{ item.context }}</span
            >
            <img src="@/assets/images/tool/alarm.png" alt="" />
          </div>
        </marquee>

        <div class="alarm-search">
          <el-tabs type="border-card" @tab-click="handleClick">
            <el-tab-pane label="AI预警">
              <Ai ref="ai" />
            </el-tab-pane>
            <el-tab-pane label="避碰预警">
              <Collision ref="collision" :list="shipCollisionAlarmList" />
            </el-tab-pane>
            <el-tab-pane label="碍航物预警">
              <Yaw ref="yaw" :list="zawList" />
            </el-tab-pane>
            <el-tab-pane :list="phList" label="偏航预警">
              <Obstacle ref="obstacle" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="warn-btn" @click="visible = !visible" slot="reference">
        预警
        <div class="warn-btn-number" v-if="alarmTypeNumber">
          {{ alarmTypeNumber }}
        </div>
      </div>
    </el-popover>
    <alarm-dialog ref="dialog" @refresh="getAlarmList" />
    <audio ref="audio" :src="audioUrl" hidden loop></audio>
  </div>
</template>

<script>
import {
  getAlarmList,
  getShipCollisionAlarm,
  getPoiOrChannelAlarmList,
} from "@/api/alarm";
import Ai from "./ai.vue";
import Collision from "./collision.vue";
import Yaw from "./yaw.vue";
import Obstacle from "./obstacle.vue";
import MapboxAlarm from "@/plugins/composition/mapbox-alarm";
import AlarmDialog from "@/plugins/components/AlarmDialog/src/index.vue";
import { collisionOption } from "@/plugins/components/Alarm/src/config";
const interval = 1000 * 15;

export default {
  name: "alarm",
  components: { AlarmDialog, Ai, Collision, Yaw, Obstacle },
  data() {
    return {
      audioUrl: `${process.env.VUE_APP_PUBLIC_PATH}/alarm.mp3`,
      timer: null,
      count: 0,
      // ai
      alarmList: [],
      // 避碰
      shipCollisionAlarmList: [],
      // 偏航
      phList: [],
      // 障碍物
      zawList: [],
      collisionOption,
      alarmTypeNumber: 0,
      visible: false,
    };
  },

  created() {
    this.getAlarmList();
    this.timeTask();
  },
  mounted() {
    MapboxAlarm.on("click", this.handleAlarmClick);
  },
  beforeDestroy() {
    MapboxAlarm.off("click", this.handleAlarmClick);
    this.clearTask();
  },
  methods: {
    handleClick(tab) {
      switch (tab.index) {
        case "0":
          return this.$refs.ai.getAlarmList();
        case "1":
          this.$refs.collision.$refs.formData.$refs.crud.refreshTable();
          return this.getShipCollisionAlarm();
        case "2":
          this.$refs.yaw.$refs.formData.$refs.crud.refreshTable();
          return this.$refs.yaw.getPoiOrChannelAlarmList();
        case "3":
          this.$refs.obstacle.$refs.formData.$refs.crud.refreshTable();
          return this.$refs.obstacle.getPoiOrChannelAlarmList();
        default:
          break;
      }
    },
    handleAlarmClick(val) {
      this.$refs.dialog.open(val);
    },
    // 碰撞预警
    getShipCollisionAlarm() {
      getShipCollisionAlarm().then(({ data }) => {
        this.shipCollisionAlarmList = data.data;
      });
    },
    // 碍航物 偏航
    getPoiOrChannelAlarmList() {
      getPoiOrChannelAlarmList({ type: "1" }).then(({ data }) => {
        this.zawList = data.data;
      });
      getPoiOrChannelAlarmList({ type: "2" }).then(({ data }) => {
        this.phList = data.data;
      });
    },
    // ai预警
    getAlarmList() {
      getAlarmList().then(({ data }) => {
        if (data.data.list.length) {
          this.alarmTypeNumber = data.data.list.length;
        }
        if (this.alarmTypeNumber !== 0) {
          this.$refs.audio.play();
        }
        this.alarmList = data.data.list;
        MapboxAlarm.setAlarm(data.data.list);
        MapboxAlarm.show();
      });
    },
    // 定时任务
    timeTask() {
      this.timer = setInterval(() => {
        this.getAlarmList();
        this.getPoiOrChannelAlarmList();
        this.getShipCollisionAlarm();
      }, interval);
    },
    // 清除定时任务
    clearTask() {
      this.timer && clearInterval(this.timer);
      this.timer = null;
    },
    load() {
      this.count += 2;
    },
  },
};
</script>

<style scoped lang="scss">
.warn-btn {
  position: absolute;
  right: 10px;
  bottom: 100px;
  width: 58px;
  height: 58px;
  border-radius: 80px;
  background: #f5255f;
  color: white;
  text-align: center;
  line-height: 58px;
  pointer-events: auto;
  cursor: pointer;
  font-size: 16px;
  font-family: Source Han Sans CN-Normal, Source Han Sans CN;
  font-weight: 400;
  color: #ffffff;
  .warn-btn-number {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    border: 1px solid #f5255f;
    background-color: #fff;
    color: #f5255f;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    top: -2px;
    right: -2px;
  }
}
.alarm-box {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 900px;
  height: 650px;
  //position: absolute;
  pointer-events: auto;
  //right: 80px;
  //bottom: 100px;
  background: #ffffff;
  border-radius: 5px 5px 5px 5px;
  .alarm-message {
    margin-top: 10px;
    width: 100%;
    height: 36px;
    margin-bottom: 20px;
    background: rgba(199, 23, 23, 0.72);
    border-radius: 6px 6px 6px 6px;
    display: flex;
    padding-left: 26px;
    align-items: center;
    .alarm-message-item {
      display: flex;
      align-items: center;
    }
    .alarm-text {
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
      line-height: 36px;
      margin-right: 10px;
    }
  }
  .alarm-search {
    width: 100%;
    height: 100px;
  }
  .alarm-content {
    flex: 1;
    overflow: auto;
    display: flex;
  }
  .info-item {
    display: flex;
    margin-left: 20px;
    margin-bottom: 15px;
    .info-item-label {
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #333333;
      width: 50px;
    }
    .info-item-content {
      font-size: 14px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      color: #8f8f8f;
    }
  }
}
::v-deep .el-tabs--left .el-tabs__item.is-left {
  text-align: center;
}
::v-deep .el-page-header__content {
  font-size: 15px;
}
::v-deep .el-range-editor--small .el-range-separator {
  font-size: 11px;
}
::v-deep .el-icon-arrow-left:before {
  font-size: 30px;
  font-weight: 700;
}
::v-deep .el-icon-arrow-right:before {
  font-size: 30px;
  font-weight: 700;
}
</style>

