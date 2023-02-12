const dotenv = require("dotenv")
dotenv.config()

const OxWebpackConfig = require('./webpack.config.oxid.js');

module.exports = ( env, argv ) => {

  let oOxWebpackConfig = new OxWebpackConfig({
    dir: __dirname,
    mode: env.NODE_ENV || 'production'
  })

  const createVariants = require('parallel-webpack').createVariants

  const webpack = require('webpack')

  const BrotliPlugin = require('brotli-webpack-plugin')
  const Copy = require('copy-webpack-plugin')
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const ChunksWebpackPlugin = require('chunks-webpack-plugin')

  const configuration = options => ({
    mode: oOxWebpackConfig.getMode(),
    entry: oOxWebpackConfig.getCommonEntries(options.theme),
    output: {
      path: oOxWebpackConfig.outSrc(options.theme.name),
      filename: oOxWebpackConfig.getOutputScriptName(),
      chunkFilename: oOxWebpackConfig.getOutputScriptChunkFileName(),
      publicPath: '/out/' + options.theme.name
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
        filename: oOxWebpackConfig.getOutputStyleName(),
        chunkFilename: oOxWebpackConfig.getOutputStyleChunkFileName()
      }),
      new webpack.ProvidePlugin(oOxWebpackConfig.getProvidedPlugins()),
      new Copy([
        {
          from: oOxWebpackConfig.viewsSrc(options.theme.name, 'out'),
          to: oOxWebpackConfig.outSrc(options.theme.name, '')
        }
      ]),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000
      }
    },
    resolve: {
      modules: [
        // oOxWebpackConfig.themeSrc('ci', 'build/less'),
        "node_modules",
      ],
      alias: oOxWebpackConfig.getPluginAlias(),
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            'css-loader'
          ],
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
            },
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                globalVars: oOxWebpackConfig.importGlobals(options.theme, 'less')
              }
            }
          ],
        },
        {
          test: /\.s(c|a)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: process.env.NODE_ENV === 'development',
              },
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

  return createVariants({}, oOxWebpackConfig.loadConfig(), configuration)
}