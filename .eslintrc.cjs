module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:prettier/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "prettier/prettier": [
            "error",
            {
                endOfLine: "auto", // 换行cr检查
                arrowParens: "always",
                bracketSameLine: true,
                tabWidth: 2,
                "trailing-comma": "all",
                "print-width": 100,
            },
        ],
    }
}
