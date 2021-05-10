<script>
   import { createEventDispatcher, onMount } from 'svelte';

   // Properties
   export let workbook = undefined;

   console.log(workbook);

   // Constants
   const dispatch = createEventDispatcher();

   // Events
   const onAfterPrint = () => dispatch('changePage', 'Workbook');

   // Lifecycle
   onMount(() => {
      window.addEventListener('afterprint', onAfterPrint);
      setTimeout(() => {
         window.print();
      }, 1000);
   });
</script>

<p>This is what you see when you hit the print button.</p>
<p>I know you were expecting something fancy here but currently it's not done.</p>
<p>Because you have hit this button your deserve a prize.</p>
<p>Here is a random picture.</p>

<img src="https://source.unsplash.com/random/500x500" alt="Something random" />

<p>Enjoy.</p>

<style lang="scss" global>
   @media print {
      // placeholder
   }
</style>
