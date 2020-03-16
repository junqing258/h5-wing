const path = require('path');
const babelConfig = require('../scripts/babel.config');

require('@babel/register')({
  ...babelConfig,
  extensions: ['.ts', '.tsx', '.jsx', '.js'],
  cache: true,
  ignore: null,
});
// require('@babel/polyfill');

// css 的转码 hook
// require('css-modules-require-hook')({
//   extensions: ['.scss'],
//   preprocessCss: (data, filename) =>
//     require('node-sass').renderSync({
//       data,
//       file: filename,
//     }).css,
//   camelCase: true,
//   generateScopedName: '[name]__[local]__[hash:base64:8]',
// });

require('asset-require-hook')({
  extensions: ['svg', 'css', 'scss', 'jpg', 'png', 'gif'],
  name: '/assets/[name].[ext]',
});

require('node-require-alias').setAlias({
  '@': path.join(__dirname, '../src'),
});

require('./server');
