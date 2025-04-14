<script>
export default {
  name: "IFramePage",
};
</script>

<script setup>
import { useRoute } from "vue-router";
import { menuStore } from "@/store";

const route = useRoute();
const MenuStore = menuStore();

defineOptions({
  name: "IFramePage",
});
</script>

<template>
  <div class="iframe-container">
    <iframe
      class="iframe"
      :src="MenuStore.getMenu(route.meta.id).path"
      frameborder="0"></iframe>
  </div>
</template>

<style scoped lang="scss">
.iframe-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include container();
  .iframe {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}
</style>
