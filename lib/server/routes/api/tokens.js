/**
 * Token request handlers
 */

// NPM Dependencies
const jwt = require('jsonwebtoken');

// Project Dependencies
const validate = require('../../../validate');
const helpers = require('../../../helpers');
const mongo = require('../../../mongo');
const config = require('../../../config/build');

// Module container
const lib = {};

/**
 * Sends request to a method
 * @param {object} data The request data
 * @param {function} callback The callback function
 */
lib.root = (data, callback) => {
   const methods = ['post', 'put'];

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
 * @param {string} data.payload.id The user's id
 * @param {string} data.payload.password The user's password
 * @param {function} callback The callback function
 */
lib.post = (data, callback) => {
   // Validate the payload
   const schema = {
      id: (value) => validate.string(value),
      password: (value) => validate.password(value),
   };

   // NOTE: 1-04-2021 8:26 AM There is a way to test schema in mongo may do that later
   const test = validate.object(data.payload, schema);

   if (test.valid) {
      const { id, password } = data.payload;

      // Lookup user and check password
      mongo.app.users.findOne({ _id: mongo.ObjectID(id) }, (error, userDoc) => {
         if (!error && userDoc) {
            const hashedPassword = helpers.hash(password);

            if (hashedPassword === userDoc.hashedPassword && id == userDoc._id) {
               const payload = {
                  id,
                  admin: userDoc.admin,
               };

               const token = jwt.sign(payload, config.key.jwt, { expiresIn: '1h' });

               callback(200, { token });
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

/**
 * Updates a token
 * @param {object} data The request data
 * @param {object} data.headers The request headers
 * @param {string} data.headers.authorization The api token
 * @param {function} callback The callback function
 */
lib.put = (data, callback) => {
   // Validate the payload
   const { authorization } = data.headers;

   const payload = lib.decode(authorization);

   if (payload) {
      // Trim the payload and create a new token
      delete payload.iat;
      delete payload.exp;

      const token = jwt.sign(payload, config.key.jwt, { expiresIn: '1h' });

      callback(200, { token });
   } else {
      callback(400, { error: 'Authorization is invalid' });
   }
};

/**
 * Verifies the token
 * @param {string} token The token
 */
lib.decode = (token) => {
   try {
      token = jwt.verify(token, config.key.jwt);

      return token;
   } catch (error) {
      return false;
   }
};

// Export module
module.exports = lib;
