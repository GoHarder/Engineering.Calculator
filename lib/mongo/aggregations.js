/**
 * Library for mongodb aggregations
 */

// NPM Dependencies
const { ObjectID } = require('mongodb');

// Module container
const lib = {};

// Project Aggregations

// TODO: 7-09-2021 2:45 PM - When using $skip and $limit see if you can use the previous last document id as a point instead of skip

/**
 * Creates an aggregation to find the recent documents of a user
 * @param {string} userId The users id
 * @param {number} skip How many documents to skip
 * @param {number} limit How many documents to return
 */
lib.getProjRecentlyOpened = (userId, skip, limit) => {
   userId = new ObjectID(userId);

   return [
      { $match: { 'opened.userId': userId } },
      { $addFields: { _sort: { $filter: { input: '$opened', as: 'i', cond: { $eq: ['$$i.userId', userId] } } } } },
      { $unwind: { path: '$_sort' } },
      { $addFields: { _sort: '$_sort.time' } },
      { $sort: { _sort: -1 } },
      { $project: { carNo: 1, contract: 1, created: 1, creator: 1, customer: 1, jobName: 1, layout: 1, opened: 1 } },
      { $skip: skip },
      { $limit: limit },
   ];
};

/**
 * Creates an aggregation to find the recent documents of a user
 * @param {string} search The search string
 * @param {number} skip How many documents to skip
 * @param {number} limit How many documents to return
 */
lib.getProjBySearch = (search, skip, limit) => {
   return [
      {
         $search: {
            compound: {
               should: [
                  { autocomplete: { query: search, path: 'customer' } },
                  { autocomplete: { query: search, path: 'carNo' } },
                  { autocomplete: { query: search, path: 'jobName' } },
                  { autocomplete: { query: search, path: 'contract' } },
                  { autocomplete: { query: search, path: 'creator.firstName' } },
                  { autocomplete: { query: search, path: 'creator.lastName' } },
                  { autocomplete: { query: search, path: 'layout' } },
               ],
               minimumShouldMatch: 1,
            },
         },
      },
      { $project: { carNo: 1, contract: 1, created: 1, creator: 1, customer: 1, jobName: 1, layout: 1, opened: 1, score: { $meta: 'searchScore' } } },
      { $skip: skip },
      { $limit: limit },
   ];
};

// Product Aggregations

// TODO: 7-12-2021 9:17 AM -  The indexes need to be set up
// The index will make the documents pre sorted so the sort will needed to be updated

// - Shoes

/**
 * Creates an aggregation for shoes
 * @param {number} capacity The max capacity of the shoe
 * @param {number} carSpeed The max speed of the shoe
 */
lib.getShoes = (capacity, carSpeed) => {
   return [
      { $match: { maxCapacity: { $gte: capacity }, maxSpeed: { $gte: carSpeed } } },
      { $sort: { _manufacturerSort: 1 } },
      { $unset: '_manufacturerSort' },
      { $project: { _id: 0, manufacturer: 0, maxCapacity: 0, maxSpeed: 0 } },
   ];
};

// - Platforms

/**
 * Creates an aggregation for platform angle
 * @param {string} steelType The type of steel
 */
lib.getPlatformAngles = (steelType) => {
   return [
      { $match: { shape: 'angle', material: steelType, name: { $in: ['L3X3X1/4', 'L3X3X3/8', 'L3X3X1/2', 'L4X4X3/8', 'L4X4X1/2'] } } },
      { $unset: '_stockStatusSort' },
      { $project: { _id: 0, area: 0, inertiaX: 0, inertiaY: 0, material: 0, modulusY: 0, shape: 0, width: 0 } },
   ];
};

/**
 * Creates an aggregation for platform channel
 * @param {string} steelType The type of steel
 */
lib.getPlatformChannels = (steelType) => {
   return [
      { $match: { shape: 'channel', material: steelType } },
      {
         $addFields: {
            _specialSort: {
               $cond: [
                  {
                     $in: [
                        '$name',
                        [
                           'C4X5.4',
                           'C5X6.7',
                           'C6X8.2',
                           'C7X9.8',
                           'C8X11.5',
                           'C9X13.4',
                           'C10X15.3',
                           'C12X20.7',
                           'C15X33.9',
                           'MC4X13.8',
                           'MC6X12',
                           'MC6X15.3',
                           'MC8X18.7',
                           'MC8X22.8',
                           'MC10X28.5',
                           'MC12X31',
                        ],
                     ],
                  },
                  0,
                  1,
               ],
            },
         },
      },
      { $sort: { _nameSort: 1, _specialSort: 1, _stockStatusSort: 1, depth: 1 } },
      { $unset: ['_nameSort', '_specialSort', '_stockStatusSort'] },
      { $project: { _id: 0, area: 0, flangeThickness: 0, gage: 0, inertiaY: 0, material: 0, modulusY: 0, shape: 0, webThickness: 0 } },
   ];
};

// - Sling

/** Creates an aggregation for the sling models */
lib.getSlingModels = () => {
   return [{ $sort: { _sort: 1 } }, { $project: { _id: 0, _sort: 0 } }];
};

/** Creates an aggregation for the sling channels */
lib.getSlingChannels = () => {
   return [
      { $match: { material: 'ASTM A36', depth: { $gte: 6 }, shape: 'channel' } },
      { $sort: { _nameSort: 1, _stockStatusSort: 1, depth: 1 } },
      { $unset: ['_nameSort', '_stockStatusSort'] },
      { $project: { _id: 0, area: 0, flangeThickness: 0, gage: 0, inertiaY: 0, material: 0, modulusY: 0, webThickness: 0 } },
   ];
};

/** Creates an aggregation for the sling top channels with gussets */
lib.getSlingTopChannels = () => {
   return [
      { $match: { material: 'ASTM A36', depth: { $gte: 6 }, shape: 'channel' } },
      { $sort: { _nameSort: 1, _stockStatusSort: 1, depth: 1 } },
      { $unset: ['_nameSort', '_stockStatusSort'] },
      { $lookup: { from: 'sling_gussets', localField: 'depth', foreignField: 'channelDepth', as: 'slingGusset' } },
      { $unwind: { path: '$slingGusset' } },
      { $project: { _id: 0, area: 0, flangeThickness: 0, inertiaY: 0, material: 0, modulusY: 0, 'slingGusset._id': 0, 'slingGusset.channelDepth': 0, webThickness: 0 } },
   ];
};

/**
 * Creates an aggregation for the counterweight models
 * @param {number} roping The roping numerator
 */
lib.getCounterweightModels = (roping) => {
   return [{ $match: { roping } }, { $project: { _id: 0, roping: 0 } }, { $sort: { _sort: 1 } }];
};

/**
 * Creates an aggregation for machine models with traction sheaves
 * @param {'Geared'|'Gearless'} type The machine type
 * @param {'Overhead'|'Hoistway'|'Overhead'} location The machine location
 */
lib.getMachineModels = (type, location) => {
   return [{ $match: { type, location } }, { $project: { _id: 0, location: 0, type: 0 } }];
};

// Export module
module.exports = lib;
