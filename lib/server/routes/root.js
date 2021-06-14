/*
 * Request handlers
 */

// Project Dependencies
const helpers = require('../../helpers');
const { static, notFound } = require('../route');

// Module Container
const lib = {};

/**
 * Returns static files from the public directory
 * @param {object} data The request data
 * @param {function} callback The return callback
 */
lib.root = (data, callback) => {
   if (data.file) {
      static(data, '/public', callback);
   } else {
      if (data.method === 'get') {
         const html = helpers.getTemplate();

         if (html) {
            callback(200, html, 'html');
         } else {
            callback(500, undefined, 'html');
         }
      }
   }
};

/**
 * Pings the server
 * @param {object} [data] The request data
 * @param {function} callback The return callback
 */
lib.ping = (data, callback) => {
   console.log(data);
   console.log(`Ping! @ ${new Date().toLocaleTimeString()}`);
   callback(200);
};

/**
 * Returns static files from the public directory
 * @param {object} data The request data
 * @param {function} callback The return callback
 */
lib.public = (data, callback) => static(data, '/public', callback);

// Imported routes
lib.notFound = notFound;
lib.api = require('./api/api').root;

module.exports = lib;
