/*
 * Request handlers
 */

// Project Dependencies
var _data = require('./data');
var _logs = require('./logs');
var helpers = require('./helpers');
var config = require('./config');

// Setup RegExp tests
var emailPattern = new RegExp(/^.+@.+$/);

// Define the handlers
var handlers = {};

/*
 * HTML Handlers
 */

// Index Handler
handlers.index = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Welcome`,
         'body.class': 'index'
      };

      // Read in the index template as a string
      helpers.getTemplate('index', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

// Create an account
handlers.accountCreate = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Sign Up`,
         'body.class': 'accountCreate'
      };

      // Read in the index template as a string
      helpers.getTemplate('accountCreate', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

// Edit an account
handlers.accountEdit = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Account Settings`,
         'body.class': 'accountEdit'
      };

      // Read in the index template as a string
      helpers.getTemplate('accountEdit', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

// Create a session (log in)
handlers.sessionCreate = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Log In`,
         'body.class': 'sessionCreate'
      };

      // Read in the index template as a string
      helpers.getTemplate('sessionCreate', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

// Shopping cart
handlers.cartEdit = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Cart`,
         'body.class': 'cartEdit'
      };

      // Read in the index template as a string
      helpers.getTemplate('cartEdit', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

// Edit a cart item
handlers.itemEdit = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Edit Item`,
         'body.class': 'itemEdit'
      };

      // Read in the index template as a string
      helpers.getTemplate('itemEdit', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

// View the menu
handlers.menu = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Menu`,
         'body.class': 'menu'
      };

      // Read in the index template as a string
      helpers.getTemplate('menu', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

// Edit a cart item
handlers.checkout = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Prepare data for interpolation
      var templateData = {
         'head.title': `Checkout`,
         'body.class': 'checkout'
      };

      // Read in the index template as a string
      helpers.getTemplate('checkout', templateData, (err, str) => {
         if (!err && str) {
            // Add the universal header and footer
            helpers.addUniversalTemplates(str, templateData, (err, str) => {
               if (!err && str) {
                  // Return the string as HTML
                  callback(200, str, 'html');
               } else {
                  callback(500, undefined, 'html');
               }
            });
         } else {
            callback(500, undefined, 'html');
         }
      });
   } else {
      callback(405, undefined, 'html');
   }
};

// Favicon
handlers.favicon = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Read in the favicon data
      helpers.getStaticAsset('favicon.ico', (err, data) => {
         if (!err && data) {
            callback(200, data, 'favicon');
         } else {
            callback(500);
         }
      });
   } else {
      callback(405);
   }
};

handlers.serviceWorker = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Read in the favicon data
      helpers.getStaticAsset('serviceWorker.js', (err, data) => {
         if (!err && data) {
            callback(200, data, 'js');
         } else {
            callback(500);
         }
      });
   } else {
      callback(405);
   }
};

// Public assets
// Favicon
handlers.public = (data, callback) => {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // Get the file name being requested
      var trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
      if (trimmedAssetName.length > 0) {
         helpers.getStaticAsset(trimmedAssetName, (err, data) => {
            if (!err && data) {
               // Determine the content type and fallback to pain text
               var contentType = 'plain';

               if (trimmedAssetName.indexOf('.css') > -1) {
                  contentType = 'css';
               }

               if (trimmedAssetName.indexOf('.js') > -1) {
                  contentType = 'js';
               }

               if (trimmedAssetName.indexOf('.png') > -1) {
                  contentType = 'png';
               }
               if (trimmedAssetName.indexOf('.jpeg') > -1) {
                  contentType = 'jpg';
               }
               if (trimmedAssetName.indexOf('.jpg') > -1) {
                  contentType = 'jpg';
               }
               if (trimmedAssetName.indexOf('.ico') > -1) {
                  contentType = 'favicon';
               }

               callback(200, data, contentType);
            } else {
               callback(404);
            }
         });
      } else {
         callback(404);
      }
   } else {
      callback(405);
   }
};

/*
 * JSON API Handlers
 */

// Users handler
handlers.users = (data, callback) => {
   var acceptableMethods = ['post', 'put', 'get', 'delete'];
   if (acceptableMethods.indexOf(data.method) > -1) {
      handlers._users[data.method](data, callback);
   } else {
      callback(405);
   }
};

// Container for the users sub methods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, email, address, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
   // Check that all required fields are filled out
   var firstName = typeof data.payload.firstName == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
   var lastName = typeof data.payload.lastName == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
   var email = typeof data.payload.email == 'string' && emailPattern.test(data.payload.email.trim()) ? data.payload.email.trim() : false;
   var address = typeof data.payload.address == 'object' && data.payload.address instanceof Object ? data.payload.address : false;
   var password = typeof data.payload.password == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
   var tosAgreement = typeof data.payload.tosAgreement == 'boolean' && data.payload.tosAgreement == true ? true : false;

   // Remove @ and . and replace with - for file names
   var userFile = email ? email.replace(/[@.]/g, '-') : false;

   // Check address
   if (address) {
      var city = typeof address.city == 'string' && address.city.trim().length > 0 ? address.city.trim() : false;
      var state = typeof address.state == 'string' && address.state.trim().length == 2 ? address.state.trim() : false;
      var streetAddress = typeof address.streetAddress == 'string' && address.streetAddress.trim().length > 0 ? address.streetAddress.trim() : false;
      var zipCode = typeof address.zipCode == 'string' && address.zipCode.trim().length == 5 ? address.zipCode.trim() : false;

      address = city && state && streetAddress && zipCode ? address : false;
   }

   if (firstName && lastName && email && address && password && tosAgreement) {
      // Make sure user doesn't already exist
      _data.read('users', userFile, (err, data) => {
         if (err) {
            // Hash the password
            var hashedPassword = helpers.hash(password);

            // Create the user object
            if (hashedPassword) {
               var userObject = {
                  userFile: userFile,
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  address: address,
                  hashedPassword: hashedPassword,
                  tosAgreement: true,
                  signUpTime: Date.now()
               };

               // Store the user
               _data.create('users', userFile, userObject, err => {
                  if (!err) {
                     callback(200);
                  } else {
                     console.log(err);
                     callback(500, { Error: 'Could not create the new user' });
                  }
               });
            } else {
               callback(500, { Error: 'Could not hash the user password' });
            }
         } else {
            // User already exists
            callback(400, { Error: 'A user with that email already exists' });
         }
      });
   } else {
      callback(400, { Error: 'Missing required fields' });
   }
};

// Users - get
// Required data: email
// Optional data: none
handlers._users.get = (data, callback) => {
   var email = typeof data.queryStringObject.email == 'string' && emailPattern.test(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim() : false;
   var userFile = email ? email.replace(/[@.]/g, '-') : false;
   if (email) {
      // Get the token from the headers
      var token = typeof data.headers.token == 'string' ? data.headers.token : false;

      // Verify that the given token is valid for the email
      handlers._tokens.verifyToken(token, email, tokenIsValid => {
         if (tokenIsValid) {
            // Lookup the user
            _data.read('users', userFile, (err, data) => {
               if (!err && data) {
                  // Removed hashed password and internal user id from user object before returning it
                  delete data.userFile;
                  delete data.hashedPassword;
                  delete data.createTime;
                  callback(200, data);
               } else {
                  callback(404);
               }
            });
         } else {
            callback(403, { Error: 'Token is not valid or token is missing' });
         }
      });
   } else {
      callback(400, { Error: 'Missing required fields' });
   }
};

// Users - put
// Required data: email
// Optional data: firstName, lastName, address, password, tosAgreement (one must be specified)
handlers._users.put = (data, callback) => {
   // Check for required data
   var email = typeof data.payload.email == 'string' && emailPattern.test(data.payload.email.trim()) ? data.payload.email.trim() : false;
   var userFile = email ? email.replace(/[@.]/g, '-') : false;

   // Check for optional data
   var firstName = typeof data.payload.firstName == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
   var lastName = typeof data.payload.lastName == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
   var address = typeof data.payload.address == 'object' && data.payload.address instanceof Object ? data.payload.address : false;
   var password = typeof data.payload.password == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

   // Check address
   if (address) {
      var city = typeof address.city == 'string' && address.city.trim().length > 0 ? address.city.trim() : false;
      var state = typeof address.state == 'string' && address.state.trim().length == 2 ? address.state.trim() : false;
      var streetAddress = typeof address.streetAddress == 'string' && address.streetAddress.trim().length > 0 ? address.streetAddress.trim() : false;
      var zipCode = typeof address.zipCode == 'string' && address.zipCode.trim().length == 5 ? address.zipCode.trim() : false;

      address = city && state && streetAddress && zipCode ? address : false;
   }

   if (email) {
      // Error if nothing is sent to update
      if (firstName || lastName || address || password) {
         // Get the token from the headers
         var token = typeof data.headers.token == 'string' ? data.headers.token : false;

         // Verify that the given token is valid for the email
         handlers._tokens.verifyToken(token, email, tokenIsValid => {
            if (tokenIsValid) {
               // Look up user
               _data.read('users', userFile, (err, readData) => {
                  if (!err && data) {
                     // Update related updated fields
                     if (firstName) {
                        readData.firstName = firstName;
                     }
                     if (lastName) {
                        readData.lastName = lastName;
                     }
                     if (address) {
                        readData.address = address;
                     }
                     if (password) {
                        // Hash the password
                        var hashedPassword = helpers.hash(password);
                        if (hashedPassword) {
                           readData.password = hashedPassword;
                        } else {
                           callback(500, {
                              Error: 'Could not hash the user password'
                           });
                        }
                     }

                     // Store updates
                     _data.update('users', userFile, readData, err => {
                        if (!err) {
                           callback(200);
                        } else {
                           console.log(err);
                           callback(500, { Error: 'Could not update user' });
                        }
                     });
                  } else {
                     callback(400, { Error: 'User does not exist' });
                  }
               });
            } else {
               callback(403, {
                  Error: 'Token is not valid or token is missing'
               });
            }
         });
      } else {
         callback(400, { Error: 'Missing required fields to update' });
      }
   } else {
      callback(400, { Error: 'Missing required field' });
   }
};

// Users - delete
// Required data: email
handlers._users.delete = (data, callback) => {
   // Check is email is valid
   var email = typeof data.queryStringObject.email == 'string' && emailPattern.test(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim() : false;
   var userFile = email ? email.replace(/[@.]/g, '-') : false;

   if (email) {
      // Get the token from the headers
      var token = typeof data.headers.token == 'string' ? data.headers.token : false;

      // Verify that the given token is valid for the email
      handlers._tokens.verifyToken(token, email, tokenIsValid => {
         if (tokenIsValid) {
            // Look up the user
            _data.read('users', userFile, (err, data) => {
               if (!err && data) {
                  // Delete the user
                  _data.delete('users', userFile, err => {
                     if (!err) {
                        // Delete the items that the user had in their cart
                        var cartItems = typeof data.cartItems == 'object' && data.cartItems instanceof Array ? data.cartItems : [];
                        var itemsToDelete = cartItems.length;
                        if (itemsToDelete > 0) {
                           var itemsDeleted = 0;
                           var deletionErrors = false;

                           // Loop through the items
                           cartItems.forEach(itemId => {
                              // Delete the items
                              _data.delete('items', itemId, err => {
                                 if (err) {
                                    deletionErrors = true;
                                 }
                                 itemsDeleted++;
                                 if (itemsDeleted == itemsToDelete) {
                                    if (!deletionErrors) {
                                       callback(200);
                                    } else {
                                       callback(500, {
                                          Error: 'Error in deleting item'
                                       });
                                    }
                                 }
                              });
                           });
                        } else {
                           callback(200);
                        }
                     } else {
                        callback(500, { Error: 'Could not delete the user' });
                     }
                  });
               } else {
                  callback(400, { Error: 'Could not find the specified user' });
               }
            });
         } else {
            callback(403, { Error: 'Token is not valid or token is missing' });
         }
      });
   } else {
      callback(400, { Error: 'Missing required fields' });
   }
};

// Tokens handler
handlers.tokens = (data, callback) => {
   var acceptableMethods = ['post', 'put', 'get', 'delete'];
   if (acceptableMethods.indexOf(data.method) > -1) {
      handlers._tokens[data.method](data, callback);
   } else {
      callback(405);
   }
};

// Container for the tokens sub methods
handlers._tokens = {};

// Tokens - post
// Required data: email, password
// Optional data: none
handlers._tokens.post = (data, callback) => {
   // Check that all required fields are filled out
   var email = typeof data.payload.email == 'string' && emailPattern.test(data.payload.email.trim()) ? data.payload.email.trim() : false;
   var password = typeof data.payload.password == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
   var userFile = email ? email.replace(/[@.]/g, '-') : false;

   if (email && password) {
      // Look up user who matches the email
      _data.read('users', userFile, (err, readData) => {
         if (!err && readData) {
            // Hash the password compare it to stored password
            var hashedPassword = helpers.hash(password);

            if (hashedPassword == readData.hashedPassword) {
               // If valid create a new token with a random name that expires 12 hours in the future
               var tokenId = helpers.createRandomString(20);
               var expires = Date.now() + 1000 * 60 * 60 * 12;

               var tokenObject = {
                  email: email,
                  id: tokenId,
                  expires: expires
               };

               // Store the token
               _data.create('tokens', tokenId, tokenObject, err => {
                  if (!err) {
                     callback(200, tokenObject);
                  } else {
                     console.log(err);
                     callback(500, { Error: 'Could not create new token' });
                  }
               });
            } else {
               callback(400, {
                  Error: "Password did not match user's password"
               });
            }
         } else {
            callback(400, { Error: 'Could not find user' });
         }
      });
   } else {
      callback(400, { Error: 'Missing required fields' });
   }
};

// Tokens - get
// Required data: id
// Optional data: none
handlers._tokens.get = (data, callback) => {
   var id = typeof data.queryStringObject.id == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
   if (id) {
      // Lookup the token
      _data.read('tokens', id, (err, data) => {
         if (!err && data) {
            callback(200, data);
         } else {
            callback(404);
         }
      });
   } else {
      callback(400, { Error: 'Missing required fields' });
   }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
handlers._tokens.put = (data, callback) => {
   // Check for required data
   var id = typeof data.payload.id == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
   var extend = typeof data.payload.extend == 'boolean' ? true : false;

   if (id && extend) {
      // Look up token
      _data.read('tokens', id, (err, readData) => {
         if (!err && readData) {
            // Check to see if the token has expired
            if (readData.expires > Date.now()) {
               // Update related updated fields
               readData.expires = Date.now() + 1000 * 60 * 60;

               // Store updates
               _data.update('tokens', id, readData, err => {
                  if (!err) {
                     callback(200);
                  } else {
                     console.log(err);
                     callback(500, { Error: 'Could not update token' });
                  }
               });
            } else {
               callback(400, { Error: 'Token has expired' });
            }
         } else {
            callback(400, { Error: 'Token does not exist' });
         }
      });
   } else {
      callback(400, { Error: 'Missing required field' });
   }
};

// Tokens - delete
// Required data: id
// Optional data: none
handlers._tokens.delete = (data, callback) => {
   // Check if id is valid
   var id = typeof data.queryStringObject.id == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
   if (id) {
      // Look up the token
      _data.read('tokens', id, (err, data) => {
         if (!err && data) {
            // Delete the token
            _data.delete('tokens', id, err => {
               if (!err) {
                  callback(200);
               } else {
                  callback(500, { Error: 'Could not delete the token' });
               }
            });
         } else {
            callback(400, { Error: 'Could not find the specified token' });
         }
      });
   } else {
      callback(400, { Error: 'Missing required fields' });
   }
};

// Verify if a given token id is currently valid for a give user
handlers._tokens.verifyToken = (id, email, callback) => {
   // Look up the token
   _data.read('tokens', id, (err, readData) => {
      if (!err && readData) {
         // Check that the token is for the given user and has not expired
         if (email == readData.email && readData.expires > Date.now()) {
            callback(true);
         } else {
            callback(false);
         }
      } else {
         callback(false);
      }
   });
};

// Menu handler
// Menu - get
// Required data: token
// Optional data: none
handlers._menu = (data, callback) => {
   if (data.method == 'get') {
      // Get the token from the headers
      var token = typeof data.headers.token == 'string' ? data.headers.token : false;

      if (token) {
         // See if token is in the server
         _data.read('tokens', token, err => {
            if (!err) {
               callback(false, config.menuData);
            } else {
               callback(403);
            }
         });
      } else {
         callback(403);
      }
   } else {
      callback(405);
   }
};

// Items handler
handlers.items = (data, callback) => {
   var acceptableMethods = ['post', 'put', 'get', 'delete'];
   if (acceptableMethods.indexOf(data.method) > -1) {
      handlers._items[data.method](data, callback);
   } else {
      callback(405);
   }
};

// Container for the users sub methods
handlers._items = {};

// Items - post{}
// Required data: size, toppings
// Optional data: none
handlers._items.post = (data, callback) => {
   // Validate inputs
   var size = typeof data.payload.size == 'string' && ['small', 'medium', 'large'].indexOf(data.payload.size) > -1 ? data.payload.size : false;
   var toppings = typeof data.payload.toppings == 'object' && data.payload.toppings instanceof Array ? data.payload.toppings : false;

   // Verify toppings
   toppings.forEach(topping => {
      if (config.menuData.toppings.hasOwnProperty(topping) == false) {
         toppings = false;
      }
   });

   if (size && toppings) {
      // Get the token from the headers
      var token = typeof data.headers.token == 'string' ? data.headers.token : false;

      // Look up user by reading token
      _data.read('tokens', token, (err, tokenData) => {
         if (!err && tokenData) {
            var userEmail = tokenData.email;
            var userFile = userEmail ? userEmail.replace(/[@.]/g, '-') : false;

            // Look up user data
            _data.read('users', userFile, (err, userData) => {
               if (!err && userData) {
                  var cartItems = typeof userData.cartItems == 'object' && userData.cartItems instanceof Array ? userData.cartItems : [];

                  // Verify that the user has less than the number of maxItems
                  if (cartItems.length < config.maxItems) {
                     // Create random id for the item
                     var itemId = helpers.createRandomString(20);

                     // Create a price for the item
                     var price = config.menuData.size[size].price;

                     toppings.forEach(topping => {
                        price += config.menuData.toppings[topping].price;
                     });

                     // Create the item object and include the users email
                     var itemObject = {
                        id: itemId,
                        userEmail: userEmail,
                        size: size,
                        toppings: toppings,
                        price: price
                     };

                     // Save the object
                     _data.create('items', itemId, itemObject, err => {
                        if (!err) {
                           // Add the item to the users cart
                           userData.cartItems = cartItems;
                           userData.cartItems.push(itemId);

                           // Save the new user data
                           _data.update('users', userFile, userData, err => {
                              if (!err) {
                                 // Return the data about the new check
                                 callback(200, itemObject);
                              } else {
                                 callback(500, {
                                    Error: 'Could not update the user with the new item'
                                 });
                              }
                           });
                        } else {
                           callback(500, {
                              Error: 'Could not create the new item'
                           });
                        }
                     });
                  } else {
                     callback(400, {
                        Error: `The user has the maximum number of items in their cart (${config.maxItems})`
                     });
                  }
               } else {
                  callback(403);
               }
            });
         } else {
            callback(403);
         }
      });
   } else {
      callback(400, { Error: 'Missing required inputs or inputs are invalid' });
   }
};

// Items - get
// Required data: id
// Optional data: none
handlers._items.get = (data, callback) => {
   var id = typeof data.queryStringObject.id == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
   if (id) {
      // Lookup the check
      _data.read('items', id, (err, itemData) => {
         if (!err && itemData) {
            // Get the token from the headers
            var token = typeof data.headers.token == 'string' ? data.headers.token : false;

            // Verify that the given token is valid for user who made the check
            handlers._tokens.verifyToken(token, itemData.userEmail, tokenIsValid => {
               if (tokenIsValid) {
                  callback(200, itemData);
               } else {
                  callback(403, {
                     Error: 'Token is not valid or token is missing'
                  });
               }
            });
         } else {
            callback(404);
         }
      });
   } else {
      callback(400, { Error: 'Missing required fields' });
   }
};

// items - put
// Required data: id
// Optional data: size, toppings
handlers._items.put = (data, callback) => {
   // Check for required data
   var id = typeof data.payload.id == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

   // Check for optional data
   var size = typeof data.payload.size == 'string' && ['small', 'medium', 'large'].indexOf(data.payload.size) > -1 ? data.payload.size : false;
   var toppings = typeof data.payload.toppings == 'object' && data.payload.toppings instanceof Array ? data.payload.toppings : false;

   // Verify toppings
   toppings.forEach(topping => {
      if (config.menuData.toppings.hasOwnProperty(topping) == false) {
         toppings = false;
      }
   });

   if (id) {
      // Error is nothing is sent to update
      if (size || toppings) {
         // Get the token from the headers
         var token = typeof data.headers.token == 'string' ? data.headers.token : false;

         // Look up user
         _data.read('items', id, (err, readData) => {
            if (!err && data) {
               // Verify that the given token is valid for the id
               handlers._tokens.verifyToken(token, readData.userEmail, tokenIsValid => {
                  if (tokenIsValid) {
                     // Update related updated fields
                     if (size) {
                        readData.size = size;
                     }
                     if (toppings) {
                        readData.toppings = toppings;
                     }

                     // Create a price for the item
                     var price = config.menuData.size[size].price;

                     toppings.forEach(topping => {
                        price += config.menuData.toppings[topping].price;
                     });

                     // Store updates
                     _data.update('items', id, readData, err => {
                        if (!err) {
                           callback(200);
                        } else {
                           console.log(err);
                           callback(500, { Error: 'Could not update item' });
                        }
                     });
                  } else {
                     callback(403, {
                        Error: 'Token is not valid or token is missing'
                     });
                  }
               });
            } else {
               callback(400, { Error: 'Item does not exist' });
            }
         });
      } else {
         callback(400, { Error: 'Missing required fields to update' });
      }
   } else {
      callback(400, { Error: 'Missing required field' });
   }
};

// Items - delete
// Required data: id
// Optional data: none
handlers._items.delete = (data, callback) => {
   // Check for required data
   var id = typeof data.payload.id == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

   if (id) {
      // Get the token from the headers
      var token = typeof data.headers.token == 'string' ? data.headers.token : false;

      // Look up check
      _data.read('items', id, (err, itemData) => {
         if (!err && itemData) {
            // Verify that the given token is valid for the email
            handlers._tokens.verifyToken(token, itemData.userEmail, tokenIsValid => {
               if (tokenIsValid) {
                  // Delete the item
                  _data.delete('items', id, err => {
                     if (!err) {
                        var userFile = itemData.userEmail ? itemData.userEmail.replace(/[@.]/g, '-') : false;

                        // Look up the user
                        _data.read('users', userFile, (err, userData) => {
                           if (!err && userData) {
                              var cartItems = typeof userData.cartItems == 'object' && userData.cartItems instanceof Array ? userData.cartItems : [];

                              // Remove item from list of items
                              var itemPosition = cartItems.indexOf(id);
                              if (itemPosition > -1) {
                                 cartItems.splice(itemPosition, 1);

                                 // Re-save the data
                                 _data.update('users', userFile, userData, err => {
                                    if (!err) {
                                       callback(200);
                                    } else {
                                       callback(500, {
                                          Error: 'Could not update user'
                                       });
                                    }
                                 });
                              } else {
                                 callback(500, {
                                    Error: 'Could not find the item in the object'
                                 });
                              }
                           } else {
                              callback(400, {
                                 Error: 'Could not find the specified user'
                              });
                           }
                        });
                     } else {
                        callback(500, {
                           Error: 'Could not delete the item'
                        });
                     }
                  });
               } else {
                  callback(403, {
                     Error: 'Token is not valid or token is missing'
                  });
               }
            });
         } else {
            callback(400, { Error: 'Check does not exist' });
         }
      });
   } else {
      callback(400, { Error: 'Missing required field' });
   }
};

// Checkout handler
// Checkout - post
// Required data: email
// Optional data: none
handlers._checkout = (data, callback) => {
   if (data.method == 'post') {
      // Check that all required fields are filled out
      var email = typeof data.payload.email == 'string' && emailPattern.test(data.payload.email.trim()) ? data.payload.email.trim() : false;
      var cardToken = typeof data.payload.cardToken == 'string' && data.payload.cardToken.trim().length > 0 ? data.payload.cardToken.trim() : false;

      if (email && cardToken) {
         // Get the token from the headers
         var token = typeof data.headers.token == 'string' ? data.headers.token : false;

         // Verify that the given token is valid for user who made the check
         handlers._tokens.verifyToken(token, email, tokenIsValid => {
            if (tokenIsValid) {
               var userFile = email ? email.replace(/[@.]/g, '-') : false;

               // Get cart and prepare for API calls
               handlers._expandCart(userFile, (err, userData) => {
                  if (!err && userData) {
                     delete userData.tosAgreement;

                     var total = 0;

                     userData.cartItems.forEach(item => {
                        total += item.price;
                     });

                     var orderObject = {
                        email: userData.email,
                        total: total,
                        cardToken: cardToken,
                        cart: userData.cartItems
                     };

                     // Charge card
                     helpers.sendStripeCharge(orderObject, (err, res) => {
                        if (!err && res) {
                           userData.stripeChargeId = res.id;

                           // Send receipt
                           helpers.sendToMailGun(orderObject, err => {
                              if (!err) {
                                 // Clean up data
                                 handlers._deleteCart(userData, (err, userData) => {
                                    if (!err && data) {
                                       callback(200, userData);
                                    } else {
                                       callback(500, {
                                          Error: 'Could not clean up cart'
                                       });
                                    }
                                 });
                              } else {
                                 callback(500, {
                                    Error: 'Send receipt failed'
                                 });
                              }
                           });
                        } else {
                           callback(500, { Error: 'Charge failed' });
                        }
                     });
                  } else {
                     callback(err, userData);
                  }
               });
            } else {
               callback(403, {
                  Error: 'Token is not valid or token is missing'
               });
            }
         });
      } else {
         callback(400, { Error: 'Missing required fields' });
      }
   } else {
      callback(405);
   }
};

// Replaces the item id's with the actual item to make a more detailed cart item
handlers._expandCart = (userFile, callback) => {
   // Get user information
   _data.read('users', userFile, (err, userData) => {
      if (!err && userData) {
         var cartItems = userData.cartItems;
         var itemsToRead = cartItems.length;

         if (itemsToRead > 0) {
            var itemsRead = 0;
            var readErrors = false;
            var cartItemArr = [];

            // Loop through the items
            cartItems.forEach(itemId => {
               // Read the items
               _data.read('items', itemId, (err, itemData) => {
                  if (err) {
                     readErrors = true;
                  }

                  delete itemData.userEmail;
                  cartItemArr.push(itemData);
                  itemsRead++;

                  if (itemsRead == itemsToRead) {
                     if (!readErrors) {
                        userData.cartItems = cartItemArr;
                        callback(false, userData);
                     } else {
                        callback(true, { Error: 'Error in deleting item' });
                     }
                  }
               });
            });
         } else {
            callback(true, { Error: 'Empty cart' });
         }
      } else {
         callback(true, { Error: 'Could not open user data' });
      }
   });
};

handlers._deleteCart = (userData, callback) => {
   const fileName = `${userData.userFile}-${Date.now()}`;

   // Save the transaction
   _data.create('orders', fileName, userData, err => {
      if (!err) {
         // Clean up items
         var cartItems = userData.cartItems;
         var itemsToDelete = cartItems.length;

         if (itemsToDelete > 0) {
            var itemsDeleted = 0;
            var deleteErrors = false;

            // Loop through the items
            cartItems.forEach(item => {
               // Delete the items
               _data.delete('items', item.id, err => {
                  if (err) {
                     deleteErrors = true;
                  }

                  itemsDeleted++;

                  if (itemsDeleted == itemsToDelete) {
                     if (!deleteErrors) {
                        userData.cartItems = [];
                        delete userData.stripeChargeId;

                        _data.update('users', userData.userFile, userData, err => {
                           if (!err) {
                              callback(false, userData);
                           } else {
                              callback(true, err);
                           }
                        });
                     } else {
                        callback(true, { Error: 'Error in deleting item' });
                     }
                  }
               });
            });
         } else {
            callback(true, { Error: 'Empty cart' });
         }
      } else {
         callback(true, err);
      }
   });
};

// Ping handler
handlers.ping = (data, callback) => {
   callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
   callback(404);
};

// Export the module
module.exports = handlers;
