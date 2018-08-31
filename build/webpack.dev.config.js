const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const base = require('./webpack.base.config.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const config = merge(base, {
	mode: 'development',
	devServer: {
		port: 8080,
		host: 'localhost',
		hot: true,
		index: 'index.html'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, '../', 'index.html'),
			filename: 'index.html'
		}),
		new webpack.HotModuleReplacementPlugin()
	]
})
module.exports = config