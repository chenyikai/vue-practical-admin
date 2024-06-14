<template>
  <transition name="slide">
    <div class="hurricane-pack" v-if="isShow">
      <div class="history-typhoon-container">
        <div class="history-typhoon-container-header">
          <span class="title">历史台风列表</span>
          <el-date-picker
            class="typhoon-year"
            v-model="typhoonYear"
            type="year"
            popper-class="typhoon-year-popper"
            placeholder="选择年"
            :pickerOptions="pickerOptions"
            :clearable="false"
            :editable="false"
            value-format="YYYY"
            @change="getFindComplexByYear">
          </el-date-picker>
        </div>
        <div class="history-typhoon-container-content">
          <template v-if="typhoonList.length !== 0">
            <div
              class="history-typhoon"
              v-for="item in typhoonList"
              :key="item.code">
              <el-checkbox
                v-model="checkList[item.code]"
                :label="item.code"
                class="typhoon-check"
                @change="handleChange(item.code, $event)">
                {{ `${item.name}-${item.ename}` }}
              </el-checkbox>
            </div>
          </template>
          <div class="noData" v-else>暂无数据</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import moment from "moment";
const POPUP_CLASSNAME = "typhoon-popup";
import {
  findComplexByComplexId,
  findComplexByYear,
} from "@/api/map/meteorology.js";
import { set } from "lodash";
import { parse } from "wellknown";
import { ref, onBeforeUnmount, watch } from "vue";
import { Mapbox } from "plugins";
import { mapStore } from "@/store/index.js";

defineOptions({
  name: "HurricanePack",
});

const MapStore = mapStore();
let isShow = ref(false);
let typhoonYear = ref(moment().format("YYYY"));
let typhoonInstance = undefined;
let typhoonList = ref([]);
let typhoonData = ref({});
let checkList = ref({});

const pickerOptions = ref({
  disabledDate(time) {
    const selectYear = moment(time).format("yyyy");
    const nowYear = moment(new Date()).format("yyyy");
    return selectYear > nowYear;
  },
});

function open(type) {
  isShow.value = type === 2;
  if (type === 2) {
    if (typhoonList.value.length > 0) {
      typhoonList.value.forEach((item) => {
        checkList.value[item.code] = false;
      });
    }
  } else {
    removeTyphoon();
  }
}

function init() {
  const ehhGis = window.EhhGis();
  typhoonInstance = new ehhGis.Typhoon(Mapbox.getMap());
  typhoonEvent();
  setTimeout(() => {
    getFindComplexByYear();
  }, 500);
}
function getFindComplexByYear() {
  findComplexByYear(typhoonYear.value).then(({ data }) => {
    typhoonList.value = kvToJson(data.data.k, data.data.v);
    typhoonList.value.forEach((item) => {
      const flag = Object.hasOwnProperty.call(checkList.value, item.code);
      if (!flag) {
        checkList.value[item.code] = false;
      }
    });
  });
}
function getFindComplexByComplexId(id) {
  return findComplexByComplexId(id).then(({ data }) => {
    return {
      ...data.data[0],
      points: data.data[0].points,
    };
  });
}
async function handleChange(id, val) {
  if (val) {
    // 选中
    const flag = Object.hasOwnProperty.call(typhoonData.value, id);
    if (flag) {
      removeTyphoon(id);
    } else {
      await getFindComplexByComplexId(id).then((data) => {
        typhoonData.value[id] = data;
      });
    }
    flyToTyphoon(typhoonData.value[id]);
    showTyphoon();
  } else {
    // 取消选中
    removeTyphoon(id);
  }
}
function showTyphoon() {
  const list = [];
  for (const typhoonDataKey in typhoonData.value) {
    let item = typhoonData.value[typhoonDataKey];
    const es = {
      radius7: null,
      radius7QuadNe: null,
      radius7QuadNw: null,
      radius7QuadSe: null,
      radius7QuadSw: null,
      radius10: null,
      radius10QuadNe: null,
      radius10QuadNw: null,
      radius10QuadSe: null,
      radius10QuadSw: null,
      radius12: null,
      radius12QuadNe: null,
      radius12QuadNw: null,
      radius12QuadSe: null,
      radius12QuadSw: null,
    };
    item.points.map((e, i) => {
      item.points[i] = { ...es, ...e };
    });
    list.push(item);
  }
  typhoonInstance.showTyphoon(list);
}
function flyToTyphoon(data) {
  if (Array.isArray(data.points)) {
    const { coordinates } = parse(data.points.at(-1).geom);
    Mapbox.getMap().flyTo({
      center: coordinates,
      zoom: 5,
      speed: 10,
      curve: 0.5,
    });
  }
}
function removeTyphoon(id) {
  if (id) {
    typhoonInstance.removeTyphoon(id);
    delete typhoonData.value[id];
  } else {
    for (const typhoonDataKey in typhoonData.value) {
      const item = typhoonData.value[typhoonDataKey];
      typhoonInstance.removeTyphoon(item.code);
      delete typhoonData.value[item.code];
    }
  }
}
function typhoonEvent() {
  const container = Mapbox.getMap().getContainer();
  typhoonInstance.onMouseleave(() => {
    container.style.pointer = "";
  });
  typhoonInstance.onMousemove(() => {
    container.style.pointer = "cursor";
  });
  typhoonInstance.onClick((e) => {
    const data = e.find((item) => item.layer.type === "circle");
    addPopup(data.properties);
  });
}
function addPopup(data) {
  const { typhoonId, power, speed, strong, lng, lat, time } = data;
  const { name, ename } = typhoonList.value.find(
    (item) => item.code === typhoonId,
  );
  const { latitude, longitude } = formatLatitudeAndLongitude(lng, lat);
  const lonLabel = `${latitude.name}${latitude.fmtValue.degree}°`;
  const latLabel = `${longitude.name}${longitude.fmtValue.degree}°`;
  const html = `
        <div class="typhoon-info-container">
            <div class="typhoon-info-container-header">
                【${name}-${ename}】${moment(Number(time)).format(
                  "yyyy-MM-DD HH:mm:ss",
                )}
            </div>
            <div class="typhoon-info-container-content">
                <div class="typhoon-info-form">
                    <div class="typhoon-info-form-item">
                        <div class="label">中心位置</div>
                        <div class="value">${lonLabel} ${latLabel}</div>
                    </div>
                    <div class="typhoon-info-form-item">
                        <div class="label">风速风力</div>
                        <div class="value">${speed}米/秒，${power}级(${strong})</div>
                    </div>
                </div>
            </div>
        </div>
      `;
  return new window.EhhGis()
    .Popup({
      className: POPUP_CLASSNAME,
      maxWidth: "none",
      closeOnClick: false,
    })
    .setLngLat([lng, lat])
    .setHTML(html)
    .addTo(Mapbox.getMap());
}
function formatLatitudeAndLongitude(
  longitude,
  latitude,
  config = {
    degreeDecimal: 4,
    minuteDecimal: 2,
    secondDecimal: 4,
  },
) {
  let fmtLongitude = formatDegree(longitude, config);
  let fmtLatitude = formatDegree(latitude, config);
  return {
    longitude: {
      get value() {
        return this.fmtValue.value;
      },
      get completeValue() {
        return `Lon. ${this.value} ${this.nameEn}`;
      },
      fmtValue: fmtLongitude,
      name: longitude >= 0 ? "东经" : "西经",
      nameEn: longitude >= 0 ? "E" : "W",
    },
    latitude: {
      get value() {
        return this.fmtValue.value;
      },
      get completeValue() {
        return `Lat. ${this.value} ${this.nameEn}`;
      },
      fmtValue: fmtLatitude,
      name: latitude >= 0 ? "北纬" : "南纬",
      nameEn: latitude >= 0 ? "N" : "S",
    },
  };
}
function formatDegree(
  value,
  config = {
    degreeDecimal: 6,
    minuteDecimal: 2,
    secondDecimal: 2,
  },
) {
  let absValue = Math.abs(value);
  let degree = Math.floor(absValue);
  let minute = (absValue - degree) * 60;
  let second = ((absValue - degree) * 3600) % 60;

  return {
    value: `${degree}°${paddingZero(
      Math.floor(minute),
    )}′${paddingZero(second.toFixed(config.secondDecimal))}″`,
    degreeMinute: `${degree}°${minute.toFixed(config.minuteDecimal)}'`,
    originValue: value,
    degree: Number(value).toFixed(config.degreeDecimal),
    minute: ((value - degree) * 60).toFixed(config.minuteDecimal),
    second: (((value - degree) * 3600) % 60).toFixed(config.secondDecimal),
  };
}
function paddingZero(num, padding = 2) {
  let len = Math.floor(num).toString().length;
  while (len < padding) {
    num = "0" + num;
    len++;
  }
  return num;
}
function kvToJson(k, v) {
  const list = [];
  v.forEach((valueItem) => {
    let data = {};
    valueItem.forEach((item, index) => {
      if (Array.isArray(item)) {
        set(data, "list", {
          k: k[index],
          v: item,
        });
      } else {
        set(data, k[index], item);
      }
    });
    list.push(data);
  });
  return list;
}

watch(
  () => MapStore.initMap,
  (news) => {
    if (news) init();
  },
  { deep: true },
);

onBeforeUnmount(() => {
  removeTyphoon();
});

defineExpose({
  open,
  init,
});
</script>

<style lang="scss" scoped>
.hurricane-pack {
  position: absolute;
  bottom: 7%;
  left: 0.7%;
  pointer-events: all;
  user-select: none;

  &::v-deep .history-typhoon-container {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 263px;
    height: 347px;
    padding: 6px;
    background: rgba(0, 47, 68, 0.59);
    box-shadow: inset 0 0 33px 0 #23e6e0;
    border-radius: 0 0 0 0;
    border: 2px solid;
    border-image: linear-gradient(
        230deg,
        rgba(32, 219, 238, 1),
        rgba(1, 246, 255, 1)
      )
      2 2;
    margin-top: 7px;
    .close-btn {
      position: absolute;
      top: 5px;
      right: 9px;
      color: #17a9c1;
      background-color: black;
      border: 2px solid #17a9c1;
      cursor: pointer;
    }
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 9px;
      margin: 5px 0 9px;
      .title {
        font-size: 18px;
        color: #fff;
        font-weight: bold;
      }
      .typhoon-year {
        width: 75px;
        .el-input__inner {
          height: 30px;
          line-height: 30px;
          padding: 0;
          font-size: 16px;
          border-color: #00f5ff;
          background-color: transparent;
          color: #00f5ff;
          text-align: center;
        }
        .el-input__prefix {
          display: none;
          .el-input__icon {
            line-height: 20px;
          }
        }
        .el-input__suffix {
          display: none;
        }
      }
    }
    &-content {
      flex: 1;
      overflow: auto;
      padding-left: 9px;
      .history-typhoon {
        display: flex;
        align-items: center;
        gap: 5px;
        width: 100%;
        height: 50px;
        padding: 0 12px;
        cursor: pointer;
        &:nth-child(even) {
          background: rgba(1, 31, 52, 0.53);
        }
        .typhoon-check {
          &.is-checked {
            .el-checkbox__inner {
              background-color: #16b4c0;
            }
          }
          .el-checkbox__inner {
            background-color: transparent;
            border: 2px solid #00f6ff;
            width: 20px;
            height: 20px;
            &:after {
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              margin: auto;
              font-size: 16px;
              font-weight: bold;
            }
          }
          .el-checkbox__label {
            color: #fff;
            font-size: 16px;
          }
        }
      }
      .noData {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        color: #fff;
      }
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(1%);
  opacity: 0;
}
</style>
