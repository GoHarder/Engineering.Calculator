/*
 * Frontend Logic for application
 */

// Container for frontend application
var app = {};

// Stripe variables
var stripe;
var elements;
var card;

// Config
app.config = {
   sessionToken: false,
   maxItems: 5,
   stripeKey: 'API_PUBLIC_KEY'
};

// AJAX Client (for the API)
app.client = {};

// Interface for making API calls
app.client.request = function(headers, path, method, queryStringObject, payload, callback) {
   // Set defaults
   headers = typeof headers == 'object' && headers !== null ? headers : {};
   path = typeof path == 'string' ? path : '/';
   method = typeof method == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
   queryStringObject = typeof queryStringObject == 'object' && queryStringObject !== null ? queryStringObject : {};
   payload = typeof payload == 'object' && payload !== null ? payload : {};
   callback = typeof callback == 'function' ? callback : false;

   // For each query string parameter sent, add it to the path
   var requestUrl = path + '?';
   var counter = 0;
   for (var queryKey in queryStringObject) {
      if (queryStringObject.hasOwnProperty(queryKey)) {
         counter++;

         // If at least one query string parameter has already been added, prepend new one with a new &
         if (counter > 1) {
            requestUrl += '&';
         }

         // Add the key value
         requestUrl += queryKey + '=' + queryStringObject[queryKey];
      }
   }

   // Form the http request as a JSON type
   var xhr = new XMLHttpRequest();
   xhr.open(method, requestUrl, true);
   xhr.setRequestHeader('Content-type', 'application/json');

   // For each header sent, add it to the request
   for (var headerKey in headers) {
      if (headers.hasOwnProperty(headerKey)) {
         xhr.setRequestHeader(headers, headers[headerKey]);
      }
   }

   // If there is a current session token set, add it to the headers
   if (app.config.sessionToken) {
      xhr.setRequestHeader('token', app.config.sessionToken.id);
   }

   // When the request comes back handle the response
   xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
         var statusCode = xhr.status;
         var responseReturned = xhr.responseText;

         // Callback if requested
         if (callback) {
            try {
               var parsedResponse = JSON.parse(responseReturned);
               callback(statusCode, parsedResponse);
            } catch (error) {
               callback(statusCode, false);
            }
         }
      }
   };

   // Send the payload as JSON
   var payloadString = JSON.stringify(payload);
   xhr.send(payloadString);
};

// Bind the logout button
app.bindLogoutButton = function() {
   document.getElementById('logoutButton').addEventListener('click', function(event) {
      // Stop it from redirecting anywhere
      event.preventDefault();

      // Log the user out
      app.logUserOut();
   });
};

// Log the user out then redirect them
app.logUserOut = function(redirectUser) {
   // Set redirectUser to default to true
   redirectUser = typeof redirectUser == 'boolean' ? redirectUser : true;

   // Get the current token id
   var tokenId = typeof app.config.sessionToken.id == 'string' ? app.config.sessionToken.id : false;

   // Send the current token to the tokens endpoint to delete it
   var queryStringObject = {
      id: tokenId
   };

   app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, function(statusCode, responsePayload) {
      // Set the app.config token as false
      app.setSessionToken(false);

      // Send the user to the logged out page
      if (redirectUser) {
         window.location = '';
      }
   });
};

// Bind the forms
app.bindForms = function() {
   // If there is a form on the page continue
   if (document.querySelector('form')) {
      // Process all forms on the page
      var allForms = document.querySelectorAll('form');
      for (var i = 0; i < allForms.length; i++) {
         // Listen to all the forms for a submit
         allForms[i].addEventListener('submit', function(event) {
            // Stop the default method of submitting
            event.preventDefault();
            var formId = this.id;
            var path = this.action;
            var method = this.method.toUpperCase();

            if (formId == 'paymentForm') {
               stripe.createToken(card).then(function(result) {
                  if (result.error) {
                     // Inform the user if there was an error.
                     var errorElement = document.getElementById('card-errors');
                     errorElement.textContent = result.error.message;
                  } else {
                     // Send the token to your server.
                     app.stripeTokenHandler(formId, result.token);
                     app.scrapeForm(formId, path, method);
                  }
               });
            } else {
               // Hide the error message (if it's currently shown due to a previous error)
               document.querySelector('#' + formId + ' .formError').style.display = 'none';

               // Hide the success message (if it's currently shown due to a previous error)
               if (document.querySelector('#' + formId + ' .formSuccess')) {
                  document.querySelector('#' + formId + ' .formSuccess').style.display = 'none';
               }

               app.scrapeForm(formId, path, method);
            }
         });
      }
   }
};

app.scrapeForm = function(formId, path, method) {
   // Turn the inputs into a payload
   var payload = {};
   var elements = document.getElementById(formId).elements;

   for (var i = 0; i < elements.length; i++) {
      // Leave out the submit in the form elements
      if (elements[i].type !== 'submit') {
         // Determine class of element and set value accordingly
         var classOfElement = typeof elements[i].classList.value == 'string' && elements[i].classList.value.length > 0 ? elements[i].classList.value : '';

         // @TODO
         //----------
         // Note: there is some validation for check boxes that have a multi select class you may have to tweak valueOfElement later
         //----------

         var valueOfElement = elements[i].type == 'checkbox' && classOfElement.indexOf('multiSelect') == -1 ? elements[i].checked : elements[i].value;

         var elementIsChecked = elements[i].checked;

         // Override the method of the form if the input's name is _method
         // Submit buttons and only do a get or a post
         var nameOfElement = elements[i].name;
         if (nameOfElement == '_method') {
            method = valueOfElement;
         } else {
            // Create an payload field named 'id' if the elements name is actually itemId
            if (nameOfElement == 'itemId') {
               nameOfElement = 'id';
            }

            // If the element has certain class then sort
            if (classOfElement.indexOf('address') > -1) {
               if (payload.hasOwnProperty('address') == false) {
                  payload.address = {};
               }
               payload.address[nameOfElement] = valueOfElement;
            } else if (classOfElement.indexOf('cardData') > -1) {
               if (payload.hasOwnProperty('cardData') == false) {
                  payload.cardData = {};
               }
               payload.cardData[nameOfElement] = valueOfElement;
            } else if (classOfElement.indexOf('multiSelect') > -1) {
               payload[nameOfElement] = typeof payload[nameOfElement] == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];

               if (elementIsChecked) {
                  payload[nameOfElement].push(valueOfElement);
               }
            } else {
               payload[nameOfElement] = valueOfElement;
            }
         }
      }
   }

   // If the method is DELETE, the payload should be a queryStringObject instead
   var queryStringObject = method == 'DELETE' ? payload : {};

   // Call the API
   app.client.request(undefined, path, method, queryStringObject, payload, function(statusCode, responsePayload) {
      // Display an error on the form if needed
      if (statusCode !== 200) {
         if (statusCode == 403) {
            // Log the user out
            app.logUserOut();
         } else {
            // Try to get the error from the api, or set a default error message
            var error = typeof responsePayload.Error == 'string' ? responsePayload.Error : 'An error has occurred, please try again';

            // Set the formError field with the error text
            document.querySelector('#' + formId + ' .formError').innerHTML = error;

            // Show the form error field on the form
            document.querySelector('#' + formId + ' .formError').style.display = 'block';
         }
      } else {
         // If successful, send to form response processor
         app.formResponseProcessor(formId, payload, responsePayload);
      }
   });
};

app.formResponseProcessor = (formId, requestPayload, responsePayload) => {
   // If account creation was successful, try to immediately log the user in
   if (formId == 'accountCreate') {
      // Take the email and password and use it to log the user in
      var newPayload = {
         email: requestPayload.email,
         password: requestPayload.password
      };

      app.client.request(undefined, 'api/tokens', 'POST', undefined, newPayload, function(newStatusCode, newResponsePayload) {
         // Display an error on the form if needed
         if (newStatusCode !== 200) {
            // Set the formError field with the error text
            document.querySelector('#' + formId + ' .formError').innerHTML = 'Sorry, an error has occurred. Please try again.';

            // Show the form error field on the form
            document.querySelector('#' + formId + ' .formError').style.display = 'block';
         } else {
            // If successful, set the token and redirect the user
            app.setSessionToken(newResponsePayload);
            window.location = '/cart/edit';
         }
      });
   }

   // If login was successful, set the token in local storage and redirect the user
   if (formId == 'sessionCreate') {
      app.setSessionToken(responsePayload);
      window.location = '/cart/edit';
   }

   // If forms saved successfully and they have success messages, show them
   var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2', 'checksEdit1'];
   if (formsWithSuccessMessages.indexOf(formId) > -1) {
      document.querySelector('#' + formId + ' .formSuccess').style.display = 'block';
   }

   // If the user just deleted their account, redirect them to the account-delete page
   if (formId == 'accountEdit3') {
      app.logUserOut(false);
      window.location = '';
   }

   if (formId == 'itemEdit1') {
      window.location = '/cart/edit';
   }

   if (formId == 'itemEdit2') {
      window.location = '/cart/edit';
   }

   if (formId == 'paymentForm') {
      document.querySelector('#' + formId + ' .formSuccess').style.display = 'block';
      setTimeout(function() {
         window.location = '';
      }, 5000);
   }
};

// Get the session token from local storage and set it in the app.config object
app.getSessionToken = function() {
   var tokenString = localStorage.getItem('token');
   if (typeof tokenString == 'string') {
      try {
         var token = JSON.parse(tokenString);
         app.config.sessionToken = token;
         if (typeof token == 'object') {
            app.setLoggedInClass(true);
         } else {
            app.setLoggedInClass(false);
         }
      } catch (error) {
         app.config.sessionToken = false;
         app.setLoggedInClass(false);
      }
   }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = function(add) {
   var target = document.querySelector('body');
   if (add) {
      target.classList.add('loggedIn');
   } else {
      target.classList.remove('loggedIn');
   }
};

// Set the session token in the app.config object as well as local storage
app.setSessionToken = function(token) {
   app.config.sessionToken = token;
   var tokenString = JSON.stringify(token);
   localStorage.setItem('token', tokenString);
   if (typeof token == 'object') {
      app.setLoggedInClass(true);
   } else {
      app.setLoggedInClass(false);
   }
};

// Renew the token
app.renewToken = function(callback) {
   var currentToken = typeof app.config.sessionToken == 'object' ? app.config.sessionToken : false;
   if (currentToken) {
      // Update the token with a new expiration
      var payload = {
         id: currentToken.id,
         extend: true
      };

      app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, function(statusCode, responsePayload) {
         // Display an error on the form if needed
         if (statusCode == 200) {
            // Get the new token details
            var queryStringObject = { id: currentToken.id };
            app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
               // Display an error on the form if needed
               if (statusCode == 200) {
                  app.setSessionToken(responsePayload);
                  callback(false);
               } else {
                  app.setSessionToken(false);
                  callback(true);
               }
            });
         } else {
            app.setSessionToken(false);
            callback(true);
         }
      });
   } else {
      app.setSessionToken(false);
      callback(true);
   }
};

// Loop to renew token often
app.tokenRenewalLoop = function() {
   setInterval(function() {
      app.renewToken(function(err) {
         if (!err) {
            // console.log('Token renewed successfully @ ' + Date.now());
         }
      });
   }, 1000 * 60);
};

// Load data on the page
app.loadDataOnPage = function() {
   // Get the current page from the body class
   var bodyClasses = document.querySelector('body').classList;
   var primaryClass = typeof bodyClasses[0] == 'string' ? bodyClasses[0] : false;

   // Logic for account settings page
   if (primaryClass == 'accountEdit') {
      app.loadAccountEditPage();
   }

   // Logic for cart page
   if (primaryClass == 'cartEdit') {
      app.loadCartEditPage();
   }

   // Logic for item edit page
   if (primaryClass == 'itemEdit') {
      app.loadItemEditPage();
   }

   // Logic for checkout page
   if (primaryClass == 'checkout') {
      app.loadCheckoutPage();
   }

   // Logic for menu page
   if (primaryClass == 'menu') {
      app.loadMenuPage();
   }
};

app.loadAccountEditPage = function() {
   // Get the email from the current token, or log the user out if there is none
   var email = typeof app.config.sessionToken.email == 'string' ? app.config.sessionToken.email : false;
   if (email) {
      // Fetch the user data
      var queryStringObject = {
         email: email
      };

      app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
         if (statusCode == 200) {
            // Put the data into the forms as values where needed
            document.querySelector('#accountEdit1 .firstNameInput').value = responsePayload.firstName;
            document.querySelector('#accountEdit1 .lastNameInput').value = responsePayload.lastName;
            document.querySelector('#accountEdit1 .displayEmailInput').value = responsePayload.email;
            document.querySelector('#accountEdit1 .streetAddressInput').value = responsePayload.address.streetAddress;
            document.querySelector('#accountEdit1 .cityInput').value = responsePayload.address.city;
            document.querySelector('#accountEdit1 .stateInput').value = responsePayload.address.state;
            document.querySelector('#accountEdit1 .zipCodeInput').value = responsePayload.address.zipCode;

            // Put the hidden phone field into both forms
            var hiddenEmailInputs = document.querySelectorAll('input.hiddenEmailInput');
            for (var i = 0; i < hiddenEmailInputs.length; i++) {
               hiddenEmailInputs[i].value = responsePayload.email;
            }
         } else {
            // If the request isn't 200 log them out
            app.logUserOut();
         }
      });
   } else {
      app.logUserOut();
   }
};

app.loadCartEditPage = function() {
   // Get the email from the current token, or log the user out if none is there
   var email = typeof app.config.sessionToken.email == 'string' ? app.config.sessionToken.email : false;
   if (email) {
      // Fetch the user data
      var queryStringObject = {
         email: email
      };

      app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
         if (statusCode == 200) {
            // Determine how many items the user has
            var cartItems = typeof responsePayload.cartItems == 'object' && responsePayload.cartItems instanceof Array && responsePayload.cartItems.length > 0 ? responsePayload.cartItems : [];
            if (cartItems.length > 0) {
               var nth = 1;
               var total = 0;

               // Show each created check as a new row in the table
               cartItems.forEach(function(itemId) {
                  // Get the data for the check
                  var newQueryStringObject = {
                     id: itemId
                  };

                  app.client.request(undefined, 'api/items', 'GET', newQueryStringObject, undefined, function(statusCode, responsePayload) {
                     if (statusCode == 200) {
                        var itemData = responsePayload;

                        // If there are no additional toppings is a plain cheese
                        if (itemData.toppings.length == 0) {
                           itemData.toppings = ['plain cheese'];
                        }

                        var toppingStr = '';

                        itemData.toppings.forEach(function(str) {
                           str = '<p>' + str + '</p>';
                           toppingStr += str;
                        });

                        toppingStr = toppingStr.replace(/^\/+|\/+$/g, '');

                        // Make the check data into a table row
                        var table = document.getElementById('cartTable');
                        var tr = table.insertRow(-1);
                        tr.classList.add('itemRow');
                        var td0 = tr.insertCell(0);
                        var td1 = tr.insertCell(1);
                        var td2 = tr.insertCell(2);
                        var td3 = tr.insertCell(3);
                        var td4 = tr.insertCell(4);
                        td0.innerHTML = nth;
                        td1.innerHTML = itemData.size;
                        td2.innerHTML = toppingStr;
                        td3.innerHTML = '$' + itemData.price;
                        td4.innerHTML = '<a href="/item/edit?id=' + itemData.id + '" class="cta blue">Edit / Delete</a>';

                        // Increment
                        nth++;
                        total += itemData.price;

                        document.getElementById('total').innerHTML = 'Total: $' + total;
                     } else {
                        console.log('Error trying to load item ID: ', itemId);
                     }
                  });
               });

               if (cartItems.length < 5) {
                  // Show the createCheck CTA
                  document.getElementById('createItemCTA').style.display = 'block';
               }
            } else {
               // Show empty cart message
               document.getElementById('emptyCartMessage').style.display = 'table-row';

               // Show the createCheck CTA
               document.getElementById('createItemCTA').style.display = 'block';

               // Show the createCheck CTA
               document.getElementById('checkOutCTA').style.display = 'none';
            }
         } else {
            // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
            app.logUserOut();
         }
      });
   } else {
      app.logUserOut();
   }
};

app.loadItemEditPage = function() {
   // Get the email from the current token, or log the user out if none is there
   var email = typeof app.config.sessionToken.email == 'string' ? app.config.sessionToken.email : false;

   if (email) {
      // Get the check id from the query string, if none is found then its a post
      var id = typeof window.location.href.split('=')[1] == 'string' && window.location.href.split('=')[1].length > 0 ? window.location.href.split('=')[1] : false;
      if (id) {
         // Fetch the item data
         var queryStringObject = {
            id: id
         };

         app.client.request(undefined, 'api/items', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
            if (statusCode == 200) {
               // Put the hidden id field into both forms
               var hiddenIdInputs = document.querySelectorAll('input.hiddenIdInput');
               for (var i = 0; i < hiddenIdInputs.length; i++) {
                  hiddenIdInputs[i].value = responsePayload.id;
               }

               console.log(hiddenIdInputs);
               document.getElementById('addSubmit').innerHTML = 'Update Item';
               document.getElementById('itemEdit2').style.display = 'block';
               document.getElementById('email').value = responsePayload.userEmail;
               document.getElementById('_method').value = 'PUT';

               // Put the data into the top form as values where needed
               document.querySelector('#itemEdit1 .sizeInput').value = responsePayload.size;
               var toppingCheckBoxes = document.querySelectorAll('input.toppingInput');

               for (var i = 0; i < toppingCheckBoxes.length; i++) {
                  if (responsePayload.toppings.indexOf(toppingCheckBoxes[i].value) > -1) {
                     toppingCheckBoxes[i].checked = true;
                  }
               }
            } else {
               window.location = '/cart/edit';
            }
         });
      } else {
         // Fetch the user data
         var queryStringObject = {
            email: email
         };

         app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
            if (statusCode == 200) {
               // Check cart
               var cartItems = typeof responsePayload.cartItems == 'object' && responsePayload.cartItems instanceof Array ? responsePayload.cartItems : [];
               if (cartItems.length <= app.config.maxItems) {
                  document.getElementById('email').value = responsePayload.email;
                  document.getElementById('_method').value = 'POST';
                  document.getElementById('addSubmit').innerHTML = 'Add To Cart';
               } else {
                  window.location = '/cart/edit';
               }
            } else {
               app.logUserOut();
            }
         });
      }
   } else {
      app.logUserOut();
   }
};

app.loadCheckoutPage = function() {
   // Get the email from the current token, or log the user out if none is there
   var email = typeof app.config.sessionToken.email == 'string' ? app.config.sessionToken.email : false;

   // Create a Stripe client.
   stripe = Stripe(app.config.stripeKey);

   if (email) {
      // Fetch the user data
      var queryStringObject = {
         email: email
      };

      app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
         if (statusCode == 200) {
            // Set up variables
            var cartItems = typeof responsePayload.cartItems == 'object' && responsePayload.cartItems instanceof Array && responsePayload.cartItems.length > 0 ? responsePayload.cartItems : [];
            var nth = 1;
            var total = 0;

            //---STRIPE FOLD---

            // Create an instance of Stripe elements
            elements = stripe.elements();
            var style = {
               base: {
                  color: '#32325d',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSmoothing: 'antialiased',
                  fontSize: '16px',
                  '::placeholder': {
                     color: '#aab7c4'
                  }
               },
               invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a'
               }
            };

            // Create an instance of the card Element.
            card = elements.create('card', { style: style });

            // Add an instance of the card Element into the `card-element` <div>.
            card.mount('#card-element');
            // Handle real-time validation errors from the card Element.
            card.addEventListener('change', function(event) {
               var displayError = document.getElementById('card-errors');
               if (event.error) {
                  displayError.textContent = event.error.message;
               } else {
                  displayError.textContent = '';
               }
            });

            //---STRIPE FOLD---

            // Show each created check as a new row in the table
            cartItems.forEach(function(itemId) {
               // Get the data for the check
               var newQueryStringObject = {
                  id: itemId
               };

               app.client.request(undefined, 'api/items', 'GET', newQueryStringObject, undefined, function(statusCode, responsePayload) {
                  if (statusCode == 200) {
                     var itemData = responsePayload;

                     // If there are no additional toppings is a plain cheese
                     if (itemData.toppings.length == 0) {
                        itemData.toppings = ['plain cheese'];
                     }

                     var toppingStr = '';

                     itemData.toppings.forEach(function(str) {
                        str = '<p>' + str + '</p>';
                        toppingStr += str;
                     });

                     toppingStr = toppingStr.replace(/^\/+|\/+$/g, '');

                     // Make the check data into a table row
                     var table = document.getElementById('cartTable');
                     var tr = table.insertRow(-1);
                     tr.classList.add('itemRow');
                     var td0 = tr.insertCell(0);
                     var td1 = tr.insertCell(1);
                     var td2 = tr.insertCell(2);
                     var td3 = tr.insertCell(3);
                     td0.innerHTML = nth;
                     td1.innerHTML = itemData.size;
                     td2.innerHTML = toppingStr;
                     td3.innerHTML = '$' + itemData.price;

                     // Increment
                     nth++;
                     total += itemData.price;

                     document.getElementById('total').innerHTML = 'Total: $' + total;

                     // Put the hidden phone field into both forms
                     var hiddenEmailInputs = document.querySelectorAll('input.hiddenEmailInput');
                     for (var i = 0; i < hiddenEmailInputs.length; i++) {
                        hiddenEmailInputs[i].value = email;
                     }
                  } else {
                     console.log('Error trying to load item ID: ', itemId);
                  }
               });
            });
         } else {
            // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
            app.logUserOut();
         }
      });
   } else {
      app.logUserOut();
   }
};

app.loadMenuPage = function() {
   app.client.request(undefined, 'api/menu', 'GET', undefined, undefined, function(statusCode, responsePayload) {
      if (statusCode == 200) {
         // Set up variables
         var sizes = typeof responsePayload.size == 'object' && responsePayload.size instanceof Object ? responsePayload.size : {};
         var toppings = typeof responsePayload.toppings == 'object' && responsePayload.toppings instanceof Object ? responsePayload.toppings : {};

         // Show the data in their tables
         for (var size in sizes) {
            if (sizes.hasOwnProperty(size)) {
               // Add size data to table
               var table = document.getElementById('sizeTable');
               var tr = table.insertRow(-1);
               tr.classList.add('itemRow');
               var td0 = tr.insertCell(0);
               var td1 = tr.insertCell(1);
               var td2 = tr.insertCell(2);

               td0.innerHTML = size;
               td1.innerHTML = sizes[size].diameter;
               td2.innerHTML = '$' + sizes[size].price;
            }
         }
         for (var topping in toppings) {
            if (toppings.hasOwnProperty(topping)) {
               // Add topping data to table
               var table = document.getElementById('toppingsTable');
               var tr = table.insertRow(-1);
               tr.classList.add('itemRow');
               var td0 = tr.insertCell(0);
               var td1 = tr.insertCell(1);
               td0.innerHTML = topping.replace(/_/, ' ');
               var price = toppings[topping].price.toString();
               price = price.length == 3 ? price + '0' : price;
               td1.innerHTML = '$' + price;
            }
         }
      } else {
         // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
         // app.logUserOut();
         console.log('Error', statusCode);
      }
   });
};

app.stripeTokenHandler = function(formId, token) {
   var form = document.getElementById(formId);
   var hiddenInput = document.createElement('input');
   hiddenInput.setAttribute('type', 'hidden');
   hiddenInput.setAttribute('name', 'cardToken');
   hiddenInput.setAttribute('value', token.id);
   form.appendChild(hiddenInput);
};

app.serviceWorkers = () => {
   if ('serviceWorker' in navigator) {
      navigator.serviceWorker
         .register('serviceWorker.js')
         .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
         })
         .catch(error => {
            console.log(`ServiceWorker registration failed: ${error}`);
         });
   }
};

// Init (bootstrapping)
app.init = function() {
   // Start service workers
   app.serviceWorkers();

   // Bind all form submissions
   app.bindForms();

   // Bind logout logout button
   app.bindLogoutButton();

   // Get the token from local storage
   app.getSessionToken();

   // Renew token
   app.tokenRenewalLoop();

   // Load data on page
   app.loadDataOnPage();
};

// Call the init processes after the window loads
window.onload = function() {
   app.init();
};
