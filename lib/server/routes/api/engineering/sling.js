/**
 * sling request handler
 */

// Project Dependencies
const mongo = require('../../../../mongo/mongo');

// Module container
const lib = {};

// TODO: 5-26-2021 2:07 PM - Document method
lib.root = async (data, callback) => {
   const capacity = parseInt(data?.query?.capacity);
   const carSpeed = parseInt(data?.query?.carSpeed);

   if (capacity && carSpeed) {
      // Aggregations
      const _models = mongo.agg.getSlingModels();
      const _shoes = mongo.agg.getShoes(capacity, carSpeed);
      const _topChannels = mongo.agg.getSlingTopChannels();
      const _channels = mongo.agg.getSlingChannels();

      try {
         const models = await mongo.engineering.collection('slings').aggregate(_models).toArray();
         const shoes = await mongo.engineering.collection('shoes').aggregate(_shoes).toArray();

         const safeties = await mongo.engineering
            .collection('safeties')
            .find({ 'limits.speed': { $gte: carSpeed } }, { projection: { _id: 0 }, sort: { weight: 1 } })
            .toArray();

         const topChannels = await mongo.engineering.collection('channel').aggregate(_topChannels).toArray();
         const channels = await mongo.engineering.collection('channel').aggregate(_channels).toArray();

         const sheaves = await mongo.engineering
            .collection('sheaves')
            .find({}, { projection: { _id: 0 }, sort: { diameter: 1, rimWidth: 1 } })
            .toArray();

         const shoePlates = await mongo.engineering.collection('shoe_plates').find().toArray();

         callback(200, {
            bottomChannels: channels,
            models,
            otherChannels: channels,
            safeties,
            sheaves,
            sheaveChannels: channels,
            shoePlates,
            shoes,
            topChannels,
         });
      } catch (error) {
         console.log(error);
         callback(500, { error: { workbook: error } });
      }
   } else {
      callback(400, { error: { workbook: 'Capacity and speed are incorrect' } });
   }
};

// Export module
module.exports = lib;
