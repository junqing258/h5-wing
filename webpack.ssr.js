const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackMd5Hash = require('webpack-md5-hash');
const nodeExternals = require('webpack-node-externals');

const common = require('./webpack.common.js');
// const prod = require('./webpack.production.js');

const mode = process.env.mode;

module.exports = () => {
	return Object.assign(common, {
		name: 'ssr',
		entry: { 
			'ssr': './server/render.tsx',
		},
		output: {
			path: path.resolve(__dirname, 'ssr'),
			filename: 'ssr.js',
			libraryTarget: 'commonjs2',
		},
		// externals: nodeExternals(),
		optimization: {
			namedModules: false,
		},
	});
};
