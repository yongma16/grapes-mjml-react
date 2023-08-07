// @ts-ignore
const proxy = require('http-proxy-middleware'); //引入http-proxy-middleware，react脚手架已经安装

// @ts-ignore
module.exports = function(app){
    app.use(
        // proxy.createProxyMiddleware('/sendEmail',{ //遇见/api1前缀的请求，就会触发该代理配置
        //     target:'http://localhost:6677/sendEmail', //请求转发给谁
        //     secure: false,
        //     changeOrigin:true,//控制服务器收到的请求头中Host的值
        //     pathRewrite:{'^/sendEmail':''} //重写请求路径，下面有示例解释
        // }),
        proxy.createProxyMiddleware('/third-login/',{ //遇见/api1前缀的请求，就会触发该代理配置
            target:'https://yongma16.xyz/third-login/', //请求转发给谁
            secure: false,
            ws: true, //接受websocket请求
            changeOrigin:true,//控制服务器收到的请求头中Host的值
            chunkOrigins: true,
            pathRewrite:{'^/third-login/':''} //重写请求路径，下面有示例解释
        }),
    )
}
