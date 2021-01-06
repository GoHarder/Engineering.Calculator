/*
 * Helpers for various tasks
 */

// Node Dependencies
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

// Project Dependencies
const config = require('./config/build');

// Module container
const lib = {};

/**
 * Create a random string of alphanumeric characters
 * @param {number} length The length of the string
 */
lib.randomStr = (length) => crypto.randomBytes(length).toString('base64').slice(0, length);

/**
 * Creates a SHA256 hash
 * @param {string} string The string to be hashed
 */
lib.hash = (string) => {
   if (typeof string === 'string' && string.length > 0) {
      return crypto.createHmac('sha256', config.key.hash).update(string).digest('hex');
   } else {
      return false;
   }
};

/**
 * Parse a json string without throwing an error
 * @param {string} string The json string to be parsed
 */
lib.parseJsonStr = (string) => {
   try {
      const obj = JSON.parse(string);
      return obj;
   } catch (error) {
      return {};
   }
};

/** Returns the configured template */
lib.getTemplate = () => {
   let file = '';

   const baseDir = path.join(__dirname, '..');

   try {
      file = fs.readFileSync(`${baseDir}/src/index.html`, 'utf8');
   } catch (error) {
      _logs.append(error.message);
   }

   config.reload = config.reload ? '\n<script src="http://localhost:35729/livereload.js"></script>' : '';

   for (const key in config) {
      if (config.hasOwnProperty(key)) {
         const find = new RegExp(`{{config.${key}}}`, 'g');
         file = file.replace(find, config[key]);
      }
   }

   return file;
};

// Export module
module.exports = lib;
