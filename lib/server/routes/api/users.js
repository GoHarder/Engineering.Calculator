/**
 * User request handlers
 */

// NPM Dependencies
const jwt = require('jsonwebtoken');

// Project Dependencies
const mongo = require('../../../mongo/mongo');
const validate = require('../../../validate');
const helpers = require('../../../helpers');
const { parse } = require('../../route');
const { decode } = require('./tokens');
const emailService = require('../../../email-service/email-service');
const config = require('../../../config/build');

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

      const password = `Vantage-${Math.floor(Math.random() * 10)}`;

      // Create the user document
      userDoc = { ...data.payload };
      userDoc.admin = false;
      userDoc.hashedPassword = helpers.hash(password);

      // Insert the user if there isn't already one
      mongo.app.collection('users').updateOne({ email }, { $set: userDoc }, { upsert: true }, (error, info) => {
         if (!error && info) {
            if (info.upsertedId !== null) {
               const { baseUrl } = config;

               const sent = emailService.sendNewUserEmail([email], { baseUrl, password });

               // If message sent send payload
               if (sent) {
                  callback(200, { _id: info.upsertedId._id });
               } else {
                  callback(500, { error: { form: 'Could not send reset email' } });
               }
            } else {
               callback(400, { error: { email: 'A user with that email already exists' } });
            }
         } else {
            callback(500, { error: { form: 'Could not create the user' } });
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

   if (data.query.email || data.query.email === '') {
      lib.getWithEmail(data, callback);
   } else {
      lib.getWithToken(data, callback);
   }
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
      mongo.app.collection('users').findOne({ _id: mongo.ObjectID(token.id) }, { projection: { hashedPassword: 0 } }, (error, data) => {
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

lib.getWithEmail = (data, callback) => {
   // Check if user exists
   const { email } = data.query;

   if (validate.email(email)) {
      mongo.app.collection('users').findOne({ email }, (error, userDoc) => {
         if (!error && userDoc) {
            // Create a security token and send the reset email
            const id = userDoc._id;
            const resetCode = helpers.randomNumStr(6);
            const { baseUrl } = config;

            const sent = emailService.sendResetEmail([email], { resetCode, baseUrl });

            // If message sent send payload
            if (sent) {
               const payload = {
                  id,
                  reset: resetCode,
               };

               const token = jwt.sign(payload, config.key.jwt, { expiresIn: '1h' });

               callback(200, { id, token });
            } else {
               callback(500, { error: 'Could not send reset email' });
            }
         } else {
            callback(404, { error: 'User does not exist' });
         }
      });
   } else {
      callback(400, { error: 'Email is invalid' });
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
      // Add admin rights if the reset codes are the same
      if (token.reset === data.payload.reset && token.reset && data.payload.reset) token.admin = true;

      if (token.admin || token.id === userId) {
         // Validate the payload
         const schema = {
            firstName: (value) => validate.string(value) || value === undefined,
            lastName: (value) => validate.string(value) || value === undefined,
            email: (value) => validate.email(value) || value === undefined,
            admin: (value) => (validate.boolean(value) && token.admin) || value === undefined,
            password: (value) => validate.password(value) || token.admin,
            newPassword: (value) => validate.password(value) || value === undefined,
         };
         console.log(token);
         console.log(data.payload);

         const test = validate.object(data.payload, schema);

         if (test.valid) {
            // Create the document revisions and update it
            const { payload: userDoc } = data;

            // Used for non admin  edits
            const oldHash = helpers.hash(userDoc.password);

            // If there is a new password add it
            if (userDoc.newPassword) {
               userDoc.hashedPassword = helpers.hash(userDoc.newPassword);
            }

            delete userDoc.password;
            delete userDoc.newPassword;
            delete userDoc.reset;

            // Set the filter for the document that needs updating
            const filter = { _id: mongo.ObjectID(userId) };

            if (!token.admin) filter.hashedPassword = oldHash;

            // Update the document
            mongo.app.collection('users').updateOne(filter, { $set: userDoc }, (error, info) => {
               if (!error && info) {
                  if (info.modifiedCount !== 0) {
                     callback(204);
                  } else {
                     callback(400, { error: 'password is incorrect' });
                  }
               } else {
                  callback(400, { error: 'a user with that email already exists' });
               }
            });
         } else {
            callback(400, { error: test.errors });
         }
      } else {
         callback(403, { error: 'token is not valid for user data' });
      }
   } else {
      callback(401, { error: 'authorization is invalid' });
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
         mongo.app.collection('users').findOneAndDelete({ _id: mongo.ObjectID(token.id) }, (error, data) => {
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
