<script>
export default {
  name: "TextEditor",
};
</script>

<script setup>
import { ref } from "vue";

defineOptions({
  name: "TextEditor",
});

const text = ref(
  '<h1 style="text-align: center;">🚀 全新体验：通用管理后台 v3.0.0 年度更新</h1>\n' +
    '<p style="text-align: center; color: #909399; font-size: 14px;">发布时间：2024-06-01 &nbsp;|&nbsp; 类别：重大版本更新 &nbsp;|&nbsp; 阅读时间：约 5 分钟</p>\n' +
    "<hr />\n" +
    "\n" +
    "<p><strong>亲爱的开发者与合作伙伴：</strong></p>\n" +
    "<p>历时三个月的封闭开发与两轮灰度测试，我们非常激动地向大家宣布：<strong>通用后台管理框架 v3.0.0 正式发布！</strong> 本次更新不仅仅是功能的堆叠，更是对“交互美学”与“性能极限”的一次深度探索。</p>\n" +
    "\n" +
    "<blockquote>\n" +
    '  <p>💡 <strong>设计理念：</strong> 让后台管理不再枯燥，让数据流动更加自然。我们在本次更新中引入了全新的 <strong>"Fluid UI"</strong> 设计语言。</p>\n' +
    "</blockquote>\n" +
    "\n" +
    "<h2>🌟 核心亮点深度解析</h2>\n" +
    "\n" +
    "<h3>1. 可视化数据驾驶舱 (Dashboard Pro)</h3>\n" +
    "<p>我们重构了首页仪表盘，现在支持拖拽式布局。引入了 WebGL 渲染引擎，处理百万级数据点的图表渲染性能提升了 <strong>400%</strong>。</p>\n" +
    '<figure style="text-align: center; margin: 20px 0;">\n' +
    '  <img src="https://placehold.co/1000x450/1b2431/409eff?text=Dashboard+Pro+Visualization&font=roboto" alt="数据驾驶舱预览" style="border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); max-width: 100%;">\n' +
    '  <figcaption style="color: #909399; font-size: 12px; margin-top: 10px;">深色模式下的实时数据监控中心</figcaption>\n' +
    "</figure>\n" +
    "\n" +
    "<h3>2. 极致的富文本编辑体验</h3>\n" +
    "<p>正如您现在所见，我们集成了最新的 <strong>AiEditor</strong> 内核。它摒弃了繁杂的旧式操作，专注于写作本身。</p>\n" +
    "<ul>\n" +
    "  <li><strong>🎨 智能配色：</strong> 自动适配系统的深/浅色主题，无需手动切换。</li>\n" +
    "  <li><strong>⚡ 性能优化：</strong> 即使文档超过 50,000 字，输入依然丝滑流畅。</li>\n" +
    "  <li><strong>🚫 纯净模式：</strong> 移除了冗余的视频与附件功能，回归图文排版的本质。</li>\n" +
    "</ul>\n" +
    "\n" +
    "<h3>3. 全新的 API 接入方式</h3>\n" +
    "<p>为了方便二次开发，我们开放了更细粒度的权限控制 Hook。以下是一个简单的配置示例：</p>\n" +
    "\n" +
    '<pre><code class="language-javascript">// v3.0.0 新增的权限拦截器示例\n' +
    "import { definePermission } from '@system/core';\n" +
    "\n" +
    "export const userPolicy = definePermission({\n" +
    "  resource: 'dashboard',\n" +
    "  actions: ['read', 'export'],\n" +
    "  conditions: (user) => {\n" +
    "    // 仅允许部门经理导出数据\n" +
    "    return user.role === 'manager' && user.department.isActive;\n" +
    "  }\n" +
    "});\n" +
    "\n" +
    "console.log('Policy initialized successfully.');</code></pre>\n" +
    "\n" +
    "<h2>📊 详细变更日志 (Changelog)</h2>\n" +
    "<p>以下是本次更新涉及的主要模块变更详情：</p>\n" +
    "\n" +
    '<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">\n' +
    "  <thead>\n" +
    '    <tr style="background-color: var(--aie-menus-bg-color, #f5f7fa); border-bottom: 2px solid #dcdfe6;">\n' +
    '      <th style="padding: 12px; text-align: left;">模块</th>\n' +
    '      <th style="padding: 12px; text-align: left;">类型</th>\n' +
    '      <th style="padding: 12px; text-align: left;">更新内容</th>\n' +
    '      <th style="padding: 12px; text-align: center;">状态</th>\n' +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    '    <tr style="border-bottom: 1px solid #ebeef5;">\n' +
    '      <td style="padding: 12px;">系统内核</td>\n' +
    '      <td style="padding: 12px;"><span style="color: #409eff; background: rgba(64,158,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 12px;">重构</span></td>\n' +
    '      <td style="padding: 12px;">升级 Vue 3.4+，全面拥抱 TypeScript 5.0</td>\n' +
    '      <td style="padding: 12px; text-align: center;">✅ 完成</td>\n' +
    "    </tr>\n" +
    '    <tr style="border-bottom: 1px solid #ebeef5;">\n' +
    '      <td style="padding: 12px;">UI 组件</td>\n' +
    '      <td style="padding: 12px;"><span style="color: #67c23a; background: rgba(103,194,58,0.1); padding: 2px 6px; border-radius: 4px; font-size: 12px;">新增</span></td>\n' +
    '      <td style="padding: 12px;">新增 Watermark (水印) 与 Tour (漫游引导) 组件</td>\n' +
    '      <td style="padding: 12px; text-align: center;">✅ 完成</td>\n' +
    "    </tr>\n" +
    '    <tr style="border-bottom: 1px solid #ebeef5;">\n' +
    '      <td style="padding: 12px;">网络层</td>\n' +
    '      <td style="padding: 12px;"><span style="color: #e6a23c; background: rgba(230,162,60,0.1); padding: 2px 6px; border-radius: 4px; font-size: 12px;">优化</span></td>\n' +
    '      <td style="padding: 12px;">Axios 拦截器逻辑优化，支持静默刷新 Token</td>\n' +
    '      <td style="padding: 12px; text-align: center;">🚀 灰度中</td>\n' +
    "    </tr>\n" +
    "    <tr>\n" +
    '      <td style="padding: 12px;">移动端</td>\n' +
    '      <td style="padding: 12px;"><span style="color: #f56c6c; background: rgba(245,108,108,0.1); padding: 2px 6px; border-radius: 4px; font-size: 12px;">修复</span></td>\n' +
    '      <td style="padding: 12px;">修复 iOS 17 下侧边栏手势冲突的问题</td>\n' +
    '      <td style="padding: 12px; text-align: center;">✅ 完成</td>\n' +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "\n" +
    "<h2>📱 多端适配预览</h2>\n" +
    "<p>我们的设计原则是“一次开发，多端运行”。无论是在 4K 显示器还是 iPad 上，布局都能完美响应。</p>\n" +
    '<div style="display: flex; gap: 15px; flex-wrap: wrap; margin-top: 20px;">\n' +
    '  <img src="https://placehold.co/400x300/e6f1fc/409eff?text=Desktop+View&font=roboto" alt="PC端" style="flex: 1; min-width: 200px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">\n' +
    '  <img src="https://placehold.co/400x300/141414/61afef?text=Mobile+View&font=roboto" alt="移动端" style="flex: 1; min-width: 200px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">\n' +
    "</div>\n" +
    "\n" +
    "<h2>🔜 下一步计划 (Roadmap)</h2>\n" +
    "<p>在接下来的 Q3 季度，我们将重点攻克以下方向：</p>\n" +
    "<ol>\n" +
    "  <li><strong>AI 助手集成：</strong> 在表格中直接呼出 AI 进行数据分析。</li>\n" +
    "  <li><strong>低代码表单设计器：</strong> 拖拽生成 80% 的 CRUD 页面。</li>\n" +
    "  <li><strong>国际化增强：</strong> 新增阿拉伯语（RTL 布局）支持。</li>\n" +
    "</ol>\n" +
    "\n" +
    "<hr />\n" +
    '<p style="font-size: 13px; color: #909399;">\n' +
    "  <em>注意事项：建议使用 Chrome 90+ 或 Edge 浏览器访问以获得最佳体验。<br>\n" +
    '  如有任何疑问，请联系内部 IT 支持团队：<a href="#" style="color: #409eff; text-decoration: none;">support@internal.system</a></em>\n' +
    "</p>",
);
</script>

<template>
  <rich-text v-model="text" />
</template>

<style scoped lang="scss"></style>
