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
   const methods = ['post', 'get', 'delete'];

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

      // Check if the user already exists
      mongo.app.users.findOne({ email }, (error, userDoc) => {
         if (!error && userDoc === null) {
            // Create the user document
            userDoc = { ...data.payload };

            userDoc.admin = false;
            userDoc.hashedPassword = helpers.hash('Vantage-1');

            // Store the user
            mongo.app.users.insertOne(userDoc, (error) => {
               if (!error) {
                  callback(200, { id: userDoc._id });
               } else {
                  callback(500, { error: 'Could not create the new user' });
               }
            });
         } else {
            callback(400, { error: 'A user with that email already exists' });
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
   const userId = validate.string(data.dir);

   if (userId) {
      lib.getOne(data, callback);
   } else {
      callback(404);
   }
};

/**
 * Gets user by id
 * @param {object} data The request data
 * @param {string} data.dir The user id
 * @param {object} data.headers The request headers
 * @param {string} data.headers.authorization The api token
 * @param {function} callback The callback function
 */
lib.getOne = (data, callback) => {
   const userId = parse(data.dir).root;

   // See if token is a valid
   const token = decode(data.headers.authorization);

   if (token) {
      if (token.admin || token.id === userId) {
         // Lookup the user
         mongo.app.users.findOne({ _id: mongo.ObjectID(userId) }, { projection: { _id: 0, hashedPassword: 0 } }, (error, data) => {
            if (!error && data) {
               callback(200, data);
            } else {
               callback(404);
            }
         });
      } else {
         callback(403, { error: 'Token is not valid for user data' });
      }
   } else {
      callback(400, { error: 'Authorization is invalid' });
   }
};

lib.delete = (data, callback) => {
   const userId = parse(data.dir).root;

   // See if token is a valid
   const token = decode(data.headers.authorization);

   // Check if the user exists
   if (token && token.id === userId) {
      mongo.app.users.findOneAndDelete({ _id: mongo.ObjectID(token.id) }, (error, data) => {
         if (!error && data.value) {
            callback(200, data);
         } else {
            callback(400, { error: 'User data does not exist' });
         }
      });
   } else {
      callback(403, { error: 'Token is not valid for user data' });
   }
};

// Export module
module.exports = lib;
