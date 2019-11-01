const path = require('path');
const babelConfig = require('../babel.config');
require('asset-require-hook')({
  extensions: ['svg', 'css', 'scss', 'jpg', 'png', 'gif'],
  name: '/asset/[name].[ext]',
});

require('@babel/register')({
  ...babelConfig,
  extensions: ['.ts', '.tsx', '.jsx', '.js'],
  cache: true,
});
// require('@babel/polyfill');
require('node-require-alias').setAlias({
  '@': path.join(__dirname, '../src'),
});

require('./server');
