<script setup>
import { onMounted, ref } from "vue";
import { getTeamAndShipList } from "@/api/map/ship.js";
import { flattenDeep, uniq } from "lodash";
import { Mapbox } from "plugins/index.js";

defineOptions({
  name: "ShipBox",
});

const drawer = ref(false);
const dataList = ref([]);
const shipNbList = ref([]);
const elTreeRef = ref();

function init() {
  let colors = [];
  getTeamAndShipList({}).then(({ data }) => {
    dataList.value = [{ name: "内部船舶", id: "root", children: data.data }];
    dataList.value[0].children.forEach((res) => {
      if (res.color && res.shipInfos && res.shipInfos.length > 0) {
        res.shipInfos.forEach((ship) => {
          ship.color = res.color;
          ship.teamName = res.name;
          ship.name = ship.shipName;
          colors.push(res.color);
        });
        res.children = res.shipInfos;
        delete res.shipInfos;
      }
    });
    colors = uniq(colors);
    // console.log(colors);
  });
}

function open(type = true) {
  drawer.value = type;
}

function handleNodeCheck(data, node) {
  const nodeList = node.checkedNodes.filter((node) => node.id !== "root");
  let datas = nodeList.map((item) => item.children);
  shipNbList.value = flattenDeep(datas).filter((node) => node);
  console.log(shipNbList.value);
}

onMounted(() => {
  Mapbox.mapLoaded().then(() => init());
});

defineExpose({
  open,
});
</script>

<template>
  <div class="ship-box">
    <el-drawer
      class="ship-drawer-box"
      :append-to-body="true"
      v-model="drawer"
      direction="rtl"
      size="20%">
      <template #header="{ titleId, titleClass }">
        <div :id="titleId" :class="`${titleClass} drawer-title-text`">
          船舶列表
        </div>
      </template>
      <div class="tree-box">
        <el-tree
          ref="elTreeRef"
          :data="dataList"
          :props="{
            label: 'name',
            children: 'children',
          }"
          node-key="id"
          show-checkbox
          default-expand-all
          @check="handleNodeCheck" />
      </div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.ship-box {
  position: relative;
  ::v-global(.drawer-title-text) {
    font-size: 17px;
    color: #bdc3c7;
  }
  .ship-drawer-box {
    ::v-global(.el-drawer__body) {
      padding: 0 15px;
    }
  }
}
</style>
