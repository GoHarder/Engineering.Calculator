<script>
   import { onMount, onDestroy } from 'svelte';

   // Components
   import { InputArea, InputLength } from '../../../material/input';

   // Properties
   export let workbook = {};
   export let save = false;

   // Variables

   let platform = {
      width: 0,
      depth: 0,
   };

   // Reactive Variables
   $: platformArea = platform.width * platform.depth;

   // Methods
   const onSave = () => {
      console.log('Saving...');
   };

   // Reactive Rules
   $: if (save) {
      onSave();
   }

   // Lifecycle
   onMount(() => {
      console.log('Platform', workbook);
   });

   onDestroy(() => {
      onSave();
   });
</script>

<fieldset>
   <legend>Globals</legend>
</fieldset>

<fieldset>
   <legend>Dimensions</legend>
   <InputLength bind:value={platform.width} label="Width" />
   <InputLength bind:value={platform.depth} label="Depth" />
   <InputArea bind:value={platformArea} lavel="Area" />
</fieldset>

<fieldset>
   <legend>Cab Information</legend>
</fieldset>
