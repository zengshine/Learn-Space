module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ?
        '/2018/' : '/',
    devServer: {
        proxy: {
            '/maps': {
                target: "https://maps.googleapis.com",
                //target:"http://163.53.88.122:60002",
                changeOrigin: true,
                secure: true,
                pathRewrite: {
                    '^/maps': '/maps'
                },
            },
            '/api': {
                target: "http://[::1]:8084",
                //target:"http://163.53.88.122:60002",
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                },
                secure: false,
            },
        },
    },
    chainWebpack: (config) => {
        //config.module.rule('json').test(/\.json$/).use('json-loader').loader('json-loader')
        //config.module.rule('images').test(/\.(png|svg|jpg|gif)$/).use('file-loader').loader('file-loader')
    },
}