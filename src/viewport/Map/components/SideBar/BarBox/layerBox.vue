<script setup>
import { ref, reactive, onBeforeMount, onMounted } from "vue";
import { reqSeaData, reqAnJiData, reqSeaType, reqAnjiType } from "./api.js";
import { parse } from "wellknown";
import { bbox } from "@turf/turf";
import { MapboxLayer } from "plugins/index.js";
defineOptions({
  name: "layerBox",
});

const drawer = ref(false);
let type = ref([]);
let allData = ref([]);
const tree = ref("");
// 图层数据
let defaultCheckKey = ref([]);
const layerList = reactive([
  {
    label: "岸基图层",
    id: "001",
    children: [],
  },
  {
    label: "海上图层",
    id: "002",
    children: [],
  },
]);

onBeforeMount(() => {
  reqLayerData();
});

onMounted(() => {});

function open(type = true) {
  drawer.value = type;
}

// 接口请求图层数据
function reqLayerData() {
  Promise.all([reqSeaData(), reqAnJiData(), reqSeaType(), reqAnjiType()]).then(
    ([seaData, anjiData, seaType, anJiType]) => {
      layerList[0].children = setDataLabel(seaData.data.data);
      layerList[1].children = setDataLabel(anjiData.data.data);
      type.value = [...seaType.data.data.rows, ...anJiType.data.data.rows];

      // 获取所有图层的数据并渲染
      allData.value = [...seaData.data.data, ...anjiData.data.data]
        .map((item) => {
          return item.poiTInfoList || item.shorePoiTInfoList || [];
        })
        .flat();
      defaultCheckKey.value = allData.value.map((item) => item.id);
      renderLayer(allData.value);
    },
  );
}
// 处理图层数据
function setDataLabel(val) {
  return val.map((item) => {
    const arr = [];
    if (item.poiTInfoList && item.poiTInfoList.length) {
      item.poiTInfoList.forEach((element) => {
        arr.push({ id: element.id, label: element.name, ...element });
      });
    }
    if (item.shorePoiTInfoList && item.shorePoiTInfoList.length) {
      item.shorePoiTInfoList.forEach((element) => {
        arr.push({ id: element.id, label: element.name, ...element });
      });
    }
    return {
      id: item.id,
      label: item.name,
      children: arr,
      ...item,
    };
  });
}

// 定位
function handleNodeClick(node) {
  if (node.geom) {
    let _bbox = bbox(parse(node.geom));
    window.map.fitBounds(
      [
        [_bbox[0], _bbox[1]],
        [_bbox[2], _bbox[3]],
      ],
      {
        padding: { top: 70, bottom: 80, left: 30, right: 30 },
      },
    );
  }
}
// 勾选图层的回调
function handleCheckChange(data) {
  const nodes = tree.value.getCheckedKeys();
  if (nodes.includes(data.id)) {
    handleShowId(data);
  } else {
    handleHideId(data);
  }
}
function handleShowId(data) {
  if (data.children && data.children.length) {
    data.children.map((item) => {
      if (item.children && item.children.length) {
        handleShowId(item);
      } else if (item.geom) {
        MapboxLayer.showById(item.id);
      }
    });
  } else if (data.id && !data.children && data.geom) {
    MapboxLayer.showById(data.id);
  }
}
function handleHideId(data) {
  if (data.children && data.children.length) {
    data.children.map((item) => {
      if (item.children && item.children.length) {
        handleHideId(item);
      } else if (item.geom) {
        MapboxLayer.hideById(item.id);
      }
    });
  } else if (data.id && !data.children && data.geom) {
    MapboxLayer.hideById(data.id);
  }
}
// 渲染图层
function renderLayer(val) {
  const features = MapboxLayer.handleAllTypeLayer(val);
  features.length !== 0 && MapboxLayer.render(features);
}
// 暴露open方法
defineExpose({
  open,
});
</script>

<template>
  <div class="layerBox">
    <el-drawer
      :append-to-body="true"
      v-model="drawer"
      direction="rtl"
      size="20%">
      <template #header="{ titleId, titleClass }">
        <div :id="titleId" :class="`${titleClass} drawer-title-text`">
          图层管理
        </div>
      </template>
      <template #default>
        <el-tree
          ref="tree"
          style="margin-top: 5px"
          :data="layerList"
          :default-expanded-keys="['001', '002']"
          :default-checked-keys="defaultCheckKey"
          node-key="id"
          show-checkbox
          @node-click="handleNodeClick"
          @check="handleCheckChange"
      /></template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.layerBox {
  position: relative;
  ::v-global(.drawer-title-text) {
    font-size: 17px;
    color: #bdc3c7;
  }
}
</style>
