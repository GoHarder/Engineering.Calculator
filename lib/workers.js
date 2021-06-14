/*
 * BackgroundWorker Related tasks
 */

// Node Dependencies
const util = require('util');
const debug = util.debuglog('workers');

// Project Dependencies
const mongo = require('./mongo/mongo');

/**
 * Run a function at a specific time of day every day
 * @param {number} hour The hour of the execution
 * @param {number} min The minute of the execution
 * @param {number} sec The second of the execution
 * @param {function} callback The function to run
 */
const runAt = (hour = 0, min = 0, sec = 0, callback) => {
   const now = new Date();
   let toFirstPeriod = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, min, sec, 0) - now;
   if (toFirstPeriod < 0) toFirstPeriod += 86400000;

   setTimeout(() => {
      callback();

      setInterval(() => {
         callback();
      }, 86400000);
   }, toFirstPeriod);
};

/** Module Container */
const lib = {};

/** Cleans the temporary files from the database */
lib.cleanTempFiles = () => {
   const now = new Date();

   mongo.app.collection('proj').deleteMany({ temp: true, created: { $lt: Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) } }, (error, data) => {
      if (error) {
         console.log(error);
      }
   });
};

/** Init the server workers */
lib.init = () => {
   runAt(18, 30, 0, () => lib.cleanTempFiles()); // 6:30 pm

   console.log('\x1b[0m%s\x1b[32m%s\x1b[0m', 'Workers started ', '✓');
   return new Promise((res, rej) => res(true));
};

// Export the module
module.exports = lib;
