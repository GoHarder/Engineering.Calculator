const helpers = require('../../helpers');

const lib = {};

lib.create = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Sign Up`,
         'body.class': 'accountCreate',
      };

      // Read in the index template as a string
      helpers.getTemplate('accountCreate', templateData, (err, str) => {
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

lib.edit = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Account Settings`,
         'body.class': 'accountEdit',
      };

      // Read in the index template as a string
      helpers.getTemplate('accountEdit', templateData, (err, str) => {
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

module.exports = lib;
