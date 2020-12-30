const { fstat } = require('fs');
const fs = require('fs');
const path = require('path');

const _logs = require('./logs');
const config = require('./config/build');

const lib = {};

const baseDir = path.join(__dirname, '..');

lib.load = () => {
   let file = '';

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

module.exports = lib;
