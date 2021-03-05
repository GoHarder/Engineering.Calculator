/**
 * Registry of all calculation modules
 */

import WeightCalcs from './weight-calcs/WeightCalcs.svelte';
import Counterweight from './counterweight/Counterweight.svelte';

const modules = [
   { i: 0, title: 'Weight Calculations', description: 'Calculates the weight of the elevator', checked: true, module: 'weightCalcs', comp: WeightCalcs },
   { i: 1, title: 'Counterweight', description: '', checked: false, module: 'counterweight', comp: Counterweight },
];

export default modules;
