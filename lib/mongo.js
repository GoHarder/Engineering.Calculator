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
   const options = {
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
   {
      db: 'app',
      cols: [
         { name: 'users', table: config.env === 'staging' ? 'users-dev' : 'users' },
         { name: 'proj', table: config.env === 'staging' ? 'proj-dev' : 'proj' },
      ],
   },
   {
      db: 'steel',
      cols: [
         { name: 'angle', table: 'angle' },
         {
            name: 'channel',
            table: 'channel',
         },
      ],
   },
];

/** Creates access to the individual collections */
const connect = () => {
   if (client) {
      routes.forEach((route) => {
         const { db, cols } = route;

         if (!lib.hasOwnProperty(db)) {
            lib[db] = {};
         }

         cols.forEach((col) => {
            lib[db][col.name] = client.db(db).collection(col.table);
         });
      });
   }

   return new Promise((res, rej) => {
      if (lib.app.users) {
         res(true);
      } else {
         res(false);
      }
   });
};

/** Converts a string to an id object */
lib.ObjectID = ObjectID;

/** Starts the connection to the database */
lib.init = async () => {
   let pass = await createClient();

   pass = await connect();

   const text = pass ? { color: '32', symbol: '✓' } : { color: '31', symbol: 'X' };

   console.log(`\x1b[0m%s\x1b[${text.color}m%s\x1b[0m`, 'Database connected ', text.symbol);

   return pass;
};

// Export module
module.exports = lib;
