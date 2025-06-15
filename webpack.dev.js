const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: "./dist",
    open: true,
    hot: true,
  liveReload: false,
  client: {
    overlay: true,
    },
  },
});
