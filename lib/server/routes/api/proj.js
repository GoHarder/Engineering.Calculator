/**
 * Project request handlers
 */

// Project Dependencies
const mongo = require('../../../mongo');

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
 * @param {function} callback The callback function
 */
lib.get = (data, callback) => {
   if (data.query.search && data.query.page) {
      lib.getBySearch(data, callback);
   } else {
      callback(404);
   }
};

/**
 * Gets projects by query search
 * @param {object} data The request data
 * @param {object} data.query The query object
 * @param {string} data.query.search The search string
 * @param {number} data.query.page The amount to skip
 * @param {function} callback The callback function
 */
lib.getBySearch = (data, callback) => {
   const { search, page } = data.query;

   const options = {
      projection: { score: { $meta: 'textScore' } },
      sort: { score: { $meta: 'textScore' } },
      skip: (page - 1) * 10,
      limit: 10,
   };

   mongo.app.proj.find({ $text: { $search: search } }, options).toArray((error, data) => {
      if (!error && data) {
         data.id = data._id;
         delete data._id;

         callback(200, data);
      } else {
         callback(404);
      }
   });
};

// Export module
module.exports = lib;
