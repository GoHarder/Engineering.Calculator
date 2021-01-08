/*
 * Primary file for the API
 */

// Project Dependencies
const config = require('./lib/config/build');
const mongo = require('./lib/mongo');
const server = require('./lib/server/server');
const workers = require('./lib/workers');

const info = () => {};

// Declare the app
const app = {};

// Init function
app.init = async () => {
   const { env, protocol, port, baseUrl } = config;

   let line = '';

   do {
      line += '-';
   } while (line.length < baseUrl.length + 13);

   console.log('\nEnvironment:', env);

   Promise.all([
      mongo.init(), // Start the database
      server.init(), // Start the server
      // workers.init(), // Start the workers
   ]).then(() => {
      console.log('\x1b[1m%s\x1b[0m', '\nAccess URLs:');
      console.log(line);
      console.log('\x1b[0m%s\x1b[35m%s\x1b[0m', 'Localhost: ', `${protocol}://localhost:${port}`);
      console.log('\x1b[0m%s\x1b[35m%s\x1b[0m', '      LAN: ', baseUrl);
      console.log(line);
      console.log('\x1b[34m\x1b[1m%s\x1b[0m', 'Press CTRL-C to stop\n');
   });
};

// Execute
app.init();

// Export the module
module.exports = app;
