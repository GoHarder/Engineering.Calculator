/**
 * sling request handler
 */

// Project Dependencies
const mongo = require('../../../../mongo/mongo');

// Module container
const lib = {};

lib.root = async (data, callback) => {
   const capacity = parseInt(data?.query?.capacity);
   const carSpeed = parseInt(data?.query?.carSpeed);

   if (capacity && carSpeed) {
      const shoeAggregation = mongo.agg.getShoes(capacity, carSpeed);

      try {
         const shoe = await mongo.engineering.collection('shoes').aggregate(shoeAggregation).toArray();

         const safety = await mongo.engineering
            .collection('safeties')
            .find({ 'limits.speed': { $gte: carSpeed } }, { sort: { weight: 1 } })
            .toArray();

         callback(200, { safety, shoe });
      } catch (error) {
         callback(500, { error: { workbook: error } });
      }
   } else {
      callback(400, { error: { workbook: 'Capacity and speed are incorrect' } });
   }
};

// Export module
module.exports = lib;
