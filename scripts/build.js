// const glob = require('glob');
const { resolve } = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const webpackConfig = require('./webpack.config')();

const args = process.argv.slice(2);
const useServer = !!args.find(v => v.indexOf('server') > -1);

const compiler = webpack(Object.assign({}, webpackConfig, {}));

compiler.apply(
  new ProgressPlugin((percentage, msg, current, active, modulepath) => {
    if (process.stdout.isTTY && percentage < 1) {
      process.stdout.cursorTo(0);
      modulepath = modulepath ? ' …' + modulepath.substr(modulepath.length - 30) : '';
      current = current ? ' ' + current : '';
      active = active ? ' ' + active : '';
      process.stdout.write((percentage * 100).toFixed(0) + '% ' + msg + current + active + modulepath + ' ');
      process.stdout.clearLine(1);
    } else if (percentage === 1) {
      process.stdout.write('\n');
      console.log('webpack: done.');
    }
  }),
);

// server
if (useServer) {
  const express = require('express');
  const cors = require('cors');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  /* dev Server */
  const app = express();
  app.use(cors());
  // 用 webpack-dev-middleware 启动 webpack 编译
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      overlay: true,
      hot: true,
    }),
  );

  // 使用 webpack-hot-middleware 支持热更新
  app.use(
    webpackHotMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      noInfo: true,
    }),
  );

  // 添加静态资源拦截转发
  app.use(express.static(resolve(__dirname, '../dist')));
  const port = 7002;
  app.listen(port, function(err) {
    if (err) return console.log(err);
    console.log('listen at', chalk.bgGreen(`http://localhost:${port}`));
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
