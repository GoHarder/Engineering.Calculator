import { writable } from 'svelte/store';

const testItems = writable(['a', 'b', 'c']);

export default testItems;
