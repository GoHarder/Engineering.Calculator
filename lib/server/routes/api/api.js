// Project dependencies
const { parse, notFound } = require('../../route');

// Module container
const lib = {};

lib.root = (data, callback) => {
   data = { ...data, ...parse(data.dir) };

   const route = typeof lib.router[data.root] !== 'undefined' ? lib.router[data.root] : notFound;

   route(data, callback);
};

lib.router = {
   engineering: require('./engineering/engineering').root,
   proj: require('./proj').root,
   tokens: require('./tokens').root,
   users: require('./users').root,
};

// Export the module
module.exports = lib;
