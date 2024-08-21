import website from "@/config/website.js";

// 整体页面
export default [
  {
    path: "/login",
    name: "登陆",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/pages/Login/index.vue"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false,
    },
  },
  {
    path: "/map",
    name: "监管一张图",
    component: () =>
      import(/* webpackChunkName: "map" */ "@/viewport/Map/index.vue"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: true,
    },
  },
  {
    path: "/",
    redirect: { path: website.indexPage },
  },
];
