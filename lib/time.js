/*
 * Library for selecting important times
 */

// Node Dependencies

// Project Dependencies

// Container for the module
var lib = {};

// Get the time to rotate logs 2 days ago
lib.rotateTime = () => {
   let _date = new Date().toString();
   let days = 1000 * 60 * 60 * 24 * 2;
   _date = _date.replace(/\d{2}:\d{2}:\d{2}/, '00:00:00');
   _date = Date.parse(_date);
   _date = _date - days;
   return _date;
};

// Get the time 24 hours ago
lib.cliTime = () => {
   let time = Date.now();
   let day = 1000 * 60 * 60 * 24;
   time = time - day;
   return time;
};

// Export the module
module.exports = lib;
