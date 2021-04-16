/**
 * Registry of all calculation modules
 */

import Counterweight from './counterweight/Counterweight.svelte';
import Platform from './platform/Platform.svelte';
import Sling from './sling/Sling.svelte';
import WeightCalcs from './weight-calcs/WeightCalcs.svelte';

const modules = [
   // { i: 0, title: 'Weight Calculations', description: 'Calculates the weight of the elevator', checked: true, module: 'weightCalcs', comp: WeightCalcs },
   { i: 0, title: 'Platform', description: '', checked: true, module: 'platform', comp: Platform },
   { i: 1, title: 'Sling', description: '', checked: true, module: 'sling', comp: Sling },
   // { i: 3, title: 'Counterweight', description: '', checked: true, module: 'counterweight', comp: Counterweight },
];

export default modules;
