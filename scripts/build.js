// const glob = require('glob');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const history = require('connect-history-api-fallback');

const { resolve } = path;
// const ProgressPlugin = require('webpack/lib/ProgressPlugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const webpackConfig = require('./webpack.base')();

const args = process.argv.slice(2);
const useServer = !!args.find(v => v.indexOf('server') > -1);

const compiler = webpack(
  Object.assign({}, webpackConfig, {
    entry: {
      app: [path.resolve(__dirname, '../src/main')],
    },
  }),
);

// server
if (useServer) {
  const express = require('express');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  /* dev Server */
  const app = express();
  // 用 webpack-dev-middleware 启动 webpack 编译
  const devMiddleware = webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.path,
    overlay: true,
    hot: true,
  });
  app.use(devMiddleware);

  // 使用 webpack-hot-middleware 支持热更新
  app.use(
    webpackHotMiddleware(compiler, {
      publicPath: webpackConfig.output.path,
      noInfo: true,
    }),
  );

  // 添加静态资源拦截转发
  app.use(express.static(resolve(__dirname, '../dist')));
  // send the user to index html page inspite of the url
  app.use(history());

  const port = 8080;
  app.listen(port, function(err) {
    if (err) return console.log(err);
  });

  compiler.hooks.done.tap('BuildStatsPlugin', stats => {
    setTimeout(() => {
      console.log('listen at', chalk.bgGreen(`http://localhost:${port}`));
    }, 0);
  });
} else {
  compiler.run((err, stats) => {
    if (err) throw err;
    process.stdout.write(
      stats.toString({
        color: true,
        modules: false,
        children: false,
        chunks: true,
        chunkModules: false,
      }) + '\n',
    );
  });
}
