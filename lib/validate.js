const schema = {
   name: (value) => /^([A-Z][a-z\-]* )+[A-Z][a-z\-]*( \w+\.?)?$/.test(value),
   age: (value) => parseInt(value) === Number(value) && value >= 18,
   phone: (value) => /^(\+?\d{1,2}-)?\d{3}-\d{3}-\d{4}$/.test(value),
};

let info = {
   name: 'John Doe',
   age: 17,
   phone: '123-456-7800',
};

const lib = {};

lib.string = (string) => typeof string === 'string' && string.trim().length > 0;

lib.email = (string) => {
   if (lib.string(string)) {
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(string);
   } else {
      return false;
   }
};

lib.object = (object, schema) => {
   const errors = Object.keys(schema)
      .filter((key) => !schema[key](object[key]))
      .map((key) => `${key} is invalid.`);

   return errors.length === 0 ? { valid: true } : { valid: false, errors };
};

module.exports = lib;
