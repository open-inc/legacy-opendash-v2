module.exports = {
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error"
  },

  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  globals: {
    angular: true,
    Highcharts: true
  },
  env: {
    browser: true,
    es6: true
  },
  rules: {
    "eol-last": ["error", "always"],
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 1
      }
    ],
    "linebreak-style": ["error", "unix"],
    "no-var": ["error"],
    "no-unused-vars": [
      "error",
      {
        args: "none"
      }
    ]
  }
};
