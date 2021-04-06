/**
 * Platform request handler
 */

// Project Dependencies
const mongo = require('../../../../mongo/mongo');
const { parseJsonStr } = require('../../../../helpers');
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
   switch (data.query.material) {
      case 'Wood':
         lib.getWoodData(data, callback);
         break;
      case 'Steel':
         lib.getSteelData(data, callback);
         break;
      default:
         callback(404);
         break;
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

// TODO: 4-06-2021 10:22 AM - document funtion
lib.getSteelData = async (data, callback) => {
   // Parse the parts
   const query = parseJsonStr(data.query.steel);

   if (Object.keys(query).length > 0) {
      const { material, stringer: stringerQuery, frontChannel: frontChannelQuery } = query;

      const stringerAggregation = mongo.agg.getChannel({
         $match: {
            'properties.material': material,
            'properties.modulusX': { $gte: stringerQuery.sectionModulus },
            'properties.inertiaX': { $gte: stringerQuery.momentOfInertia },
         },
      });

      const sideChannelAggregation = mongo.agg.getChannel({ $match: { 'properties.material': material, name: { $in: ['MC4X13.8', 'MC6X12', 'MC8X18.7'] } } });

      const frontChannelAggregation = mongo.agg.getChannel({
         $match: {
            'properties.material': material,
            'properties.modulusX': { $gte: frontChannelQuery.sectionModulus },
            'properties.inertiaX': { $gte: frontChannelQuery.momentOfInertia },
         },
      });

      try {
         const stringer = await mongo.engineering.collection('channel').aggregate(stringerAggregation).toArray();
         const sideChannel = await mongo.engineering.collection('channel').aggregate(sideChannelAggregation).toArray();
         const frontChannel = await mongo.engineering.collection('channel').aggregate(frontChannelAggregation).toArray();

         callback(200, { stringer, sideChannel, frontChannel });
      } catch (error) {
         callback(500, { error: { workbook: 'Could not get steel information' } });
      }
   } else {
      callback(400, { error: { workbook: 'Channel database query is incorrect' } });
   }
};

// Export module
module.exports = lib;
