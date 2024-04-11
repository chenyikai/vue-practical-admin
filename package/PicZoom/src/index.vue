<template>
  <div class="pic-zoom-box" :class="customClass">
    <div ref="previewBox" class="preview-box" @mousemove="move" @mouseout="out">
      <img class="preview-img" :src="src" alt="" />
      <div
        ref="hoverBox"
        class="hover-box"
        :style="{
          width: `${this.base}px`,
          height: `${this.base}px`,
        }" />
    </div>
    <div
      v-show="zoomVisible"
      ref="zoomBox"
      class="zoom-box"
      :style="{
        width: `${this.base * this.coefficient}px`,
        height: `${this.base * this.coefficient}px`,
      }">
      <div
        class="big-img-box"
        :style="{
          width: `${bigImgBoxSize.width}px`,
          height: `${bigImgBoxSize.height}px`,
        }">
        <img
          ref="bigImg"
          :src="src"
          alt=""
          :style="{
            width: `${bigImgBoxSize.width}px`,
            height: `${bigImgBoxSize.height}px`,
          }" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PicZoom",
  props: {
    src: {
      type: String,
      default: null,
      required: true,
    },
    coefficient: {
      type: Number,
      default: 4,
    },
    base: {
      type: Number,
      default: 100,
    },
    customClass: String,
  },
  data() {
    return {
      zoomVisible: false,
      zoomImgBox: undefined,
      bigImgBoxSize: {},
    };
  },
  computed: {
    maxWidth() {
      const pDom = this.$refs.previewBox;
      const offsetWidth = pDom?.offsetWidth || 0;
      return offsetWidth - this.base;
    },
    maxHeight() {
      const pDom = this.$refs.previewBox;
      const offsetHeight = pDom?.offsetHeight || 0;
      return offsetHeight - this.base;
    },
  },
  unmounted() {
    this.destroy();
  },
  mounted() {
    const dom = this.$refs?.previewBox;
    this.bigImgBoxSize = {
      width: dom?.offsetWidth * this.coefficient || 0,
      height: dom?.offsetHeight * this.coefficient || 0,
    };
  },
  methods: {
    destroy() {
      this.zoomVisible = false;
      this.bigImgBoxSize = {};
      this.zoomImgBox = null;
    },
    out() {
      this.zoomVisible = false;
    },
    move({ offsetX, offsetY }) {
      this.zoomVisible = true;

      const top = this.getMoveScope(offsetY - this.base / 2, this.maxHeight);
      const left = this.getMoveScope(offsetX - this.base / 2, this.maxWidth);
      this.$refs.hoverBox.style.top = `${top}px`;
      this.$refs.hoverBox.style.left = `${left}px`;

      this.$refs.bigImg.style.top = `-${top * this.coefficient}px`;
      this.$refs.bigImg.style.left = `-${left * this.coefficient}px`;
    },
    getMoveScope(distance, max) {
      if (distance <= 0) return 0;
      if (distance > max) return max;
      return distance;
    },
  },
});
</script>

<style lang="scss">
.pic-zoom-box {
  position: relative;
  width: 100%;
  height: 100%;
  .preview-box {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: move;
    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &:hover .hover-box {
      display: block;
    }
    .hover-box {
      position: absolute;
      display: none;
      border: 1px solid #545454;
      background: url("../assets/hoverPoint.png") repeat 0 0;
      user-select: none;
      pointer-events: none;
    }
  }
  .zoom-box {
    overflow: hidden;
    position: absolute;
    left: 595px;
    z-index: 1000;
    background-color: #fff;
    top: 0;
    .big-img-box {
      //width: 1176px;
      //height: 1850px;
      img {
        //width: 1176px;
        //height: 1850px;
        position: absolute;
        object-fit: contain;
      }
    }
  }
}
</style>
