export const sheaveLocation = [{ text: 'Overslung' }, { text: 'Underslung' }];

export const ropeSize = [
   { text: '3/8"', value: 0.375, weight: 0.0167 },
   { text: '7/16"', value: 0.4375, weight: 0.0233 },
   { text: '1/2"', value: 0.5, weight: 0.03 },
   { text: '9/16"', value: 0.5625, weight: 0.0383 },
   { text: '5/8"', value: 0.625, weight: 0.0475 },
   { text: '11/16"', value: 0.6875, weight: 0.0575 },
   { text: '3/4"', value: 0.75, weight: 0.0683 },
   { text: '10mm', value: 0.393701, weight: 0.0208 },
   { text: '11mm', value: 0.433071, weight: 0.0258 },
   { text: '12mm', value: 0.472441, weight: 0.0308 },
   { text: '13mm', value: 0.511811, weight: 0.0358 },
   { text: '14mm', value: 0.551181, weight: 0.0392 },
   { text: '15mm', value: 0.590551, weight: 0.045 },
   { text: '16mm', value: 0.629921, weight: 0.0525 },
   { text: '18mm', value: 0.708661, weight: 0.065 },
];

export const plywoodThickness = [
   { text: '1/4"', value: 0.25 },
   { text: '3/8"', value: 0.375 },
   { text: '1/2"', value: 0.5 },
   { text: '5/8"', value: 0.625 },
   { text: '3/4"', value: 0.75 },
];

export const finFloorArea = [{ text: 'Inside Cab' }, { text: 'Full Platform' }];

export const compensation = [{ text: 'None' }, { text: 'Chain' }, { text: 'Rope' }];

export const slingModel = [
   { text: '7T', stile: 'C7X9.8', top: 'C8X11.5', bottom: 'C8X11.5', comp: ['None', 'Chain'] },
   { text: '7T-SPL', stile: 'C7X9.8', top: undefined, bottom: undefined, comp: ['None', 'Chain'] },
   { text: '6TS', stile: 'MC6X12', top: 'C10X15.3', bottom: 'C10X15.3', comp: ['None', 'Chain'] },
   { text: '6TS-SPL', stile: 'MC6X12', top: undefined, bottom: undefined, comp: ['None', 'Chain'] },
   { text: '6TS-TD-LD', stile: 'MC6X15.3', top: 'C10X25', bottom: 'C10X25', comp: ['Rope'] },
   { text: '8TS', stile: 'MC8X22.8', top: 'C10X15.3', bottom: 'C10X15.3', comp: ['None', 'Chain'] },
   { text: '8TS-SPL', stile: 'MC8X22.8', top: undefined, bottom: undefined, comp: ['None', 'Chain'] },
   { text: '8TS-TD-LD-OH', stile: 'MC8X21.4', top: 'C10X25', bottom: 'C10X25', comp: ['Rope'] },
   { text: '10TS', stile: 'MC10X28.5', top: undefined, bottom: undefined, comp: ['None', 'Chain'] },
   { text: '12TS', stile: 'MC12X50', top: undefined, bottom: undefined, comp: ['None', 'Chain'] },
   { text: '15TS', stile: 'C15X33.9', top: undefined, bottom: undefined, comp: ['None', 'Chain'] },
   { text: '18TS', stile: 'MC18X42.7', top: undefined, bottom: undefined, comp: ['None', 'Chain'] },
];

export const railSize = [{ text: '6.25#' }, { text: '8#' }, { text: '11#' }, { text: '12#' }, { text: '15#' }, { text: '18.5#' }, { text: '22.5#' }, { text: '30#' }];
