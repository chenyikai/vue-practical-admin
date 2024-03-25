<template>
  <div class="danger-box" @click.prevent.stop="$emit('click', formData)">
    <div
      class="danger-ship"
      :style="`background: red`"
      v-for="item in 3"
      :key="item"
      :class="`point${item}`"></div>
  </div>
</template>

<script>
export default {
  name: "DangerousPoint",
  data() {
    return {
      formData: {},
    };
  },
};
</script>

<style lang="scss" scoped>
@mixin transform($param) {
  transform: $param;
  -webkit-transform: $param;
  -moz-transform: $param;
  -o-transform: $param;
}
.danger-box {
  display: inline-block;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
  &.wrap {
    z-index: 1;
    .danger-ship {
      background: #419eff;
    }
  }
  .danger-ship {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    /*transform-origin: 50% 50%;*/
  }
}
.point1 {
  animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 0s infinite;
  -webkit-animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 0s infinite;
  -o-animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 0s infinite;
  -moz-animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 0s infinite;
}

.point2 {
  @include transform(scale(0.2));
  animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 0.8s infinite;
  -webkit-animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 0.8s infinite;
  -o-animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 0.8s infinite;
  -moz-animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 0.8s infinite;
}

.point3 {
  @include transform(scale(0.2));
  animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 1.6s infinite;
  -webkit-animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 1.6s infinite;
  -o-animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 1.6s infinite;
  -moz-animation: move 2s cubic-bezier(0.21, 0.53, 0.56, 0.8) 1.6s infinite;
}

@keyframes move {
  0% {
    opacity: 1;
    transform: scale(0.2);
  }

  50% {
    opacity: 0.6;
    transform: scale(0.8);
  }

  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}
</style>
