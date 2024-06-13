<script setup>
import ComponentBox from "@/viewport/Map/ComponentBox.vue";
import { ref } from "vue";

const vif = ref(false);
const loading = ref(false);
const formData = ref({});

defineOptions({
  name: "ChannelMonitorDialog",
});

function open() {
  vif.value = true;
  loading.value = true;
}

defineExpose({
  open,
});
</script>

<template>
  <component-box
    class="ship-info-control"
    v-draggable:ship-info-container-header
    v-if="vif"
    :loading="loading"
    :zIndex="99">
    <section class="ship-info-container">
      <header class="ship-info-container-header">
        {{ formData.name || "未知区域" }}航道监控
      </header>
      <footer class="ship-info-container-footer">
        <div class="ship-info-container-footer-item">
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道全天流量: {{ formData.qtll ? `${formData.qtll}船次` : "--" }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道船舶平均船速:
              {{ formData.pjcs ? `${formData.pjcs}节` : "--" }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道实时潮位: {{ formData.sscw ? `${formData.sscw}cm` : "--" }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道最大能见度:
              {{ formData.zdnjd ? `${formData.zdnjd}cm` : "--" }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道通航效率:
              {{ formData.thxl ? `${formData.thxl}艘/小时` : "--" }}
            </el-col>
          </el-row>
        </div>
      </footer>
    </section>
  </component-box>
</template>

<style scoped lang="scss">
.ship-info-control {
  position: absolute;
  top: 15px;
  left: 12px;
  width: 340px;
  .ship-info-container {
    width: 100%;
    padding: 5px 0 0;
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 2px 10px 5px;
      border-bottom: 1px solid;
      font-size: 15px;
      border-image: linear-gradient(
          90deg,
          rgba($color: #959595, $alpha: 0.2),
          rgba($color: #fff, $alpha: 0.5),
          rgba($color: #959595, $alpha: 0.2)
        )
        1 1;
    }
    &-footer {
      width: 100%;
      border-radius: 0 0 6px 6px;
      background-color: rgba($color: #191929, $alpha: 0.8);
      overflow: hidden;
      padding: 10px 10px;
      box-sizing: border-box;
      &-item {
        display: flex;
        flex-direction: column;
        height: 100%;
        color: #fff;
        .row-text-box {
          font-size: 13px;
          line-height: 24px;
        }
        .icon {
          font-size: 18px;
          margin-bottom: 4px;
        }
        .label {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
