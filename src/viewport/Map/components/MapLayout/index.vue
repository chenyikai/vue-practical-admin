<script>
export default {
  name: "MapLayout",
};
</script>

<script setup>
import { ref, onMounted, onBeforeMount, onBeforeUnmount, computed } from "vue";
import moment from "moment";
import UserInfo from "../UserInfo/index.vue";

defineOptions({
  name: "MapLayout",
});

const props = defineProps({
  title: {
    type: String,
    default: "浙江某某船务有限公司",
  },
});

const titleRef = ref({});
const headerRef = ref({});
const titleLayout = ref({});
const nowDate = ref("");
const nowTime = ref("");
const weekArr = [
  "星期天",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];
const arrowLength = computed(() => 16 - props.title.length);
let timer = null;

onBeforeMount(() => {
  timer = setInterval(() => {
    const time = new Date();
    nowDate.value = `${moment(time).format("YYYY / MM / DD")} ${weekArr[time.getDay()]}`;
    nowTime.value = moment(time).format("HH:mm:ss");
  }, 1000);
});

onBeforeUnmount(() => {
  timer && clearInterval(timer);
  timer = null;
});

onMounted(() => {
  setTimeout(() => {
    const height = headerRef.value.offsetHeight;
    const root = document.documentElement;
    root.style.setProperty("--header-height", height + "px");
  }, 0);
});
</script>

<template>
  <section class="map-page-container">
    <header ref="headerRef" class="map-page-container-header">
      <img src="@/assets/images/map/map-header.png" alt="" />
      <div class="header-box">
        <div class="left-layout">
          <div class="date-time-box">
            <span class="time">{{ nowTime }}</span>
            <span class="date">{{ nowDate }}</span>
          </div>
        </div>
        <div class="title-layout" ref="titleLayout">
          <div class="left-arrow">
            <div v-for="item in arrowLength" :key="item"></div>
          </div>
          <h1 ref="titleRef" class="title">{{ title }}</h1>
          <div class="right-arrow">
            <div v-for="item in arrowLength" :key="item"></div>
          </div>
        </div>
        <div class="right-layout">
          <user-info />
        </div>
      </div>
    </header>
    <main class="map-page-container-main">
      <span class="rounded-border" v-for="item in 4" :key="item"></span>
      <div class="map-container">
        <slot name="map"></slot>
        <div class="control-container">
          <slot name="control"></slot>
        </div>
      </div>
    </main>
    <!--    <footer class="map-page-container-footer">-->
    <!--      <div class="module-box left">模块1</div>-->
    <!--      <div class="module-box left">模块2</div>-->
    <!--      <div class="module-box left">模块3</div>-->
    <!--      <img class="index" src="@/assets/images/map/module-index.png" alt="" />-->
    <!--      <div class="module-box right">模块4</div>-->
    <!--      <div class="module-box right">模块5</div>-->
    <!--      <div class="module-box right">模块6</div>-->
    <!--    </footer>-->
  </section>
</template>

<style scoped lang="scss">
@mixin rounded-border($width: 30) {
  position: relative;
  .rounded-border {
    position: absolute;
    padding: 15px;
    border-style: solid;
    border-color: #0cbeff;
    &:nth-child(1) {
      left: 9px;
      top: -6px;
      border-width: 4px 0 0 4px;
    }
    &:nth-child(2) {
      right: 9px;
      top: -6px;
      border-width: 4px 4px 0 0;
    }
    &:nth-child(3) {
      right: 9px;
      bottom: -6px;
      border-width: 0 4px 4px 0;
    }
    &:nth-child(4) {
      left: 9px;
      bottom: -6px;
      border-width: 0 0 4px 4px;
    }
  }
}
.map-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-image: url(@/assets/images/map/map-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  &-header {
    position: fixed;
    width: 100%;
    z-index: 10;
    img {
      display: block;
      width: 100%;
    }
    .header-box {
      display: flex;
      justify-content: space-between;
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      padding: 0 30px;
      height: 100%;
      .left-layout {
        flex: 1;
        .date-time-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: max-content;
          height: 100%;
          .time {
            font-family: Source Han Sans CN-Medium;
            font-size: 26px;
            color: #0cc6f5;
            line-height: 32px;
          }
          .date {
            font-family: Source Han Sans CN-Medium;
            font-size: 12px;
            color: #0cc6f5;
          }
        }
      }
      .right-layout {
        display: flex;
        justify-content: flex-end;
        flex: 1;
      }
      .title-layout {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 29%;
        overflow: hidden;
        .title {
          width: max-content;
          background-image: linear-gradient(180deg, #8dd5ff 0%, #ffffff 100%);
          color: transparent;
          margin: 0 10px;
          font-family: ShiShangZhongHeiJianTi;
          font-size: 28px;
          letter-spacing: 2px;
          line-height: 1;
          white-space: nowrap;
          -webkit-background-clip: text;
        }
        .left-arrow {
          position: relative;
          top: 3px;
          display: flex;
          align-items: center;
          > div {
            width: 14px;
            height: 17px;
            background: url(@/assets/images/map/title-decoration-left.png)
              no-repeat;
            background-size: 100% 100%;
          }
        }
        .right-arrow {
          position: relative;
          top: 3px;
          display: flex;
          align-items: center;
          > div {
            width: 14px;
            height: 17px;
            background: url(@/assets/images/map/title-decoration-right.png)
              no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  &-main {
    position: relative;
    width: 100%;
    margin-bottom: 15px;
    height: calc(100% - var(--header-height));
    margin: {
      top: var(--header-height);
    }
    padding: {
      top: 0;
      left: 15px;
      right: 15px;
      bottom: 0;
    }
    .map-container {
      position: relative;
      width: 100%;
      height: 100%;
      border: 1px solid #0cc6f5;
      padding: 2px;
      overflow: hidden;
      .control-container {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
      }
    }
    @include rounded-border();
  }
  &-footer {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 63px;
    .index {
      width: 217px;
      height: 42px;
    }
    .module-box {
      width: 271px;
      height: 42px;
      font-size: 14px;
      color: #fff;
      font-weight: bold;
      text-align: center;
      line-height: 42px;
      cursor: pointer;
      &.left {
        background-image: url(@/assets/images/map/module-left.png);
        background-repeat: no-repeat;
        background-size: contain;
      }
      &.right {
        background-image: url(@/assets/images/map/module-right.png);
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }
}
</style>
