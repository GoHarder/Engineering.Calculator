/**
 * Registry of all calculation modules
 */

import Counterweight from './counterweight/Counterweight.svelte';
import Platform from './platform/Platform.svelte';
import Sling from './sling/Sling.svelte';

const modules = [
   { i: 0, title: 'Platform', description: '', checked: true, module: 'platform', comp: Platform },
   { i: 1, title: 'Sling', description: '', checked: true, module: 'sling', comp: Sling },
   { i: 2, title: 'Counterweight', description: '', checked: true, module: 'counterweight', comp: Counterweight },
];

export default modules;
