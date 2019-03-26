const path = require('path')
function addStyleResource(rule) {
    rule.use('style-resources')
      .loader('style-resources-loader')
      .options({
        patterns: [
          path.resolve(__dirname, './src/styles/*/*.less'), //styles 下面的所有less文件
        ],
      })
  }

  module.exports = {
    assetsDir: 'static/assets',
    productionSourceMap: false,
    chainWebpack: config => {
      const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
      types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    },
    css: {
      // 是否使用css分离插件 ExtractTextPlugin
      extract: true,
      // 开启 CSS source maps?
      sourceMap: false,
      // css预设器配置项
      loaderOptions: {},
      // 启用 CSS modules for all css / pre-processor files.
      modules: false
    },
    devServer: {
      port: 8088, // 运行 npm run serve 启动时候的端口号
      host: 'localhost',
      https: false, // https:{type:Boolean}
      open: true, //运行 npm run serve 时候自动启动浏览器
      proxy: 'http://localhost:8085' // 配置跨域处理,只有一个代理
      // proxy: {
      //   '^/v1.0': {
      //     target: 'http://localhost:3000',
      //     ws: false,
      //     changeOrigin: true
      //   },
      // },  // 配置多个代理
    }
  }