/**
 * Library for the redis cache
 */

// Project Dependencies
const { redis: config } = require('./config/build');
const _logs = require('./logs');

// NPM Dependencies
const redis = require('redis');

let client = null;
let startError = false;

const lib = {};

/** Starts the connection to the cache */
lib.init = async () => {
   if (config.use) {
      client = redis.createClient({});

      client.on('error', (error) => {
         if (!startError) _logs.append(`Error: redis.js\n${error.message}`);
         startError = true;
      });

      const text = startError ? { color: '32', symbol: '✓' } : { color: '31', symbol: 'X' };

      console.log(`\x1b[0m%s\x1b[${text.color}m%s\x1b[0m`, 'Cache connected ', text.symbol);

      return startError;
   } else {
      return true;
   }
};

module.exports = lib;
