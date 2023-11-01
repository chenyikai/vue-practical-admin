import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import TurboConsole from "vite-plugin-turbo-console";
// import Inspector from "vite-plugin-vue-inspector";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import DefineOptions from "unplugin-vue-define-options/vite";
import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // publicDir: env.VITE_API_PREFIX,
    plugins: [
      vue(),
      vueJsx({}),
      TurboConsole(),
      // Inspector({
      //   enabled: false,
      //   openInEditorHost: "http://127.0.0.1:5173",
      // }),
      AutoImport({
        imports: ["vue", "vue-router"],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      DefineOptions(),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
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

// export default defineConfig({
//   plugins: [
//     vue(),
//     vueJsx({}),
//     TurboConsole(),
//     // Inspector({
//     //   enabled: false,
//     //   openInEditorHost: "http://127.0.0.1:5173",
//     // }),
//     AutoImport({
//       imports: ["vue", "vue-router"],
//       resolvers: [ElementPlusResolver()],
//     }),
//     Components({
//       resolvers: [ElementPlusResolver()],
//     }),
//     DefineOptions(),
//   ],
//   resolve: {
//     alias: {
//       "@": fileURLToPath(new URL("./src", import.meta.url)),
//     },
//   },
// });
