/*
 * Library for storing and editing data
 */

// Node Dependencies
const fs = require('fs');
const path = require('path');

// Container for the module
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data');

/**
 * Write data to a file
 * @param {string} dir The directory the file is to be saved
 * @param {string} file The name of the file
 * @param {object} data The data to be saved
 */
lib.create = (dir, file, data) => {
   try {
      // Open the file for writing
      const fileDesc = fs.openSync(`${lib.baseDir}/${dir}/${file}.json`, 'wx');

      // Convert data to string
      data = JSON.stringify(data);

      // Write to file and close it
      fs.writeFileSync(fileDesc, data);
      fs.closeSync(fileDesc);

      return true;
   } catch (error) {
      return false;
   }
};

/**
 * Read data of a file
 * @param {string} dir The directory the file is to be saved
 * @param {string} file The name of the file
 */
lib.read = (dir, file) => {
   try {
      let fileData = fs.readFileSync(`${lib.baseDir}/${dir}/${file}.json`, 'utf8');
      fileData = JSON.parse(fileData);
      return fileData;
   } catch (error) {
      return false;
   }
};

/**
 * Update data inside a file
 * @param {string} dir The directory the file is to be saved
 * @param {string} file The name of the file
 * @param {object} data The data to be saved
 */
lib.update = (dir, file, data) => {
   try {
      // Open the file for writing
      const fileDesc = fs.openSync(`${lib.baseDir}/${dir}/${file}.json`, 'r+');

      // Convert data to string
      data = JSON.stringify(data);

      // Truncate the file
      fs.ftruncateSync(fileDesc);

      // Write to file and close it
      fs.writeFileSync(fileDesc, data);
      fs.closeSync(fileDesc);

      return true;
   } catch (error) {
      return false;
   }
};

/**
 * Delete a file
 * @param {string} dir The directory the file is to be saved
 * @param {string} file The name of the file
 */
lib.delete = (dir, file) => {
   try {
      fs.unlinkSync(`${lib.baseDir}/${dir}/${file}.json`);
      return true;
   } catch (error) {
      return false;
   }
};

/**
 * List all the files in a directory
 * @param {string} dir The directory the file is to be saved
 * @param {string} file The name of the file
 */
lib.list = (dir) => {
   try {
      let files = fs.readdirSync(`${lib.baseDir}/${dir}`);

      files = files.filter((file) => file !== '.gitignore');

      files = files.map((file) => file.replace('.json', ''));

      return files;
   } catch (error) {
      return false;
   }
};

// Export the module
module.exports = lib;
