<script>
export default {
  name: "PublishDialog",
};
</script>

<script setup>
import { ref, defineProps, watch } from "vue";
import useForm from "@/hooks/useForm.js";
import { nextTick } from "vue";
import useFormOption from "./options.js";
import website from "@/config/website.js";
import { detailPoiTInfo } from "@/api/data-manage/index.js";
import { validatenull } from "@/utils/validate.js";
import MapBox from "../map.vue";
import LonlatEditor from "../lonlatEditor.vue";
import PageDialog from "package/Dialog/src/index.vue";
import { mapStore } from "@/store/index.js";
import { stringify, parse } from "wellknown";
import { ElMessage } from "element-plus";
import { circle, lineString, bbox } from "@turf/turf";
import { getPoiRTypeAttributeByTypeCode } from "@/api/utils/index.js";
import { randomLenNum } from "@/utils/util.js";
import PageButton from "package/Button/src/index.vue";
import { userStore } from "@/store/index.js";
const source = userStore().$state.userInfo.source === 1; // 是否为超级管理员
const MapStore = mapStore();
const lonlatEditor = ref(null);
const { formOption } = useFormOption();

const emits = defineEmits({
  [website.pageStatus.PUBLISH]: null,
  [website.pageStatus.REVPUBLISH]: null,
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
} = useForm();

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
  detailFunc.value = detailPoiTInfo;
  dialog.value.open();
  nextTick().then(() => {
    formOption.disabled = isDetail.value;
    formOption.column[2].dicData = propData.hqDicData;
    formOption.column[3].dicData = propData.lxDicData;
    switch (status) {
      case website.pageStatus.PUBLISH:
        title.value = "申请发布";
        break;
      case website.pageStatus.REVPUBLISH:
        title.value = "发布审核";
        formOption.disabled = true;
        lonlatEditor.value.validate(false);
        break;
      default:
        title.value = "异常开启";
        break;
    }
    map.value.initMap(() => {
      setData(status, data).then((data) => jsonDataToObject(data));
    });
    form.value.clearValidate();
  });
}

function onTypeCodeChange(value) {
  // 根据类型解析并添加formOption字段
  closeTypeCode();
  if (!validatenull(value)) {
    getPoiRTypeAttributeByTypeCode({ typeCode: value, source: 1 }).then(
      ({ data }) => {
        data.data.map((item) => {
          if (item.attributeType === "string") {
            let n = {
              label: item.attributeName,
              prop: item.attributeCode,
              span: 24,
              slotCustom: true,
            };
            if (item.forcedInput === 1)
              n.rules = [
                { required: true, message: "不能为空", trigger: "blur" },
              ];
            formOption.column.push(n);
          } else if (item.attributeType === "number") {
            let n = {
              label: item.attributeName,
              prop: item.attributeCode,
              span: 24,
              type: "number",
              slotCustom: true,
            };
            if (item.forcedInput === 1)
              n.rules = [
                { required: true, message: "不能为空", trigger: "blur" },
              ];
            formOption.column.push(n);
          } else if (item.attributeType === "date") {
            let n = {
              label: item.attributeName,
              prop: item.attributeCode,
              span: 24,
              type: "datetime",
              format: "YYYY-MM-DD HH:mm:ss",
              valueFormat: "YYYY-MM-DD HH:mm:ss",
              slotCustom: true,
            };
            if (item.forcedInput === 1)
              n.rules = [
                { required: true, message: "不能为空", trigger: "blur" },
              ];
            formOption.column.push(n);
          }
        });
      },
    );
  }
}

function closeTypeCode() {
  // 清理添加的自定义字段
  formOption.column = formOption.column.filter(
    (item) => item.slotCustom !== true,
  );
}

function jsonDataToObject() {
  // 处理接口地图数据为本地地图数据
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
  // delete formData.value.extension;
  // delete formData.value.geom;
  // delete formData.value.geomType;
  // delete formData.value.radius;
}

const publishStatus = ref(null); // 发布选择 1：通过 2：驳回
function onDialogSubmit(select) {
  if (graphicalCreate().id !== null) {
    publishStatus.value = select;
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
  lonlatEditor.value.validate(false);

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

  if (source && formStatus.value === website.pageStatus.REVPUBLISH) {
    // 超管审核和评论
    formData.value.feedbackStatus = publishStatus.value === 1 ? 3 : 6;
  }

  emits(
    formStatus.value,
    { ...formData.value, extension, geom, geomType, radius },
    (isClose = false) => {
      done();
      dialog.value.onDone(isClose);
    },
  );
}

function onClose() {
  lonlatEditor.value.closeDataList();
  MapStore.setDrawData([{ id: null }]);
  closeTypeCode();
  map.value.closeMap();
  form.value.resetForm(true);
  formData.value = {};
  formStatus.value = null;
}

function handleGales(event) {
  const keyName = new Date().getTime() + "-" + randomLenNum(6, false);
  closeGales();
  lonlatEditor.value.validate(true);
  switch (event) {
    case 1:
      lonlatEditor.value.closeDataList("customPoint");
      map.value.getMapboxDrow().draw.changeMode("draw_custom_point", {
        ...map.value.customPoint,
        "icon-image": formData.value.icon || "point",
        name: formData.value.name || formData.value.enName || `点${keyName}`, //点位名称
      });
      break;
    case 2:
      lonlatEditor.value.closeDataList("lineString");
      map.value.getMapboxDrow().draw.changeMode("draw_line_string", {
        ...map.value.lineString,
        name: formData.value.name || formData.value.enName || `线${keyName}`, //文本内容
      });
      break;
    case 3:
      lonlatEditor.value.closeDataList("polygon");
      map.value.getMapboxDrow().draw.changeMode("draw_polygon", {
        ...map.value.polygon,
        name: formData.value.name || formData.value.enName || `面${keyName}`, //文本内容
      });
      break;
    case 4:
      lonlatEditor.value.closeDataList("circle");
      map.value.getMapboxDrow().draw.changeMode("draw_circle", {
        ...map.value.circle,
        name: formData.value.name || formData.value.enName || `圆${keyName}`, //文本内容
      });
      break;
    default:
      break;
  }
}

function updateGales(features, event) {
  const keyName = new Date().getTime() + "-" + randomLenNum(6, false);
  switch (event) {
    case "customPoint":
      features.id = `点${keyName}`;
      features.properties = {
        ...map.value.customPoint,
        "icon-image": formData.value.icon || "point",
        name: formData.value.name || formData.value.enName || `点${keyName}`,
      };
      break;
    case "lineString":
      features.id = `线${keyName}`;
      features.properties = {
        ...map.value.lineString,
        name: formData.value.name || formData.value.enName || `线${keyName}`, //文本内容
      };
      break;
    case "polygon":
      features.id = `面${keyName}`;
      features.properties = {
        ...map.value.polygon,
        name: formData.value.name || formData.value.enName || `面${keyName}`, //文本内容
      };
      break;
    case "circle":
      features.id = `圆${keyName}`;
      features.properties = {
        ...map.value.circle,
        ...features.properties,
        name: formData.value.name || formData.value.enName || `圆${keyName}`, //文本内容
      };
      break;
  }
  features.type = "Feature";
  features.properties.featureType = event;
  map.value.getMapboxDrow().draw.changeMode("simple_select");
  MapStore.setDrawData([features]);
  map.value.getMapboxDrow().draw.add(features);
  map.value.getMapboxDrow().draw.render();
}

function closeGales() {
  // 清除并关闭标绘状态
  if (graphicalCreate().id) {
    map.value.getMapboxDrow().draw.delete(graphicalCreate().id).getAll();
    MapStore.setDrawData([{ id: null }]);
  }
  lonlatEditor.value.closeDataList();
  map.value.getMapboxDrow().draw.changeMode("simple_select");
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
  lonlatEditor.value.closeDataList();
  lonlatEditor.value.validate(formStatus.value === website.pageStatus.PUBLISH);
  switch (graphicalCreate().value.properties.featureType) {
    case "customPoint":
      lonlatEditor.value.onAreaToData(
        graphicalCreate().value.geometry.coordinates,
        graphicalCreate().value.properties.featureType,
      );
      break;
    case "lineString":
      lonlatEditor.value.onAreaToData(
        graphicalCreate().value.geometry.coordinates,
        graphicalCreate().value.properties.featureType,
      );
      break;
    case "polygon":
      lonlatEditor.value.onAreaToData(
        graphicalCreate().value.geometry.coordinates,
        graphicalCreate().value.properties.featureType,
      );
      break;
    case "circle":
      lonlatEditor.value.onAreaToData(
        graphicalCreate().value.properties,
        graphicalCreate().value.properties.featureType,
      );
      break;
    default:
      break;
  }
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

function handleChangeDraw(geometry, coordinates, radius, type) {
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
        (graphicalCreate().value.properties
          ? graphicalCreate().value.properties.name
          : "未知标签"),
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
  } else if (MapFeaturesIndex === -1 && type) {
    updateGales(features, type);
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
    onTypeCodeChange(newValue);
    getIconData(() => {
      handleChangeDraw();
    });
  },
);

watch(
  () => graphicalCreate().value,
  () => {
    selectDrow();
  },
  { deep: true },
);

function selectDrow() {
  // 触发地图活跃模式
  if (
    graphicalCreate().id &&
    !validatenull(formData.value) &&
    formStatus.value === website.pageStatus.PUBLISH
  )
    map.value.getMapboxDrow().selectGraphical(graphicalCreate().id);
}

defineExpose({
  open,
});
</script>

<template>
  <page-dialog
    style="margin-top: 10vh"
    :title="title"
    width="1200"
    ref="dialog"
    :submitButtonName="
      formStatus === website.pageStatus.PUBLISH ? '申请发布' : '通过并发布'
    "
    :rejectButtonName="formStatus === website.pageStatus.PUBLISH ? '' : '驳回'"
    @submit="onDialogSubmit(1)"
    @reject="onDialogSubmit(2)"
    @close="onClose"
    :loading="loading"
    :show-footer="!isDetail">
    <div
      class="feedback-content-box"
      v-if="!source && formData.feedbackStatus === 6">
      <el-alert
        title="审核回复"
        :description="formData.feedbackContent"
        type="warning"
        show-icon
        :closable="false" />
    </div>
    <div class="form-box">
      <div class="left-form">
        <avue-form
          :key="key"
          ref="form"
          :option="formOption"
          v-model="formData"
          @submit="onFormSubmit" />
        <div class="map-editor-box">
          <div
            v-if="formStatus === website.pageStatus.PUBLISH"
            class="button-group">
            <page-button
              class="btn"
              icon="mapDraw-dian"
              label="绘点"
              @click.stop="handleGales(1)" />
            <page-button
              class="btn"
              icon="mapDraw-xian"
              label="绘线"
              @click.stop="handleGales(2)" />
            <page-button
              class="btn"
              icon="mapDraw-mian"
              label="绘面"
              size="15"
              @click.stop="handleGales(3)" />
            <page-button
              class="btn"
              icon="mapDraw-yuan"
              label="绘圆"
              @click.stop="handleGales(4)" />
            <page-button
              class="btn"
              icon="mapDraw-closeDraw"
              label="清除"
              @click.stop="closeGales" />
          </div>
          <LonlatEditor ref="lonlatEditor" @dataReturn="handleChangeDraw" />
        </div>
      </div>

      <div class="map-box">
        <MapBox ref="map" @draw-data="onDrawData" @draw-click="selectDrow" />
      </div>
    </div>

    <div class="feedback-content-form-box" v-if="source">
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
    width: 670px;
    height: 547px;
    margin-right: 15px;
    box-sizing: border-box;
  }
  .left-form {
    display: flex;
    flex-direction: column;
    width: 465px;
    height: 547px;
    overflow: hidden auto;
    .map-editor-box {
      padding: 1px 0 0 15px;
      box-sizing: border-box;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      .button-group {
        display: flex;
        align-content: flex-start;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        flex-shrink: 0;
        margin-bottom: 15px;
        .btn {
          margin: 0;
        }
      }
    }
  }
}
.feedback-content-box {
  padding: 0 15px 15px;
}
.feedback-content-form-box {
  padding: 15px 12px 3px;
}
</style>
