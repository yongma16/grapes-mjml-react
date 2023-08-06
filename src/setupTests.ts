// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
const proxy = require('http-proxy-middleware'); //引入http-proxy-middleware，react脚手架已经安装

module.exports = function(app: { use: (arg0: any, arg1: any) => void; }){
    app.use(
        proxy.createProxyMiddleware('/localSendEmail',{ //遇见/api1前缀的请求，就会触发该代理配置
            target:'http://localhost:6677/sendEmail', //请求转发给谁
            changeOrigin:true,//控制服务器收到的请求头中Host的值
            pathRewrite:{'^/localSendEmail':''} //重写请求路径，下面有示例解释
        }),
        proxy.createProxyMiddleware('/remoteSendEmail',{ //遇见/api1前缀的请求，就会触发该代理配置
            target:'http://yongma16.xyz/third-login/sendEmail', //请求转发给谁
            changeOrigin:true,//控制服务器收到的请求头中Host的值
            pathRewrite:{'^/remoteSendEmail':''} //重写请求路径，下面有示例解释
        }),
    )
}

