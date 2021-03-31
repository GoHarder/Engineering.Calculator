/**
 * Platform request handler
 */

// Project Dependencies
const mongo = require('../../../../mongo/mongo');
const { round } = require('./round');

// Module container
const lib = {};

/**
 * Sends request to a method
 * @param {object} data The request data
 * @param {object} data.query The request query
 * @param {string} data.query.material The platform material
 * @param {function} callback The callback function
 */
lib.root = (data, callback) => {
   if (data.query.material === 'Wood') {
      lib.getWoodData(data, callback);
   } else {
      callback(404);
   }
};

/**
 * Returns wood platform database information
 * @param {object} data The request data
 * @param {object} data.query The request query
 * @param {string} data.query.sectionModulus The angle section modulus
 * @param {function} callback The callback function
 */
lib.getWoodData = async (data, callback) => {
   const response = { angle: undefined };

   // The information required to request the server
   const query = {
      name: { $in: ['L3X3X1/4', 'L3X3X3/8', 'L3X3X1/2', 'L4X4X3/8', 'L4X4X1/2'] },
      'properties.material': 'ASTM A36',
      'properties.modulusX': { $gt: parseFloat(data.query.sectionModulus) },
   };
   const projection = { _id: 0, name: 1, 'dimensions.depth': 1, 'dimensions.thickness': 1, 'properties.weight': 1 };

   try {
      // Get the data information for the angle
      response.angle = await mongo.engineering.collection('angle').findOne(query, { projection });

      // Trim the response
      response.angle.depth = response.angle.dimensions.depth;
      response.angle.thickness = response.angle.dimensions.thickness;
      response.angle.weight = round(response.angle.properties.weight / 12, 4);
      delete response.angle.dimensions;
      delete response.angle.properties;
   } catch (error) {
      response.angle = null;
   }

   callback(200, response);
};

// Export module
module.exports = lib;
