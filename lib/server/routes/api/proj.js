/**
 * Project request handlers
 */

// Project Dependencies
const mongo = require('../../../mongo/mongo');
const { parse } = require('../../route');

// Module container
const lib = {};

const pageSize = 15;

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
   } else if (data.dir) {
      lib.getByCalcId(data, callback);
   } else {
      callback(404);
   }
};

/**
 * Gets the users recent projects
 * @param {object} data The request data
 * @param {object} data.query The query object
 * @param {string} data.query.id The user id
 * @param {number} data.query.page The amount to skip
 * @param {function} callback The callback function
 */
lib.getRecent = (data, callback) => {
   const { id, page } = data.query;

   const aggregation = mongo.agg.getProjRecentlyOpened(id, (page - 1) * pageSize, pageSize);

   mongo.app
      .collection('proj')
      .aggregate(aggregation)
      .toArray((error, data) => {
         if (!error) {
            callback(200, data);
         } else {
            callback(500, { error });
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

   const aggregation = mongo.agg.getProjBySearch(search, (page - 1) * pageSize, pageSize);

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
 * Gets project by id
 * @param {object} data The request data
 * @param {object} data.dir The calculator id
 * @param {function} callback The callback function
 */
lib.getByCalcId = (data, callback) => {
   const calcId = parse(data.dir).root;

   const aggregation = mongo.agg.getFullProj(calcId);

   mongo.app
      .collection('proj')
      .aggregate(aggregation)
      .toArray((error, data) => {
         if (!error && data.length > 0) {
            callback(200, data[0]);
         } else {
            console.log(error);
            callback(500, { error: 'error opening project' });
         }
      });
};

// Export module
module.exports = lib;
