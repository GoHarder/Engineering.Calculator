/**
 * Library for mongodb
 */

// Project Dependencies
const config = require('./config/build');
const _logs = require('./logs');

// NPM Dependencies
const { MongoClient, ObjectID } = require('mongodb');

// Module container
let lib = {};

// The connection to the database
let client = null;

/** Creates a client to the database */
const createClient = async () => {
   options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   };

   try {
      if (!client) {
         client = await MongoClient.connect(config.mongo.url, options);
         return true;
      }
   } catch (error) {
      const log = `Error: mongo.js\n${error.message}`;

      _logs.append(log);
      client = null;
      return false;
   }
};

/** The databases and collections */
const routes = [
   { db: 'app', cols: ['users'] },
   { db: 'steel', cols: ['angle', 'channel'] },
];

/** Creates access to the individual collections */
const connect = () => {
   let group = {};

   if (client) {
      group = routes.reduce((acc, route) => {
         const { db, cols } = route;

         acc[db] = cols.reduce((acc, col) => {
            acc[col] = client.db(db).collection(col);

            return acc;
         }, {});

         return acc;
      }, group);
   }

   lib = { ...lib, ...group };
};

/** Converts a string to an id object */
lib.ObjectID = ObjectID;

/** Starts the connection to the database */
lib.init = async () => {
   const pass = await createClient();

   connect();

   const text = pass ? { color: '32', symbol: '✓' } : { color: '31', symbol: 'X' };

   console.log(`\x1b[0m%s\x1b[${text.color}m%s\x1b[0m`, 'Database connected ', text.symbol);
   return pass;
};

// Export module
module.exports = lib;
