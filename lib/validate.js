// age: (value) => parseInt(value) === Number(value) && value >= 18,

const lib = {};

/**
 * Verifies a string is a string
 * @param {string} string The string to be verified
 */
lib.string = (string) => typeof string === 'string' && string.trim().length > 0;

/**
 * Verifies a string is a valid email
 * @param {string} string The string to be verified
 */
lib.email = (string) => {
   const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   let output = false;

   if (lib.string(string)) output = regex.test(string);

   return output;
};

/**
 * Verifies a string is a valid password
 * @param {string} string The string to be verified
 */
lib.password = (string) => {
   const regex = /^(?=.*[~!@#$%^&*()_\+\-\=])(?=.*\d)(?=.*[A-Z])(?=.*[a-z])\S{8,15}$/;
   let output = false;

   if (lib.string(string)) output = regex.test(string);

   return output;
};

/**
 * Verifies an object based on a schema
 * @param {object} object The object to be verified
 * @param {object} schema The schema to check the object
 */
lib.object = (object, schema) => {
   const errors = Object.keys(schema)
      .filter((key) => !schema[key](object[key]))
      .map((key) => `${key} is invalid.`);

   return errors.length === 0 ? { valid: true } : { valid: false, errors };
};

module.exports = lib;
