// Node Dependencies
const path = require('path');

// Module Container
const lib = {};

// File Entry
lib.entry = {
   app: './src/js/app.js',
};

// File Output
lib.output = {
   path: path.resolve(__dirname, 'public'),
};

//Rules
lib.module = { rules: [] };

// lib.module.rules[0] = {
//    test: /\.svelte$/,
//    exclude: /node_modules/,
//    use: 'svelte-loader',
// };

lib.module.rules[0] = {
   test: /\.svelte$/,
   exclude: /node_modules/,
   use: {
      loader: 'svelte-loader',
      options: {
         preprocess: require('svelte-preprocess')({
            // options
         }),
      },
   },
};

// File Watch
lib.watch = process.argv.indexOf('--watch') > -1;

lib.watchOptions = {
   aggregateTimeout: 200,
   ignored: /node_modules/,
   poll: 1000,
};

// Export the Module
module.exports = lib;
