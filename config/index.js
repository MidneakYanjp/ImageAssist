'use strict'

const path = require('path')

module.exports = {
	dev: {
		assetsResource : 'static',
		assetsPublicPath: '/',
		host: 'localhost',
		port: 8080,
		autoOpenBrowser: true
	},

	build: {
		index: path.resolve(__dirname, '../dist/index.html'),
		assetsResource : 'static',
		assetsPublicPath: '/',
		assetRoot: path.join(__dirname, '../dist')
	}
}