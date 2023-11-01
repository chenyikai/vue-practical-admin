import website from "@/config/website.js";

// 整体页面
export default [
  {
    path: "/login",
    name: "登陆",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/page/Login/index.vue"),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false,
    },
  },
  {
    path: "/",
    redirect: { path: website.indexPage },
  },
];
