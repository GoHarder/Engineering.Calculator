// Node Dependencies
const path = require('path');
const { webpack } = require('webpack');

// NPM Dependencies
const LiveReloadPlugin = require('@kooneko/livereload-webpack-plugin');

// Module Container
const lib = {};

const watch = process.argv.includes('--watch');

// File Entry
lib.entry = {
   app: ['./src/js/app.js', './public/style.css'],
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

lib.module.rules[0] = {
   test: /\.css$/,
   exclude: /node_modules/,
   use: 'null-loader',
};

lib.module.rules[1] = {
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

if (watch) {
   lib.plugins[0] = new LiveReloadPlugin({
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
