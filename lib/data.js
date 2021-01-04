/*
 * Library for storing and editing data
 */

// Node Dependencies
const fs = require('fs');
const path = require('path');

// Project Dependencies
const helpers = require('./helpers');

// Container for the module
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data');

/**
 * Write data to a file
 * @param {string} dir The directory the file is to be saved
 * @param {string} file The name of the file
 * @param {object} data The data to be saved
 */
lib.create = (dir, file, data) => {
   try {
      // Open the file for writing
      const fileDesc = fs.openSync(`${lib.baseDir}/${dir}/${file}.json`, 'wx');

      // Convert data to string
      data = JSON.stringify(data);

      // Write to file and close it
      fs.writeFileSync(fileDesc, data);
      fs.closeSync(fileDesc);

      return true;
   } catch (error) {
      return false;
   }
};

/**
 * Read data to a file
 * @param {string} dir The directory the file is to be saved
 * @param {string} file The name of the file
 */
lib.read = (dir, file) => {
   try {
      let fileData = fs.readFileSync(`${lib.baseDir}/${dir}/${file}.json`, 'utf8');
      fileData = JSON.parse(fileData);
      return fileData;
   } catch (error) {
      return false;
   }
};

/**
 * Update data inside a file
 * @param {string} dir The directory the file is to be saved
 * @param {string} file The name of the file
 * @param {object} data The data to be saved
 */
lib.update = (dir, file, data) => {
   try {
      // Open the file for writing
      const fileDesc = fs.openSync(`${lib.baseDir}/${dir}/${file}.json`, 'r+');

      // Convert data to string
      data = JSON.stringify(data);

      // Truncate the file
      fs.ftruncateSync(fileDesc);

      // Write to file and close it
      fs.writeFileSync(fileDesc, data);
      fs.closeSync(fileDesc);

      return true;
   } catch (error) {
      return false;
   }
};

// Update data inside a file
// lib.update = (dir, file, data, callback) => {
//    // Open the file for writing
//    fs.open(lib.baseDir + `${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
//       if (!err && fileDescriptor) {
//          // Convert data to string
//          var stringData = JSON.stringify(data);

//          // Truncate the file
//          fs.ftruncate(fileDescriptor, (err) => {
//             if (!err) {
//                // Write to file and close it
//                fs.writeFile(fileDescriptor, stringData, (err) => {
//                   if (!err) {
//                      fs.close(fileDescriptor, (err) => {
//                         if (!err) {
//                            callback(false);
//                         } else {
//                            callback('Error closing existing file');
//                         }
//                      });
//                   } else {
//                      callback('Error writing to existing file');
//                   }
//                });
//             } else {
//                callback('Error truncating file');
//             }
//          });
//       } else {
//          callback('Could not open the file for updating, it may not exist yet');
//       }
//    });
// };

// Delete a file
lib.delete = (dir, file, callback) => {
   // Unlink the file
   fs.unlink(lib.baseDir + `${dir}/${file}.json`, (err) => {
      if (!err) {
         callback(false);
      } else {
         callback('Error deleting file');
      }
   });
};

// List all the files in a directory
lib.list = (dir, callback) => {
   fs.readdir(lib.baseDir + `${dir}/`, (err, data) => {
      if (!err && data && data.length > 0) {
         var trimmedFileNames = [];
         data.forEach((fileName) => {
            trimmedFileNames.push(fileName.replace('.json', ''));
         });
         callback(false, trimmedFileNames);
      } else {
         callback(err, data);
      }
   });
};

// Export the module
module.exports = lib;
