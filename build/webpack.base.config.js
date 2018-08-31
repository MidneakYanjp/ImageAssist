const path = require('path')
const config = require('../config')
const VueLoaderPlugin = require('vue-loader')
module.exports = {
	context: path.join(__dirname, '../'),
	entry: {
		app: './src/main.js'
	},
	output: {
		path: config.build.assetRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production'
		? config.build.assetsPublicPath: config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json']
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: path.join(__dirname, '../', 'node_modules')
			},
			{
				test:  /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader'
			},
			{
				test: /\.css$/,
				loaders: ['style-loader', 'css-loader']
			}
		]
	},
	plugins: [
		new VueLoaderPlugin.VueLoaderPlugin()
	]
}
