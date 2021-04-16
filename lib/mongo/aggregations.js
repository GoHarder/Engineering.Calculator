/**
 * Library for mongodb aggregations
 */

// NPM Dependencies
const { ObjectID } = require('mongodb');

// Module container
const lib = {};

// Project Aggregations

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
      { $addFields: { currentUser: { $filter: { input: '$opened', as: 'i', cond: { $eq: ['$$i.userId', userId] } } } } },
      {
         $lookup: {
            from: 'users',
            let: { creatorId: '$creator' },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$creatorId'] } } }, { $project: { firstName: 1, lastName: 1 } }],
            as: 'creator',
         },
      },
      { $unwind: '$creator' },
      { $unwind: '$currentUser' },
      { $sort: { 'currentUser.time': -1 } },
      { $project: { creator: 1, contract: 1, jobName: 1, carNo: 1, customer: 1, layout: 1, created: 1, opened: 1 } },
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
      { $match: { $text: { $search: search } } },
      { $project: { creator: 1, contract: 1, jobName: 1, carNo: 1, customer: 1, layout: 1, created: 1, opened: 1, score: { $meta: 'textScore' } } },
      {
         $lookup: {
            from: 'users',
            let: { creatorId: '$creator' },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$creatorId'] } } }, { $project: { _id: 0, firstName: 1, lastName: 1 } }],
            as: 'creator',
         },
      },
      { $unwind: '$creator' },
      { $sort: { score: { $meta: 'textScore' } } },
      { $skip: skip },
      { $limit: limit },
   ];
};

/**
 * Creates an aggregation to open a complete calculator
 * @param {string} calcId The calculator id
 */
lib.getFullProj = (calcId) => {
   calcId = new ObjectID(calcId);

   return [
      { $match: { _id: calcId } },
      {
         $lookup: {
            from: 'modules',
            let: { searchId: '$_id' },
            pipeline: [{ $match: { $expr: { $eq: ['$$searchId', '$calcId'] } } }, { $project: { calcId: 0 } }],
            as: 'modules',
         },
      },
      { $addFields: { modules: { $arrayToObject: { $map: { input: '$modules', as: 'doc', in: { k: '$$doc.module', v: '$$doc' } } } } } },
   ];
};

// Steel Aggregations

/**
 * Creates an aggregation for channels in general
 * @param {string} steelType The type of steel
 * @param {string[]} specialChannels List of special channels
 */
getChannels = (steelType, specialChannels = []) => {
   return [
      { $match: { 'properties.material': steelType } },
      { $addFields: { type: { $substr: ['$name', 0, 1] } } },
      { $addFields: { type: { $cond: { if: { $eq: ['$type', 'C'] }, then: 0, else: 1 } } } },
      {
         $addFields: {
            sort: {
               $switch: {
                  branches: [
                     { case: { $eq: ['$stockStatus', 'Available'] }, then: 2 },
                     { case: { $eq: ['$stockStatus', 'Check'] }, then: 3 },
                  ],
                  default: 1,
               },
            },
         },
      },
      { $addFields: { sort: { $cond: [{ $in: ['$name', specialChannels] }, { $subtract: ['$sort', 1] }, '$sort'] } } },
      { $sort: { sort: 1, type: 1, 'dimensions.depth': 1 } },
      { $unset: ['type', 'sort'] },
      { $addFields: { 'properties.weight': { $round: [{ $divide: ['$properties.weight', 12] }, 5] } } },
      {
         $project: {
            _id: 0,
            'dimensions.webThickness': 0,
            'dimensions.flangeThickness': 0,
            'dimensions.gage': 0,
            'dimensions.area': 0,
            'properties.material': 0,
            'properties.modulusY': 0,
            'properties.inertiaY': 0,
         },
      },
   ];
};

// Product Aggregations

/**
 * Creates an aggregation for platform angle
 * @param {string} steelType The type of steel
 */
lib.getPlatformAngles = (steelType) => {
   return [
      { $match: { name: { $in: ['L3X3X1/4', 'L3X3X3/8', 'L3X3X1/2', 'L4X4X3/8', 'L4X4X1/2'] }, 'properties.material': steelType } },
      { $addFields: { 'properties.weight': { $divide: ['$properties.weight', 12] } } },
      {
         $project: {
            _id: 0,
            'dimensions.area': 0,
            'dimensions.width': 0,
            'properties.material': 0,
            'properties.modulusY': 0,
            'properties.inertiaX': 0,
            'properties.inertiaY': 0,
         },
      },
   ];
};

/**
 * Creates an aggregation for platform channel
 * @param {string} steelType The type of steel
 */
lib.getPlatformChannels = (steelType) => {
   const special = [
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
   ];

   return getChannels(steelType, special);
};

/**
 * Creates an aggregation for shoes
 * @param {number} capacity The max capacity of the shoe
 * @param {number} carSpeed The max speed of the shoe
 */
lib.getShoes = (capacity, carSpeed) => {
   return [
      { $match: { maxCapacity: { $gte: capacity }, maxSpeed: { $gte: carSpeed } } },
      {
         $addFields: {
            sort: {
               $switch: {
                  branches: [
                     { case: { $eq: ['$stockStatus', 'ELSCO'] }, then: 2 },
                     { case: { $eq: ['$stockStatus', 'ELPRO'] }, then: 3 },
                  ],
                  default: 1,
               },
            },
         },
      },
      { $sort: { sort: 1 } },
      { $unset: 'sort' },
      { $project: { _id: 0, manufacturer: 0 } },
   ];
};

/** Creates an aggregation for the top and bottom sling channels */
lib.getSlingTopAndBottomChannels = () => getChannels('ASTM A36', ['C8X11.5', 'C10X15.3', 'C12X20.7']);

/** Creates an aggregation for the sling stile channels */
lib.getSlingStileChannels = () => getChannels('ASTM A36', ['C7X9.8', 'MC6X12.0', 'MC8X18.7', 'MC8X22.8', 'MC10X28.5', 'MC12X31', 'MC12X50']);

// Export module
module.exports = lib;
