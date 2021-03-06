/**
 * counterweight request handler
 */

// Project Dependencies
const mongo = require('../../../../mongo/mongo');

// Module container
const lib = {};

// TODO: 5-26-2021 2:07 PM - Document method
lib.root = async (data, callback) => {
   const capacity = parseInt(data?.query?.capacity);
   const carSpeed = parseInt(data?.query?.carSpeed);
   const roping = parseInt(data?.query?.roping);

   if (capacity && carSpeed && roping) {
      try {
         const _models = mongo.agg.getCounterweightModels(roping);
         const _shoes = mongo.agg.getShoes(capacity, carSpeed);

         const models = await mongo.engineering.collection('counterweights').aggregate(_models).toArray();
         const shoes = await mongo.engineering.collection('shoes').aggregate(_shoes).toArray();
         const safeties = await mongo.engineering
            .collection('safeties')
            .find({ 'limits.speed': { $gte: carSpeed } }, { projection: { _id: 0 }, sort: { weight: 1 } })
            .toArray();

         const shoePlates = await mongo.engineering.collection('shoe_plates').find().toArray();

         const sheaves = await mongo.engineering
            .collection('sheaves')
            .find({}, { projection: { _id: 0 }, sort: { diameter: 1, rimWidth: 1 } })
            .toArray();

         callback(200, { models, safeties, sheaves, shoes, shoePlates });
      } catch (error) {
         console.log(error);
         callback(500, { error: { workbook: error } });
      }
   } else {
      callback(400, { error: { workbook: 'Speed is required' } });
   }
};

// Export module
module.exports = lib;
