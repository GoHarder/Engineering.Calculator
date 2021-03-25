/**
 * Project request handlers
 */

// Project Dependencies
const mongo = require('../../../mongo/mongo');
const { parse } = require('../../route');
const util = require('util');

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
   // Split the modules from the project
   let modules = { ...data.payload.modules };
   delete data.payload.modules;

   // Set the version
   version = 0;

   // Sanitize ids
   data.payload.creator = mongo.ObjectID(data.payload.creator);

   data.payload.opened.map((nth) => {
      nth.userId = mongo.ObjectID(nth.userId);
      return nth;
   });

   data.payload.version = version;

   // Save the project and get the project id
   mongo.app.collection('proj').insertOne(data.payload, (error, info) => {
      if (!error && info) {
         // console.log(info);

         // Create the calcId for each of the modules insert it into the project
         data.payload._id = info.insertedId;
         const calcId = mongo.ObjectID(info.insertedId);

         // Create the collection of docs to insert
         const moduleDocs = Object.values(modules).reduce((container, module) => {
            module.calcId = calcId;
            module.version = version;
            container.push(module);
            return container;
         }, []);

         // Insert the modules in the database
         mongo.app.collection('modules').insertMany(moduleDocs, (error, info) => {
            if ((!error, info)) {
               console.log(info.ops);

               // Inject the modules into the project
               modules = info.ops.reduce((container, module) => {
                  container[module.module] = module;
                  return container;
               }, {});

               data.payload.modules = modules;

               callback(200, data.payload);
            } else {
               callback(500, { error: { workbook: 'Could not save project modules' } });
            }
         });
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
            callback(500, { error: { menu: 'Could not open project' } });
         }
      });
};

lib.put = (data, callback) => {
   // Split the modules from the project
   let modules = { ...data.payload.modules };
   delete data.payload.modules;

   // Set the version
   data.payload.version += 1;

   // Update the payload _ids
   data.payload._id = mongo.ObjectID(data.payload._id);
   data.payload.creator = mongo.ObjectID(data.payload.creator);
   data.payload.opened.map((user) => (user.userId = mongo.ObjectID(user.userId)));

   // Create the module documents and version them
   let moduleDocs = Object.values(modules).reduce((container, module) => {
      module.version = data.payload.version;
      container.push(module);
      return container;
   }, []);

   // Sort the module docs
   moduleDocs = moduleDocs.reduce(
      (container, module) => {
         // Clean the calcID
         module.calcId = mongo.ObjectID(data.payload._id);

         // Sort for certain operations
         if ('_id' in module) {
            module._id = mongo.ObjectID(module._id);
            container.update.push(module);
         } else {
            container.insert.push(module);
         }

         return container;
      },
      { insert: [], update: [] }
   );

   console.log(moduleDocs);

   // Update the project
   mongo.app.collection('proj').updateOne({ _id: data.payload._id }, { $set: data.payload }, (error, info) => {
      if (!error && info) {
         let errors = [];

         // Update the modules
         if (moduleDocs.update.length > 0) {
            moduleDocs.update.forEach((doc) => {
               mongo.app.collection('modules').updateOne({ _id: doc._id }, { $set: doc }, (error, info) => {
                  if (error) {
                     errors.push(`Could not update ${doc.module}`);
                  }
               });
            });
         }

         if (moduleDocs.insert.length > 0) {
            mongo.app.collection('modules').insertMany(moduleDocs.insert, (error, info) => {
               if (!error && info) {
                  moduleDocs.insert = info.ops;
               } else {
                  errors.push('Could not save new modules');
               }
            });
         }

         if (errors.length === 0) {
            // Delete old modules
            mongo.app.collection('modules').deleteMany({ calcId: data.payload._id, version: { $ne: data.payload.version } }, (error, info) => {
               if (!error && info) {
                  // Pack new object and return
                  data.payload.modules = [...moduleDocs.update, ...moduleDocs.insert].reduce((container, doc) => {
                     container[doc.module] = doc;
                     return container;
                  }, {});

                  callback(200, data.payload);
               } else {
                  callback(500, { error: { workbook: 'Could not save project' } });
               }
            });
         } else {
            errors = errors.join(' ');
            callback(500, { error: { workbook: errors } });
         }
      } else {
         callback(500, { error: { workbook: 'Could not save project' } });
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
         mongo.app.collection('modules').deleteMany({ calcId: mongo.ObjectID(calcId) }, (error, info) => {
            if (!error && info) {
               callback(204);
            } else {
               callback(500, { error: { menu: 'Could not delete modules' } });
            }
         });
      } else {
         callback(500, { error: { menu: 'Could not delete project' } });
      }
   });
};

// Export module
module.exports = lib;
