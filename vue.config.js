//node filesystem
// const fs = require("fs");

//node vars
process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  //fix for working in a directory
  publicPath: "./",

  pwa: {
    name: "TP Tracker",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    themeColor: "#12BC1B",
    msTileColor: "#FFFFFF",
    manifestOptions: {
      background_color: "#FFFFFF",
      display: "standalone",
      start_url: "./",
      scope: ".",
    },
    workboxOptions: {
      //automatically load new service worker
      // i opted to give the user manual control
      skipWaiting: true,
    },
  },
  //more configs
  chainWebpack: (config) => {
    //Change the title on the html file
    config.plugin("html").tap((args) => {
      args[0].title = "TP Tracker";
      return args;
    });
  },

  /* fix LINT on SAVE
  chainWebpack: config => {
    config.module.rule('eslint').use('eslint-loader').options({
      fix: true
    })
  }*/
};
