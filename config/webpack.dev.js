const common = require('./webpack.common.js');

const { merge } = require('webpack-merge');

module.exports = merge(common, {
    devtool: 'source-map',
    devServer: {
        port: 8080,
    },
});