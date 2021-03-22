const aggregation = [
   { $match: { 'opened.userId': '5ff38f7558d9411be0437ad3' } },
   {
      $addFields: {
         currentUser: {
            $filter: {
               input: '$opened',
               as: 'i',
               cond: { $eq: ['$$i.userId', '5ff38f7558d9411be0437ad3'] },
            },
         },
      },
   },
   {
      $lookup: {
         from: 'users',
         let: { creatorId: '$creator' },
         pipeline: [
            {
               $match: { $expr: { $eq: ['$_id', '$$creatorId'] } },
            },
            { $project: { _id: 0, firstName: 1, lastName: 1 } },
         ],
         as: 'creator',
      },
   },
   { $unwind: '$creator' },
   { $unwind: '$currentUser' },
   { $sort: { 'currentUser.time': -1 } },
   {
      $project: {
         creator: 1,
         contract: 1,
         jobName: 1,
         carNo: 1,
         customer: 1,
         layout: 1,
         created: 1,
         opened: 1,
      },
   },
   { $skip: 0 },
   { $limit: 15 },
];
