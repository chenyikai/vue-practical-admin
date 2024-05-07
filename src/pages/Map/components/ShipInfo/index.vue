<script>
export default {
  name: "ShipInfo",
};
</script>

<script setup>
import ComponentBox from "@/pages/Map/ComponentBox.vue";
import { shipInfoStore } from "@/store";
const ShipInfoStore = shipInfoStore();

defineOptions({
  name: "ShipInfo",
});
</script>

<template>
  <component-box
    class="ship-info-control"
    v-if="ShipInfoStore.visible"
    :zIndex="ShipInfoStore.zIndex">
    <section class="ship-info-container">
      <header class="ship-info-container-header">
        <div class="title-layout">
          <span class="ship-name">{{
            `${ShipInfoStore.shipData.cnname || ShipInfoStore.shipData.enname || ShipInfoStore.shipData.mmsi || "暂无数据"}`
          }}</span>
        </div>
        <div class="func-layout"></div>
      </header>
      <main class="ship-info-container-main"></main>
      <footer class="ship-info-container-footer"></footer>
    </section>
  </component-box>
</template>

<style scoped lang="scss">
.ship-info-control {
  position: absolute;
  top: 65px;
  right: 12px;
  width: 340px;
  .ship-info-container {
    width: 100%;
    padding: 5px;
    &-header {
      display: flex;
      flex-direction: column;
      width: 100%;
      //height: 50px;
      border-bottom: 1px solid;
      padding: 7px 13px 0;
      border-image: linear-gradient(
          90deg,
          rgba($color: #959595, $alpha: 0.2),
          rgba($color: #fff, $alpha: 0.5),
          rgba($color: #959595, $alpha: 0.2)
        )
        1 1;
    }
    &-footer {
      display: flex;
      align-items: center;
      width: 100%;
      height: 52px;
      background-color: rgba($color: #191929, $alpha: 0.8);
    }
  }
}
</style>
