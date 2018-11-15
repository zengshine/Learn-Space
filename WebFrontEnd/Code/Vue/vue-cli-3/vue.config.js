module.exports={
    baseUrl:'/',
    devServer:{
        proxy: {
            '/api':{
        target:"http://[::1]:8081",
        changeOrigin:true,
        pathRewrite:{
          '^/api':'/api'
        },
        secure:false,
      }
   },
    }
}