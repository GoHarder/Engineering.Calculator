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
