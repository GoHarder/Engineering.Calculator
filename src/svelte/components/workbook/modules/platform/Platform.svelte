<script>
   import { onMount, onDestroy } from 'svelte';
   import * as tables from './tables';

   // Components
   import { InputArea, InputLength, InputWeight } from '../../../material/input';
   import { round } from '../../../material/input/round';

   // Properties
   export let workbook = {};
   export let save = false;

   // Variables
   let { capacity } = workbook.modules.globals;

   let platform = {
      width: 0,
      depth: 0,
   };

   let cab = {
      height: 96,
      width: 0,
      depth: 0,
   };

   // Reactive Variables
   $: platformArea = platform.width * platform.depth;
   $: cabArea = cab.width * cab.depth;
   $: maxPlatformArea = tables.maxPlatform.reverse().find((row) => row.capacity <= capacity).area;
   $: maxPlatformAreaPlus = round(maxPlatformArea * 1.05, 1);

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
      // console.log('Platform', workbook);
   });

   onDestroy(() => {
      onSave();
   });
</script>

<fieldset>
   <legend>Globals</legend>
   <InputWeight value={capacity} disabled label="Capacity" />
</fieldset>

<fieldset>
   <legend>Dimensions</legend>
   <InputLength bind:value={platform.width} label="Width" />
   <InputLength bind:value={platform.depth} label="Depth" />
   <InputArea value={platformArea} disabled label="Area" />
</fieldset>

<fieldset>
   <legend>Cab Information</legend>
   <InputLength bind:value={cab.height} label="Height" />
   <InputLength bind:value={cab.width} label="Interior Width" />
   <InputLength bind:value={cab.depth} label="Interior Depth" />
   <InputArea value={cabArea} disabled label="Area" />
</fieldset>

<fieldset>
   <legend>Code Requirements</legend>
   <InputArea value={maxPlatformArea} disabled label="Max Inside Platform Area" />
   <InputArea value={maxPlatformAreaPlus} disabled label="Max Inside Platform Area + 5%" />
</fieldset>
