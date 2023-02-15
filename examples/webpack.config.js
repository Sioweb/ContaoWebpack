const dotenv = require("dotenv")
dotenv.config();

const ContaoWebpackConfig = require('./webpack.config.contao.js');

/**/
module.exports = ( env, argv ) => {

  let oContaoWebpackConfig = new ContaoWebpackConfig({
    dir: __dirname,
    mode: env.NODE_ENV || 'production'
  })

  const createVariants = require('parallel-webpack').createVariants
  const webpack = require('webpack')

  const BrotliPlugin = require('brotli-webpack-plugin')
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const ChunksWebpackPlugin = require('chunks-webpack-plugin')

  const configuration = options => ({
    mode: oContaoWebpackConfig.getMode(),
    entry: oContaoWebpackConfig.getCommonEntries(options.theme),
    output: {
      path: oContaoWebpackConfig.outSrc(options.theme.name, 'webpack'),
      filename: oContaoWebpackConfig.getOutputScriptName(),
      chunkFilename: oContaoWebpackConfig.getOutputScriptChunkFileName(),
      publicPath: '/files/' + options.theme.name
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
        "node_modules",
      ],
      alias: oContaoWebpackConfig.getPluginAlias(),
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
                globalVars: oContaoWebpackConfig.importGlobals(options.theme, 'less')
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
  /**/
  return createVariants({}, oContaoWebpackConfig.loadConfig(), configuration)
}
