/*
 * Create and export configuration variables
 */

// Node Dependencies
const crypto = require('crypto');

// Project Dependencies
const settings = require('./settings.json');

// Determine which environment was passed as a command-line argument
const arg = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

// Build the environment
const env = { ...settings.common, ...settings[arg] };

// See it the server started with the reload flag
const reload = process.argv.includes('--reload');

if (reload) env.reload = true;

// TODO: 2-03-2021 9:19 AM Move to json file
// Set the json web token key
env.key.jwt = 'Hollister-Whitney 1906';

// Export the module
module.exports = env;
