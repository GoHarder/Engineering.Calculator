/*
 * Server related tasks
 */

// Node Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

// Project Dependencies
const config = require('../config/build');
const helpers = require('../helpers');
const routes = require('./routes/root');

// Server module object
const lib = {};

// Instantiate the HTTP server
lib.httpServer = http.createServer((req, res) => {
   lib.unifiedServer(req, res);
});

// Instantiate the HTTPS server
lib.httpsServerOptions = {
   key: fs.readFileSync(path.join(__dirname, '../../https/key.pem')),
   cert: fs.readFileSync(path.join(__dirname, '../../https/cert.pem')),
};

lib.httpsServer = https.createServer(lib.httpsServerOptions, (req, res) => {
   lib.unifiedServer(req, res);
});

// All the server logic for both the http and https servers
lib.unifiedServer = (req, res) => {
   // Get the URL and Parse it
   const parsedUrl = url.parse(req.url, true);

   // Get the path
   const path = parsedUrl.pathname;
   const { root, dir, file } = routes.parse(path);

   // Get the query string as an object
   const query = parsedUrl.query;

   // Get the HTTP Method
   const method = req.method.toLowerCase();

   // Get the headers as an object
   const headers = req.headers;

   // Get the payload, if any
   const decoder = new StringDecoder('utf-8');
   let buffer = '';

   req.on('data', (data) => {
      buffer += decoder.write(data);
   });

   req.on('end', () => {
      buffer += decoder.end();

      // Choose the handler this request should go to
      const chosenHandler = typeof lib.router[root] !== 'undefined' ? lib.router[root] : routes.notFound;

      // Construct the data object to send to the handler
      const data = {
         root,
         dir,
         file,
         query,
         method,
         headers,
         payload: helpers.parseJsonToObject(buffer),
      };

      // Route the request to the handler specified in the router
      chosenHandler(data, (statusCode, payload, contentType) => {
         // Determine the type of response (fallback on JSON)
         contentType = typeof contentType === 'string' ? contentType : 'json';

         // Use the status code called back by the handler, or default to 200
         statusCode = typeof statusCode === 'number' ? statusCode : 200;

         // Return the response parts that are content-specific
         let payloadString = '';

         if (contentType === 'json') {
            res.setHeader('Content-Type', 'application/json');

            // Use the payload called back by the handler, or default an empty object (other types use same pattern)
            payload = typeof payload === 'object' ? payload : {};

            // Convert the payload to string
            payloadString = JSON.stringify(payload);
         }

         if (contentType === 'html') {
            res.setHeader('Content-Type', 'text/html');
            payloadString = typeof payload === 'string' ? payload : '';
         }

         if (contentType === '.ico') {
            res.setHeader('Content-Type', 'image/x-icon');
            payloadString = typeof payload !== 'undefined' ? payload : '';
         }

         if (contentType === 'css') {
            res.setHeader('Content-Type', 'text/css');
            payloadString = typeof payload !== 'undefined' ? payload : '';
         }

         if (contentType === '.js') {
            res.setHeader('Content-Type', 'text/javascript');
            payloadString = typeof payload !== 'undefined' ? payload : '';
         }

         if (contentType === 'png') {
            res.setHeader('Content-Type', 'image/png');
            payloadString = typeof payload !== 'undefined' ? payload : '';
         }

         if (contentType === 'jpg') {
            res.setHeader('Content-Type', 'image/jpeg');
            payloadString = typeof payload !== 'undefined' ? payload : '';
         }

         if (contentType === 'plain') {
            res.setHeader('Content-Type', 'text/plain');
            payloadString = typeof payload !== 'undefined' ? payload : '';
         }

         // Return the response parts that are common to all content-types
         res.writeHead(statusCode);
         res.end(payloadString);

         // Log the request path
         if (statusCode == 200) {
            debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} ${path} ${statusCode}`);
         } else {
            debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} ${path} ${statusCode}`);
         }
      });
   });
};

// Define a request router
lib.router = {
   '': routes.root,
   ping: routes.ping,
   public: routes.public,
};

// Init server
lib.init = () => {
   const { protocol, port } = config;

   const server = {
      http: lib.httpServer,
      https: lib.httpsServer,
   };

   server[protocol].listen(port, () => {
      console.log('\x1b[0m%s\x1b[32m%s\x1b[0m', 'Server started ', '✓');
      return new Promise((res, rej) => res());
   });
};

// Export the module
module.exports = lib;
