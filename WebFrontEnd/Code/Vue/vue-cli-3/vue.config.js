module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ?
        '/vue-cli3/' : '/',
    devServer: {
        proxy: {
            '/api': {
                target: "http://[::1]:8084",
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
        //config.module.rule('images').test(/\.(png|svg|jpg|gif)$/).use('file-loader').loader('file-loader')
    },
}