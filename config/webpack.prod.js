const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const baseWebpackConfig = require('./webpack.base');
const paths = require('./paths');
const { sourceMapEnabled } = require('./env');

const webpackConfig = smp.wrap(
    merge(baseWebpackConfig, {
        mode: 'production',
        // devtool: 'none',
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
                            test: /\.less$/,
                            use: [
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: require.resolve('css-loader'),
                                    options: {
                                        importLoaders: 2,
                                        sourceMap: sourceMapEnabled
                                    }
                                },
                                {
                                    loader: require.resolve('less-loader'),
                                    options: {
                                        sourceMap: sourceMapEnabled,
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
                            loader: require.resolve('babel-loader'),
                            options: {
                                customize: require.resolve('babel-preset-react-app/webpack-overrides'),
                                plugins: [
                                    [
                                        require.resolve('babel-plugin-named-asset-import'),
                                        {
                                            loaderMap: {
                                                svg: {
                                                    ReactComponent: '@svgr/webpack?-svgo![path]'
                                                }
                                            }
                                        }
                                    ],
                                    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]
                                ],
                                cacheDirectory: true,
                                cacheCompression: true,
                                compact: true
                            }
                        },
                        {
                            test: /\.css$/,
                            exclude: /node_modules/,
                            include: paths.appSrc,
                            use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')]
                        },
                        {
                            exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/],
                            loader: require.resolve('file-loader'),
                            options: {
                                name: 'static/media/[name].[hash:8].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),

            new MiniCssExtractPlugin({
                filename: 'static/css/[name].[contenthash:8].css',
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
                ignoreOrder: true
            }),

            new webpack.ids.HashedModuleIdsPlugin()
        ],
        optimization: {
            minimize: true,
            chunkIds: "named",
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            },
            // minimizer: [new CssMinimizerPlugin()],

            // 生成runtime chunk，以达到优化持久化缓存的目的
            // runtimeChunk: true
            runtimeChunk: {
                name: entrypoint => `runtime~${entrypoint.name}`
            }
        },
        stats: {
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }
    })
);

module.exports = webpackConfig;
