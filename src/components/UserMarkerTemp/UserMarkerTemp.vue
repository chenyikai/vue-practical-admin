<script>
export default {
  name: "UserMarkerTemp",
};
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Mapbox } from "plugins/index.js";

defineOptions({
  name: "UserMarkerTemp",
});

const props = defineProps({
  params: {
    type: Object,
    default: () => {},
  },
});

const scale = ref(1);

// 绑定类型
const TYPES = {
  VEHICLE: "1", // 车辆
  PERSON: "2", // 人员
  VISIT_PERSON: "3", // 访客（外来人员）
  VISIT_VEHICLE: "4", // 访客（外来）车辆
  LONG_TERM_CONTRACTOR: "5", // 长期承包商
  SHORT_TERM_CONTRACTOR: "6", // 短期承包商
  DRIVER: "7", // 司机
};

const ICONS = {
  [TYPES.VEHICLE]: {
    name: "车辆",
    icon: new URL(
      `../../assets/images/map/icon/car-inner.png`,
      import.meta.url,
    )["href"],
  },
  [TYPES.PERSON]: {
    name: "员工",
    icon: new URL(`../../assets/images/map/icon/person.png`, import.meta.url)[
      "href"
    ],
  },
  [TYPES.VISIT_PERSON]: {
    name: "访客",
    icon: new URL(`../../assets/images/map/icon/visitor.png`, import.meta.url)[
      "href"
    ],
  },
  [TYPES.VISIT_VEHICLE]: {
    name: "外来车辆",
    icon: new URL(
      `../../assets/images/map/icon/car-foreign.png`,
      import.meta.url,
    )["href"],
  },
  [TYPES.LONG_TERM_CONTRACTOR]: {
    name: "长期承包商",
    icon: new URL(
      `../../assets/images/map/icon/long-term.png`,
      import.meta.url,
    )["href"],
  },
  [TYPES.SHORT_TERM_CONTRACTOR]: {
    name: "短期承包商",
    icon: new URL(
      `../../assets/images/map/icon/short-term.png`,
      import.meta.url,
    )["href"],
  },
  [TYPES.DRIVER]: {
    name: "司机",
    icon: new URL(`../../assets/images/map/icon/driver.png`, import.meta.url)[
      "href"
    ],
  },
};

function getIcon(val) {
  let url = ICONS[val.bindObjectType].icon;
  if (val.avatarId) {
    url = new URL(
      `../../assets/images/map/person/icon-${val.avatarId}.png`,
      import.meta.url,
    )["href"];
  }

  return url;
}

function onZoom() {
  const zoom = Mapbox.getMap().getZoom();
  const val = zoom - 15;
  const coefficient = val / 5 > 1 ? 1 : val / 5;
  if (val <= 0) {
    scale.value = 0.6;
  } else {
    scale.value = coefficient * 0.4 + 0.6;
  }
}

onMounted(() => {
  onZoom();
  Mapbox.getMap().on("zoom", onZoom);
});

onBeforeUnmount(() => {
  Mapbox.getMap().off("zoom", onZoom);
});
</script>

<template>
  <section class="person-card">
    <img class="icon" :src="getIcon(props.params)" alt="" />
    <span class="text">{{ props.params.name }}</span>
  </section>
</template>

<style scoped lang="scss">
.person-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: scale(v-bind(scale));
  transform-origin: center;
  transition: all 0.15s;
  .icon {
    width: 30px;
    margin-bottom: 5px;
  }
  .text {
    padding: 3px 5px;
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    font-size: 12px;
    line-height: 1;
  }
}
</style>
