module.exports = {
    baseUrl: '/',
    devServer: {
        proxy: {
            '/api': {
                target: "http://[::1]:8081",
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                },
                secure: false,
            }
        },
    },
    chainWebpack: (config) => {
        //config.module.rule('json').test(/\.json$/).use('json-loader').loader('json-loader')
        //config.module.rule('imgages').use('image-webpack-loader').loader('image-webpack-loader')
    },
}