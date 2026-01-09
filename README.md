# 🚢 实时航道安全监管系统 & 企业级后台框架

> **版本**: 1.0.0 | **技术栈**: Vue 3 + Vite + Pinia + Element Plus + Mapbox GL

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element_Plus-2.x-409EFF?style=flat-square&logo=element-plus)](https://element-plus.org/)
[![Mapbox](https://img.shields.io/badge/Mapbox-GL-blue?style=flat-square&logo=mapbox)](https://www.mapbox.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)]()

## 📖 项目概述

本项目是一个深度集成的**双模态系统**，旨在解决复杂的海事监管与后台管理需求：

1.  **GIS 可视化子系统 (`/map`)**：
    基于 **Mapbox GL** 的高性能航道安全监管“一张图”。支持船舶 AIS 数据实时渲染、贝塞尔曲线轨迹回放、空间检索、多图层控制以及复杂的弹窗层级管理。该模块独立采用 `1920px` 基准的大屏适配方案。

2.  **后台管理子系统 (`/sys`)**：
    基于 **Vue 3 Ecosystem** 构建的高性能 RBAC 权限管理平台。集成了低代码框架 **Avue** 与自定义的高级 `useCrud` 钩子，实现了极速的业务模块开发能力。支持动态路由、按钮级权限控制及全系统暗黑模式。

---

## ✨ 核心特性

### 🌍 GIS 一张图 (Viewport)
*   **高性能渲染**: 集成 Mapbox GL，支持海量船舶数据的流畅展示。
*   **轨迹平滑**: 独创 `useAnimateMarker` Hook，利用 `Turf.js` 计算，实现基于地理坐标的平滑轨迹回放动画。
*   **智能弹窗引擎**: 通过 `popupManageStore` 与 `ComponentBox` 组件，实现了地图悬浮窗的智能布局、层级管理 (z-index) 及防遮挡逻辑。
*   **全局搜索**: 悬浮式搜索栏，支持对 MMSI、船名、港口及经纬度的快速检索与定位。
*   **侧边工具栏**: 集成图层切换、气象信息、测距工具等功能。

### ⚡ 极速后台开发 (Admin)
*   **Hooks 驱动**: 核心业务逻辑封装为 Composable Hooks (`useCrud`, `useForm`)，大幅减少样板代码。
*   **自定义组件库 (`package/`)**: 独立封装的业务组件层，包含 `PageCrud` (配置化表格)、`Upload` (OSS上传)、`SignBoard` (签名板) 等，与业务解耦。
*   **权限体系**: 完善的 RBAC 模型，支持菜单动态路由加载、按钮级权限指令、以及基于 Tree 的角色权限分配。
*   **Avue 集成**: 在标准 CRUD 外，集成了 Avue 低代码框架，进一步提升系统管理类页面的开发效率。

### 🎨 UI 与工程化
*   **暗黑模式**: 基于 `@vueuse/core` 实现全站暗黑模式，并集成 **View Transitions API** 实现原生级的圆形扩散切换动画。
*   **大屏适配**: 针对 `src/viewport` 目录单独配置 `postcss-px-to-viewport`，确保 GIS 界面在不同分辨率下的完美展示。
*   **构建优化**: 配置 Gzip/Brotli 压缩、SVG 雪碧图、Visualizer 包体积分析。

---

## 🏗️ 详细目录结构

```text
root/
├── .env.formal                 # 生产环境(正式)配置文件
├── .env.pro                    # 生产环境(构建)配置文件
├── .eslintrc.cjs               # ESLint 代码规范配置
├── .gitignore                  # Git 忽略文件列表
├── config/                     # Vite 额外配置文件抽离
│   ├── index.js                # 基础配置
│   └── server.js               # 开发服务器端口配置
├── index.html                  # 入口 HTML (含 Loading 样式)
├── jsconfig.json               # JS 路径别名配置 (@/*, package/*)
├── package.json                # 项目依赖与脚本
├── vite.config.js              # Vite 构建主配置 (含压缩、SVG、可视化分析、PostCSS视口适配)
├── package/                    # 📦 [核心资产] 自定义通用组件库 (独立于业务逻辑)
│   ├── Button/                 # 权限控制按钮 (集成 UserStore 权限判断)
│   ├── Card/                   # 统一样式的卡片容器
│   ├── CityBox/                # 城市选择组件 (预留)
│   ├── Container/              # 页面标准容器 (Header/Main/Footer 布局)
│   ├── Crud/                   # ⚡ 高级表格组件 (自定义轻量级 CRUD)
│   │   ├── src/
│   │   │   ├── td/             # 自定义单元格渲染器
│   │   │   │   ├── ImageTd.vue # 图片列 (含预览)
│   │   │   │   ├── NormalTd.vue# 普通/编辑列
│   │   │   │   ├── RateTd.vue  # 评分列
│   │   │   │   ├── TagTd.vue   # 标签列
│   │   │   │   └── TextTd.vue  # 长文本列 (含 Tooltip)
│   │   │   ├── useTd.js        # 单元格逻辑 Hook
│   │   │   ├── TableColumn.vue # 递归列组件
│   │   │   └── index.vue       # Crud 主入口
│   │   └── index.scss          # 表格样式
│   ├── Dialog/                 # 弹窗组件 (集成 Loading 与 防抖提交)
│   ├── Directive/              # 自定义指令库
│   │   ├── debounce.js         # v-debounce 防抖指令
│   │   └── throttle.js         # v-throttle 节流指令
│   ├── IconBox/                # 图标选择器 (自动读取 src/icons)
│   ├── PicZoom/                # 图片放大镜组件
│   ├── RichText/               # 富文本编辑器 (基于 AiEditor，适配暗黑模式)
│   ├── SignBoard/              # Canvas 手写签名板
│   ├── Skeleton/               # 骨架屏表单组件
│   ├── SvgIcon/                # SVG 图标渲染组件
│   ├── Upload/                 # ☁️ 全能上传组件
│   │   ├── src/components/     # 上传子模式 (拖拽/头像/照片墙/列表)
│   │   └── src/index.vue       # 上传主逻辑 (集成 OSS)
│   ├── VerticalStretchBox/     # 左右拖拽伸缩布局容器 (用于角色权限分配)
│   ├── index.js                # 组件库统一注册入口
│   └── index.scss              # 组件库全局样式
├── src/
│   ├── api/                    # 📡 后端接口定义
│   │   ├── login/              # 登录认证 (Token/Refresh)
│   │   ├── map/                # GIS 相关接口 (搜索/船舶/AIS数据)
│   │   └── sys/                # 系统管理接口 (用户/角色/菜单/字典/日志/在线用户)
│   ├── assets/                 # 静态资源 (图片/字体)
│   ├── components/             # 🧩 全局通用业务组件
│   │   ├── CollapseMenu/       # 左侧折叠菜单 (基于 Store 动态渲染)
│   │   ├── FullScreen/         # 全屏切换
│   │   ├── GlobalSearch/       # 全局菜单搜索
│   │   ├── LayoutComponent/    # 布局核心组件 (Aside/Header/Tab)
│   │   ├── LockButton/         # 锁屏按钮
│   │   ├── MenuBar/            # 图标模式菜单
│   │   ├── MonitorButton/      # 跳转 GIS 大屏按钮
│   │   ├── NotificationCenter/ # 消息通知中心
│   │   ├── SettingButton/      # 系统设置抽屉
│   │   ├── ThemeButton/        # 暗黑模式切换 (含 View Transition 动画)
│   │   └── UserInfo/           # 用户头像与下拉菜单 (含改密/改资料弹窗)
│   ├── config/                 # 全局配置
│   │   ├── errorCode.js        # HTTP 错误码映射
│   │   └── website.js          # 网站基础配置 (Title, Logo, Menu Props)
│   ├── hooks/                  # 🎣 组合式 API (核心逻辑复用)
│   │   ├── useAnimateMarker.js # GIS: 船舶轨迹平滑移动动画 (基于 Turf.js)
│   │   ├── useCrud.js          # Admin: 表格增删改查通用逻辑 (分页/搜索/加载)
│   │   ├── useForm.js          # Admin: 表单/弹窗通用逻辑 (新建/编辑/查看状态机)
│   │   ├── useSignBoard.js     # 签名板逻辑
│   │   └── useSocket.js        # WebSocket 连接封装 (心跳/重连)
│   ├── icons/                  # SVG 图标文件源 (vite-plugin-svg-icons 读取处)
│   ├── mock/                   # Mock 数据 (菜单数据模拟)
│   ├── pages/                  # 基础页面 (非业务强相关)
│   │   ├── ErrorPage/          # 404 页面
│   │   ├── IFramePage/         # IFrame 嵌入容器
│   │   ├── Layout/             # 系统主布局结构
│   │   ├── Login/              # 登录页 (含粒子背景/验证码逻辑)
│   │   └── MenuGroup/          # 菜单组导航页
│   ├── permission.js           # 🔒 路由权限守卫 (Token 校验/动态路由加载/Tab 缓存)
│   ├── router/                 # 路由配置
│   │   ├── axios.js            # Axios 封装 (拦截器/重试/序列化)
│   │   ├── cancelRepeatRquest.js # 取消重复请求逻辑
│   │   ├── index.js            # 路由主入口
│   │   ├── page/               # 基础路由 (Login, Map)
│   │   └── views/              # 动态加载的视图路由
│   ├── store/                  # 💾 Pinia 状态管理
│   │   ├── module/
│   │   │   ├── layoutStore.js  # 布局配置
│   │   │   ├── menuStore.js    # 菜单数据与检索
│   │   │   ├── popupManage.js  # GIS: 地图弹窗层级与防重叠管理
│   │   │   ├── searchStore.js  # GIS: 搜索栏状态
│   │   │   ├── shipInfoStore.js# GIS: 船舶详情数据
│   │   │   ├── tabStore.js     # 多标签页管理
│   │   │   └── userStore.js    # 用户信息与 Token
│   │   └── index.js
│   ├── styles/                 # 🎨 样式文件
│   │   ├── theme/              # 主题定义 (dark.scss, light.scss, table.scss)
│   │   ├── avue.scss           # Avue 框架样式覆盖
│   │   ├── elementUI.scss      # Element Plus 样式覆盖
│   │   ├── layout.scss         # 布局样式
│   │   ├── login.scss          # 登录页样式
│   │   └── variables.scss      # 全局 SCSS 变量与 Mixins
│   ├── utils/                  # 工具函数 (日期/加密/Store/Validate)
│   ├── viewport/               # 🌍 [GIS核心] 独立视口模块 (PostCSS 适配 1920px)
│   │   └── Map/
│   │       ├── components/
│   │       │   ├── Mapbox/     # 地图引擎初始化 (Mapbox GL)
│   │       │   ├── MapControl/ # 缩放与坐标控件
│   │       │   ├── MapLayout/  # 地图大屏专用布局 (Header/Footer)
│   │       │   ├── SearchBar/  # 悬浮搜索栏与结果面板
│   │       │   ├── ShipInfo/   # 船舶详情侧边弹窗 (含拖拽)
│   │       │   ├── SideBar/    # 右侧功能工具栏 (图层/气象)
│   │       │   └── UserInfo/   # 大屏版用户信息组件
│   │       ├── ComponentBox.vue# 弹窗容器 (处理 z-index 与自动排列)
│   │       └── index.vue       # 地图页入口
│   └── views/                  # 🖥️ 业务视图页面
│       ├── component/          # 组件展示示例
│       │   ├── common/         # 图标选择/签名板示例
│       │   ├── crud/           # CRUD 表格组件示例
│       │   ├── directive/      # 自定义指令示例
│       │   ├── text-editor/    # 富文本示例
│       │   └── upload/         # 上传组件示例
│       ├── sys/                # 系统管理模块 (主要使用 Avue + Hooks)
│       │   ├── dept/           # 部门管理 (MainDialog + 递归树)
│       │   ├── dict/           # 字典管理 (主字典 + 字典项弹窗)
│       │   ├── live/           # 在线用户管理
│       │   ├── log/            # 日志管理
│       │   ├── menu/           # 菜单管理 (树形结构)
│       │   ├── role/           # 角色管理 (含权限分配 VerticalStretchBox)
│       │   └── user/           # 用户管理
│       ├── index.vue           # 首页 (仪表盘)
│       └── show/               # 演示页面
└── main.js                     # 应用入口
