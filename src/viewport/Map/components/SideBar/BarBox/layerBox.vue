<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { reqSeaData, reqAnjiData } from "./api.js";
defineOptions({
  name: "layerBox",
});

const drawer = ref(false);
const tree = ref("");
function open(type = true) {
  drawer.value = type;
}
onBeforeMount(() => {
  reqLayerData();
});
function reqLayerData() {
  Promise.all([reqSeaData(), reqAnjiData()]).then(([seaData, anjiData]) => {
    layerList[0].children = setDataLabel(seaData.data.data.rows);
    layerList[1].children = setDataLabel(anjiData.data.data.rows);
  });
}
// 处理图层数据
function setDataLabel(val) {
  return val.map((item) => {
    const arr = [];
    if (item.attributeVoList && item.attributeVoList.length) {
      item.attributeVoList.forEach((element) => {
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
function handleNodeClick(node) {
  // if (node.geom) {
  //   let _bbox = bbox(parse(node.geom));
  //   window.map.fitBounds(
  //     [
  //       [_bbox[0], _bbox[1]],
  //       [_bbox[2], _bbox[3]],
  //     ],
  //     {
  //       padding: { top: 70, bottom: 80, left: 30, right: 30 },
  //     },
  //   );
  // }
}
function handleCheckChange() {
  // MapboxLayer.clear();
  // let nodes = tree.value.getCheckedNodes().filter((item) => !item.children);
  // nodes = nodes.map((item) => {
  //   let ele = type.value.find((i) => i.code == item.typeCode);
  //   return {
  //     ...item,
  //     icon: ele.icon || "",
  //   };
  // });
  // const features = MapboxLayer.handleAllTypeLayer(nodes);
  // features.length !== 0 && MapboxLayer.render(features);
}
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
