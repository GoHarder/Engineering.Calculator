/**
 * Library for mongodb aggregations
 */

// NPM Dependencies
const { ObjectID } = require('mongodb');

// Module container
const lib = {};

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
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$creatorId'] } } }, { $project: { _id: 0, firstName: 1, lastName: 1 } }],
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

// Export module
module.exports = lib;
