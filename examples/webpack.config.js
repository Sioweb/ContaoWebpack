const dotenv = require("dotenv"),
      path = require('path');

dotenv.config();

const ContaoWebpackConfig = require('./webpack.config.contao.js'),
      webpack = require('webpack'),
      BrotliPlugin = require('brotli-webpack-plugin'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      ChunksWebpackPlugin = require('chunks-webpack-plugin');

let oContaoWebpackConfig = new ContaoWebpackConfig({
  dir: __dirname,
  mode: process.env.NODE_ENV || 'production'
});

let webpackConfigs = [];
for(let options of oContaoWebpackConfig.loadConfig().theme) {
  webpackConfigs.push({
    mode: oContaoWebpackConfig.getMode(),
    entry: oContaoWebpackConfig.getCommonEntries(options),
    devtool: 'source-map',
    output: {
      path: oContaoWebpackConfig.outSrc(options.name, 'webpack'),
      filename: oContaoWebpackConfig.getOutputScriptName(),
      chunkFilename: oContaoWebpackConfig.getOutputScriptChunkFileName(),
      publicPath: '/files/' + options.name + '/'
    },
    plugins: [
      new ChunksWebpackPlugin(),
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new MiniCssExtractPlugin({
        filename: oContaoWebpackConfig.getOutputStyleName(),
        chunkFilename: oContaoWebpackConfig.getOutputStyleChunkFileName()
      }),
      new webpack.ProvidePlugin(oContaoWebpackConfig.getProvidedPlugins())
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000
      }
    },
    resolve: {
      modules: [
        path.resolve(__dirname, 'node_modules')
      ],
      alias: oContaoWebpackConfig.getPluginAlias(),
    },
    module: {
      rules: [
        {
          test: /\.m?jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              // plugins: ['@babel/plugin-proposal-class-properties']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader'
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                globalVars: oContaoWebpackConfig.importGlobals(options, 'less')
              }
            }
          ],
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ],
        },
        {
          test: /\.jpg$/,
          loader: "file-loader",
          options: {
            outputPath: 'src/img/',
            publicPath: '../img/'
          },
        },
        {
          test: /\.gif$/,
          loader: "file-loader",
          options: {
            outputPath: 'src/img/',
            publicPath: '../img/'
          },
        },
        {
          test: /\.png$/,
          loader: "file-loader",
          options: {
            outputPath: 'src/img/',
            publicPath: '../img/'
          },
        },
        {
          test: /\.svg$/,
          loader: "file-loader",
          options: {
            outputPath: 'src/img/',
            publicPath: '../img/'
          },
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            outputPath: 'src/fonts/',
            publicPath: '../fonts/'
          },
        }
      ],
    }
  })
}

module.exports = webpackConfigs;
