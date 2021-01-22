import Svelte from '../svelte/App.svelte';

new Svelte({ target: document.body });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
