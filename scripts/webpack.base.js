/* eslint-disable @typescript-eslint/explicit-function-return-type */
const path = require('path');
const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PACK_PATH = path.join(__dirname, '../dist');

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production';

  const definePlugin = new webpack.DefinePlugin({
    __DEV__: !isProd,
    __SERVE__: process.env.devServer,
  });

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
      definePlugin,
      new ProgressBarPlugin(),
      // new CleanWebpackPlugin(PACK_PATH, {
      //   root: path.resolve(__dirname, '../'),
      //   verbose: true,
      //   dry: false,
      //   exclude: ['dll'],
      // }),
      new MiniCssExtractPlugin({
        filename: !isProd ? '[name].css' : '[name].[contenthash:6].css',
        chunkFilename: !isProd ? '[id].css' : '[id].[chunkhash:6].css',
      }),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
      }),
      // new HtmlWebpackInlineSourcePlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/,
          loader: 'babel-loader',
          include: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../server')],
          options: {
            configFile: path.resolve(__dirname, './babel.config.js'),
          },
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
            'sass-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024 * 8,
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
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modules: [path.resolve(__dirname, './../src'), path.resolve(__dirname, './../node_modules')],
      alias: {
        '@': path.resolve(__dirname, './../src'),
      },
    },
  };

  return webpackConfig;
};
