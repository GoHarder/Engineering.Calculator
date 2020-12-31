/*
 * Library to storing and rotating logs
 */

// Node Dependencies
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

// Module Container
const lib = {};

// Base directory of the logs folder
const baseDir = path.join(__dirname, '/../.logs');

const header = () => {
   const time = new Date().toLocaleTimeString();

   return `@ ${time}\n-------------\n`;
};

/**
 * Append text to the log file. Creates a file if it does not exist.
 * @param {string} text The text to be inserted
 */
lib.append = (text) => {
   const date = new Date().toLocaleDateString().replace(/\//g, '-');

   try {
      // Open the file for appending
      const file = fs.openSync(`${baseDir}/${date}.log`, 'a');

      // Append the file
      fs.appendFileSync(file, `${header()}`);
      fs.appendFileSync(file, `${text}\n\n`);

      // Close the file
      fs.closeSync(file);
   } catch (error) {
      console.log(error);
   }
};

// // List all the logs, and optionally include the compressed logs
// lib.list = (includeCompressedLogs, callback) => {
//    fs.readdir(lib.baseDir, (err, data) => {
//       if (!err && data && data.length > 0) {
//          var trimmedFileNames = [];
//          data.forEach((fileName) => {
//             // Add the .log files
//             if (fileName.indexOf('.log') > -1) {
//                trimmedFileNames.push(fileName.replace('.log', ''));
//             }

//             // Add the compressed files .gz files
//             if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
//                trimmedFileNames.push(fileName.replace('.gz.b64', ''));
//             }
//          });
//          callback(false, trimmedFileNames);
//       } else {
//          callback(err, data);
//       }
//    });
// };

// // Compress the contents of one .log file into a .gz.b64 in the same dir
// lib.compress = (logId, newFileId, callback) => {
//    var sourceFile = `${logId}.log`;
//    var destinationFile = `${newFileId}.gz.b64`;

//    // Read the source file
//    fs.readFile(`${lib.baseDir}${sourceFile}`, 'utf8', (err, inputString) => {
//       if (!err && inputString) {
//          // Compress the data using gzip
//          zlib.gzip(inputString, (err, buffer) => {
//             if (!err && buffer) {
//                // Send the data to the destination file
//                fs.open(`${lib.baseDir}${destinationFile}`, 'wx', (err, fileDescriptor) => {
//                   if (!err && fileDescriptor) {
//                      // Write to the destination file
//                      fs.writeFile(fileDescriptor, buffer.toString('base64'), (err) => {
//                         if (!err) {
//                            // Close the destination file
//                            fs.close(fileDescriptor, (err) => {
//                               if (!err) {
//                                  callback(false);
//                               } else {
//                                  callback(err);
//                               }
//                            });
//                         } else {
//                            callback(err);
//                         }
//                      });
//                   } else {
//                      callback(err);
//                   }
//                });
//             } else {
//                callback(err);
//             }
//          });
//       } else {
//          callback(err);
//       }
//    });
// };

// // Decompress the contents of a .gz.b64 file into a sting variable
// lib.decompress = (fileId, callback) => {
//    var fileName = `${fileId}.gz.b64`;

//    // Read the file
//    fs.readFile(`${lib.baseDir}${fileName}`, 'utf8', (err, str) => {
//       if (!err && str) {
//          // Decompress the data using gzip
//          var inputBuffer = Buffer.from(str, 'base64');
//          zlib.unzip(inputBuffer, (err, outputBuffer) => {
//             if (!err && outputBuffer) {
//                // Callback
//                str = outputBuffer.toString();
//                callback(false, str);
//             } else {
//                callback(err);
//             }
//          });
//       } else {
//          callback(err);
//       }
//    });
// };

// // Truncate a log file
// lib.truncate = (logId, callback) => {
//    fs.truncate(`${lib.baseDir}${logId}.log`, 0, (err) => {
//       if (!err) {
//          callback(false);
//       } else {
//          callback(err);
//       }
//    });
// };

// // Delete a file
// lib.delete = (file, callback) => {
//    // Unlink the file
//    fs.unlink(`${lib.baseDir}/${file}.log`, (err) => {
//       if (!err) {
//          callback(false);
//       } else {
//          callback('Error deleting file');
//       }
//    });
// };

// Export the module
module.exports = lib;
