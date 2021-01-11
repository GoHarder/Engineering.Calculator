// Node Dependencies
const path = require('path');

// NPM Dependencies
const LiveReloadPlugin = require('@kooneko/livereload-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Module Container
const lib = {};

const watch = process.argv.includes('--watch');

// File Entry
lib.entry = {
   app: ['./src/js/app.js', './src/scss/style.scss'],
};

// File Output
lib.output = {
   path: path.resolve(__dirname, 'public'),
};

//Rules
lib.module = { rules: [] };

lib.module.rules[0] = {
   test: /\.html$/,
   exclude: /node_modules/,
   use: 'null-loader',
};

lib.module.rules[1] = {
   test: /\.scss$/,
   exclude: /node_modules/,
   use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }, { loader: 'postcss-loader' }, { loader: 'sass-loader' }],
};

lib.module.rules[2] = {
   test: /\.svelte$/,
   exclude: /node_modules/,
   use: {
      loader: 'svelte-loader',
      options: {
         preprocess: require('svelte-preprocess')({
            postcss: {
               plugins: [require('autoprefixer')()],
            },
         }),
      },
   },
};

// Plugins
lib.plugins = [];

lib.plugins[0] = new MiniCssExtractPlugin({
   filename: 'style.css',
});

if (watch) {
   lib.plugins[1] = new LiveReloadPlugin({
      options: {
         ignore: /node_modules/,
      },
   });
}

// File Watch
lib.watch = watch;

lib.watchOptions = {
   aggregateTimeout: 200,
   ignored: /node_modules/,
   poll: 1000,
};

// Export the Module
module.exports = lib;
