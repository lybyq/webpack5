const path = require('path')
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const smp = new SpeedMeasurePlugin();

const isEnvProduction = process.env.NODE_ENV === 'production'
console.log(isEnvProduction)

module.exports = smp.wrap({
  entry: './src/index.js',
  output: {
    filename: isEnvProduction ? '[name].[contenthash].js' : '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
      // ....自行配置
    },
    symlinks: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack5'
    }),
    // 构建进度条
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`
    }),
    // 打包体积分析
    new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  // 需要兼容到以下浏览器的什么版本
                  "targets": {
                    "ie": 7,
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1",
                  },
                  // 按需加载
                  "useBuiltIns": "usage",
                  "corejs": "3.16.3",
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: path.resolve(__dirname, 'src'),
        type: 'asset/resource',
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/i,
        include: [
          path.resolve(__dirname, 'src')
        ],
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        // exclude: /node_modules/,
        // include: path.resolve(__dirname, 'src'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // postcss-preset-env 包含 autoprefixer
                    'postcss-preset-env'
                  ],
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              // `dart-sass` 是首选
              implementation: require('sass'),
            },
          }
        ]
      }
    ]
  }
})