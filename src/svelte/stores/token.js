/**
 * @store token
 * This store holds the security token between the browser and the server
 */

// Svelte Imports
import { writable } from 'svelte/store';

// Creates the custom store and sets up renewal loop
const { subscribe, set: setStore } = writable(localStorage.getItem('token'), (set) => {
   const interval = setInterval(async () => {
      // See if there is a token
      const token = localStorage.getItem('token');

      if (token) {
         // Renew the token
         const res = await fetch('/api/tokens', {
            method: 'PUT',
            headers: { Authorization: token },
         });

         // If a new token is returned set it else delete all tokens
         if (res.ok) {
            const body = await res.json();
            set(body.token);
         } else {
            localStorage.removeItem('token');
         }
      }
   }, 60 * 1000);

   return () => {
      clearInterval(interval);
   };
});

/**
 * Set the security token in the store
 * @param {string} token The security token to store
 */
const set = (token) => {
   localStorage.setItem('token', token);
   setStore(token);
};

/** Destroys the security token */
const destroy = () => {
   localStorage.removeItem('token');
   setStore(null);
};

// export the store object
export default {
   subscribe,
   set,
   destroy,
};
