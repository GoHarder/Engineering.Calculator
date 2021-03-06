import { round } from '../js/math';

const maxPlatformTable = [
   { capacity: 30000, area: 33264 },
   { capacity: 25000, area: 28296 },
   { capacity: 20000, area: 23212.8 },
   { capacity: 18000, area: 21153.6 },
   { capacity: 15000, area: 18014.4 },
   { capacity: 12000, area: 14832 },
   { capacity: 10000, area: 12672 },
   { capacity: 9000, area: 11592 },
   { capacity: 8000, area: 10497.6 },
   { capacity: 7000, area: 9403.2 },
   { capacity: 6000, area: 8308.8 },
   { capacity: 5000, area: 7200 },
   { capacity: 4500, area: 6652.8 },
   { capacity: 4000, area: 6076.8 },
   { capacity: 3500, area: 5472 },
   { capacity: 3000, area: 4852.8 },
   { capacity: 2500, area: 4190.4 },
   { capacity: 2000, area: 3484.8 },
   { capacity: 1800, area: 3182.4 },
   { capacity: 1500, area: 2721.6 },
   { capacity: 1200, area: 2246.4 },
   { capacity: 1000, area: 1908 },
   { capacity: 700, area: 1382.4 },
   { capacity: 600, area: 1195.2 },
   { capacity: 500, area: 1008 },
   { capacity: 0, area: 0 },
];

export const maxPlatform = (capacity) => maxPlatformTable.find((row) => row.capacity <= capacity).area;

export const capacityRating = [
   { class: 'None', rating: 0 },
   { class: 'A', rating: 0.347222 },
   { class: 'B-Auto', rating: 0.208333 },
   { class: 'B-Truck', rating: 0.208333 },
   { class: 'C1', rating: 0.347222 },
   { class: 'C2', rating: 0.347222 },
   { class: 'C3', rating: 0.347222 },
];

export const frontChannelFormulas = [
   {
      category: ['None', 'A'],
      sectionModulus: (load, length, ratio) => round((load * length) / (14000 * 8 * ratio), 2),
      momentOfInertia: (load, length, elasticModulus) => round((960 * load * length ** 2) / (192 * elasticModulus), 1),
   },
   {
      category: ['B-Auto', 'B-Truck'],
      sectionModulus: (load, length, ratio) => round((load * (length - 60)) / (14000 * 2 * ratio), 2),
      momentOfInertia: (load, length, elasticModulus) =>
         round((960 * load * ((length - 60) / 2) * (3 * length ** 2 - 4 * ((length - 60) / 2) ** 2)) / (24 * elasticModulus * length), 1),
   },
   {
      category: ['C1', 'C2', 'C3'],
      sectionModulus: (load, length, ratio) => round((load * (length - 30)) / (14000 * 2 * ratio), 2),
      momentOfInertia: (load, length, elasticModulus) =>
         round((960 * load * ((length - 30) / 2) * (3 * length ** 2 - 4 * ((length - 30) / 2) ** 2)) / (24 * elasticModulus * length), 1),
   },
];

export const steelPlate = [
   { type: 'Smooth', thickness: 0.1875 },
   { type: 'Smooth', thickness: 0.25 },
   { type: 'Smooth', thickness: 0.3125 },
   { type: 'Smooth', thickness: 0.375 },
   { type: 'Smooth', thickness: 0.5 },
   { type: 'Smooth', thickness: 0.625 },
   { type: 'Smooth', thickness: 0.75 },
   { type: 'Checkered', thickness: 0.1875 },
   { type: 'Checkered', thickness: 0.25 },
   { type: 'Checkered', thickness: 0.3125 },
   { type: 'Checkered', thickness: 0.375 },
   { type: 'Checkered', thickness: 0.5 },
   { type: 'Checkered', thickness: 0.625 },
   { type: 'Checkered', thickness: 0.75 },
];

export const platformMaterial = [{ name: 'Wood' }, { name: 'Steel' }];

export const doorLocation = [{ name: 'Back' }, { name: 'Left' }, { name: 'Right' }];

export const doorQty = [{ name: 1 }, { name: 2 }];

export const doorType = [
   { name: 'Single Speed', thickness: 7 },
   { name: 'Two Speed', thickness: 9 },
   { name: 'Three Speed', thickness: 9 },
   { name: 'Gate', thickness: 3 },
];

export const steelType = [
   { name: 'ASTM A36', elasticModulus: 29000000, tensileStrength: 58 }, // 58ksi = 58000psi
   { name: 'Stainless Steel', elasticModulus: 28000000, tensileStrength: 73.2 }, // 72.2ksi = 37200psi
];
