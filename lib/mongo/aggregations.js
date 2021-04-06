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
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$creatorId'] } } }, { $project: { firstName: 1, lastName: 1 } }],
            as: 'creator',
         },
      },
      { $unwind: '$creator' },
      { $unwind: '$currentUser' },
      { $sort: { 'currentUser.time': 1 } },
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

// /**
//  * Creates an aggregation to help select channels
//  * @param {string} material The channel material
//  * @param {number} sectionModulus The minimum section modulus
//  * @param {number} momentOfInertia The minimum moment of inertia
//  */
//  lib.getChannel = (material, sectionModulus, momentOfInertia) => {

/**
 * Creates an aggregation to help select channels
 * @param {string} material The channel material
 * @param {number} sectionModulus The minimum section modulus
 * @param {number} momentOfInertia The minimum moment of inertia
 */
lib.getChannel = (match) => {
   return [
      match,
      { $addFields: { type: { $substr: ['$name', 0, 1] } } },
      { $addFields: { type: { $cond: { if: { $eq: ['$type', 'C'] }, then: 0, else: 1 } } } },
      {
         $addFields: {
            stockStatus: {
               $switch: {
                  branches: [
                     { case: { $eq: ['$stockStatus', 'Available'] }, then: 1 },
                     { case: { $eq: ['$stockStatus', 'Check'] }, then: 2 },
                  ],
                  default: 0,
               },
            },
         },
      },
      { $sort: { stockStatus: 1, type: 1 } },
      {
         $addFields: {
            stockStatus: {
               $switch: {
                  branches: [
                     {
                        case: { $eq: ['$stockStatus', 1] },
                        then: 'Available',
                     },
                     {
                        case: { $eq: ['$stockStatus', 2] },
                        then: 'Check',
                     },
                  ],
                  default: 'Stocked',
               },
            },
         },
      },
      { $addFields: { text: '$name' } },
      { $unset: ['name', 'type'] },
   ];
};

// Export module
module.exports = lib;
