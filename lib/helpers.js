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
 * @param {number} len The length of the string
 */
lib.randomStr = (len) => {
   len = typeof len === 'number' && len > 0 ? len : false;

   if (len) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let str = '';

      for (i = 1; i <= len; i++) {
         str += characters.charAt(Math.floor(Math.random() * characters.length));
      }

      return str;
   } else {
      return false;
   }
};

/**
 * Creates a SHA256 hash
 * @param {string} str The string to be hashed
 */
lib.hash = (str) => {
   if (typeof str === 'string' && str.length > 0) {
      return crypto.createHmac('sha256', config.hash).update(str).digest('hex');
   } else {
      return false;
   }
};

/**
 * Parse a json string without throwing an error
 * @param {string} str The json string to be parsed
 */
lib.parseJsonStr = (str) => {
   try {
      const obj = JSON.parse(str);
      return obj;
   } catch (err) {
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
