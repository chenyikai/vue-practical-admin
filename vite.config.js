import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import TurboConsole from "vite-plugin-turbo-console";
import viteCompression from "vite-plugin-compression";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
// import { viteExternalsPlugin } from "vite-plugin-externals";
import pxToViewport from "postcss-px-to-viewport";
import path from "path";

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // publicDir: env.VITE_API_PREFIX,
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
        // eslint-disable-next-line no-undef
        iconDirs: [path.resolve(process.cwd(), "src/icons")],
        symbolId: "icon-[dir]-[name]", // icon-file-excel
      }),
      visualizer({
        open: true, //注意这里要设置为true，否则无效
        filename: "stats.html", //分析图生成的文件名
        gzipSize: true, // 收集 gzip 大小并将其显示
        brotliSize: true, // 收集 brotli 大小并将其显示
      }),
      // viteExternalsPlugin({
      //   vue: "Vue",
      //   "element-plus": "Element",
      // }),
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
          pxToViewport({
            unitToConvert: "px", // (String) 需要转换的单位，默认为"px"
            viewportWidth: 1920, // (String) 需要转换的单，默认为"px"
            unitPrecision: 5, // (Number) 单位转换后保留的精度
            propList: ["*"], // (Array) 能转化为vw的属性列表
            viewportUnit: "vw", // (String) 希望使用的视口单位
            fontViewportUnit: "vw", // (String) 字体使用的视口单位
            selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
            minPixelValue: 1, // (Number) 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
            mediaQuery: false, // (Boolean) 媒体查询里的单位是否需要转换单位
            replace: true, // (Boolean) 是否直接更换属性值，而不添加备用属性
            exclude: null, // (Array or Regexp) 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
            include: [/\/src\/viewport\//],
            landscape: false,
            landscapeUnit: "vw",
            landscapeWidth: 568,
          }),
        ],
      },
    },
    server: {
      // port: 9999,
      proxy: {
        [env.VITE_API_PREFIX]: {
          target: env.VITE_API_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(RegExp(`^${env.VITE_API_PREFIX}`), ""),
        },
      },
    },
  };
});
