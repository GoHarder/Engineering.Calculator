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
 * @param {string} data.payload.email The user's email
 * @param {string} data.payload.password The user's password
 * @param {function} callback The callback function
 */
lib.post = (data, callback) => {
   // Validate the payload
   const schema = {
      email: (value) => validate.email(value),
      password: (value) => validate.password(value),
   };

   // NOTE: 1-04-2021 8:26 AM There is a way to test schema in mongo may do that later
   const test = validate.object(data.payload, schema);

   if (test.valid) {
      const { email, password, longToken } = data.payload;

      // Lookup user and check password
      mongo.app.users.findOne({ email }, (error, userDoc) => {
         if (!error && userDoc) {
            const hashedPassword = helpers.hash(password);

            if (hashedPassword === userDoc.hashedPassword && email == userDoc.email) {
               const payload = {
                  id: userDoc._id,
                  admin: userDoc.admin,
                  valid: Date.now() + (longToken ? Number('1.21e+9') : Number('3.6e+6')),
               };

               const token = jwt.sign(payload, config.key.jwt);

               callback(200, { token });
            } else {
               callback(403, { error: 'Password is incorrect' });
            }
         } else {
            callback(500, { error: 'Could not find user' });
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
   // Validate the header
   const { authorization: auth } = data.headers;

   const oldToken = lib.decode(auth);

   if (oldToken) {
      // Copy the token
      let { id, admin, valid } = { ...oldToken };

      if (valid > Date.now()) {
         // If the token if greater than two hours just return the token
         const check = Date.now() + Number('7.2e+6');
         const longToken = valid > check;

         valid = longToken ? valid : Date.now() + Number('3.6e+6');

         const payload = { id, admin, valid };

         const token = jwt.sign(payload, config.key.jwt);
         callback(200, { token });
      } else {
         callback(401, { error: 'authorization has expired' });
      }
   } else {
      callback(500, { error: 'could not process token' });
   }
};

/**
 * Decodes the token
 * @param {string} token The token
 */
lib.decode = (token) => {
   try {
      token = jwt.verify(token, config.key.jwt);

      return token;
   } catch (error) {
      console.log(error);
      return false;
   }
};

// Export module
module.exports = lib;
