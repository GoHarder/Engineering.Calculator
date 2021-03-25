/**
 * @store token
 * This store holds the project data
 */

// Svelte Imports
import { writable } from 'svelte/store';

// Creates the custom store and sets up renewal loop
const { subscribe, set: setStore, update: updateStore } = writable({});

/**
 * Sets the state of the project
 * @param {any} proj The project object
 */
const set = (proj) => {
   setStore(proj);
};

/**
 * Saves the updated data in the project
 * @param {string} location Where in the project its saving
 * @param {any} update The updated section data
 */
const save = (location, update) => {
   updateStore((store) => {
      let output = { ...store };
      let copy;

      switch (location) {
         case 'project':
            output = { ...store, ...update };
            break;
         case 'globals':
            copy = { ...store };

            copy.modules.globals = { ...update };

            output = copy;
            break;
         case 'modules':
            copy = { ...store };

            copy.modules = { ...update };

            output = copy;
            break;
      }

      return output;
   });
};

// export the store object
export default {
   subscribe,
   set,
   save,
};
