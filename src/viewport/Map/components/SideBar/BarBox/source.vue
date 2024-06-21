<script setup>
import { Mapbox, MapboxSwitch } from "plugins";
import { ref, onMounted } from "vue";

defineOptions({
  name: "SourceBox",
});

const drawer = ref(false);
const baseList = ref([]);
const baseId = ref(null);

function open(type = true) {
  drawer.value = type;
}

function init() {
  baseList.value = MapboxSwitch.switch.baseLayerOption.map((item) => {
    const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/im;
    const domain = item.paramsList[0].tiles[0].match(domainRegex);
    return {
      ...item,
      urltext: domain ? domain[1] : null,
    };
  });
  baseId.value = baseList.value[0].id;
}

function handleClick(data) {
  MapboxSwitch.switchLayer(data.name);
  baseId.value = data.id;
}

onMounted(() => {
  Mapbox.mapLoaded().then(() => init());
});

defineExpose({
  open,
  init,
});
</script>

<template>
  <div class="source-box">
    <el-drawer
      :append-to-body="true"
      v-model="drawer"
      direction="rtl"
      size="20%">
      <template #header="{ titleId, titleClass }">
        <div :id="titleId" :class="`${titleClass} drawer-title-text`">
          图源列表
        </div>
      </template>
      <div class="button-div-list-box">
        <div
          class="button-from"
          v-for="(item, i) in baseList"
          :key="item.id"
          @click.stop="handleClick(item, i)">
          <div
            class="button-list"
            :class="item.id === baseId ? 'selected-box' : ''">
            <img :src="item.img" :alt="item.name" class="img-box" />
            <div class="text-box">
              <span>{{ item.name }}</span>
              <span class="mini-text">数据源：{{ item.urltext }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.source-box {
  position: relative;
  :global(.drawer-title-text) {
    font-size: 17px;
    color: #bdc3c7;
  }
}
.button-div-list-box {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 0 !important;
  .button-from {
    margin-bottom: 15px;
    .button-list {
      display: flex;
      padding: 10px !important;
      box-sizing: border-box;
      font-size: 16px;
      user-select: none;
      background: rgba(0, 47, 68, 0.59);
      box-shadow: inset 0 0 33px 0 #191929;
      border-radius: 10px 10px 10px 10px;
      border: 2px solid;
      border-image: linear-gradient(
          230deg,
          rgba($color: #959595, $alpha: 0.2),
          rgba($color: #fff, $alpha: 0.5),
          rgba($color: #959595, $alpha: 0.2)
        )
        2 2;
      cursor: pointer;
      .img-box {
        width: 100px;
        margin-right: 10px;
        border-radius: 1px 1px 1px 1px;
      }
      .text-box {
        display: flex;
        flex-direction: column;
        .mini-text {
          font-size: 12px;
          color: #bdc3c7;
          margin-top: 3px;
        }
      }
    }
    .selected-box {
      background: linear-gradient(135deg, #17ead9, #6078ea);
      .text-box .mini-text {
        color: white;
      }
    }
  }
}
</style>
