/// <reference types="vite/client" />

// Vue SFC 类型声明
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}

// Vite virtual modules
declare module "virtual:svg-icons-register" {}

// 无类型声明的第三方插件
declare module "@smallwei/avue" {
  import type { Plugin } from "vue";
  const Avue: Plugin;
  export default Avue;
}

declare module "package/index.js" {
  import type { Plugin } from "vue";
  const AdminComponent: Plugin;
  export default AdminComponent;
}

declare module "postcss-px-to-viewport" {
  interface Options {
    unitToConvert?: string;
    viewportWidth?: number;
    unitPrecision?: number;
    propList?: string[];
    viewportUnit?: string;
    fontViewportUnit?: string;
    selectorBlackList?: string[];
    minPixelValue?: number;
    mediaQuery?: boolean;
    replace?: boolean;
    exclude?: RegExp[] | null;
    include?: RegExp[];
    landscape?: boolean;
    landscapeUnit?: string;
    landscapeWidth?: number;
  }
  function pxToViewport(options?: Options): unknown;
  export default pxToViewport;
}

// 环境变量类型
interface ImportMetaEnv {
  readonly VITE_TITLE: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_PREFIX: string;
  readonly VITE_PUBLIC_PATH: string;
  /** OAuth2 客户端凭证，Base64(client_id:client_secret) */
  readonly VITE_CLIENT_CREDENTIALS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
