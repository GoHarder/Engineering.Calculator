/**
 * machine request handler
 */

// Project Dependencies
const mongo = require('../../../../mongo/mongo');

// Module container
const lib = {};

// TODO: 7-01-2021 3:05 PM - Document method
lib.root = async (data, callback) => {
   if (data.query?.type && data.query?.location) {
      const _machines = mongo.agg.getMachineModels(data.query.type, data.query.location);

      try {
         const machines = await mongo.engineering.collection('machines').aggregate(_machines).toArray();

         callback(200, { machines });
      } catch (error) {
         console.log(error);
         callback(500, { error: { workbook: error } });
      }
   } else {
      callback(400, { error: { workbook: 'Machine type is required' } });
   }
};

// Export module
module.exports = lib;
