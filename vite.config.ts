import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import TurboConsole from "vite-plugin-turbo-console";
import viteCompression from "vite-plugin-compression";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { fileURLToPath, URL } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import pxToViewport from "postcss-px-to-viewport";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_PUBLIC_PATH,
    plugins: [
      vue({
        script: {
          defineModel: true,
        },
      }),
      vueJsx({}),
      TurboConsole(),
      viteCompression({
        algorithm: "gzip",
        threshold: 10240,
        deleteOriginFile: true,
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), "src/icons")],
        symbolId: "icon-[dir]-[name]",
      }),
      // 仅在非 CI 环境下打开分析报告
      visualizer({
        open: process.env.CI !== "true",
        filename: "stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    build: {
      rollupOptions: {
        external: [
          "vue",
          "element-plus",
          "@element-plus/icons-vue",
          "vue-router",
          "@smallwei/avue",
          "@vueuse/core",
          "aieditor",
          "lodash-es",
          "moment",
          "qs",
          "crypto-js",
          "axios",
          "pinia",
          "vuedraggable",
          "virtual:svg-icons-register",
        ],
      },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        package: fileURLToPath(new URL("./package", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variables.scss" as *;',
          javascriptEnabled: true,
          silenceDeprecations: ["legacy-js-api"],
        },
      },
      postcss: {
        plugins: [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call
          pxToViewport({
            unitToConvert: "px",
            viewportWidth: 1920,
            unitPrecision: 5,
            propList: ["*"],
            viewportUnit: "vw",
            fontViewportUnit: "vw",
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: null,
            include: [/\/src\/viewport\//],
            landscape: false,
            landscapeUnit: "vw",
            landscapeWidth: 568,
          }) as never,
        ],
      },
    },
    server: {
      port: 5173,
      strictPort: false, // 端口被占用时自动尝试下一个可用端口
      proxy: {
        [env.VITE_API_PREFIX]: {
          target: env.VITE_API_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (p) => p.replace(RegExp(`^${env.VITE_API_PREFIX}`), ""),
        },
      },
    },
  };
});
