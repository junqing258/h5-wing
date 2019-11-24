const path = require('path');
const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const config = require('./webpack.base')();

const serverConfig = {
  // mode: 'production',
  target: 'node', // 构建目标为 node，在服务器端不需要将 require 的包打包
  entry: {
    ssr: [path.resolve(__dirname, '../src/server/render.tsx')],
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: path.resolve(__dirname, 'node_modules'),
      },
      {
        //css代码不能被打包进用于服务端的代码中去，忽略掉css文件
        test: /\.css/,
        use: ['ignore-loader'],
      },
    ],
  },
  devtool: 'source-map',
};

module.exports = merge(config, serverConfig);
