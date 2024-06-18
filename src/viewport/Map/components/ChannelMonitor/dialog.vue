<script setup>
import ComponentBox from "@/viewport/Map/ComponentBox.vue";
import { ref } from "vue";
import { getDetailByFenceId } from "@/api/map/ptfence.js";
import SvgIcon from "package/SvgIcon/src/index.vue";

const vif = ref(false);
const loading = ref(true);
const formData = ref({});

defineOptions({
  name: "ChannelMonitorDialog",
});

function open(id, name) {
  vif.value = true;
  loading.value = true;
  getDetailByFenceId({ fenceId: id }).then(({ data }) => {
    const allNum = data.data.inNum + data.data.outNum;
    const average = (allNum / new Date().getHours()).toFixed(0);
    formData.value = {
      ...data.data,
      allNum,
      average,
      name,
    };
    loading.value = false;
  });
}

function handleClose() {
  vif.value = false;
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
        <svg-icon class="btn" :name="'stop'" @click.stop="handleClose" />
      </header>
      <footer class="ship-info-container-footer">
        <div class="ship-info-container-footer-item">
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道全天流量:
              <span>{{
                formData.allNum ? `${formData.allNum} 船次` : "--"
              }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道船舶平均船速:
              <span>{{ formData.speed ? `${formData.speed} 节` : "--" }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道实时潮位:
              <span>{{
                formData.height ? `${formData.height} cm` : "--"
              }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道最大能见度:
              <span>{{
                formData.visibility ? `${formData.visibility} m` : "--"
              }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="row-text-box">
              航道通航效率:
              <span>{{
                formData.average ? `${formData.average} 艘/小时` : "--"
              }}</span>
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
      position: relative;
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
      .btn {
        position: absolute;
        right: 7px;
        top: 1px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        background: white;
        border-radius: 50px;
      }
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
          display: flex;
          justify-content: space-between;
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
