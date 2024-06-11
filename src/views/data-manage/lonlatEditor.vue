<script>
export default {
  name: "lonlatEditor",
};
</script>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
import SvgIcon from "package/SvgIcon/src/index.vue";
import { validatenull } from "@/utils/validate.js";
import BigNumber from "bignumber.js";
import { circle } from "@turf/turf";
const upLoading = ref(false); // 提交状态控制 true-允许编辑 false-禁止编辑
const emit = defineEmits(["dataReturn"]);
const type = ref("");
const formData = ref([
  {
    longitude: 0,
    latitude: 0,
    radius: 0,
    lonTab: "E",
    latTab: "N",

    lon1e1: 0,
    lat1e1: 0,

    lon2e1: 0,
    lat2e1: 0,
    lon2e2: 0,
    lat2e2: 0,

    lon3e1: 0,
    lat3e1: 0,
    lon3e2: 0,
    lat3e2: 0,
    lon3e3: 0,
    lat3e3: 0,
  },
]);

const lonOption = [
  { label: "W", value: "W" },
  { label: "E", value: "E" },
];
const latOption = [
  { label: "N", value: "N" },
  { label: "S", value: "S" },
];

function validate(type) {
  upLoading.value = type;
}

function addDataList() {
  if (type.value !== "polygon") {
    formData.value.push({
      longitude: 0,
      latitude: 0,
      radius: 0,
      lonTab: "E",
      latTab: "N",
    });
    onDegreeToData(formData.value.length - 1);
  } else {
    formData.value.splice(formData.value.length - 1, 0, {
      longitude: 0,
      latitude: 0,
      radius: 0,
      lonTab: "E",
      latTab: "N",
    });
    onDegreeToData(formData.value.length - 1);
  }
}

// 初始数据区域判断并覆写数组
function onAreaToData(data, e) {
  type.value = e;
  if (type.value === "customPoint") {
    const lonTab = data[0] >= 0 ? "E" : "W";
    const latTab = data[1] >= 0 ? "N" : "S";
    formData.value = [
      {
        longitude: Math.abs(data[0]),
        latitude: Math.abs(data[1]),
        lonTab: lonTab,
        latTab: latTab,
      },
    ];
  } else if (type.value === "lineString") {
    formData.value = data.map((item) => {
      const lonTab = item[0] >= 0 ? "E" : "W";
      const latTab = item[1] >= 0 ? "N" : "S";
      return {
        longitude: Math.abs(item[0]),
        latitude: Math.abs(item[1]),
        lonTab: lonTab,
        latTab: latTab,
      };
    });
  } else if (type.value === "polygon") {
    formData.value = data[0].map((item) => {
      const lonTab = item[0] >= 0 ? "E" : "W";
      const latTab = item[1] >= 0 ? "N" : "S";
      return {
        longitude: Math.abs(item[0]),
        latitude: Math.abs(item[1]),
        lonTab: lonTab,
        latTab: latTab,
      };
    });
  } else if (type.value === "circle") {
    const lonTab = data.center[0] >= 0 ? "E" : "W";
    const latTab = data.center[1] >= 0 ? "N" : "S";
    formData.value = [
      {
        longitude: Math.abs(data.center[0]),
        latitude: Math.abs(data.center[1]),
        radius: data.radius,
        lonTab: lonTab,
        latTab: latTab,
      },
    ];
  }
  formData.value.map((item, index) => {
    onDegreeToData(index);
  });
}

function deleteDataList(i) {
  formData.value.splice(i, 1);
  dataReturn();
}

// 度转三维数据
function onDegreeToData(index) {
  const e = formData.value[index];
  const longitude = Number(e.longitude);
  const latitude = Number(e.latitude);
  if (
    (longitude === 0 || !validatenull(longitude)) &&
    (latitude === 0 || !validatenull(latitude))
  ) {
    // 计算度区域数
    const lon1e1 = Math.abs(longitude);
    const lat1e1 = Math.abs(latitude);
    formData.value[index].lon1e1 = lon1e1;
    formData.value[index].lat1e1 = lat1e1;

    // 计算度分区域数
    const lon2e1 = parseInt(String(lon1e1));
    const lat2e1 = parseInt(String(lat1e1));
    formData.value[index].lon2e1 = lon2e1;
    formData.value[index].lat2e1 = lat2e1;
    const lon2e2 = new BigNumber(lon1e1).minus(new BigNumber(lon2e1)).times(60);
    const lat2e2 = new BigNumber(lat1e1).minus(new BigNumber(lat2e1)).times(60);
    formData.value[index].lon2e2 = Number(lon2e2.toString());
    formData.value[index].lat2e2 = Number(lat2e2.toString());

    // 计算度分秒区域数
    formData.value[index].lon3e1 = lon2e1;
    formData.value[index].lat3e1 = lat2e1;
    const lon3e2 = parseInt(String(Number(lon2e2.toString())));
    const lat3e2 = parseInt(String(Number(lat2e2.toString())));
    formData.value[index].lon3e2 = lon3e2;
    formData.value[index].lat3e2 = lat3e2;
    const lon3e3 = new BigNumber(Number(lon2e2.toString()))
      .minus(new BigNumber(lon3e2))
      .times(60);
    const lat3e3 = new BigNumber(Number(lat2e2.toString()))
      .minus(new BigNumber(lat3e2))
      .times(60);
    formData.value[index].lon3e3 = Number(lon3e3.toString());
    formData.value[index].lat3e3 = Number(lat3e3.toString());
  }
}

// 任意三维数据转度
function onDataToDegree(index, key) {
  const e = formData.value[index];
  if (key === "degree1") {
    formData.value[index].longitude = e.lon1e1;
    formData.value[index].latitude = e.lat1e1;
    onDegreeToData(index);
  } else if (key === "degree2") {
    const lon2e2 = e.lon2e2 / 60;
    const lat2e2 = e.lat2e2 / 60;
    formData.value[index].longitude = e.lon2e1 + lon2e2;
    formData.value[index].latitude = e.lat2e1 + lat2e2;
    onDegreeToData(index);
  } else if (key === "degree3") {
    const lon3e3 = e.lon3e3 / 60;
    const lat3e3 = e.lat3e3 / 60;
    const lon3e2 = (e.lon3e2 + lon3e3) / 60;
    const lat3e2 = (e.lat3e2 + lat3e3) / 60;
    formData.value[index].longitude = e.lon3e1 + lon3e2;
    formData.value[index].latitude = e.lat3e1 + lat3e2;
    onDegreeToData(index);
  }
  dataReturn();
}

// 获取当前编辑器输出WKT格式
function dataReturn() {
  let coordinates = [],
    data = {},
    radius = null;
  formData.value.map((item) => {
    const lon = item.lonTab === "E" ? "" : "-";
    const lat = item.latTab === "N" ? "" : "-";
    coordinates.push([
      Number(lon + item.longitude),
      Number(lat + item.latitude),
    ]);
  });
  if (type.value === "customPoint") {
    data = { coordinates: coordinates[0], type: "Point" };
  } else if (type.value === "lineString") {
    data = { coordinates: coordinates, type: "LineString" };
  } else if (type.value === "polygon") {
    coordinates[coordinates.length - 1] = coordinates[0];
    data = { coordinates: [coordinates], type: "Polygon" };
  } else if (type.value === "circle") {
    data = circle(coordinates[0], formData.value[0].radius, {
      units: "kilometers",
    });
  } else {
    console.error("编辑器异常输出");
  }

  if (!validatenull(data)) {
    emit("dataReturn", data, coordinates, radius, type.value);
    return {
      data: data,
      coordinates: coordinates,
      radius: radius,
      type: type.value,
    };
  }
}

// 重置数据类型
function closeDataList(e) {
  if (!e) {
    formData.value = [
      {
        longitude: 0,
        latitude: 0,
        radius: 0,
        lonTab: "E",
        latTab: "N",
      },
    ];
    type.value = null;
    onDegreeToData(0);
    validate(false);
  } else {
    if (e === "customPoint") {
      onAreaToData([0, 0], e);
    } else if (e === "lineString") {
      onAreaToData(
        [
          [0, 0],
          [0, 0],
        ],
        e,
      );
    } else if (e === "polygon") {
      onAreaToData(
        [
          [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
        e,
      );
    } else if (e === "circle") {
      onAreaToData({ center: [0, 0], radius: 0 }, e);
    }
  }
}

function deleteButtonIf() {
  if (type.value === "lineString") {
    return formData.value.length > 2;
  } else if (type.value === "polygon") {
    return formData.value.length > 4;
  }
}

function virtualHiddenFace(index) {
  // 虚拟隐藏面的最后一个值 需要配合同步第一个值
  if (index + 1 === formData.value.length && type.value === "polygon") {
    return false;
  }
  return true;
}

defineExpose({
  formData,
  validate,
  onAreaToData,
  closeDataList,
});
</script>

<template>
  <div class="lonlat-editor-box" v-if="type !== 'circle'">
    <div
      class="new-data"
      v-show="upLoading"
      v-if="type === 'lineString' || type === 'polygon'">
      <svg-icon class="btn" :name="'add-editor'" @click="addDataList" />
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="度">
        <div
          class="form-box"
          v-for="(item, i) in formData"
          :key="i"
          v-show="virtualHiddenFace(i)">
          <div class="tag-head">
            <span># {{ i + 1 }}</span>
            <svg-icon
              class="btn"
              :name="'delete'"
              v-show="upLoading"
              v-if="deleteButtonIf()"
              @click="deleteDataList(i, 'degree1')" />
          </div>
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">经度</el-col>
              <el-col :span="15" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon1e1"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="180"
                  label="度"
                  @blur="onDataToDegree(i, 'degree1')" />
                <span>°</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.lonTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree1')">
                  <el-option
                    v-for="item in lonOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">纬度</el-col>
              <el-col :span="15" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat1e1"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="90"
                  label="度"
                  @blur="onDataToDegree(i, 'degree1')" />
                <span>°</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.latTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree1')">
                  <el-option
                    v-for="item in latOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="度分">
        <div class="form-box" v-for="(item, i) in formData" :key="i">
          <div class="tag-head">
            <span># {{ i + 1 }}</span>
            <svg-icon
              class="btn"
              :name="'delete'"
              v-show="upLoading"
              v-if="deleteButtonIf()"
              @click="deleteDataList(i, 'degree2')" />
          </div>
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">经度</el-col>
              <el-col :span="7" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon2e1"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="180"
                  label="度"
                  @blur="onDataToDegree(i, 'degree2')" />
                <span>°</span>
              </el-col>
              <el-col :span="8" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon2e2"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="分"
                  @blur="onDataToDegree(i, 'degree2')" />
                <span>'</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.lonTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree2')">
                  <el-option
                    v-for="item in lonOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">纬度</el-col>
              <el-col :span="7" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat2e1"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="90"
                  label="度"
                  @blur="onDataToDegree(i, 'degree2')" />
                <span>°</span>
              </el-col>
              <el-col :span="8" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat2e2"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="分"
                  @blur="onDataToDegree(i, 'degree2')" />
                <span>'</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.latTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree2')">
                  <el-option
                    v-for="item in latOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="度分秒">
        <div class="form-box" v-for="(item, i) in formData" :key="i">
          <div class="tag-head">
            <span># {{ i + 1 }}</span>
            <svg-icon
              class="btn"
              :name="'delete'"
              v-show="upLoading"
              v-if="deleteButtonIf()"
              @click="deleteDataList(i, 'degree3')" />
          </div>
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">经度</el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon3e1"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="180"
                  label="度"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>°</span>
              </el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon3e2"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="分"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>'</span>
              </el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon3e3"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="秒"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>"</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.lonTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree3')">
                  <el-option
                    v-for="item in lonOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">纬度</el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat3e1"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="90"
                  label="度"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>°</span>
              </el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat3e2"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="分"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>'</span>
              </el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat3e3"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="秒"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>"</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.latTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree3')">
                  <el-option
                    v-for="item in latOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>

  <div class="lonlat-editor-box" v-if="type === 'circle'">
    <el-tabs type="border-card">
      <el-tab-pane label="度">
        <div class="form-box" v-for="(item, i) in formData" :key="i">
          <div class="tag-head" />
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">经度</el-col>
              <el-col :span="15" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon1e1"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="180"
                  label="度"
                  @blur="onDataToDegree(i, 'degree1')" />
                <span>°</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.lonTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree1')">
                  <el-option
                    v-for="item in lonOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">纬度</el-col>
              <el-col :span="15" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat1e1"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="90"
                  label="度"
                  @blur="onDataToDegree(i, 'degree1')" />
                <span>°</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.latTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree1')">
                  <el-option
                    v-for="item in latOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="element-box sea-number-input">
              <el-col :span="4">半径</el-col>
              <el-col :span="15" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.radius"
                  :disabled="!upLoading"
                  :controls="false"
                  :min="0"
                  label="公里"
                  @blur="onDataToDegree(i, 'degree1')" />
                <span style="padding: 2px" />
              </el-col>
              <el-col :span="5">
                <span>公里</span>
              </el-col>
            </div>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="度分">
        <div class="form-box" v-for="(item, i) in formData" :key="i">
          <div class="tag-head" />
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">经度</el-col>
              <el-col :span="7" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon2e1"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="180"
                  label="度"
                  @blur="onDataToDegree(i, 'degree2')" />
                <span>°</span>
              </el-col>
              <el-col :span="8" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon2e2"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="分"
                  @blur="onDataToDegree(i, 'degree2')" />
                <span>'</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.lonTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree2')">
                  <el-option
                    v-for="item in lonOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">纬度</el-col>
              <el-col :span="7" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat2e1"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="90"
                  label="度"
                  @blur="onDataToDegree(i, 'degree2')" />
                <span>°</span>
              </el-col>
              <el-col :span="8" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat2e2"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="分"
                  @blur="onDataToDegree(i, 'degree2')" />
                <span>'</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.latTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree2')">
                  <el-option
                    v-for="item in latOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="element-box sea-number-input">
              <el-col :span="4">半径</el-col>
              <el-col :span="15" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.radius"
                  :disabled="!upLoading"
                  :controls="false"
                  :min="0"
                  label="公里"
                  @blur="onDataToDegree(i, 'degree2')" />
                <span style="padding: 2px" />
              </el-col>
              <el-col :span="5">
                <span>公里</span>
              </el-col>
            </div>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="度分秒">
        <div class="form-box" v-for="(item, i) in formData" :key="i">
          <div class="tag-head" />
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">经度</el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon3e1"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="180"
                  label="度"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>°</span>
              </el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon3e2"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="分"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>'</span>
              </el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lon3e3"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="秒"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>"</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.lonTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree3')">
                  <el-option
                    v-for="item in lonOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="element-box">
              <el-col :span="4">纬度</el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat3e1"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="90"
                  label="度"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>°</span>
              </el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat3e2"
                  :disabled="!upLoading"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="分"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>'</span>
              </el-col>
              <el-col :span="5" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.lat3e3"
                  :disabled="!upLoading"
                  :precision="6"
                  :controls="false"
                  :min="0"
                  :max="60"
                  label="秒"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span>"</span>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="item.latTab"
                  :disabled="!upLoading"
                  @visible-change="onDataToDegree(i, 'degree3')">
                  <el-option
                    v-for="item in latOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="element-box sea-number-input">
              <el-col :span="4">半径</el-col>
              <el-col :span="15" class="input-el-box">
                <el-input-number
                  class="el-input-number-lonlat"
                  v-model="item.radius"
                  :disabled="!upLoading"
                  :controls="false"
                  :min="0"
                  label="公里"
                  @blur="onDataToDegree(i, 'degree3')" />
                <span style="padding: 2px" />
              </el-col>
              <el-col :span="5">
                <span>公里</span>
              </el-col>
            </div>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss">
.lonlat-editor-box {
  flex: 1;
  position: relative;
  .new-data {
    position: absolute;
    top: 10px;
    right: 15px;
    z-index: 1000;
    .btn {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  }
  .el-tabs__content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 200px;
    .el-tab-pane {
      display: flex;
      flex-direction: column;
      overflow: hidden auto;
    }
  }
  .form-box {
    border: 1px solid #7f8c8d;
    margin-bottom: 10px;
    .tag-head {
      padding: 8px 10px 10px;
      box-sizing: border-box;
      font-size: 17px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      .btn {
        $size: 16px;
        width: $size;
        height: $size;
        cursor: pointer;
      }
    }
    .el-row {
      margin: 0 !important;
      .element-box {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        .input-el-box {
          display: flex;
          span {
            margin-left: 5px;
          }
        }
        .el-input-number-lonlat {
          width: 100% !important;
        }
      }
      .sea-number-input {
        margin-bottom: 10px;
      }
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>
