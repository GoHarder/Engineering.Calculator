/**
 * Token request handlers
 */

// Project Dependencies
const validate = require('../../validate');
const helpers = require('../../helpers');
const mongo = require('../../mongo');
const _data = require('../../data');

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
 * Creates a new token
 * @param {object} data The request data
 * @param {object} data.payload The payload of the request
 * @param {string} data.payload.email The user's email
 * @param {string} data.payload.password The user's password
 * @param {function} callback The callback function
 */
lib.post = (data, callback) => {
   // Validate the payload
   const schema = {
      _id: (value) => validate.string(value),
      password: (value) => validate.password(value),
   };

   // NOTE: 1-04-2021 8:26 AM There is a way to test schema in mongo may do that later
   const test = validate.object(data.payload, schema);

   if (test.valid) {
      const { _id, password } = data.payload;

      // Lookup user and check password
      mongo.app.users.findOne({ _id: mongo.ObjectID(_id) }, (error, userDoc) => {
         if (!error && userDoc) {
            const hashedPassword = helpers.hash(password);

            if (hashedPassword === userDoc.hashedPassword) {
               const token = {
                  _id,
                  tokenId: helpers.randomStr(20),
                  expires: Date.now() + 1000 * 60 * 60,
               };

               // Store the token
               const created = _data.create('tokens', token.tokenId, token);

               if (created) {
                  callback(200, token);
               } else {
                  callback(500, { error: 'Could not create new token' });
               }
            } else {
               callback(400, { error: 'Password is incorrect' });
            }
         } else {
            callback(400, { error: 'Could not find user' });
         }
      });
   } else {
      callback(400, { error: test.errors });
   }
};

// Export module
module.exports = lib;
