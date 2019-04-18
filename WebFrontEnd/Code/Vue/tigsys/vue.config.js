module.exports = {
  baseUrl: process.env.NODE_ENV === "production" ? "/" : "/",
  devServer: {
    proxy: {
      "/metapi": {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  chainWebpack: config => {
    //config.module.rule('json').test(/\.json$/).use('json-loader').loader('json-loader')
    //config.module.rule('images').test(/\.(png|svg|jpg|gif)$/).use('file-loader').loader('file-loader')
  }
};
