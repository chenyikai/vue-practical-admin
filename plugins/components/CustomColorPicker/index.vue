<template>
  <div class="custom-color-picker">
    <div
      class="custom-color-picker__content"
      :style="{ '--color': value || 'transparent' }"></div>
    <div class="custom-color-picker__trigger">
      <div
        class="custom-color-picker__trigger-item"
        v-for="color in colors"
        :key="color"
        :style="{ '--color': color }"
        @click="onChoose(color)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomColorPicker",
  data() {
    return {};
  },
  props: {
    value: {
      type: String,
      default: undefined,
    },
    colors: {
      type: Array,
      default: () => {
        return [
          "#000000",
          "#808080",
          "#800000",
          "#F7883A",
          "#308430",
          "#385AD3",
          "#800080",
          "#009999",
          "#FFFFFF",
          "#C0C0C0",
          "#FB3838",
          "#FFFF00",
          "#99CC00",
          "#3894E4",
          "#F31BF3",
          "#16DCDC",
        ];
      },
    },
  },
  model: {
    prop: "value",
    event: "change",
  },
  methods: {
    onChoose(color) {
      this.$emit("change", color);
    },
  },
};
</script>

<style lang="scss">
.custom-color-picker {
  height: 60px;
  width: 100%;
  border-radius: 3px;
  display: flex;
  align-items: center;

  &__content {
    background: var(--color);
    width: 60px;
    height: 60px;
    border-radius: 3px;
    margin-right: 5px;
    border: 1px solid #808080;
  }
  &__trigger {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(2, 1fr);
    overflow: hidden;
    gap: 5px;
    height: 100%;
  }
  &__trigger-item {
    width: 100%;
    height: 100%;
    background: var(--color);
    border: 1px solid #808080;
    cursor: pointer;
  }
}
</style>
