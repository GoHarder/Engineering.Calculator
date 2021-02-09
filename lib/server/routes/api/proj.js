/**
 * Project request handlers
 */

// Project Dependencies
const mongo = require('../../../mongo/mongo');

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
   if (data.query.page) {
      if (data.query.search) {
         lib.getBySearch(data, callback);
      } else {
         lib.getRecent(data, callback);
      }
   } else {
      callback(404);
   }
};

lib.getRecent = (data, callback) => {
   const { id, page } = data.query;

   const aggregation = mongo.agg.getProjRecentlyOpened(id, (page - 1) * 10, 10);

   mongo.app
      .collection('proj')
      .aggregate(aggregation)
      .toArray((error, data) => {
         if (!error) {
            callback(200, data);
         } else {
            callback(500, { error: 'error finding projects' });
         }
      });
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

   const aggregation = mongo.agg.getProjBySearch(search, (page - 1) * 10, 10);

   mongo.app
      .collection('proj')
      .aggregate(aggregation)
      .toArray((error, data) => {
         if (!error) {
            callback(200, data);
         } else {
            callback(500, { error: 'error finding projects' });
         }
      });
};

// Export module
module.exports = lib;
