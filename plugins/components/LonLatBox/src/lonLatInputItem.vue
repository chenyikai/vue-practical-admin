<template>
  <div class="lon-lat-input-item-container">
    <div class="lon-lat-input-item-container-header">
      <span class="lon-lat-input-item-container-header-title">{{
        index + 1
      }}</span>
      <em
        v-if="isRender()"
        class="lon-lat-input-item-container-header-btn el-icon-close"
        @click="$emit('delete', index)" />
    </div>
    <div class="lon-lat-input-item-container-content">
      <div class="lat-row">
        <span class="title">纬</span>
        <div v-show="lonLatType === 'degree'" class="degree-box">
          <el-input-number
            v-model="lat.degreeMinuteSecond"
            :max="89.99"
            :min="0"
            :controls="false"
            @change="handleDegreeChange()" />
        </div>
        <div v-show="lonLatType === 'degreeMinute'" class="degree-minute-box">
          <el-input-number
            v-model="lat.degree"
            :max="89.99"
            :min="0"
            :controls="false"
            @change="handleDegreeMinuteLatChange" />
          <el-input-number
            v-model="lat.minuteSecond"
            :min="0"
            :max="60"
            :controls="false"
            @change="handleDegreeMinuteLatChange" />
        </div>
        <div
          v-show="lonLatType === 'degreeMinuteSecond'"
          class="degree-minute-second-box">
          <el-input-number
            v-model="lat.degree"
            :max="89.99"
            :min="0"
            :controls="false"
            @change="handleDegreeMinuteSecondLatChange" />
          <el-input-number
            v-model="lat.minute"
            :min="0"
            :max="60"
            :controls="false"
            @change="handleDegreeMinuteSecondLatChange" />
          <el-input-number
            v-model="lat.second"
            :min="0"
            :max="60"
            :controls="false"
            @change="handleDegreeMinuteSecondLatChange" />
        </div>
        <div class="direction-box">
          <el-select
            v-model="lat.direction"
            placeholder=""
            @change="handleDirectionLatChange">
            <el-option value="N" label="N" />
            <el-option value="S" label="S" />
          </el-select>
        </div>
      </div>
      <div class="lon-row">
        <span class="title">经</span>
        <div v-show="lonLatType === 'degree'" class="degree-box">
          <el-input-number
            v-model="lon.degreeMinuteSecond"
            :min="0"
            :max="179.99"
            :controls="false"
            @change="handleDegreeChange()" />
        </div>
        <div v-show="lonLatType === 'degreeMinute'" class="degree-minute-box">
          <el-input-number
            v-model="lon.degree"
            :min="0"
            :max="179.99"
            :controls="false"
            @change="handleDegreeMinuteLonChange" />
          <el-input-number
            v-model="lon.minuteSecond"
            :min="0"
            :max="59.99"
            :controls="false"
            @change="handleDegreeMinuteLonChange" />
        </div>
        <div
          v-show="lonLatType === 'degreeMinuteSecond'"
          class="degree-minute-second-box">
          <el-input-number
            v-model="lon.degree"
            :min="0"
            :max="179.99"
            :controls="false"
            @change="handleDegreeMinuteSecondLonChange" />
          <el-input-number
            v-model="lon.minute"
            :min="0"
            :max="59.99"
            :controls="false"
            @change="handleDegreeMinuteSecondLonChange" />
          <el-input-number
            v-model="lon.second"
            :min="0"
            :max="59.99"
            :controls="false"
            @change="handleDegreeMinuteSecondLonChange" />
        </div>
        <div class="direction-box">
          <el-select
            v-model="lon.direction"
            placeholder=""
            @change="handleDirectionLonChange">
            <el-option value="E" label="E" />
            <el-option value="W" label="W" />
          </el-select>
        </div>
      </div>
      <div class="radius-row" v-if="radius">
        <span class="title" style="width: 3em">半径</span>
        <el-input-number
          v-model="lat.degreeMinuteSecond"
          :min="0"
          :controls="false"
          @change="handleRadiusChange()" />
      </div>
    </div>
  </div>
</template>

<script>
import { MapboxPlotClass } from "@/plugins/composition/mapbox-plot";
import { cloneDeep } from "lodash";

export default {
  name: "lonLatInputItem",
  props: {
    lonLat: Array,
    index: {
      type: Number,
      default: 0,
    },
    lonLatType: String,
    type: {
      type: String,
      default: "",
    },
    length: {
      type: Number,
      default: Infinity,
    },
    radius: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      lon: {
        degree: "",
        minute: "",
        second: "",
        minuteSecond: "",
        degreeMinuteSecond: "",
        direction: "",
      },
      lat: {
        degree: "",
        minute: "",
        second: "",
        minuteSecond: "",
        degreeMinuteSecond: "",
        direction: "",
      },
      directionEnum: {
        N: 1,
        S: -1,
        E: 1,
        W: -1,
      },
      circleRadius: undefined,
    };
  },
  watch: {
    lonLat: {
      deep: true,
      immediate: true,
      handler(val) {
        const [lon, lat] = val;
        this.lon = this.formatDegree(lon, false);
        this.lat = this.formatDegree(lat, true);
        this.circleRadius = cloneDeep(this.radius);
      },
    },
  },
  beforeDestroy() {
    this.reset();
  },
  methods: {
    handleDegreeChange() {
      const lon = this.lon.degreeMinuteSecond;
      const lat = this.lat.degreeMinuteSecond;
      this.emitEvent([lon, lat]);
    },
    handleDegreeMinuteLatChange() {
      const lat = Number(this.lat.degree) + Number(this.lat.minuteSecond) / 60;
      this.emitEvent([this.lon.degreeMinuteSecond, lat]);
    },
    handleDegreeMinuteLonChange() {
      const lon = Number(this.lon.degree) + Number(this.lon.minuteSecond) / 60;
      this.emitEvent([lon, this.lat.degreeMinuteSecond]);
    },
    handleDegreeMinuteSecondLatChange() {
      const lat =
        Number(this.lat.degree) +
        Number(this.lat.minute) / 60 +
        Number(this.lat.second) / 3600;
      this.emitEvent([this.lon.degreeMinuteSecond, lat]);
    },
    handleDegreeMinuteSecondLonChange() {
      const lon =
        Number(this.lon.degree) +
        Number(this.lon.minute) / 60 +
        Number(this.lon.second) / 3600;
      this.emitEvent([lon, this.lat.degreeMinuteSecond]);
    },
    handleDirectionLatChange(val) {
      const lon = this.lon.degreeMinuteSecond;
      const lat = this.lat.degreeMinuteSecond * this.directionEnum[val];
      this.emitEvent([lon, lat]);
    },
    handleDirectionLonChange(val) {
      const lon = this.lon.degreeMinuteSecond * this.directionEnum[val];
      const lat = this.lat.degreeMinuteSecond;
      this.emitEvent([lon, lat]);
    },
    formatDegree(
      value,
      isLat,
      config = {
        degreeDecimal: 6,
        minuteDecimal: 4,
        secondDecimal: 6,
      }
    ) {
      let absValue = Math.abs(value);
      let degree = Math.floor(absValue);
      let minuteSecond = (absValue - degree) * 60;
      let minute = Math.floor(minuteSecond);
      let second = ((absValue - degree) * 3600) % 60;
      let direction = null;
      if (value === absValue) {
        direction = isLat ? "N" : "E";
      } else {
        direction = isLat ? "S" : "W";
      }

      return {
        // value: `${degree}°${paddingZero(Math.floor(minute))}′${paddingZero(
        //   second.toFixed(config.secondDecimal)
        // )}″`,
        degree: degree,
        minute: minute,
        second: second.toFixed(config.secondDecimal),
        minuteSecond: minuteSecond.toFixed(config.minuteDecimal),
        degreeMinuteSecond: absValue.toFixed(config.degreeDecimal),
        direction: direction,
      };
    },
    emitEvent(lngLat) {
      this.$emit("change", {
        index: this.index,
        lngLat,
      });
    },
    handleRadiusChange(val) {
      this.$emit("radius-change", val);
    },
    reset() {
      this.lon = {
        degree: "",
        minute: "",
        second: "",
        minuteSecond: "",
        degreeMinuteSecond: "",
        direction: "",
      };
      this.lat = {
        degree: "",
        minute: "",
        second: "",
        minuteSecond: "",
        degreeMinuteSecond: "",
        direction: "",
      };
      this.circleRadius = null;
    },
    isRender() {
      if (this.type === MapboxPlotClass.POINT) {
        return false;
      } else if (this.type === MapboxPlotClass.LINE) {
        return this.length > 2;
      } else if (this.type === MapboxPlotClass.POLYGON) {
        return this.length > 3;
      } else if (this.type === MapboxPlotClass.CIRCLE) {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.lon-lat-input-item-container {
  width: 100%;
  padding: 5px;
  background-color: #f5f7fa;
  color: #646262;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-btn {
      cursor: pointer;
    }
  }
  &-content {
    .lat-row,
    .lon-row,
    .radius-row {
      display: flex;
      align-items: center;
      width: 100%;
      height: 36px;
      .title {
        margin-right: 6px;
      }
      .degree-box,
      .degree-minute-box,
      .degree-minute-second-box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100%;
        margin: 0 10px;
        .el-input-number {
          flex: 1;
          width: 0;
          margin-right: 8px;
          &:last-child {
            margin-right: 0;
          }
          .el-input__inner {
            height: 24px;
            line-height: 24px;
            padding-left: 5px;
            padding-right: 5px;
          }
        }
      }
      .direction-box {
        width: 60px;
        .el-select {
          width: 100%;
          .el-input__inner {
            height: 24px;
            line-height: 24px;
          }
          .el-input__suffix {
            .el-input__icon {
              line-height: 24px;
            }
          }
        }
      }
    }
  }
}
</style>
