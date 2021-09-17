const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = ()=>{
  const config = {
    splitChunks: {
      chunks: 'all',
},
  }
  if (isProd) {config.minimizer = [
    new OptimizeCssAssetsWebpackPlugin(),
    new TerserWebpackPlugin()
  ]}
  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './index.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      extensions: ['.js', '.json', '.png']
    },
    optimization: optimization(),
    plugins: [
      new HTMLWebpackPlugin({
        // title: 'E-commerce Shop',
        template: './index.html',
        minify: {
          collapseWhitespace:isProd
        }
      }),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        // chunkFilename: '[name].[id].[contenthash].css',
      })
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use:[ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.scss$/,
          use: [  MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'],
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75
                }
              }
            },
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {loader:'babel-loader', options: {
            presets: ['@babel/preset-env']
          }},
        }
      ]
    },
    devServer: {
      port: 5500,
      hot: isDev
    },
}