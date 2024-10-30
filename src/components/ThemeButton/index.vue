<script setup>
import { useDark, useToggle, useMouse } from "@vueuse/core";
import { Sunny, Moon } from "@element-plus/icons-vue";
defineOptions({
  name: "ThemeButton",
});

const isDark = useDark({
  selector: "html",
  valueDark: "dark",
  valueLight: "light",
});
const toggleDark = useToggle(isDark);
const { x, y } = useMouse();

const toggleTheme = () => {
  const endRadius = Math.hypot(
    Math.max(x.value, innerWidth - x.value),
    Math.max(y.value, innerHeight - y.value),
  );

  // 兼容性处理
  if (!document.startViewTransition) {
    toggleDark();
    return;
  }
  const transition = document.startViewTransition(async () => {
    toggleDark();
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x.value}px ${y.value}px)`,
      `circle(${endRadius}px at ${x.value}px ${y.value}px)`,
    ];
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: "ease-in",
        pseudoElement: isDark.value
          ? "::view-transition-old(root)"
          : "::view-transition-new(root)",
      },
    );
  });
};
</script>

<template>
  <el-icon class="theme-btn" :size="20" color="#fff" @click.stop="toggleTheme">
    <Moon v-if="isDark" />
    <Sunny v-else />
  </el-icon>
</template>

<style lang="scss" scoped>
.theme-btn {
  cursor: pointer;
}
</style>
