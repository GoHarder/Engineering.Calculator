import { round } from '../js/math';

const weight230 = (dbg, width, material) => {
   const area = (dbg - 2.75) * width - (8 + (width / 2 - 0.5) * 0.25);
   return round(area * material, 2);
};

const weight235 = (dbg, width, material, stileDepth) => {
   const stile = [
      { depth: 8, tabWidth: 6.75, tabDepth: 3 },
      { depth: 9, tabWidth: 7.5, tabDepth: 3 },
      { depth: 10, tabWidth: 8.5, tabDepth: 3.5 },
      { depth: 12, tabWidth: 10.25, tabDepth: 3.25 },
   ].find((nth) => nth.depth === stileDepth);

   const area = stile.tabWidth * stile.tabDepth * 2 + (dbg - (2.5 + stile.tabDepth * 2)) * width - (2.2146 + (width / 2 - 0.5) * 0.25);
   return round(area * material, 2);
};

const weight245 = (dbg, width, material) => {
   const area = (dbg + 0.875) * width - (11.5 + (width / 2 - 0.5) * 0.25);
   return round(area * material, 2);
};

const use230Check = (length, weight, zu) => round((weight * length) / (4 * 13750) / 2, 2) <= zu;

const use265Check = (length, weight) => round(-0.185475 * (length + 2.75) ** 3 + 34.8009 * (length + 2.75) ** 2 - 2313.29 * (length + 2.75) + 61576.1, 2) >= weight;

export const cwtModels = [
   { name: '230', modelCheck: use230Check, fillerWeight: weight230, dbg: 38.75 },
   { name: '230-SPL', modelCheck: use230Check, fillerWeight: weight230 },
   { name: '231', modelCheck: use230Check, fillerWeight: weight230, dbg: 38.75 },
   { name: '231-SPL', modelCheck: use230Check, fillerWeight: weight230 },
   { name: '235', modelCheck: use230Check, fillerWeight: weight235 },
   { name: '236', modelCheck: use230Check, fillerWeight: weight235 },
   { name: '245', modelCheck: use230Check, fillerWeight: weight245 },
   { name: '246', modelCheck: use230Check, fillerWeight: weight245 },
   { name: '250', modelCheck: use230Check, fillerWeight: weight230, dbg: 57.25 },
   { name: '250-SPL', modelCheck: use230Check, fillerWeight: weight230 },
   { name: '251', modelCheck: use230Check, fillerWeight: weight230, dbg: 57.25 },
   { name: '251-SPL', modelCheck: use230Check, fillerWeight: weight230 },
   { name: '265', modelCheck: use265Check, fillerWeight: weight230 },
   { name: '266', modelCheck: use265Check, fillerWeight: weight230 },
];

export const blocks = [
   { name: '230-016', height: 6, depth: 5, weight: 13.1, striker: true },
   { name: '230-022', height: 6, depth: 6, weight: 15.62, striker: false },
   { name: '230-014', height: 5, depth: 5, weight: 10.486, striker: false },
];

export const stile235 = [
   { depth: 8, name: 'MC8X22.8', weight: 1.9 },
   { depth: 9, name: 'MC9X25.4', weight: 2.1167 },
   { depth: 10, name: 'MC10X28.5', weight: 2.375 },
   { depth: 12, name: 'MC12X35', weight: 2.9167 },
];

export const sheaveHangers = [
   {
      name: '341',
      miscWeight: 45.334,
      channel: [
         { stock: true, width: 5, weight: 38.92 },
         { stock: false, width: 6, weight: 25.274 },
      ],
      plateWeight: (length = 36) => round(2.1667 * length, 2),
   },
   {
      name: '342',
      miscWeight: 43.56,
      channel: [
         { stock: false, width: 7, weight: 21.716 },
         { stock: true, width: 8, weight: 27.44 },
      ],
      plateWeight: (length = 36) => round(1.6528 * length, 2),
   },
];

const img230 = [{ name: '230' }, { name: '230-block' }, { name: '230-plate' }, { name: '230-safety' }];
const img231_341 = [{ name: '231-341' }, { name: '231-341-block' }, { name: '231-341-plate' }, { name: '231-341-safety' }];
const img231_342 = [{ name: '231-342' }, { name: '231-342-block' }, { name: '231-342-plate' }, { name: '231-342-safety' }];

const img245 = [{ name: '245' }, { name: '245-block' }, { name: '245-plate' }, { name: '245-safety' }];
const img246_341 = [{ name: '246-341' }, { name: '246-341-block' }, { name: '246-341-plate' }, { name: '246-341-safety' }];
const img246_342 = [{ name: '246-342' }, { name: '246-342-block' }, { name: '246-342-plate' }, { name: '246-342-safety' }];
const img250 = [{ name: '250' }, { name: '250-block' }, { name: '250-plate' }, { name: '250-safety' }];
const img251_341 = [{ name: '251-341' }, { name: '251-341-block' }, { name: '251-341-plate' }, { name: '251-341-safety' }];
const img251_342 = [{ name: '251-342' }, { name: '251-342-block' }, { name: '251-342-plate' }, { name: '251-342-safety' }];

export const dimensionImages = [
   ...img230,
   ...img231_341,
   ...img231_342,
   { name: '235' },
   { name: '235-safety' },
   { name: '236' },
   { name: '236-safety' },
   ...img245,
   ...img246_341,
   ...img246_342,
   ...img250,
   ...img251_341,
   ...img251_342,
   { name: '265' },
   { name: '266' },
];
