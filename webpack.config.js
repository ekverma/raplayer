var path = require("path");
var webpack = require("webpack");
var resolve = require("path").resolve;

var WebpackConfig = {
    entry: {
        index: ["./src/index.js"]
    },
    output: {
        path: path.join(__dirname, "dist"),
        library: "RaPlayer",
        filename: "[name].bundle.js",
        libraryTarget: "umd",
        umdNamedDefine: true
    },
    //devtool: 'source-map',
    resolve: {
        alias: {
            "@config": resolve(__dirname, "./src/app/config"),
            "@components": resolve(__dirname, "./src/app/components"),
            "@containers": resolve(__dirname, "./src/app/containers"),
            "@utils": resolve(__dirname, "./src/app/utils"),
            "@models": resolve(__dirname, "./src/app/models"),
            "@api": resolve(__dirname, "./src/app/api"),
            styles: resolve(__dirname, "./src/app/styles"),
            images: resolve(__dirname, "./src/app/images")
        }
    },
    module: {
        loaders: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                query: {
                    presets: ["env", "react", "es2015", "stage-0"],
                    plugins: [
                        "add-module-exports",
                        "transform-es2015-modules-umd",
                        "transform-remove-strict-mode",
                        "transform-decorators-legacy"
                    ]
                }
            },
            {
                test: /\.json$/,
                use: "json-loader"
            },
            {
                test: /\.html$/,
                use: "html-loader"
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                query: {
                    presets: ["env", "react", "es2015", "stage-0"],
                    plugins: [
                        "add-module-exports",
                        "transform-es2015-modules-umd",
                        "transform-remove-strict-mode",
                        "transform-decorators-legacy",
                        [
                            "transform-react-jsx",
                            {
                                pragma: "h"
                            }
                        ]
                    ]
                },
                loader: "babel-loader"
            },
            {
                test: /\.scss?$/,
                loader: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName:
                                process.env.ENV === "prod" ? "[hash:base64:5]" : "[folder]__[local]___[hash:base64:5]",
                            discardComments: {
                                removeAll: true
                            },
                            discardUnused: false,
                            mergeIdents: false,
                            reduceIdents: false,
                            safe: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: loader => [
                                require("autoprefixer")({
                                    add: true,
                                    remove: true,
                                    browsers: ["last 2 versions"]
                                })
                            ]
                        }
                    },
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "images/[hash]-[name].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loader: "image-webpack-loader"
                // options: {
                //     mozjpeg: {
                //         progressive: true,
                //         quality: 65
                //     },
                //     // optipng.enabled: false will disable optipng
                //     optipng: {
                //         enabled: false
                //     },
                //     pngquant: {
                //         quality: '65-90',
                //         speed: 4
                //     },
                //     gifsicle: {
                //         interlaced: false
                //     },
                //     // the webp option will enable WEBP
                //     webp: {
                //         quality: 75
                //     }
                // }
            }
        ]
    },
    stats: {
        colors: true
    }
};

// WebpackConfig.plugins = [
//     new webpack.ProvidePlugin({
//         Promise: "es6-promise"
//     })
// ];

if (process.env.ENV === "prod") {
    WebpackConfig.plugins = WebpackConfig.plugins || [];
    WebpackConfig.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            comments: false,
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
            }
        })
    );
}

if (process.env.BUILD_TYPE === "react-build") {
    WebpackConfig.externals = {
        preact: "preact"
    };
}

module.exports = WebpackConfig;