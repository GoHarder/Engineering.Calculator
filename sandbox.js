const aggregation = [
   { $match: { _id: ObjectId('601c39ad983f1d516844f954') } },
   {
      $lookup: {
         from: 'modules',
         let: { searchId: '$_id' },
         pipeline: [{ $match: { $expr: { $eq: ['$$searchId', '$calcId'] } } }, { $project: { calcId: 0 } }],
         as: 'modules',
      },
   },
   {
      $addFields: {
         modules: {
            $arrayToObject: {
               $map: {
                  input: '$modules',
                  as: 'doc',
                  in: {
                     k: '$$doc.module',
                     v: '$$doc',
                  },
               },
            },
         },
      },
   },
];
