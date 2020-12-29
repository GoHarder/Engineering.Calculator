/*
 * BackgroundWorker Related tasks
 */

// Node Dependencies
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const url = require('url');
const util = require('util');
const debug = util.debuglog('workers');

// Project Dependencies
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');

// Container for the workers
const lib = {};

// // Look up all checks, get their data, send to a validator
// workers.gatherAllChecks = () => {
//    // Get all the checks in system
//    _data.list('checks', (err, checks) => {
//       if (!err && checks && checks.length > 0) {
//          checks.forEach(check => {
//             // Read check data
//             _data.read('checks', check, (err, originalCheckData) => {
//                if (!err && originalCheckData) {
//                   // Pass it to the check validator and let it continue or log errors
//                   workers.validateCheckData(originalCheckData);
//                } else {
//                   debug('Error: Could not read check data');
//                }
//             });
//          });
//       } else {
//          debug('Error: No checks to process');
//       }
//    });
// };

// // Sanity check the original check data
// workers.validateCheckData = originalCheckData => {
//    originalCheckData = typeof originalCheckData == 'object' && originalCheckData !== null ? originalCheckData : {};
//    originalCheckData.id = typeof originalCheckData.id == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
//    originalCheckData.userPhone = typeof originalCheckData.userPhone == 'string' && originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false;
//    originalCheckData.protocol = typeof originalCheckData.protocol == 'string' && ['http', 'https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
//    originalCheckData.url = typeof originalCheckData.url == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
//    originalCheckData.method = typeof originalCheckData.method == 'string' && ['post', 'get', 'put', 'delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
//    originalCheckData.success = typeof originalCheckData.success == 'object' && originalCheckData.success instanceof Array && originalCheckData.success.length > 0 ? originalCheckData.success : false;
//    originalCheckData.timeoutSeconds = typeof originalCheckData.timeoutSeconds == 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false;

//    // Set the keys that may not be set if the workers never seen it before
//    originalCheckData.state = typeof originalCheckData.state == 'string' && ['up', 'down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : 'down';
//    originalCheckData.lastCheck = typeof originalCheckData.lastCheck == 'number' && originalCheckData.lastCheck > 0 ? originalCheckData.lastCheck : false;

//    // If all Checks pass then pass it along
//    if (originalCheckData.id && originalCheckData.userPhone && originalCheckData.protocol && originalCheckData.url && originalCheckData.method && originalCheckData.success && originalCheckData.timeoutSeconds) {
//       workers.performCheck(originalCheckData);
//    } else {
//       debug('One of the checks are not formated correctly');
//    }
// };

// // Perform the check, send the original check data and the outcome of the check process and pass it
// workers.performCheck = originalCheckData => {
//    // Prepare the initial check outcome
//    var checkOutcome = {
//       error: false,
//       responseCode: false
//    };

//    // Mark that the outcome has not been sent yet
//    var outcomeSent = false;

//    // Parse the hostname and the path out of the original check data
//    var parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
//    var hostName = parsedUrl.hostname;
//    var path = parsedUrl.path; // using path and not pathname because we want the query string

//    // Construct the request
//    var requestDetails = {
//       protocol: `${originalCheckData.protocol}:`,
//       hostname: hostName,
//       method: `${originalCheckData.method.toUpperCase()}`,
//       path: path,
//       timeout: originalCheckData.timeoutSeconds * 1000
//    };

//    var _moduleToUse = originalCheckData.protocol == 'http' ? http : https;

//    // Instantiate the request object
//    var req = _moduleToUse.request(requestDetails, res => {
//       // Grab the status of the sent request
//       var status = res.statusCode;

//       // Update the check outcome and pass the data along
//       checkOutcome.responseCode = status;
//       if (!outcomeSent) {
//          workers.processCheckOutcome(originalCheckData, checkOutcome);
//          outcomeSent = true;
//       }
//    });

//    // Bind to the error event so it doesn't get thrown
//    req.on('error', err => {
//       // Update the check outcome and pass the data along
//       checkOutcome.error = {
//          error: true,
//          value: error
//       };

//       if (!outcomeSent) {
//          workers.processCheckOutcome(originalCheckData, checkOutcome);
//          outcomeSent = true;
//       }
//    });

//    // Bind to the timeout event
//    req.on('timeout', err => {
//       // Update the check outcome and pass the data along
//       checkOutcome.error = {
//          error: true,
//          value: 'timeout'
//       };

//       if (!outcomeSent) {
//          workers.processCheckOutcome(originalCheckData, checkOutcome);
//          outcomeSent = true;
//       }
//    });

//    // End the request
//    req.end();
// };

// // Process the check outcome, update the check data as needed, trigger and alert if needed
// // Logic for a check that has never been tested before (no alerts)
// workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
//    // Decide if check is up or down
//    var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.success.indexOf(checkOutcome.responseCode) > -1 ? 'up' : 'down';

//    // Decide if to fire the alert
//    var alertWarranted = originalCheckData.lastCheck && originalCheckData.state !== state ? true : false;

//    // Log the outcome
//    var timeOfCheck = Date.now();
//    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

//    // Update the check data
//    var newCheckData = originalCheckData;
//    newCheckData.state = state;
//    newCheckData.lastCheck = timeOfCheck;

//    // Save the updates
//    _data.update('checks', newCheckData.id, newCheckData, err => {
//       if (!err) {
//          // Send the new check data to the next phase in the process if needed
//          if (alertWarranted) {
//             workers.alertUserToStatusChange(newCheckData);
//          } else {
//             debug('No update to check');
//          }
//       } else {
//          debug('Error updating check data');
//       }
//    });
// };

// // alert the user to the change in their status
// workers.alertUserToStatusChange = newCheckData => {
//    var msg = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;

//    console.log(msg);

//    // ---MIGHT BE BLOCKED---
//    // helpers.sendTwilioSms(newCheckData.userPhone, msg, (err)=>{
//    //    if (!err) {
//    //       console.log('User was updated on their check status');
//    //    } else {
//    //       console.log('Error sms failed', err);
//    //    }
//    // });
// };

// // Log to a text file
// workers.log = (originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) => {
//    // Form the log data
//    var logData = {
//       check: originalCheckData,
//       outcome: checkOutcome,
//       state: state,
//       alert: alertWarranted,
//       time: timeOfCheck
//    };

//    // Convert data to a string
//    var logString = JSON.stringify(logData);

//    // Determine the name of the log file
//    var logFileName = originalCheckData.id;

//    // Append the log string to the file
//    _logs.append(logFileName, logString, err => {
//       if (!err) {
//          debug('Log updated');
//       } else {
//          debug('Error: Log failed to update', err);
//       }
//    });
// };

// Delete Api tokens
lib.deleteBadTokens = () => {
   // Get all the tokens in system
   _data.list('tokens', (err, tokens) => {
      if (!err && tokens && tokens.length > 0) {
         tokens.forEach((token) => {
            // Read token data
            _data.read('tokens', token, (err, tokenData) => {
               if (!err && tokenData) {
                  // Check that the token is expired
                  if (tokenData.expires < Date.now()) {
                     // Delete the token
                     _data.delete('tokens', tokenData.id, (err) => {
                        if (err) {
                           debug('Error: Could not delete the token');
                        }
                     });
                  }
               } else {
                  debug('Error: Could not read token data');
               }
            });
         });
      } else {
         debug('Error: No tokens to process');
      }
   });
};

// Timer to execute the worker-process once per hour
lib.loop = () => {
   setInterval(() => {
      lib.deleteBadTokens();
   }, 1000 * 60 * 60);
};

// @TODO have to redo log system
// Rotate the log files
// workers.rotateLogs = () => {
//    // List all the non compressed log files
//    _logs.list(false, (err, logs) => {
//       if (!err && logs && logs.length > 0) {
//          // Filter out current days logs
//          logs.forEach((log) => {
//             logs[logs.indexOf(log)] = log.replace('.log', '');
//          });

//          logs = logs.filter((log) => {
//             log = parseInt(log.split('-')[2]);
//             return log < _logs.time();
//          });

//          if (logs.length > 0) {
//             logs.forEach((logName) => {
//                // Compress the data to a different file
//                var logId = logName.replace('.log', '');
//                var newFileId = logId.replace(/-\d+/, '');
//                _logs.compress(logId, newFileId, (err) => {
//                   if (!err) {
//                      // delete old log
//                      _logs.delete(logId, (err) => {
//                         if (!err) {
//                            debug('Log deleted', logId);
//                         } else {
//                            debug('Error: could not delete log', logId);
//                         }
//                      });
//                   } else {
//                      debug('Error compressing one of the log files', err);
//                   }
//                });
//             });
//          }
//       } else {
//          debug('Error: Could not find logs to rotate');
//       }
//    });
// };

// Compress and rotate the logs every hour
// workers.logRotationLoop = () => {
//    setInterval(() => {
//       workers.rotateLogs();
//    }, 1000 * 60 * 60);
// };

// Init workers
lib.init = () => {
   // Remove old API tokens
   lib.deleteBadTokens();

   // Execute all the checks
   // workers.gatherAllChecks();

   // Call the loop so the checks run on their own
   lib.loop();

   // Compress all the logs
   // workers.rotateLogs();

   // Call the compression loop
   // workers.logRotationLoop();

   console.log('\x1b[0m%s\x1b[32m%s\x1b[0m', 'Workers started ', '✓\n');
   return new Promise((res, rej) => res());
};

// Export the module
module.exports = lib;
