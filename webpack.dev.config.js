var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }
        }]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'tu.dev.js'
    },
    watch: true
};
