<script>
export default {
  name: "BarNav",
  props: {
    value: {
      type: String,
      default: undefined,
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  data() {
    return {
      navList: [
        {
          id: 1,
          label: "船舶搜索",
          icon: "icon-ship",
          value: "ship",
        },
        {
          id: 2,
          label: "位置搜索",
          icon: "icon-position",
          value: "position",
        },
      ],
    };
  },
  methods: {
    handleClick(e) {
      const { value } = e.target.dataset;
      this.$emit("change", value);
    },
  },
};
</script>

<template>
  <ul class="bar-nav-container" @click="handleClick">
    <li
      v-for="item in navList"
      :key="item.id"
      class="nav"
      :class="{ active: item.value === value }"
      :data-value="item.value">
      <em class="icon iconfont" :class="item.icon" />
      <span class="label">{{ item.label }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.bar-nav-container {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 40px;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(1, 24, 68, 0.19);
  border-radius: 4px;
  .nav {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    color: #737272;
    cursor: pointer;
    &:hover,
    &.active {
      color: #3380e2;
    }
    .icon {
      font-size: 20px;
      margin-right: 4px;
    }
    .label {
      font-size: 12px;
      font-family: Source Han Sans CN-Regular, Source Han Sans CN;
      font-weight: 400;
      line-height: 14px;
    }
  }
}
</style>
