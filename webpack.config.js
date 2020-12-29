// Node Dependencies
const path = require('path');

// Module Container
const lib = {};

lib.entry = {
   app: './src/js/app.js',
};

lib.output = {
   path: path.resolve(__dirname, 'public'),
};

lib.watch = process.argv.indexOf('--watch') > -1;

lib.watchOptions = {
   aggregateTimeout: 500,
   ignored: /node_modules/,
   poll: 1000,
};

// Export the Module
module.exports = lib;
