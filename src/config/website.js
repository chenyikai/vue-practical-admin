export default {
  title: "实时航道安全监管系统", // 网站标题(项目名称)
  storageKey: "sshdjg-admin", // 可设置为项目英文名 避免不同项目在同一环境下缓存互相串联
  indexPage: "/screen", // 项目首页地址
  indexTitle: "航道监管", // 项目首页菜单上方显示的名称
  // logo: `${process.env.BASE_URL}logo-white.png`, // 项目或企业LOGO
  // defaultAvatar: `${process.env.BASE_URL}images/default-avatar.jpg`, // 默认用户头像
  iv: "aochendemo@12345", // 加密偏移值
  fistPage: {
    label: "业务操作",
    value: "/screen",
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
  plotType: {
    point: 1,
  },
};
