'use strict';

const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',

    context: `${__dirname}/src/`,

    entry: {
        'autocomplete-cpnt': './autocomplete-cpnt.js',
        'autocomplete-cpnt.min': './autocomplete-cpnt.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'autocompleteComponent',
        libraryTarget: 'var'
    },

    performance: {hints: false},

    optimization: {
        minimizer: [
            new TerserPlugin({
                include: /\.min\.js$/,
                parallel: true,
                terserOptions: {
                    compress: true,
                    ie8: false,
                    ecma: 5,
                    output: {comments: false},
                    warnings: false
                }
            })
        ]
    },

    plugins: [
        new CleanWebpackPlugin()
    ]
};