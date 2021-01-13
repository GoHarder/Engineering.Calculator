// Node Dependencies
const path = require('path');

// NPM Dependencies
const LiveReloadPlugin = require('webpack-livereload-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sveltePreprocess = require('svelte-preprocess');
const sass = require('sass');

// Checks the cli command if it includes the watch flag
const watch = process.argv.includes('--watch');

// The module container
const lib = {};

// The entry files to process
lib.entry = ['./src/scss/style.scss', './src/js/app.js'];

// The file it compiles to
lib.output = {
   filename: 'app.js',
   path: path.resolve(__dirname, 'public'),
};

// Rules
lib.module = { rules: [] };

lib.module.rules[0] = {
   test: /\.(html|svelte)$/,
   exclude: /node_modules/,
   use: {
      loader: 'svelte-loader',
      options: {
         emitCss: true,
         preprocess: sveltePreprocess(),
      },
   },
};

lib.module.rules[1] = {
   test: /\.css$/,
   exclude: /node_modules/,
   use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
};

lib.module.rules[2] = {
   test: /\.scss$/,
   exclude: /node_modules/,
   use: [
      MiniCssExtractPlugin.loader,
      { loader: 'css-loader' },
      { loader: 'postcss-loader' },
      {
         loader: 'sass-loader',
         options: {
            implementation: sass,
            webpackImporter: false,
            sassOptions: {
               includePaths: ['./node_modules'],
            },
         },
      },
   ],
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

// File watch options
lib.watch = watch;

lib.watchOptions = {
   aggregateTimeout: 200,
   ignored: /node_modules/,
   poll: 1000,
};

// Export the container
module.exports = lib;
