module.exports = {
  root: true,
  extends: [
    "@react-native-community",
    //"airbnb-typescript",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  overrides: {
    "no-unused-vars": ["off"],
    "no-undef": ["off"],
  },
};
