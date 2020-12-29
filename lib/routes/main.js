/*
 * Request handlers
 */

// Node Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('../helpers');

// Project Dependencies
const account = require('./account/main');
const api = require('./api/main');

const lib = {};

lib.parse = (str) => {
   const { ext, base: fileName } = path.parse(str);

   const file = ext ? fileName : undefined;

   str = file ? str.replace(file, '/') : str;

   str = str.replace(/^\/+|\/+$/g, '');

   let subPath = str.split('/');

   let base = subPath[0];

   subPath.shift();

   subPath = `/${subPath.join('/')}`;

   return { base, subPath, file };
};

lib.root = (data, callback) => {
   if (data.file) {
      lib.static(data, '/public', callback);
   } else {
      if (data.method === 'get') {
         // Prepare data for interpolation
         const templateData = {
            'head.title': `Welcome`,
            'body.class': 'index',
         };

         helpers.getTemplate('index', templateData, (err, str) => {
            if (!err && str) {
               // Add the universal header and footer
               helpers.addUniversalTemplates(str, templateData, (err, str) => {
                  if (!err && str) {
                     // Return the string as HTML
                     callback(200, str, 'html');
                  } else {
                     callback(500, undefined, 'html');
                  }
               });
            } else {
               callback(500, undefined, 'html');
            }
         });
      }
   }
};

lib.account = (data, callback) => {
   const { subPath } = data;

   const update = lib.parse(subPath);

   data = { ...data, ...update };

   const router = {
      create: account.create,
      edit: account.edit,
   };

   const route = typeof router[data.base] !== 'undefined' ? router[data.base] : lib.notFound;

   data = { ...data, ...update };

   route(data, callback);
};

lib.api = (data, callback) => {
   const { subPath } = data;

   const update = lib.parse(subPath);

   data = { ...data, ...update };

   const router = {};

   const route = typeof router[data.base] !== 'undefined' ? router[data.base] : lib.notFound;

   data = { ...data, ...update };

   route(data, callback);
};

lib.cart = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Cart`,
         'body.class': 'cartEdit',
      };

      // Read in the index template as a string
      helpers.getTemplate('cartEdit', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

lib.checkout = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Checkout`,
         'body.class': 'checkout',
      };

      // Read in the index template as a string
      helpers.getTemplate('checkout', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

lib.item = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Edit Item`,
         'body.class': 'itemEdit',
      };

      // Read in the index template as a string
      helpers.getTemplate('itemEdit', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

lib.menu = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Menu`,
         'body.class': 'menu',
      };

      // Read in the index template as a string
      helpers.getTemplate('menu', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

/**
 * Returns static files from the public directory
 * @param {data} data The request data
 * @param {function} callback The return callback
 */
lib.session = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Log In`,
         'body.class': 'sessionCreate',
      };

      // Read in the index template as a string
      helpers.getTemplate('sessionCreate', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

/**
 * Ping route
 * @param {data} [data] The request data
 * @param {function} callback The return callback
 */
lib.ping = (data, callback) => callback(200);

/**
 * Returns static files from the public directory
 * @param {data} data The request data
 * @param {string} dir The location of the file
 * @param {function} callback The return callback
 */
lib.public = (data, callback) => lib.static(data, '/public', callback);

/**
 * Returns static files
 * @param {data} data The request data
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
 * @param {data} [data] The request data
 * @param {function} callback The return callback
 */
lib.notFound = (data, callback) => callback(404);

module.exports = lib;
