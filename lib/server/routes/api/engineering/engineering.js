/**
 * Engineering request handlers
 */

// Project dependencies
const { parse, notFound } = require('../../../route');

// Module container
const lib = {};

/**
 * Sends request to a method
 * @param {object} data The request data
 * @param {function} callback The callback function
 */
lib.root = (data, callback) => {
   const methods = ['get'];

   if (methods.includes(data.method)) {
      lib[data.method](data, callback);
   } else {
      callback(405);
   }
};

/**
 * Sends get request to the correct route
 * @param {object} data The request data
 * @param {string} data.dir Where to route the request
 * @param {function} callback The callback function
 */
lib.get = (data, callback) => {
   const route = parse(data.dir).root;

   if (route in lib.router) {
      lib.router[route](data, callback);
   } else {
      notFound(data, callback);
   }
};

lib.router = {
   platform: require('./platform').root,
};

// Export module
module.exports = lib;
