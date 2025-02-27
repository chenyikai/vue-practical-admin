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

const sighData = {};
let count = 0;
let ctx = null;
let beginPoint = null;
const container = ref({});

function init() {
  const canvas = document.getElementById("signBoard");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = container.value.offsetWidth * dpr;
  canvas.height = container.value.offsetHeight * dpr;

  ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.filter = "blur(1px)";
  on();
}

function destroy() {
  document
    .getElementById("signBoard")
    .removeEventListener("mousedown", onPointerDown);

  document
    .getElementById("signBoard")
    .removeEventListener("mousemove", onPointerMove);
}

function onPointerDown(e) {
  const { offsetX, offsetY } = e;

  document
    .getElementById("signBoard")
    .addEventListener("mousemove", onPointerMove);

  window.addEventListener("mouseup", onPointerUp);

  beginPoint = [offsetX, offsetY];

  sighData[count] = {
    path: [],
    visible: true,
  };
}

function onPointerUp() {
  off();
  count += 1;
}

function onPointerMove(e) {
  const { offsetX, offsetY } = e;
  sighData[count].path.push([offsetX, offsetY]);
  draw();
}

function draw() {
  for (let i = 0; i <= count; i++) {
    const points = sighData[i].path;
    if (points.length > 3) {
      const lastTwoPoints = points.slice(-2);
      const controlPoint = lastTwoPoints[0];
      const endPoint = [
        (lastTwoPoints[0][0] + lastTwoPoints[1][0]) / 2,
        (lastTwoPoints[0][1] + lastTwoPoints[1][1]) / 2,
      ];
      drawCurve(beginPoint, controlPoint, endPoint);
      beginPoint = endPoint;
    }
  }
}

function drawCurve(beginPoint, controlPoint, endPoint) {
  const [bx, by] = beginPoint;
  const [cx, cy] = controlPoint;
  const [ex, ey] = endPoint;

  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.quadraticCurveTo(cx, cy, ex, ey);

  ctx.lineWidth = 4; // 设置线宽
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();
}

function on() {
  document
    .getElementById("signBoard")
    .addEventListener("mousedown", onPointerDown);

  window.addEventListener("mouseup", onPointerUp);
}

function off() {
  document
    .getElementById("signBoard")
    .removeEventListener("mousemove", onPointerMove);
  window.removeEventListener("mouseup", onPointerUp);
}

function recoil() {
  if (count > 0) {
    count -= 1;
  }
}

function advance() {
  const value = Object.keys(sighData).at(-1);
  if (count < value) {
    count += 1;
  }
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destroy();
});

defineExpose({
  recoil,
  advance,
});
</script>

<template>
  <section class="sign-board-container" ref="container">
    <canvas id="signBoard"></canvas>
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
