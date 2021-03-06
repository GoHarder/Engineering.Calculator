// Node Dependencies
const path = require('path');

// NPM Dependencies
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const sveltePreprocess = require('svelte-preprocess');

// Checks the cli command if it includes the watch flag
const watch = process.argv.includes('--watch');

// The entry files to process
const entry = {
   app: ['./src/scss/style.scss', './src/js/app.js'],
   sw: ['./src/js/sw.js'],
};

// The file it compiles to
const output = {
   filename: '[name].js',
   path: path.resolve(__dirname, 'public'),
};

// Rules
const rules = [];

rules[0] = {
   test: /\.js$/,
   exclude: /node_modules/,
   use: {
      loader: 'babel-loader',
      options: {
         presets: ['@babel/preset-env'],
         plugins: ['@babel/plugin-transform-runtime'],
      },
   },
};

rules[1] = {
   test: /\.(html|svelte)$/,
   use: {
      loader: 'svelte-loader',
      options: {
         preprocess: sveltePreprocess({
            babel: {
               presets: [
                  [
                     '@babel/preset-env',
                     {
                        loose: true,
                        // No need for babel to resolve modules
                        modules: false,
                        targets: {
                           // ! Very important. Target es6+
                           esmodules: true,
                        },
                     },
                  ],
               ],
            },
         }),
         emitCss: true,
      },
   },
};

rules[2] = {
   test: /\.(sa|sc|c)ss$/,
   use: [
      'style-loader',
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      {
         loader: 'sass-loader',
         options: {
            sassOptions: {
               includePaths: ['./src/scss', './node_modules'],
            },
         },
      },
   ],
};

// Plugins
const plugins = [];

plugins[0] = new MiniCssExtractPlugin({
   filename: 'style.css',
   chunkFilename: 'style.[id].css',
});

plugins[1] = new OptimizeCssAssetsPlugin({
   assetNameRegExp: /\.css$/g,
   cssProcessor: require('cssnano'),
   cssProcessorPluginOptions: {
      preset: ['default', { discardComments: { removeAll: true } }],
   },
   canPrint: true,
});

if (watch) {
   plugins[2] = new LiveReloadPlugin({
      options: {
         delay: 10000,
         ignore: /node_modules/,
      },
   });
}

// File watch options
const watchOptions = {
   // aggregateTimeout: 1000,
   ignored: /node_modules/,
   // poll: 5000,
};

// Export the settings
module.exports = {
   entry,
   output,
   module: { rules },
   plugins,
   watch,
   watchOptions,
};
