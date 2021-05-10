/**
 * @module math
 * A module for various math operations.
 */

/**
 * Rounds a number to the nearest decimal
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to round to
 */
export const round = (value, decimals = 0) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

/**
 * Rounds a number down to the nearest decimal
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to round to
 */
export const floor = (value, decimals = 0) => Number(Math.floor(value + 'e' + decimals) + 'e-' + decimals);

/**
 * Rounds a number up to the nearest decimal
 * @param {number} value The value to round
 * @param {number} decimals The number of decimals to round to
 */
export const ceil = (value, decimals = 0) => Number(Math.ceil(value + 'e' + decimals) + 'e-' + decimals);

/**
 * Rounds a number to the nearest increment
 * @param {number} value The value to round
 * @param {number} increment The number to round to
 */
export const roundInc = (value, increment = 0.0625) => round(Math.round(value / increment) * increment, 4);

/**
 * Returns the sine of a number.
 * @param {number} deg The angle in degrees
 */
export const sin = (deg) => Math.sin((deg * Math.PI) / 180);
