/**
 * @module functions
 * Common functions that are shared between modules
 */

/**
 * Gets an individual object from an object array
 * @param {string} name The name property to search for
 * @param {array} data The object array to search in
 */
export const getFromArray = (name, data) => data?.find((row) => row.name === name);
