/**
 * Platform request handler
 */

// Project Dependencies
const mongo = require('../../../../mongo/mongo');

// Module container
const lib = {};

/**
 * Sends request to a method
 * @param {object} data The request data
 * @param {object} query The request query
 * @param {string} material The platform material
 * @param {function} callback The callback function
 */
lib.root = async (data, callback) => {
   const angleAggregation = mongo.agg.getPlatformAngles(data.query.material);
   const channelAggregation = mongo.agg.getPlatformChannels(data.query.material);

   try {
      const angle = await mongo.engineering.collection('steel').aggregate(angleAggregation).toArray();
      const channel = await mongo.engineering.collection('steel').aggregate(channelAggregation).toArray();

      callback(200, { angle, channel });
   } catch (error) {
      callback(500, { error: { workbook: error } });
   }
};

// Export module
module.exports = lib;
