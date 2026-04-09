module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  // 基础规则：适用于所有文件
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:prettier/recommended",
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "vue"],
  rules: {
    // Prettier（从 .prettierrc 读取，这里只声明 error 级别）
    "prettier/prettier": "error",

    // Vue 规则
    "vue/multi-word-component-names": "off", // 单词组件名在后台系统中常见
    "vue/component-definition-name-casing": ["error", "PascalCase"],
    "vue/require-default-prop": "error",
    "vue/require-prop-types": "error",
    "vue/no-unused-vars": "error",
    "vue/html-self-closing": [
      "error",
      {
        html: { void: "always", normal: "always", component: "always" },
        svg: "always",
        math: "always",
      },
    ],

    // 通用代码质量
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "object-shorthand": "error",
    eqeqeq: ["error", "always"],
    curly: ["error", "all"],
  },

  overrides: [
    // TS 文件：启用类型感知的严格规则
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
      ],
      parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.node.json"],
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          { allowExpressions: true, allowTypedFunctionExpressions: true },
        ],
        "@typescript-eslint/no-non-null-assertion": "error",
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { prefer: "type-imports", fixStyle: "separate-type-imports" },
        ],
        "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/no-misused-promises": "error",
      },
    },
    // Vue 文件：启用 TS 解析（无类型感知，待迁移完成后升级）
    {
      files: ["*.vue"],
      // 必须显式指定，防止 @typescript-eslint/recommended 覆盖 vue-eslint-parser
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        ecmaVersion: "latest",
        sourceType: "module",
        // 迁移阶段：不强制 project，避免 JS Vue 文件报错
        // 全量迁移完成后改为: project: ['./tsconfig.json']
      },
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/no-explicit-any": "warn", // Vue 迁移期间降为 warn
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "error",
          { prefer: "type-imports", fixStyle: "separate-type-imports" },
        ],
      },
    },
    // JS 文件：保持基础 TS 规则（不做类型检查）
    {
      files: ["*.js", "*.mjs"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
      },
    },
    // 配置文件豁免
    {
      files: ["*.cjs"],
      env: { node: true },
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],

  ignorePatterns: ["dist/", "node_modules/", "stats.html", "*.d.ts", "public/"],
};
