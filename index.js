/*
 * Primary file for the API
 */

// Project Dependencies
const server = require('./lib/server');
const config = require('./lib/config/main');
const workers = require('./lib/workers');
const cli = require('./lib/cli');

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

   // Start the server
   await server.init();

   // Start the workers
   await workers.init();

   // // Start the CLI, but start it last
   // setTimeout(() => {
   //    cli.init();
   // }, 100);

   console.log('\x1b[1m%s\x1b[0m', 'Access URLs:');
   console.log(line);
   console.log('\x1b[0m%s\x1b[35m%s\x1b[0m', 'Localhost: ', `${protocol}://localhost:${port}`);
   console.log('\x1b[0m%s\x1b[35m%s\x1b[0m', '      LAN: ', baseUrl);
   console.log(line);
   console.log('\x1b[34m\x1b[1m%s\x1b[0m', 'Press CTRL-C to stop\n');
};

// Execute
app.init();

// Export the module
module.exports = app;
