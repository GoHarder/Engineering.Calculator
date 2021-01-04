/*
 * Request handlers
 */

// Node Dependencies
const fs = require('fs');
const path = require('path');

// Project Dependencies
const helpers = require('../../helpers');

// Module Container
const lib = {};

/**
 * Parses a path for the server
 * @param {string} reqPath The path of the resource
 */
lib.parse = (reqPath) => {
   const { ext, base } = path.parse(reqPath);

   const file = ext ? base : undefined;

   reqPath = file ? reqPath.replace(file, '') : reqPath;

   const root = reqPath.match(/^\/([^\/]*)/);

   const dir = reqPath.replace(root[0], '');

   return { root: root[1], dir, file };
};

/**
 * Returns static files from the public directory
 * @param {object} data The request data
 * @param {function} callback The return callback
 */
lib.root = (data, callback) => {
   if (data.file) {
      lib.static(data, '/public', callback);
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
lib.ping = (data, callback) => callback(200);

/**
 * Returns static files from the public directory
 * @param {object} data The request data
 * @param {function} callback The return callback
 */
lib.public = (data, callback) => lib.static(data, '/public', callback);

/**
 * Returns static files
 * @param {object} data The request data
 * @param {string} dir The location of the file
 * @param {function} callback The return callback
 */
lib.static = (data, dir, callback) => {
   let { file, method } = data;

   if (method === 'get') {
      try {
         if (!file) throw error;

         file = path.join(__dirname, '/../..', dir, file);

         const output = fs.readFileSync(file);
         const { ext } = path.parse(file);

         callback(200, output, ext);
      } catch (error) {
         callback(404);
      }
   } else {
      callback(405);
   }
};

/**
 * Not found route
 * @param {object} [data] The request data
 * @param {function} callback The return callback
 */
lib.notFound = (data, callback) => callback(404);

// Imported routes
lib.users = require('./users').root;

module.exports = lib;
