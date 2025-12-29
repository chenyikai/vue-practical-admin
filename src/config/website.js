function getIcon(name) {
  if (import.meta.env.BASE_URL !== "/") {
    return `${import.meta.env.BASE_URL}/${name}`;
  } else {
    return `${name}`;
  }
}

export default {
  title: import.meta.env.VITE_TITLE, // 网站标题(项目名称)
  storageKey: "group-two-vue3-admin", // 可设置为项目英文名 避免不同项目在同一环境下缓存互相串联
  indexPage: "index", // 项目首页地址
  logo: getIcon("vite.svg"), // 项目或企业LOGO
  defaultTabIcon: getIcon("tab.svg"), // 项目或企业LOGO
  defaultAvatar: {
    male: getIcon("male.svg"),
    female: getIcon("female.svg"),
  },
  upload: {
    url: "/rest/file/upload",
    ossType: 1,
  },
  iv: "aochendemo@12345", // 加密偏移值
  fistPage: {
    label: "主页",
    value: "/index",
    params: {},
    query: {},
    icon: `index`,
    meta: {
      isTab: true,
    },
  },
  pageIcon: {
    404: 404,
  },
  gender: {
    MALE: 0,
    FEMALE: 1,
  },
  scaleRatio: 1920 / window.innerWidth,
  menu: {
    props: {
      id: "id",
      fId: "fId",
      label: "menuName",
      path: "path",
      icon: "icon",
      children: "children",
      meta: "meta",
    },
  },
  pageStatus: {
    CREATE: "create",
    UPDATE: "update",
    DETAIL: "detail",
  },
};

export const iconfontUrl = "//at.alicdn.com/t/font_$key.css";
export const iconFonts = ["2636982_ukga8onc90h"]; // 字体图标库
