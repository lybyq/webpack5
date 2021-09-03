const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const glob = require('glob')
const path = require('path')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      // 包含所有的chunks
      chunks: 'all',
      // 重复打包问题
      cacheGroups:{
        vendors:{ // node_modules里的代码
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          // name: 'vendors', 一定不要定义固定的name
          priority: 10, // 优先级
          enforce: true 
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        }
      }),
      new CssMinimizerPlugin({
        parallel: 4
      }),
      new MiniCssExtractPlugin({
        filename: "[hash].[name].css"
      }),
      // CSS的 Tree Shaking
      new PurgeCSSPlugin({
        paths: glob.sync(`${path.resolve(__dirname, 'src')}/**/*`,  { nodir: true }),
      })
    ]
  }
})