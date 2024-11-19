<script>
export default {
  name: "SignBoard",
};
</script>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

defineOptions({
  name: "SignBoard",
});

const props = defineProps({
  color: {
    type: String,
    default: "#000",
  },
});

const sighList = ref([]);
const count = ref(0);
let ctx = null;

function init() {
  ctx = document.getElementById("signBoard").getContext("2d");
  document
    .getElementById("signBoard")
    .addEventListener("mousedown", onPointerDown);
  window.addEventListener("mouseup", onPointerUp, { once: true });
}

function destroy() {
  document
    .getElementById("signBoard")
    .removeEventListener("mousedown", onPointerDown);
}

function onPointerDown(e) {
  const { offsetX, offsetY } = e;
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);
  on();
}

function onPointerUp() {
  off();
  ctx.closePath();
}

function onPointerMove(e) {
  const { offsetX, offsetY } = e;
  sighList.value.push([offsetX, offsetY]);
  ctx.lineTo(offsetX, offsetY);
  // const [lastX, lastY] = sighList.value[count.value - 1] || [0, 0];
  // ctx.quadraticCurveTo(lastX, lastY, offsetX, offsetY);
  ctx.lineWidth = 4; // 设置线宽
  ctx.lineCap = "round";
  ctx.stroke();
  count.value += 1;
}

function on() {
  document
    .getElementById("signBoard")
    .addEventListener("pointermove", onPointerMove);
}

function off() {
  document
    .getElementById("signBoard")
    .removeEventListener("pointermove", onPointerMove);
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destroy();
});
</script>

<template>
  <section class="sign-board-container">
    <canvas class="board" width="400" height="200" id="signBoard"></canvas>
  </section>
</template>

<style scoped lang="scss">
.sign-board-container {
  width: 400px;
  height: 200px;
  background-color: #fff;
  border-radius: 6px;
  overflow: hidden;
  cursor:
    url("../assets/images/cursor.svg") 4 29,
    crosshair;
}
</style>
