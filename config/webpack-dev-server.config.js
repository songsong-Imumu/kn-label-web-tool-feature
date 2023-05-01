module.exports = {
    host: 'localhost', // 默认是：localhost
    port: 8081, // 默认是：8080
    open: true, // 浏览器自启动
    hot: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    historyApiFallback: {
        rewrites: { from: /^\/index/, to: `/index.html` }
    },
    proxy: {
        // 测试
        '/mock/dev': {
            target: 'http://121.41.27.5:80',
            secure: false,
            pathRewrite: {
                '^/mock/dev': ''
            },
            changeOrigin: true,
            logLevel: 'debug' // this what you want
        },

        '/mock/test': {
            target: 'http://101.35.15.228:80',
            secure: false,
            pathRewrite: {
                '^/mock/test': ''
            },
            changeOrigin: true,
            logLevel: 'debug' // this what you want
        },
    }
};
