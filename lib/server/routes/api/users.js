/**
 * User request handlers
 */

// Project Dependencies
const mongo = require('../../../mongo');
const validate = require('../../../validate');
const helpers = require('../../../helpers');
const { parse } = require('../../route');
const tokens = require('./tokens');

// Module container
const lib = {};

/**
 * Sends request to a method
 * @param {object} data The request data
 * @param {function} callback The callback function
 */
lib.root = (data, callback) => {
   const methods = ['post', 'get'];

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
 * @param {function} callback The callback function
 */
lib.getOne = (data, callback) => {
   const userId = parse(data.dir).root;

   // See if token is a valid string
   const test = validate.string(data.headers.token);

   if (test) {
      // See if the token is valid
      const valid = tokens.validate(userId, data.headers.token);

      if (valid) {
         // Lookup the user
         mongo.app.users.findOne({ _id: mongo.ObjectID(userId) }, { projection: { _id: 0, hashedPassword: 0 } }, (error, data) => {
            if (!error && data) {
               callback(200, data);
            } else {
               callback(404);
            }
         });
      } else {
         callback(403, { error: 'Token is not valid' });
      }
   } else {
      callback(400, { error: 'Missing required token header' });
   }
};

// Export module
module.exports = lib;
