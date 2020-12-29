/*
 * Create and export configuration variables
 */

// Project Dependencies
const settings = require('./settings.json');

// Determine which environment was passed as a command-line argument
const arg = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : 'staging';

// Build the environment
const env = { ...settings.common, ...settings[arg] };

// Export the module
module.exports = env;
