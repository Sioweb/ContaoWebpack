const dotenv = require("dotenv"),
    path = require("path")

dotenv.config()

const ContaoWebpackConfig = require("./webpack.config.contao.js"),
    webpack = require("webpack"),
    BrotliPlugin = require("brotli-webpack-plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    ChunksWebpackPlugin = require("chunks-webpack-plugin")

let oContaoWebpackConfig = new ContaoWebpackConfig({
    dir: __dirname,
    mode: process.env.NODE_ENV || "production",
})

let webpackConfigs = []
for (let [index, theme] of oContaoWebpackConfig.loadConfig().themes.entries()) {
    let entries = theme.getCommonEntries()

    if (entries.length === 0) {
        continue
    }

    let themeConfig = {
        mode: oContaoWebpackConfig.getMode(),
        entry: theme.getCommonEntries(),
        devtool: "source-map",
        output: {
            path: theme.themeSrc('webpack'),
            filename: oContaoWebpackConfig.getOutputScriptName(),
            chunkFilename: oContaoWebpackConfig.getOutputScriptChunkFileName(),
            publicPath: theme.outSrc('webpack') + '/',
        },
        plugins: [
            new ChunksWebpackPlugin(),
            new BrotliPlugin({
                asset: "[path].br[query]",
                test: /\.(js|css|html|svg)$/,
                threshold: 10240,
                minRatio: 0.8,
                deleteOriginalAssets: false,
            }),
            new MiniCssExtractPlugin({
                filename: oContaoWebpackConfig.getOutputStyleName(),
                chunkFilename:
                    oContaoWebpackConfig.getOutputStyleChunkFileName(),
            }),
            new webpack.ProvidePlugin(
                oContaoWebpackConfig.getProvidedPlugins()
            ),
        ],
        optimization: {
            splitChunks: {
                chunks: "all",
                minSize: 10000,
                name: "src/js/vendor.min",
            },
        },
        resolve: {
            modules: [path.resolve(__dirname, "node_modules")],
            alias: oContaoWebpackConfig.getPluginAlias(),
        },
        module: {
            rules: [
                {
                    test: /\.m?jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        "css-loader",
                    ],
                },
                {
                    test: /\.s(c|a)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        "css-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: "src/img/[hash][ext][query]",
                    },
                },
                {
                    test: /\.(eot|ttf|woff|woff2)$/,
                    type: "asset/resource",
                    generator: {
                        filename: "src/fonts/[hash][ext][query]",
                    },
                },
            ],
        },
    }
    console.log(themeConfig)
    webpackConfigs.push(themeConfig)
}

module.exports = webpackConfigs
