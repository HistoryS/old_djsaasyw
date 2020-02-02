var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this nessessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                    // other vue-loader options go here
                }
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(png|jpg|gif|svg)$/,
        　　　　  loader: 'url-loader?limit=108192'
            }, {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            // {
            //     test: /\.(eot|woff|woff2|ttf)([\\?]?.*)$/,
            //     loader: "file"
            // },
            {
                test: /\.(eot|svg|ttf|woff|woff2)/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }, {
                test: /\.less$/,
                loader: "style-loader!css-loader!less-loader",
            },

        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            _:"lodash",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        // new HtmlWebpackPlugin({
        //     title: '鲜丰水果大数据平台',
        //     template: 'index.html' // 模板路径
        // }),
    ],
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js',
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
        // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}