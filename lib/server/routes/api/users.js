/**
 * User request handlers
 */

// Project Dependencies
const mongo = require('../../../mongo');
const validate = require('../../../validate');
const helpers = require('../../../helpers');
const { parse } = require('../../route');
const { decode } = require('./tokens');

// Module container
const lib = {};

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
 * Creates a new user
 * @param {object} data The request data
 * @param {object} data.payload The payload of the request
 * @param {string} data.payload.firstName The user's first name
 * @param {string} data.payload.lastName The user's last name
 * @param {string} data.payload.email The user's email
 * @param {function} callback The callback function
 */
lib.post = (data, callback) => {
   // Validate the payload
   const schema = {
      firstName: (value) => validate.string(value),
      lastName: (value) => validate.string(value),
      email: (value) => validate.email(value),
   };

   // NOTE: 1-04-2021 8:26 AM There is a way to test schema in mongo may do that later
   const test = validate.object(data.payload, schema);

   if (test.valid) {
      const { email } = data.payload;

      // Create the user document
      userDoc = { ...data.payload };
      userDoc.admin = false;
      userDoc.hashedPassword = helpers.hash('Vantage-1');

      // Insert the user if there isn't already one
      mongo.app.users.updateOne({ email }, { $set: userDoc }, { upsert: true }, (error, info) => {
         if (!error && info) {
            if (info.upsertedId !== null) {
               callback(200, { id: info.upsertedId._id });
            } else {
               callback(400, { error: 'A user with that email already exists' });
            }
         } else {
            callback(500, { error: 'Could not create the new user' });
         }
      });
   } else {
      callback(400, { error: test.errors });
   }
};

/**
 * Sends get request to the correct route
 * @param {object} data The request data
 * @param {function} callback The callback function
 */
lib.get = (data, callback) => {
   // const userId = validate.string(data.dir);

   // if (userId) {
   lib.getWithToken(data, callback);
   // } else {
   //    callback(404);
   // }
};

/**
 * Gets user by token
 * @param {object} data The request data
 * @param {object} data.headers The request headers
 * @param {string} data.headers.authorization The api token
 * @param {function} callback The callback function
 */
lib.getWithToken = (data, callback) => {
   // See if token is a valid
   const token = decode(data.headers.authorization);

   if (token) {
      // Lookup the user
      mongo.app.users.findOne({ _id: mongo.ObjectID(token.id) }, { projection: { _id: 0, hashedPassword: 0 } }, (error, data) => {
         if (!error && data) {
            callback(200, data);
         } else {
            callback(404);
         }
      });
   } else {
      callback(401, { error: 'Authorization is invalid' });
   }
};

/**
 * Update a user by id
 * @param {object} data The request data
 * @param {string} data.dir The user id
 * @param {object} data.headers The request headers
 * @param {string} data.headers.authorization The api token
 * @param {object} data.payload The payload of the request
 * @param {string} [data.payload.firstName] The user's first name
 * @param {string} [data.payload.lastName] The user's last name
 * @param {string} [data.payload.email] The user's email
 * @param {boolean} [data.payload.admin] The user's admin status
 * @param {string} data.payload.password The user's password
 * @param {string} [data.payload.newPassword] The user's updated password
 * @param {function} callback The callback function
 */
lib.put = (data, callback) => {
   // Get the user id from the path
   const userId = parse(data.dir).root;

   // See if token is a valid
   const token = decode(data.headers.authorization);

   if (token) {
      if (token.admin || token.id === userId) {
         // Validate the payload
         const schema = {
            firstName: (value) => validate.string(value) || value === undefined,
            lastName: (value) => validate.string(value) || value === undefined,
            email: (value) => validate.email(value) || value === undefined,
            admin: ((value) => validate.boolean(value) && token.admin) || value === undefined,
            password: (value) => validate.password(value) || token.admin,
            newPassword: (value) => validate.password(value) || value === undefined,
         };

         const test = validate.object(data.payload, schema);

         if (test) {
            // Create the document revisions and update it
            const { payload: userDoc } = data;

            const oldHash = helpers.hash(userDoc.password);
            userDoc.hashedPassword = helpers.hash(userDoc.newPassword);

            delete userDoc.password;
            delete userDoc.newPassword;

            // Update the document
            const filter = { _id: mongo.ObjectID(userId) };

            if (!token.admin) filter.hashedPassword = oldHash;

            mongo.app.users.updateOne(filter, { $set: userDoc }, (error, info) => {
               if (!error && info) {
                  if (info.modifiedCount !== 0) {
                     callback(204);
                  } else {
                     callback(400, { error: 'Password is incorrect' });
                  }
               } else {
                  callback(400, { error: 'A user with that email already exists' });
               }
            });
         } else {
            callback(400, { error: test.errors });
         }
      } else {
         callback(403, { error: 'Token is not valid for user data' });
      }
   } else {
      callback(401, { error: 'Authorization is invalid' });
   }
};

/**
 * Delete a user by id
 * @param {object} data The request data
 * @param {string} data.dir The user id
 * @param {object} data.headers The request headers
 * @param {string} data.headers.authorization The api token
 * @param {function} callback The callback function
 */
lib.delete = (data, callback) => {
   // Get the user id from the path
   const userId = parse(data.dir).root;

   // See if token is a valid
   const token = decode(data.headers.authorization);

   if (token) {
      // Check if user can perform action
      if (token.admin || token.id === userId) {
         // Delete the user by the id
         mongo.app.users.findOneAndDelete({ _id: mongo.ObjectID(token.id) }, (error, data) => {
            if (!error && data.value) {
               callback(204);
            } else {
               callback(500, { error: 'Could not delete user or user does not exist' });
            }
         });
      } else {
         callback(403, { error: 'Token is not valid for user data' });
      }
   } else {
      callback(401, { error: 'Authorization is invalid' });
   }
};

// Export module
module.exports = lib;
