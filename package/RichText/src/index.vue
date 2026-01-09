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

// --- Props & Model ---
const props = defineProps({
  options: {
    type: Object,
    default: () => ({}),
  },
  height: {
    type: String,
    default: "450px", // 稍微加高一点默认高度
  },
});

const model = defineModel({ type: String, default: "" });

// --- 状态管理 ---
const divRef = ref(null);
let editor = null;

// --- 暗黑模式检测 ---
const isDark = useDark({
  selector: "html",
  valueDark: "dark",
  valueLight: "light",
});

// --- 工具函数：图片压缩并转 Base64 ---
const compressImage = (file, quality = 0.7, maxWidth = 1000) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let w = img.width;
        let h = img.height;

        // 限制最大宽度，保持宽高比
        if (w > maxWidth) {
          h = (maxWidth * h) / w;
          w = maxWidth;
        }

        canvas.width = w;
        canvas.height = h;

        // 绘制到底布
        ctx.drawImage(img, 0, 0, w, h);

        // 导出压缩后的 Base64
        // 注意：如果是 png 可能会变大，这里强制转 image/jpeg 以获得更好的压缩率
        // 如果你需要透明底，请判断 file.type
        const type = file.type === "image/png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(type, quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

// --- 初始化编辑器 ---
onMounted(() => {
  if (!divRef.value) return;

  editor = new AiEditor({
    element: divRef.value,
    theme: isDark.value ? "dark" : "light",
    toolbarSize: "medium",
    placeholder: "请输入内容...",
    content: model.value,
    toolbarExcludeKeys: ["image", "video", "attachment", "ai"],

    // 👇 图片配置核心逻辑 👇
    image: {
      allowBase64: true, // 允许粘贴/拖拽 Base64
      // 自定义上传：拦截上传动作，转为本地 Base64
      customUpload: async (file) => {
        try {
          // 执行压缩
          const base64Url = await compressImage(file);
          return {
            url: base64Url,
            alt: file.name,
          };
        } catch (error) {
          console.error("Image process failed:", error);
          throw error;
        }
      },
    },

    // 合并外部传入的其他配置
    ...props.options,

    // 监听内容变化
    onChange: (ed) => {
      const html = ed.getHtml();
      model.value = html;
      if (props.options.onChange) props.options.onChange(ed);
    },
  });
});

// --- 监听外部数据变化 (双向绑定) ---
watch(model, (newVal) => {
  if (editor) {
    const currentContent = editor.getHtml();
    // 只有当新内容真正不同时才 setContent，避免光标重置
    if (newVal !== currentContent) {
      editor.setContent(newVal);
    }
  }
});

// --- 监听主题变化 ---
watch(isDark, (val) => {
  if (editor) {
    editor.changeTheme(val ? "dark" : "light");
  }
});

// --- 销毁 ---
onUnmounted(() => {
  editor && editor.destroy();
  editor = null;
});

// --- 暴露给父组件的方法 ---
const clearContent = () => {
  model.value = "";
  editor?.setContent("");
};
const getEditorInstance = () => editor;

defineExpose({
  clear: clearContent,
  getInstance: getEditorInstance,
});
</script>

<template>
  <div class="aieditor-wrapper">
    <div
      class="editor-container"
      ref="divRef"
      :style="{ height: height }"></div>
  </div>
</template>
