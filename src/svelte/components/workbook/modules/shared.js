/**
 * @module shared
 * This module handles the order of passing variables between modules
 */

/**
 * Returns the passed platform thickness
 * @param {object} modules The workbook modules
 * @param {('module'|'value')} data
 */
export const platformThickness = (modules, data) => {
   const order = [{ module: 'platform', value: modules?.platform?.properties?.thickness }];
   return order.find((branch) => branch.value !== undefined)[data];
};

/**
 * Returns the passed platform weight
 * @param {object} modules The workbook modules
 * @param {('module'|'value')} data
 */
export const platformWeight = (modules, data) => {
   const order = [{ module: 'platform', value: modules?.platform?.properties?.weight }];
   return order.find((branch) => branch.value !== undefined)[data];
};
