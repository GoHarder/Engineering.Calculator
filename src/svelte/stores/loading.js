/**
 * @store loading
 * This store holds if the system is loading or not
 */

// Svelte Imports
import { writable } from 'svelte/store';

// Creates the custom store and sets up renewal loop
const { subscribe, set: setStore } = writable(false);

/**
 * Sets the state of the project
 * @param {any} proj The project object
 */
const set = (state) => {
   setStore(state);
};

// export the store object
export default {
   subscribe,
   set,
};
