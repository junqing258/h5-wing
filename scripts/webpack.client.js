const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const merge = require('webpack-merge');

const config = require('./webpack.base')();

// const autoconfig = require('./autoconfig.js.js');

const PACK_PATH = path.join(__dirname, '../dist');

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production';

  const webpackConfig = {
    mode: isProd ? 'production' : 'development',
    devtool: !isProd ? 'source-map' : false,
    entry: {},
    output: {
      pathinfo: false,
      path: PACK_PATH,
      filename: !isProd ? '[name].js' : '[name].[hash:6].js',
      chunkFilename: !isProd ? '[id].[name].js' : '[id].[name].[chunkhash:6].js',
    },
    watch: !isProd,
    plugins: [
      new HtmlWebpackPlugin({
        title: '平安好医生',
        template: './index.ejs',
        filename: 'index.html',
        inject: true,
        script: {
          // BEACON: `<script src="${autoconfig.BEACON_URL}"></script>`,
          // SENTRY: `<script src="${autoconfig.SENTRY}"></script>`,
        },
      }),
      /* new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, '../dist/dll/*.dll.js'),
      }), */
      new HtmlWebpackInlineSourcePlugin(),
    ],
    optimization: {
      // splitChunks: {
      //   chunks: 'initial',
      //   cacheGroups: {
      //     libs: {
      //       test: /[\\/]node_modules[\\/]/,
      //       priority: -10,
      //     },
      //     default: {
      //       minChunks: 2,
      //       priority: 20,
      //       reuseExistingChunk: true,
      //     },
      //   },
      // },
    },
  };

  if (!isProd) {
    // webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
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

  return merge(config, webpackConfig);
};
