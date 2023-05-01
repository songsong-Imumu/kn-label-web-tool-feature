const path = require('path');
const { merge } = require('webpack-merge');
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base');
const devServer = require('./webpack-dev-server.config');
const paths = require('./paths');

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
            react: require.resolve('react')
        }
    },

    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(png|jpe?g|gif|webp|woff2?|eot|ttf|otf)$/i,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {}
                            }
                        ]
                    },
                    {
                        test: /\.(less|css)$/,
                        use: [
                            require.resolve('style-loader'),
                            require.resolve('css-loader'),
                            {
                                loader: require.resolve('less-loader'),
                                options: {
                                    sourceMap: false,
                                    lessOptions: {
                                        javascriptEnabled: true
                                    }
                                }
                            },
                            {
                                loader: 'style-resources-loader',
                                options: {
                                    patterns: [path.resolve(paths.appCss, 'antd-style.less'), path.resolve(paths.appCss, 'variables.less')],
                                    injector: 'append'
                                }
                            }
                        ],
                        sideEffects: true
                    },
                    {
                        test: /\.(j|t)sx?$/,
                        include: paths.appSrc,
                        exclude: /node_modules/,
                        loader: require.resolve('babel-loader')
                    },
                    {
                        test: /\.css$/,
                        exclude: /node_modules/,
                        include: paths.appSrc
                    },
                    {
                        exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/, /\.md$/],
                        loader: require.resolve('file-loader'),
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }), new webpack.HotModuleReplacementPlugin()],
    devServer
});

module.exports = webpackConfig;
