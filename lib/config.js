/*
 * Create and export configuration variables
 */

// Container for all environments
var environments = {};

// Staging (default) environment
environments.staging = {
   httpPort: 3000,
   httpsPort: 3001,
   envName: 'staging',
   hashingSecret: 'hashThing1',
   maxItems: 5,
   stripe: {
      apiKey: 'API_TEST_KEY'
   },
   mailGun: {
      apiKey: 'API_TEST_KEY',
      domain: 'API_TEST_DOMAIN'
   },
   templateGlobals: {
      appName: 'Application Name',
      companyName: "Jim's Brew House",
      yearCreated: '2019',
      baseUrl: 'http://localhost:3000/'
   }
};

// Production environment
environments.production = {
   httpPort: 5000,
   httpsPort: 5001,
   envName: 'production',
   hashingSecret: 'hashThing2',
   maxItems: 5,
   stripe: {
      apiKey: 'API_PRODUCTION_KEY'
   },
   mailGun: {
      apiKey: 'API_PRODUCTION_KEY',
      domain: 'API_PRODUCTION_DOMAIN'
   },
   templateGlobals: {
      appName: 'Application Name',
      companyName: "Jim's Brew House",
      yearCreated: '2019',
      baseUrl: 'http://localhost:5000/'
   }
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof environments[currentEnvironment] == 'object' ? environments[currentEnvironment] : environments.staging;

// Menu Data
environmentToExport.menuData = {
   size: {
      small: { diameter: '12in', price: 8.99 },
      medium: { diameter: '14in', price: 9.99 },
      large: { diameter: '16in', price: 11.99 }
   },
   toppings: {
      pepperoni: { price: 0.25 },
      sausage: { price: 0.25 },
      onions: { price: 0.1 },
      mushrooms: { price: 0.1 },
      olives: { price: 0.1 },
      green_pepper: { price: 0.1 },
      garlic: { price: 0.1 },
      tomatoes: { price: 0.1 },
      spinach: { price: 0.15 },
      pineapple: { price: 0.15 },
      ham: { price: 0.25 },
      bacon: { price: 0.25 },
      hamburger: { price: 0.25 },
      extra_cheese: { price: 0.25 }
   }
};

// Export the module
module.exports = environmentToExport;
