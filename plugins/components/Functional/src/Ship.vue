<script>
import OwnShip from "./OwnShip.vue";
import OutShip from "./OutShip.vue";

export default {
  name: "ShipBox",
  components: { OutShip, OwnShip },
};
</script>

<template>
  <div class="ship-box">
    <el-tabs type="border-card">
      <el-tab-pane label="我的船舶" lazy>
        <own-ship />
      </el-tab-pane>
      <el-tab-pane label="外部船舶筛选" lazy>
        <out-ship />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.ship-box {
  width: 600px;
}
</style>
