/* We've started Quokka for you automatically on this file.
 *
 * To open a new Quokka file:
 *   - Press `Ctrl K, J` to create a new JavaScript File
 *   - Press `Ctrl K, T` to create a new TypeScript File
 *   - Press `Ctrl K, L` to open an interactive sample from:
 *     https://github.com/wallabyjs/interactive-examples
 *
 * To start/restart Quokka on an existing file:
 *   - Press `Ctrl K, Q`
 */

const round = (value, decimals = 0) => Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
const ceil = (value, decimals = 0) => Number(Math.ceil(value + 'e' + decimals) + 'e-' + decimals);

const safetyFactorTable = [
   { speed: 50, passenger: 7.6, freight: 6.65 },
   { speed: 75, passenger: 7.75, freight: 6.85 },
   { speed: 100, passenger: 7.97, freight: 7 },
   { speed: 125, passenger: 8.1, freight: 7.15 },
   { speed: 150, passenger: 8.25, freight: 7.3 },
   { speed: 175, passenger: 8.4, freight: 7.45 },
   { speed: 200, passenger: 8.6, freight: 7.65 },
   { speed: 225, passenger: 8.75, freight: 7.75 },
   { speed: 250, passenger: 8.9, freight: 7.9 },
   { speed: 300, passenger: 9.2, freight: 8.2 },
   { speed: 350, passenger: 9.5, freight: 8.45 },
   { speed: 400, passenger: 9.75, freight: 8.7 },
   { speed: 450, passenger: 10, freight: 8.9 },
   { speed: 500, passenger: 10.25, freight: 9.15 },
   { speed: 550, passenger: 10.45, freight: 9.3 },
   { speed: 600, passenger: 10.7, freight: 9.5 },
   { speed: 650, passenger: 10.85, freight: 9.65 },
   { speed: 700, passenger: 11, freight: 9.8 },
   { speed: 750, passenger: 11.15, freight: 9.9 },
   { speed: 800, passenger: 11.25, freight: 10 },
   { speed: 850, passenger: 11.35, freight: 10.1 },
   { speed: 900, passenger: 11.45, freight: 10.15 },
   { speed: 950, passenger: 11.5, freight: 10.2 },
   { speed: 1000, passenger: 11.55, freight: 10.3 },
   { speed: 1050, passenger: 11.65, freight: 10.35 },
   { speed: 1100, passenger: 11.7, freight: 10.4 },
   { speed: 1150, passenger: 11.75, freight: 10.45 },
   { speed: 1250, passenger: 11.8, freight: 10.5 },
   { speed: 1350, passenger: 11.85, freight: 10.55 },
   { speed: 2000, passenger: 11.9, freight: 10.55 },
];

export const ropeSizes = [
   { name: '1/4"', value: 0.25, weight: 0.0092 },
   { name: '5/16"', value: 0.3125, weight: 0.15},
   { name: '3/8"', value: 0.375, weight: 0.0217 },
   { name: '7/16"', value: 0.4375, weight: 0.0292 },
   { name: '1/2"', value: 0.5, weight: 0.0383 },
   { name: '9/16"', value: 0.5625, weight: 0.0483 },
   { name: '5/8"', value: 0.625, weight: 0.0608 },
   { name: '11/16"', value: 0.6875, weight: 0.0725 },
   { name: '3/4"', value: 0.75, weight: 0.085 },
   { name: '13/16"', value: 0.8125, weight: 0.08 },
   { name: '7/8"', value: 0.875, weight: 0.0925},
   { name: '15/16"', value: 0.9375, weight: 0.1058},
   { name: '1"', value: 1, weight: 0.1208},
   { name: '10mm', value: 0.393701, weight: 0.0208 },
   { name: '11mm', value: 0.433071, weight: 0.0258 },
   { name: '12mm', value: 0.472441, weight: 0.0308 },
   { name: '13mm', value: 0.511811, weight: 0.0358 },
   { name: '14mm', value: 0.551181, weight: 0.0392 },
   { name: '15mm', value: 0.590551, weight: 0.045 },
   { name: '16mm', value: 0.629921, weight: 0.0525 },
   { name: '18mm', value: 0.708661, weight: 0.065 },
];


const carWeight = 8760;
const capacity = 6000;
const counterbalance = 40;

const loadingType = 'Passenger';
const roping = 1 / 1;
const carSpeed = 350;

const counterweight = carWeight + (capacity * (counterbalance / 100))
const machineSpeed = roping * carSpeed;
const safetyFactor = safetyFactorTable.find((row) => machineSpeed <= row.speed)[loadingType.toLowerCase()];

const ropeWeight = 0.26;
const compSheaveWeight = 0;
const travelingCableWeight = 0;
const ropeQty = 21;
const compensationWeight = 0;

const loadPerRope = round( (carWeight + capacity + ropeWeight + compensationWeight + compSheaveWeight + travelingCableWeight) / ropeQty / roping)

const requiredStrength = Math.max(
   ceil((safetyFactor * ((carWeight + capacity + ropeWeight) / roping + compSheaveWeight / 2 + travelingCableWeight)) / ropeQty),
   ceil(loadPerRope * safetyFactor)
);

safetyFactor
requiredStrength
loadPerRope
