// Node Dependencies
const path = require('path');
const fs = require('fs');

// Project Dependencies
const _logs = require('../logs');

// Module container
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
 * Returns static files
 * @param {object} data The request data
 * @param {string} root The location of the root directory
 * @param {function} callback The return callback
 */
lib.static = (data, root, callback) => {
   let { file, method } = data;

   if (data.url === '/favicon.ico') {
      console.log(data);
   }

   file = data.dir ? data.dir + file : file;

   if (method === 'get') {
      try {
         if (!file) throw error;

         file = path.join(__dirname, '/../..', root, file);

         const output = fs.readFileSync(file);
         const { ext } = path.parse(file);

         callback(200, output, ext);
      } catch (error) {
         let log = 'Location: route.js\n';
         log += `Error: ${error.message}\n`;
         log += `Request: ${JSON.stringify(data, null, 2)}`;
         _logs.append(log);

         callback(404);
      }
   } else {
      callback(405, { error: 'Method not allowed' });
   }
};

/**
 * Not found route
 * @param {object} [data] The request data
 * @param {function} callback The return callback
 */
lib.notFound = (data, callback) => callback(404);

// Export module
module.exports = lib;
