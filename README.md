
## 使用方式
1、安装依赖包
```js
yarn
```

2、运行项目
```
yarn start
```
> `yarn run dev`包含了dll命令，作用是**尽可能将使用到的第三方资源打包成静态包，加快开发构建的速度**；建议在初次/得知vendor资源发生变动后时执行一次。

3、项目打包
```
yarn build
```

## 目录结构

```
project
│   README.md
│   babel.config.js
│   .eslintrc.js
│   .prettierrc.js
│   .stylelintrc.js
│
└───config // webpack、dll配置
│   │   webpack.base.js
│   │   webpack.dev.js
│   │   webpack.prod.js
│   │   ...
│
└───src // 项目源文件
│   │   App.js
│   │   index.js
│   │   Page.js
│   │
|   |____assets // 资源（可被webpack打包）
|   |   | css // 全局css
|   |   | iconfont // 图标文件
|   |   | img // 图片文件
|   |
|   |____axios // 请求
|   |   | api // 接口
|   |   | config.js // 接口环境变量
|   |   | http.js // axios二次封装
|   |   | index.js // 接口统一导出文件
|   |
|   |____components // 组件
│   |   |____common // 通用组件
│   |   |    |   ...
│   |   |
│   |   | ... // 业务组件
|   |
|   |____constants // 常量文件夹
|   |   | common // 全局常量
|   |   | index.js // 出口
|   |   | ... // 其他变量
|   |
|   |____hooks // hooks
│   |   |____common // 通用hooks
│   |   |    |   ...
│   |   |
│   |   | ... // 业务hooks
|   |
|   |____locales // 多语言
|   |
|   |____router // 路由
|   |   | index.js 路由表
|   |   | tools.js 有关路由的工具方法
|   |
|   |____utils // 工具方法
|   |   | tool.js
|   |
|   |____view // 页面
│   |   | ... // 各业务页面（按功能划分）
|
└───public // 静态文件夹
│   │   index.html
|
└───vendor // dll动态链缓存文件夹
│   │
```
接口文档

```
https://www.showdoc.com.cn/1796536733832584/8318086323903179 
密码 admin123

你的前端代码 放 /home/html 下面就好了
前端页面 http://101.35.15.228/index.html
后端接口 http://101.35.15.228/api/dict/
http://101.35.15.228/api/dict/

```
