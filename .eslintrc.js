module.exports = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module"
  },
  env: {
    browser: true
  },
  plugins: ["prettier"],
  extends: ["prettier"],
  rules: {
    "prettier/prettier": "error"
  }
};
