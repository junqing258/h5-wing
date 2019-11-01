const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const WebpackMd5Hash = require('webpack-md5-hash');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const autoconfig = require('./autoconfig.js');

const PACK_PATH = path.join(__dirname, './dist');

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production';

  const definePlugin = new webpack.DefinePlugin({
    __DEV__: !isProd,
    __SERVE__: process.env.devServer,
  });

  const webpackConfig = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
      app: path.resolve(__dirname, '../src/main'),
    },
    devtool: !isProd ? 'source-map' : false,
    output: {
      pathinfo: false,
      path: PACK_PATH,
      filename: !isProd ? '[name].js?[hash:6]' : '[name].[chunkhash:6].js',
      chunkFilename: 'js/[id].[name].chunk.js',
    },
    watch: !isProd,
    plugins: [
      definePlugin,
      // new WebpackMd5Hash(),
      new ProgressBarPlugin(),
      new CleanWebpackPlugin(PACK_PATH, {
        root: __dirname,
        verbose: true,
        dry: false,
      }),
      new MiniCssExtractPlugin({
        filename: !isProd ? '[name].css' : '[name].[contenthash:6].css',
        chunkFilename: !isProd ? '[id].css' : '[id].[chunkhash:6].css',
      }),
      new HtmlWebpackPlugin({
        title: '平安好医生',
        template: './index.ejs',
        filename: 'index.html',
        minify: isProd
          ? {
              minifyCSS: true,
              minifyJS: false,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              collapseWhitespace: true,
              removeComments: true,
            }
          : null,
        inject: true,
        script: {
          BEACON: `<script src="${autoconfig.BEACON_URL}"></script>`,
          SENTRY: `<script src="${autoconfig.SENTRY}"></script>`,
        },
      }),
      new HtmlWebpackInlineSourcePlugin(),
    ],
    optimization: {
      splitChunks: {
        chunks: 'initial',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: 20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/,
          use: ['babel-loader'],
          include: path.join(__dirname, '../src'),
          // options: {
          //   configFile: resolve('babel.config.js')
          // },
        },
        {
          test: /\.s?css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: !isProd,
              },
            },
            {
              loader: 'css-loader',
              options: {
                modules: false,
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
            'postcss-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader',
              options: {
                // 8192 = 1024 * 8 小于等于8k的转换成 base64
                limit: 8192,
                name: !isProd ? './assets/[name].[ext]' : './assets/[name].[contenthash:6].[ext]',
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|svg|eot|ttf)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10240,
                name: !isProd ? './assets/fonts/[name].[ext]' : './assets/fonts/[name].[contenthash:6].[ext]',
              },
            },
          ],
        },
      ],
    },
    devServer: {
      hot: true,
      // https: true,
      host: '0.0.0.0',
      // publicPath: "/h5-wing/",
      contentBase: PACK_PATH,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modules: [path.resolve(__dirname, './../src'), path.resolve(__dirname, './../node_modules')],
      alias: {
        '@': path.resolve(__dirname, './../src'),
      },
    },
  };

  if (!isProd) {
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    webpackConfig.plugins.push(
      new WorkboxPlugin.GenerateSW({
        // 这些选项帮助快速启用 ServiceWorkers
        // 不允许遗留任何“旧的” ServiceWorkers
        clientsClaim: true,
        skipWaiting: true,
        cacheId: 'h5-wing', // 设置前缀
        skipWaiting: true, // 强制等待中的 Service Worker 被激活
        clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
        globDirectory: 'dist',
        globPatterns: ['**/*.{html,js,css}'],
        globIgnores: ['sw.js', 'unpack.json'], // 忽略的文件
        swDest: 'sw.js',
        importWorkboxFrom: 'local',
        runtimeCaching: [
          // 配置路由请求缓存
          {
            urlPattern: /.*\.js/, // 匹配文件
            handler: 'networkFirst', // 网络优先
          },
        ],
      }),
    );
  }

  return webpackConfig;
};
