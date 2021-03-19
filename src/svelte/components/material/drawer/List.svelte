<script>
   import { onMount } from 'svelte';

   // Variables
   let nav = undefined;

   // Events
   onMount(() => {
      const span = nav.querySelector('span');
      span.classList.add('mdc-list-item--activated');
   });
</script>

<nav bind:this={nav} class="mdc-list"><slot /></nav>
