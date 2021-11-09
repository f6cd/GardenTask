const common = require('./webpack.common.js');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    devtool: false,
    optimization: {
        minimize: true,
        runtimeChunk: {
            name: 'runtime',
        },
        splitChunks: {
            chunks: 'all',
        },
    },
    performance: {
        hints: false,
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
});