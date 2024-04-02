import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import TurboConsole from "vite-plugin-turbo-console";
import viteCompression from "vite-plugin-compression";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { fileURLToPath, URL } from "node:url";
import { loadEnv } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // publicDir: env.VITE_API_PREFIX,
    plugins: [
      vue(),
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
        symbolId: "icon-[dir]-[name]",
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        package: fileURLToPath(new URL("./package", import.meta.url)),
        plugins: fileURLToPath(new URL("./plugins", import.meta.url)),
      },
    },
    server: {
      port: 9999,
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
