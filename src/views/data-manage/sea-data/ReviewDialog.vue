<script>
export default {
  name: "ReviewDialog",
};
</script>

<script setup>
import { ref, defineProps, watch } from "vue";
import useForm from "@/hooks/useForm.js";
import { nextTick } from "vue";
import { formOption } from "./options.js";
import website from "@/config/website.js";
import {
  detailFeedbackPoiTInfo,
  detailPoiTInfo,
} from "@/api/data-manage/index.js";
import { validatenull } from "@/utils/validate.js";
import MapBox from "../map.vue";
import LonlatEditor from "../lonlatEditor.vue";
import PageDialog from "package/Dialog/src/index.vue";
import { mapStore } from "@/store/index.js";
import { stringify, parse } from "wellknown";
import { ElMessage } from "element-plus";
import { circle, lineString, bbox } from "@turf/turf";
import { getPoiRTypeAttributeByTypeCode } from "@/api/utils/index.js";
const MapStore = mapStore();
const newLonlatEditor = ref(null);
const oldLonlatEditor = ref(null);
const submitButtonName = ref("");

const emits = defineEmits({
  [website.pageStatus.REVIEW]: null,
});

const {
  key,
  form,
  loading,
  formStatus,
  dialog,
  formData,
  isDetail,
  detailFunc,
  setData,
  forceUpdate,
} = useForm();
const oldData = ref({});
const oldForm = ref(null);
const oldFormOption = { ...formOption, disabled: true };

const propData = defineProps({
  hqDicData: {
    type: Array,
    required: [],
  },
  lxDicData: {
    type: Array,
    required: [],
  },
});

const map = ref(null);
const title = ref("");

function open(status, data = {}) {
  detailFunc.value = detailFeedbackPoiTInfo;
  dialog.value.open();
  nextTick().then(() => {
    formOption.disabled = true;
    formOption.column[2].dicData = propData.hqDicData;
    formOption.column[3].dicData = propData.lxDicData;
    oldFormOption.column[2].dicData = propData.hqDicData;
    oldFormOption.column[3].dicData = propData.lxDicData;
    newLonlatEditor.value.validate(false);
    oldLonlatEditor.value.validate(false);
    switch (status) {
      case website.pageStatus.REVIEW:
        title.value = "数据审核";
        break;
      default:
        title.value = "异常开启";
        submitButtonName.value = "";
        break;
    }
    map.value.initMap(() => {
      getOldData(data);
      setData(status, data).then(() => jsonDataToObject());
    });
    form.value.clearValidate();
  });
}

function getOldData(data) {
  // 创建反馈前数据
  detailPoiTInfo(data.id).then(({ data }) => {
    // 将接口自定义字段json格式转对象并写入formData
    let extension;
    if (!validatenull(data.data.extension)) {
      extension = JSON.parse(data.data.extension);
    }
    oldData.value = {
      ...data.data,
      ...extension,
    };
    jsonOldDataToObject();
    forceUpdate();
  });
}

function onTypeCodeChange(value, type) {
  // 根据类型解析并添加formOption字段
  closeTypeCode();
  if (!validatenull(value)) {
    getPoiRTypeAttributeByTypeCode({ typeCode: value, source: 1 }).then(
      ({ data }) => {
        let option = [];
        data.data.map((item) => {
          if (item.attributeType === "string") {
            let n = {
              label: item.attributeName,
              prop: item.attributeCode,
              span: 24,
              slotCustom: true,
              placeholder: " ",
            };
            if (item.forcedInput === 1)
              n.rules = [
                { required: true, message: "不能为空", trigger: "blur" },
              ];
            option.push(n);
          } else if (item.attributeType === "number") {
            let n = {
              label: item.attributeName,
              prop: item.attributeCode,
              span: 24,
              type: "number",
              slotCustom: true,
              placeholder: " ",
            };
            if (item.forcedInput === 1)
              n.rules = [
                { required: true, message: "不能为空", trigger: "blur" },
              ];
            option.push(n);
          } else if (item.attributeType === "date") {
            let n = {
              label: item.attributeName,
              prop: item.attributeCode,
              span: 24,
              type: "datetime",
              format: "YYYY-MM-DD HH:mm:ss",
              valueFormat: "YYYY-MM-DD HH:mm:ss",
              slotCustom: true,
              placeholder: " ",
            };
            if (item.forcedInput === 1)
              n.rules = [
                { required: true, message: "不能为空", trigger: "blur" },
              ];
            option.push(n);
          }
        });
        if (type === "formData") {
          formOption.column = [...formOption.column, ...option];
        } else if (type === "oldData") {
          oldFormOption.column = [...oldFormOption.column, ...option];
        }
        forceUpdate();
      },
    );
  }
}

function closeTypeCode() {
  // 清理添加的自定义字段
  formOption.column = formOption.column.filter(
    (item) => item.slotCustom !== true,
  );
  oldFormOption.column = oldFormOption.column.filter(
    (item) => item.slotCustom !== true,
  );
  forceUpdate();
}

function jsonDataToObject() {
  // 处理提交的反馈接口地图数据为本地地图数据 并绘制至地图
  getIconData(() => {
    if (!validatenull(formData.value.geom)) {
      let geometry = parse(formData.value.geom);
      let feature = {
        type: "Feature",
        id: `polt-editor-${formData.value.id}`,
        properties: {},
        geometry,
      };
      switch (formData.value.geomType) {
        case 1:
          feature.properties = {
            ...map.value.customPoint,
            "icon-image": formData.value.icon || "point",
            name: formData.value.name,
          };
          break;
        case 2:
          feature.properties = {
            ...map.value.lineString,
            name: formData.value.name,
          };
          break;
        case 3:
          feature.properties = {
            ...map.value.polygon,
            name: formData.value.name,
          };
          break;
        case 4:
          feature.properties = {
            ...map.value.circle,
            name: formData.value.name,
          };
          break;
      }
      if (formData.value.geomType === 4) {
        const e = circle(geometry.coordinates, formData.value.radius, {
          units: "kilometers",
        });
        feature.geometry = e.geometry;
        feature.properties.center = geometry.coordinates;
        feature.properties.radius = formData.value.radius;
      }
      const featureIds = map.value.getMapboxDrow().draw.add(feature);
      map.value
        .getMapboxDrow()
        .draw.getAll()
        .features.map((item) => {
          if (featureIds[0] === item.id) {
            MapStore.setDrawData([item]);
            onDrawData();
            flyToData();
          }
        });
    }
  });

  // 将接口自定义字段json格式转对象并写入formData
  let extension;
  if (!validatenull(formData.value.extension)) {
    extension = JSON.parse(formData.value.extension);
  }
  formData.value = {
    ...formData.value,
    ...extension,
  };
}

function jsonOldDataToObject() {
  // 处理提交的反馈接口地图数据为本地地图数据
  if (!validatenull(oldData.value.geom)) {
    let geometry = parse(oldData.value.geom);
    let feature = {
      type: "Feature",
      id: `polt-editor-${oldData.value.id}`,
      properties: {},
      geometry,
    };
    switch (oldData.value.geomType) {
      case 1:
        feature.properties = {
          ...map.value.customPoint,
          "icon-image": formData.value.icon || "point",
          name: oldData.value.name,
        };
        break;
      case 2:
        feature.properties = {
          ...map.value.lineString,
          name: oldData.value.name,
        };
        break;
      case 3:
        feature.properties = {
          ...map.value.polygon,
          name: oldData.value.name,
        };
        break;
      case 4:
        feature.properties = {
          ...map.value.circle,
          name: oldData.value.name,
        };
        break;
    }
    if (oldData.value.geomType === 4) {
      const e = circle(geometry.coordinates, oldData.value.radius, {
        units: "kilometers",
      });
      feature.geometry = e.geometry;
      feature.properties.center = geometry.coordinates;
      feature.properties.radius = oldData.value.radius;
    }
    onOldDrawData(feature);
  }
}

const feedbackStatus = ref(null); // 审核选择 2：驳回  3：通过
function onDialogSubmit(select) {
  if (graphicalCreate().id !== null) {
    feedbackStatus.value = select;
    form.value.submit();
  } else {
    ElMessage({
      message: "请在地图上绘制数据",
      type: "warning",
    });
  }
}

function onFormSubmit(data, done) {
  dialog.value.onLoad();

  // 格式化补充字段
  let extension = {};
  let geom = null;
  let geomType = null;
  let radius = null;
  const slotCustomKey = formOption.column
    .filter((item) => item.slotCustom === true)
    .map((item) => item.prop);
  slotCustomKey.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(formData.value, key)) {
      extension[key] = formData.value[key];
    }
  });
  extension = JSON.stringify(extension);
  switch (graphicalCreate().value.properties.featureType) {
    case "customPoint":
      geom = stringify(graphicalCreate().value.geometry);
      geomType = 1;
      break;
    case "lineString":
      geom = stringify(graphicalCreate().value.geometry);
      geomType = 2;
      break;
    case "polygon":
      geom = stringify(graphicalCreate().value.geometry);
      geomType = 3;
      break;
    case "circle":
      geom = graphicalCreate().value.properties.center;
      geom = `POINT (${geom[0]} ${geom[1]})`;
      radius = graphicalCreate().value.properties.radius;
      geomType = 4;
      break;
    default:
      break;
  }

  emits(
    formStatus.value,
    {
      ...formData.value,
      extension,
      geom,
      geomType,
      radius,
      feedbackStatus: feedbackStatus.value,
    },
    (isClose = false) => {
      done();
      dialog.value.onDone(isClose);
    },
  );
}

function onClose() {
  newLonlatEditor.value.closeDataList();
  newLonlatEditor.value.validate(false);
  oldLonlatEditor.value.closeDataList();
  oldLonlatEditor.value.validate(false);
  MapStore.setDrawData([{ id: null }]);
  closeTypeCode();
  map.value.closeMap();
  form.value.resetForm(true);
  oldData.value = {};
}

function graphicalCreate() {
  // 获取绘制图形的坐标
  return {
    id: MapStore.drawData[0] ? MapStore.drawData[0].id : null,
    value: MapStore.drawData[0] || [],
  };
}

function onDrawData() {
  // 绘制事件回调
  newLonlatEditor.value.closeDataList();
  switch (graphicalCreate().value.properties.featureType) {
    case "customPoint":
      newLonlatEditor.value.onAreaToData(
        graphicalCreate().value.geometry.coordinates,
        graphicalCreate().value.properties.featureType,
      );
      break;
    case "lineString":
      newLonlatEditor.value.onAreaToData(
        graphicalCreate().value.geometry.coordinates,
        graphicalCreate().value.properties.featureType,
      );
      break;
    case "polygon":
      newLonlatEditor.value.onAreaToData(
        graphicalCreate().value.geometry.coordinates,
        graphicalCreate().value.properties.featureType,
      );
      break;
    case "circle":
      newLonlatEditor.value.onAreaToData(
        graphicalCreate().value.properties,
        graphicalCreate().value.properties.featureType,
      );
      break;
    default:
      break;
  }
}

function onOldDrawData(feature) {
  // 反馈前编辑器数据覆写并锁定
  oldLonlatEditor.value.closeDataList();
  switch (feature.properties.featureType) {
    case "customPoint":
      oldLonlatEditor.value.onAreaToData(
        feature.geometry.coordinates,
        feature.properties.featureType,
      );
      break;
    case "lineString":
      oldLonlatEditor.value.onAreaToData(
        feature.geometry.coordinates,
        feature.properties.featureType,
      );
      break;
    case "polygon":
      oldLonlatEditor.value.onAreaToData(
        feature.geometry.coordinates,
        feature.properties.featureType,
      );
      break;
    case "circle":
      oldLonlatEditor.value.onAreaToData(
        feature.properties,
        feature.properties.featureType,
      );
      break;
    default:
      break;
  }
  oldLonlatEditor.value.validate();
}

function flyToData() {
  // 地图飞入动画
  if (
    graphicalCreate().value.properties.featureType === "polygon" ||
    graphicalCreate().value.properties.featureType === "circle"
  ) {
    const _bbox = bbox(
      lineString(
        graphicalCreate().value.geometry.coordinates[0].map((item) => [
          item[0],
          item[1],
        ]),
      ),
    );
    map.value.getMapboxDrow().fly(_bbox, 2);
  } else if (graphicalCreate().value.properties.featureType === "lineString") {
    const _bbox = bbox(
      lineString(
        graphicalCreate().value.geometry.coordinates.map((item) => [
          item[0],
          item[1],
        ]),
      ),
    );
    map.value.getMapboxDrow().fly(_bbox, 2);
  } else {
    map.value
      .getMapboxDrow()
      .fly(graphicalCreate().value.geometry.coordinates, 1);
  }
}

function handleChangeDraw(geometry, coordinates, radius) {
  // 编辑器修改地图绘制 循环覆写地图数据
  let Map_Draw_List = map.value.getMapboxDrow().draw.getAll();
  let features = {
    ...graphicalCreate().value,
    geometry: geometry ? geometry : graphicalCreate().value.geometry,
    properties: {
      ...graphicalCreate().value.properties,
      "icon-image": formData.value.icon || "point",
      name:
        formData.value.name ||
        formData.value.enName ||
        graphicalCreate().value.properties
          ? graphicalCreate().value.properties.name
          : "未知标签",
    },
  };
  if (!validatenull(radius)) {
    features.properties.center = coordinates[0];
    features.properties.radius = radius;
  }
  const MapFeaturesIndex = Map_Draw_List.features.findIndex(
    (item) => item.id === graphicalCreate().id,
  );
  if (MapFeaturesIndex !== -1) {
    Map_Draw_List.features[MapFeaturesIndex] = features;
    MapStore.setDrawData([features]);
    map.value.getMapboxDrow().draw.set(Map_Draw_List);
    map.value.getMapboxDrow().draw.render();
  }
}

function getIconData(callback) {
  // 根据类型解析并添加icon
  propData.lxDicData.forEach((item) => {
    if (item.code === formData.value.typeCode) {
      formData.value.icon = item.icon;
      callback(item.icon);
    }
  });
}

watch([() => formData.value.name, () => formData.value.enName], () => {
  if (map.value.getMapboxDrow() && graphicalCreate().id) handleChangeDraw();
});

watch(
  () => formData.value.typeCode,
  (newValue) => {
    onTypeCodeChange(newValue, "formData");
    getIconData(() => {
      handleChangeDraw();
    });
  },
);

watch(
  () => oldData.value.typeCode,
  (newValue) => {
    onTypeCodeChange(newValue, "oldData");
  },
);

defineExpose({
  open,
});
</script>

<template>
  <page-dialog
    style="margin-top: 10vh"
    :title="title"
    width="1690"
    ref="dialog"
    submitButtonName="通过并合并"
    rejectButtonName="驳回"
    @submit="onDialogSubmit(3)"
    @reject="onDialogSubmit(2)"
    @close="onClose"
    :loading="loading"
    :show-footer="!isDetail">
    <div class="form-box">
      <div class="left-form">
        <div class="form-text-box">反馈前</div>
        <div class="left-form-box">
          <avue-form
            :key="key"
            ref="oldForm"
            :option="oldFormOption"
            v-model="oldData"
            @submit="onFormSubmit" />
          <div class="map-editor-box">
            <LonlatEditor ref="oldLonlatEditor" />
          </div>
        </div>
      </div>

      <div class="left-form">
        <div class="form-text-box">提交的反馈</div>
        <div class="left-form-box">
          <avue-form
            :key="key"
            ref="form"
            :option="formOption"
            v-model="formData"
            @submit="onFormSubmit" />
          <div class="map-editor-box">
            <LonlatEditor
              ref="newLonlatEditor"
              @dataReturn="handleChangeDraw" />
          </div>
        </div>
      </div>

      <div class="map-box">
        <MapBox ref="map" @draw-data="onDrawData" />
      </div>
    </div>

    <div class="feedback-content-box">
      <el-input
        v-model="formData.feedbackContent"
        style="width: 100%"
        :rows="4"
        :disabled="loading"
        resize="none"
        maxlength="100"
        type="textarea"
        placeholder="在此输入审核意见" />
    </div>
  </page-dialog>
</template>

<style scoped lang="scss">
.form-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .map-box {
    width: 660px;
    height: 530px;
    margin-right: 15px;
    box-sizing: border-box;
    position: relative;

    .button-group {
      z-index: 9999;
      position: absolute;
      left: 10px;
      top: 10px;
      display: flex;
      align-content: flex-start;
      gap: 12px;
      flex-shrink: 0;
      margin-bottom: 15px;

      .btn {
        margin: 0;
      }
    }
  }

  .left-form {
    display: flex;
    flex-direction: column;
    width: 465px;
    height: 530px;
    position: relative;
    overflow: hidden;

    .form-text-box {
      position: relative;
      margin-bottom: 10px;
    }

    .left-form-box {
      display: flex;
      flex-direction: column;
      overflow: hidden auto;

      .map-editor-box {
        padding: 1px 0 0 15px;
        box-sizing: border-box;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
      }
    }
  }
}
.feedback-content-box {
  padding: 15px 12px 3px;
}
</style>
