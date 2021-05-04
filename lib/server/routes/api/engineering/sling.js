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
      const topAndBottomChannelAggregation = mongo.agg.getSlingTopAndBottomChannels();
      const stileChannelAggregation = mongo.agg.getSlingStileChannels();

      try {
         const shoe = await mongo.engineering.collection('shoes').aggregate(shoeAggregation).toArray();

         const safety = await mongo.engineering
            .collection('safeties')
            .find({ 'limits.speed': { $gte: carSpeed } }, { sort: { weight: 1 } })
            .toArray();

         const topAndBottomChannels = await mongo.engineering.collection('channel').aggregate(topAndBottomChannelAggregation).toArray();

         const stiles = await mongo.engineering.collection('channel').aggregate(stileChannelAggregation).toArray();

         const sheaves = await mongo.engineering.collection('sheaves').find().toArray();

         const shoePlates = await mongo.engineering.collection('shoe_plates').find().toArray();

         callback(200, { safety, shoe, topChannels: topAndBottomChannels, bottomChannels: topAndBottomChannels, sheaves, stiles, shoePlates });
      } catch (error) {
         callback(500, { error: { workbook: error } });
      }
   } else {
      callback(400, { error: { workbook: 'Capacity and speed are incorrect' } });
   }
};

// Export module
module.exports = lib;
