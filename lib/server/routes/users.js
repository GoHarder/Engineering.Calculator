// Project Dependencies
const mongo = require('../../mongo');
const validate = require('../../validate');
const helpers = require('../../helpers');

// Module container
const lib = {};

/**
 * Sends request to a method
 * @param {object} data The request data
 * @param {function} callback The callback function
 */
lib.root = (data, callback) => {
   const methods = ['post'];

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

            userDoc.hashedPassword = helpers.hash('Vantage1');

            // Store the user
            mongo.app.users.insertOne(userDoc, (error) => {
               if (!error) {
                  callback(200);
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

// Export module
module.exports = lib;
