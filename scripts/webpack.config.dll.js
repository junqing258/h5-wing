const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  mode: 'production', //process.env.NODE_ENV || 'development',
  context: __dirname,
  entry: {
    vendor: ['react', 'react-dom', 'redux', 'react-redux'],
  },
  output: {
    // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dist/dll/'),
    // library必须和后面dllplugin中的name一致
    library: '[name]_dll_[chunkhash]',
  },
  plugins: [
    // 接入 DllPlugin
    new webpack.DllPlugin({
      context: __dirname,
      // 动态链接库的全局变量名称，需要和 output.library 中保持一致
      // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
      name: '[name]_dll_[chunkhash]',
      // 描述动态链接库的 manifest.json 文件输出时的文件名称
      path: path.join(__dirname, '../dist/dll/', '[name].manifest.json'),
    }),
    new AssetsPlugin({
      filename: 'bundle-config.json',
      path: path.join(__dirname, '../dist/dll/'),
    }),
  ],
};
