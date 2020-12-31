/*
 * Primary file for the API
 */

// Node Dependencies
const readline = require('readline');
const util = require('util');
const events = require('events');
const os = require('os');
const v8 = require('v8');
const debug = util.debuglog('cli');

// Node extends
class _events extends events {}

// Node instances
const event = new _events();

// Project Dependencies
const _data = require('./data');
const _logs = require('./logs');
const helpers = require('./helpers');
// const _time = require('./time');
const config = require('./config/build');

// Declare the cli
var cli = {};

// Input handlers
event.on('man', () => {
   cli.responders.help();
});

event.on('help', () => {
   cli.responders.help();
});

event.on('exit', () => {
   cli.responders.exit();
});

event.on('stats', () => {
   cli.responders.stats();
});

event.on('menu', () => {
   cli.responders.menu();
});

event.on('list', (str) => {
   cli.responders.list(str);
});

event.on('info', (str) => {
   cli.responders.info(str);
});

// Responders object
cli.responders = {};

// Rendering Functions
// Create a horizontal line
cli.horizontalLine = () => {
   // Get the available space
   const width = process.stdout.columns - 1;
   let line = '';
   for (let i = 0; i < width; i++) {
      line += '-';
   }
   console.log(line);
};

// Create centered text on the screen
cli.centered = (str) => {
   str = typeof str && str.trim().length > 0 ? str.trim() : '';

   // Get the available space
   const width = process.stdout.columns;

   // Calculate the left padding
   const leftPadding = Math.floor((width - str.length) / 2);

   // Put in left padded spaces
   let line = '';
   for (let i = 0; i < leftPadding; i++) {
      line += ' ';
   }

   line += str;
   console.log(line);
};

// Create a vertical space
cli.verticalSpace = (lines) => {
   lines = typeof lines == 'number' && lines > 0 ? lines : 1;
   for (let i = 0; i < lines; i++) {
      console.log('');
   }
};

// Help Man
cli.responders.help = () => {
   const commands = {
      exit: 'Exit the CLI',
      man: 'Show help page',
      help: 'Alias of the "man" command',
      stats: 'Get statistics on the underlying operating system and resource utilization ',
      menu: 'View the menu that is is on the server',
      'list -u': 'View all the users who have signed up in the last 24 hours',
      'list -o': 'View all the orders who have signed up in the last 24 hours',
      'info -u "{email}"': 'Lookup the details of a user by email address ',
      'info -o "{fileName}"': 'Lookup the details of a specific order by  file name',
   };

   // Show a header for the help page that is as wide as the screen
   cli.horizontalLine();
   cli.centered('CLI MANUAL');
   cli.horizontalLine();
   cli.verticalSpace();

   // Show each command, followed by an explanation, in yellow in white
   for (const key in commands) {
      if (commands.hasOwnProperty(key)) {
         const value = commands[key];
         let line = `\x1b[33m${key}\x1b[0m`;
         const padding = 60 - line.length;

         for (let i = 0; i < padding; i++) {
            line += ' ';
         }

         line += value;
         console.log(line);
      }
   }

   // End with another horizontal line
   cli.verticalSpace();
   cli.horizontalLine();
   cli.verticalSpace();
};

// Exit
cli.responders.exit = () => {
   process.exit(0);
};

// Stats
cli.responders.stats = () => {
   // Compile an object of stats
   var stats = {
      'Load Average': os.loadavg().join(' '),
      'CPU Count': os.cpus().length,
      'Free Memory': `${os.freemem()} bytes`,
      'Current Malloced Memory': v8.getHeapStatistics().malloced_memory,
      'Peak Malloced Memory': v8.getHeapStatistics().peak_malloced_memory,
      'Allocated Heap Used (%)': Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
      'Allocated Heap Allocated (%)': Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
      Uptime: `${os.uptime()} Seconds`,
   };

   // Show a header for the help page that is as wide as the screen
   cli.horizontalLine();
   cli.centered('SYSTEM STATISTICS');
   cli.horizontalLine();
   cli.verticalSpace();

   // Show each command, followed by an explanation, in yellow in white
   for (const key in stats) {
      if (stats.hasOwnProperty(key)) {
         const value = stats[key];
         let line = `\x1b[33m${key}\x1b[0m`;
         const padding = 60 - line.length;

         for (let i = 0; i < padding; i++) {
            line += ' ';
         }

         line += value;
         console.log(line);
      }
   }

   // End with another horizontal line
   cli.verticalSpace();
   cli.horizontalLine();
   cli.verticalSpace();
};

// See the menu in config.js
cli.responders.menu = () => {
   cli.verticalSpace();
   console.dir(config.menuData, { colors: true });
   cli.verticalSpace();
};

// List what you want based on flag
cli.responders.list = (str) => {
   const arr = str.split(' ');
   const flag = arr[1];
   const validFlags = ['-u', '-o'];

   if (validFlags.indexOf(flag) > -1) {
      if (flag == '-u') {
         _data.list('users', (err, userIds) => {
            if (!err && userIds && userIds.length > 0) {
               userIds.forEach((userId) => {
                  _data.read('users', userId, (err, userData) => {
                     if (!err && userData) {
                        // Filter list to people who signed up 24 hours ago
                        if (_time.cliTime() < userData.signUpTime) {
                           let line = `Name: ${userData.firstName} ${userData.lastName}\nEmail: ${userData.email}`;
                           console.log(line);
                           cli.verticalSpace();
                        }
                     }
                  });
               });
               cli.verticalSpace();
            }
         });
      } else {
         _data.list('orders', (err, orderIds) => {
            if (!err && orderIds && orderIds.length > 0) {
               // Filter list to orders that were made 24 hours ago
               orderIds = orderIds.filter((orderId) => {
                  orderId = orderId.split('-');
                  let end = orderId.length - 1;
                  orderId = parseInt(orderId[end]);
                  return orderId > _time.cliTime();
               });

               if (orderIds.length > 0) {
                  orderIds.forEach((orderId) => {
                     _data.read('orders', orderId, (err, orderData) => {
                        if (!err && orderData) {
                           console.log(orderId);
                           cli.verticalSpace();
                        }
                     });
                  });
               }

               cli.verticalSpace();
            }
         });
      }
   } else {
      console.log('\x1b[31m%s\x1b[0m', 'Invalid list command\nrun help for more details');
   }
};

cli.responders.info = (str) => {
   const arr = str.split(' ');
   const flag = arr[1];
   let file = arr[2].replace(/"/g, '');
   const validFlags = ['-u', '-o'];

   if (validFlags.indexOf(flag) > -1 && file) {
      if (flag == '-u') {
         file = file.replace(/[@.]/g, '-');

         _data.read('users', file, (err, userData) => {
            if (!err && userData) {
               delete userData.userFile;
               delete userData.hashedPassword;
               delete userData.signUpTime;

               cli.verticalSpace();
               console.dir(userData, { colors: true });
               cli.verticalSpace();
            }
         });
      } else {
         _data.read('orders', file, (err, orderData) => {
            if (!err && orderData) {
               delete orderData.hashedPassword;
               delete orderData.signUpTime;

               cli.verticalSpace();
               console.dir(orderData, { colors: true });
               cli.verticalSpace();
            }
         });
      }
   } else {
      console.log('\x1b[31m%s\x1b[0m', 'Invalid info command\nrun help for more details');
   }
};

// // List Users
// cli.responders.listUsers = ()=>{
//    _data.list('users', (err, userIds)=>{
//       if (!err && userIds && userIds.length > 0) {
//          userIds.forEach(userId => {
//             _data.read('users', userId, (err, userData)=>{
//                if (!err && userData) {
//                   let line = `Name: ${userData.firstName} ${userData.lastName} Phone: ${userData.phone} Checks: `;
//                   let numberOfChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array && userData.checks.length > 0 ? userData.checks.length : 0;
//                   line += numberOfChecks;
//                   console.log(line);
//                }
//             })
//          });
//          cli.verticalSpace();
//       }
//    });
// };

// // More User Info
// cli.responders.moreUserInfo = (str)=>{

//    // Get the IF from the string
//    let arr = str.split('--');
//    let userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

//    if (userId) {

//       // Look the user up
//       _data.read('users', userId, (err, userData)=>{
//          if (!err, userData) {

//             // Remove the hashed password
//             delete userData.hashedPassword;

//             // Print the JSON with text highlighting
//             cli.verticalSpace();
//             console.dir(userData, {'colors': true});
//          }
//       })
//    }
// };

// // List Checks
// cli.responders.listChecks = str =>{
//    _data.list('checks', (err, checkIds)=>{
//       if (!err && checkIds && checkIds.length > 0) {
//          cli.verticalSpace();
//          checkIds.forEach(checkId =>{
//             _data.read('checks', checkId, (err, checkData)=>{
//                if (!err && checkData) {
//                   let lowerString = str.toLowerCase();

//                   // Get the state, default to down
//                   let state = typeof(checkData.state) == 'string' ? checkData.state : 'down';

//                   // Get the state default, default to unknown
//                   let stateOrUnknown = typeof(checkData.state) == 'string' ? checkData.state : 'unknown';

//                   // If the user has specified the state, or hasn't include the current check
//                   if (lowerString.indexOf(`--${state}`) > -1 || lowerString.indexOf(`--down`) == -1 && lowerString.indexOf(`--up`) == -1) {
//                      let line = `ID: ${checkData.id} ${checkData.method.toUpperCase()} ${checkData.protocol}://${checkData.url} State: ${stateOrUnknown}`;
//                      console.log(line);
//                      cli.verticalSpace();
//                   }
//                }
//             });
//          });
//       }
//    });
// };

// // More Check Info
// cli.responders.moreCheckInfo = (str)=>{

//    // Get the IF from the string
//    let arr = str.split('--');
//    let checkId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;

//    if (checkId) {

//       // Look the user up
//       _data.read('checks', checkId, (err, checkData)=>{
//          if (!err, checkData) {

//             // Print the JSON with text highlighting
//             cli.verticalSpace();
//             console.dir(checkData, {'colors': true});
//          }
//       })
//    }
// };

// // List Logs
// cli.responders.listLogs = ()=>{
//    _logs.list(true, (err, logFileNames)=>{
//       if (!err && logFileNames && logFileNames.length > 0) {
//          cli.verticalSpace();
//          logFileNames.forEach(logFileName =>{
//             if (logFileName.indexOf('-') > -1) {
//                console.log(logFileName);
//                cli.verticalSpace(1);
//             }
//          });
//       }
//    });
// };

// // More Log Info
// cli.responders.moreLogInfo = str => {

//    // Get the IF from the string
//    let arr = str.split('--');
//    let logFileName = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
//    if (logFileName) {
//       cli.verticalSpace();

//       // Decompress the log file
//       _logs.decompress(logFileName, (err, logData)=>{
//          if (!err && logData) {

//             // Split into lines
//             const arr = logData.split('\n');
//             arr.forEach(jsonString =>{
//                const logObject = helpers.parseJsonToObject(jsonString);
//                if (logObject && JSON.stringify(logObject) !== '{}') {
//                   console.dir(logObject, {'colors': true});
//                   cli.verticalSpace();
//                }
//             });
//          }
//       });
//    }
// };

// Input processor
cli.processInput = (str) => {
   str = typeof str == 'string' && str.trim().length > 0 ? str.trim() : false;

   // Only process the input if the user wrote something
   if (str) {
      // Codify the unique strings that will get responded to
      var uniqueInputs = ['man', 'help', 'exit', 'stats', 'menu', 'list', 'info'];

      // Go through inputs and emit an event on a match
      var matchFound = false;
      uniqueInputs.some((input) => {
         if (str.toLowerCase().indexOf(input) > -1) {
            matchFound = true;

            // Emit event matching the input and include string
            event.emit(input, str);
            return true;
         }
      });

      // No match is found tell user to try again
      if (!matchFound) {
         console.log('\x1b[31m%s\x1b[0m', 'Invalid command');
      }
   }
};

// Init function
cli.init = () => {
   // Send the start message to the console
   console.log('\x1b[34m%s\x1b[0m', 'The CLI is running');

   // Start the interface
   var _interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '',
   });

   // Create the initial prompt
   _interface.prompt();

   // Handle each line of input separately
   _interface.on('line', (str) => {
      // Send to the input processor
      cli.processInput(str);

      // Bring the prompt back
      _interface.prompt();
   });

   // If the user stops the CLI, kill everything
   _interface.on('close', () => {
      process.exit(0);
   });
};

// Export the module
module.exports = cli;
