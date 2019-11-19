module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true
  },
  plugins: ["prettier"],
  extends: ["prettier"],
  rules: {
    "prettier/prettier": "error"
  }
};
