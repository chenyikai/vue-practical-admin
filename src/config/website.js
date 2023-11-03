export default {
  title: "翱晨通用后台管理框架", // 网站标题(项目名称)
  storageKey: "group-two-vue3-admin", // 可设置为项目英文名 避免不同项目在同一环境下缓存互相串联
  indexPage: "/wel/index", // 项目首页地址
  indexTitle: "翱晨科技", // 项目首页菜单上方显示的名称
  logo: `${import.meta.env.BASE_URL}vite.svg`, // 项目或企业LOGO
  defaultTabIcon: `${import.meta.env.BASE_URL}tab.svg`, // 项目或企业LOGO
  // defaultAvatar: `${import.meta.env.BASE_URL}images/default-avatar.jpg`, // 默认用户头像
  iv: "aochendemo@12345", // 加密偏移值
  fistPage: {
    label: "仪表盘",
    value: "/wel/index",
    params: {},
    query: {},
    close: false,
    meta: {
      isTab: true,
    },
  },
  menu: {
    iconDefault: "iconfont icon-caidan",
    props: {
      label: "menuName",
      path: "path",
      icon: "icon",
      children: "children",
      meta: "meta",
    },
  },
};

export const iconfontUrl = "//at.alicdn.com/t/font_$key.css";
export const iconFonts = ["2636982_ukga8onc90h"]; // 字体图标库
