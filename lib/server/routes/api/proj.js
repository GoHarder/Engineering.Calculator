/**
 * Project request handlers
 */

// Project Dependencies
const mongo = require('../../../mongo/mongo');
const { parse } = require('../../route');
const emailService = require('../../../email-service/email-service');
const config = require('../../../config/build');
// const util = require('util');

// Module container
const lib = {};

const pageSize = 15;

/**
 * Sends request to a method
 * @param {object} data The request data
 * @param {function} callback The callback function
 */
lib.root = (data, callback) => {
   const methods = ['post', 'get', 'put', 'delete'];

   if (methods.includes(data.method)) {
      lib[data.method](data, callback);
   } else {
      callback(405);
   }
};

/**
 * Creates a new project
 * @param {object} data The request data
 * @param {object} data.payload The project data
 * @param {function} callback The callback function
 */
lib.post = (data, callback) => {
   // Sanitize ids
   data.payload.creator = mongo.ObjectID(data.payload.creator);

   data.payload.opened.map((nth) => {
      nth.userId = mongo.ObjectID(nth.userId);
      return nth;
   });

   // Save the project and get the project id
   mongo.app.collection('proj').insertOne(data.payload, (error, info) => {
      if (!error && info) {
         // Insert _id and return
         data.payload._id = info.insertedId;

         callback(200, data.payload);
      } else {
         callback(500, { error: { workbook: 'Could not save project' } });
      }
   });
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

   if (id && page) {
      const aggregation = mongo.agg.getProjRecentlyOpened(id, (page - 1) * pageSize, pageSize);

      // console.log(util.inspect(aggregation, { showHidden: false, depth: null }));

      mongo.app
         .collection('proj')
         .aggregate(aggregation)
         .toArray((error, data) => {
            if (!error) {
               callback(200, data);
            } else {
               callback(500, { error: 'Could not find projects' });
            }
         });
   } else {
      callback(400);
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

   const aggregation = mongo.agg.getProjBySearch(search, (page - 1) * pageSize, pageSize);

   // console.log(util.inspect(aggregation, { showHidden: false, depth: null }));

   mongo.app
      .collection('proj')
      .aggregate(aggregation)
      .toArray((error, data) => {
         if (!error) {
            callback(200, data);
         } else {
            callback(500, { error: 'Could not find projects' });
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
   const _id = mongo.ObjectID(data.dir.replace('/', ''));

   mongo.app.collection('proj').findOne({ _id }, (error, doc) => {
      if (!error && doc) {
         callback(200, doc);
      } else {
         callback(500, { error: { menu: 'Could not open project' } });
      }
   });
};

/**
 * Sends get request to the correct route
 * @param {object} data The request data
 * @param {function} callback The callback function
 */
lib.put = (data, callback) => {
   switch (data.payload._type) {
      case 'save':
         lib.updateProject(data, callback);
         break;

      case 'share':
         lib.shareProject(data, callback);
         break;

      default:
         callback(500);
         break;
   }
};

/**
 * Updates a saved project
 * @param {object} data The request data
 * @param {function} callback The callback function
 */
lib.updateProject = (data, callback) => {
   // Update the payload _ids
   data.payload._id = mongo.ObjectID(data.payload._id);
   data.payload.creator = mongo.ObjectID(data.payload.creator);
   data.payload.opened.map((user) => (user.userId = mongo.ObjectID(user.userId)));

   // Remove the type of update
   delete data.payload._type;

   mongo.app.collection('proj').updateOne({ _id: data.payload._id }, { $set: data.payload }, (error, info) => {
      if (!error && info) {
         callback(200, data.payload);
      } else {
         console.log(error);
         callback(500, { error: { workbook: 'Could not save project' } });
      }
   });
};

/**
 * Shares a project with another user
 * @param {object} data The request data
 * @param {object} data.payload The payload of the request
 * @param {string} data.payload.calcId The workbook id
 * @param {string} data.payload.userId The user the workbook is shared with
 * @param {string} data.payload.email The users email
 * @param {function} callback The callback function
 */
lib.shareProject = (data, callback) => {
   // Update the payload _ids
   data.payload.calcId = mongo.ObjectID(data.payload.calcId);

   // Get the project
   mongo.app.collection('proj').findOne({ _id: data.payload.calcId }, (error, doc) => {
      if (!error && doc) {
         const update = [...doc.opened].filter((user) => `${user.userId}` !== data.payload.userId);

         // Create the opened listing
         update.push({ userId: mongo.ObjectID(data.payload.userId), time: Date.now() });

         // Update document
         doc.opened = update;

         mongo.app.collection('proj').findOneAndUpdate({ _id: data.payload.calcId }, { $set: doc }, (error, info) => {
            if (!error && info) {
               const { baseUrl } = config;
               let title = 'Untitled';

               if (doc.contract && doc.jobName && doc.carNo) title = `${doc.contract} - ${doc.jobName} - ${doc.carNo}`;

               // Send notification to other user
               const sent = emailService.sendSharedWorkbookEmail([data.payload.email], { baseUrl, title });

               if (sent) {
                  callback(204);
               } else {
                  callback(500);
               }
            } else {
               callback(500, error);
            }
         });
      } else {
         callback(500);
      }
   });
};

/**
 * Deletes project by id
 * @param {object} data The request data
 * @param {object} data.dir The calculator id
 * @param {function} callback The callback function
 */
lib.delete = (data, callback) => {
   const calcId = parse(data.dir).root;

   mongo.app.collection('proj').deleteOne({ _id: mongo.ObjectID(calcId) }, (error, info) => {
      if (!error && info) {
         callback(204);
      } else {
         callback(500, { error: { menu: 'Could not delete project' } });
      }
   });
};

// Export module
module.exports = lib;
