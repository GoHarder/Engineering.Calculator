/**
 * Library for mongodb
 */

// TODO: 2-05-2021 3:04 PM Clean up database files

// Project Dependencies
const aggregations = require('./aggregations');
const config = require('../config/build');
const _logs = require('../logs');

// NPM Dependencies
const { MongoClient, ObjectID } = require('mongodb');

// Module container
let lib = {
   app: null,
};

// The connection to the database
let client = null;

/** Connects to the database */
const connect = async () => {
   if (client) {
      console.log('Client already exists.');
      return;
   }

   const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
   };

   try {
      client = await MongoClient.connect(config.mongo.url, options);
      return true;
   } catch (error) {
      _logs.append(`Error: mongo.js\n${error.message}`);
      return false;
   }
};

/** Creates access to the individual databases */
const build = async () => {
   const databases = [
      { name: 'app', tag: config.env === 'staging' ? 'app_dev' : 'app' },
      { name: 'steel', tag: 'steel' },
   ];

   if (client) {
      databases.forEach((database) => (lib[database.name] = client.db(database.tag)));
      return true;
   } else {
      return false;
   }
};

/** Aggregation methods */
lib.agg = aggregations;

/** Converts a string to an id object */
lib.ObjectID = ObjectID;

/** Starts the connection to the database */
lib.init = async () => {
   let pass = await connect();

   pass = await build();

   const text = pass ? { color: '32', symbol: '✓' } : { color: '31', symbol: 'X' };

   console.log(`\x1b[0m%s\x1b[${text.color}m%s\x1b[0m`, 'Database connected ', text.symbol);

   return pass;
};

// Export module
module.exports = lib;
