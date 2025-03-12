<script>
export default {
  name: "RichText",
};
</script>

<script setup>
import { useDark } from "@vueuse/core";
import { AiEditor } from "aieditor";
import { onUnmounted, onMounted, ref, watch } from "vue";

defineOptions({
  name: "RichText",
});

const isDark = useDark({
  selector: "html",
  valueDark: "dark",
  valueLight: "light",
});

const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
});

const model = defineModel({ type: String, default: "" });
const text = ref({});
let editor = null;

watch(
  isDark,
  (val) => {
    editor?.changeTheme(val ? "dark" : "light");
  },
  {
    immediate: true,
  },
);

function onChange(editor) {
  model.value = editor.getHtml();
}

onMounted(() => {
  editor = new AiEditor({
    ...props.options,
    element: text.value,
    theme: isDark.value ? "dark" : "light",
    toolbarSize: "medium",
    placeholder: "点击输入内容...",
    content: null,
    onChange,
  });
});

onUnmounted(() => {
  editor && editor.destroy();
});
</script>

<template>
  <div class="text-container">
    <div class="editor" ref="text"></div>
  </div>
</template>

<style lang="scss">
.text-container {
  .editor {
    width: 100%;
    height: 400px;
  }
}
</style>
