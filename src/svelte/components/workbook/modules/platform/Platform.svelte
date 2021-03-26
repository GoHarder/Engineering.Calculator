<script>
   import { onMount, onDestroy } from 'svelte';
   import { round } from '../../../material/input/round';
   import * as tables from './tables';
   import * as options from './options';

   // Components
   import { Input, InputArea, InputLength, InputPressure, InputWeight } from '../../../material/input';
   import { Select } from '../../../material/select';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Methods
   const onSave = () => {
      console.log('Saving...');
      const { platform: platformModule } = workbook.modules;

      platformModule.dimensions = platform;
      platformModule.cab = cab;
      platformModule.flooring = flooring;

      saveProject();
   };

   // Constants
   const { capacity, loading } = workbook.modules.globals;
   const { type: loadingType, freight } = loading;

   // Variables
   let platform = {
      width: 0,
      depth: 0,
   };

   let cab = {
      height: 96,
      width: 0,
      depth: 0,
   };

   let flooring = {
      material: {
         thickness: 0.25,
         area: 'Interior',
         weight: 0,
      },
      weight: 0,
   };

   // Reactive Variables
   $: platformArea = platform.width * platform.depth;
   $: cabArea = cab.width * cab.depth;

   // - Code Calculations
   $: maxPlatformArea = tables.maxPlatform.reverse().find((row) => row.capacity <= capacity).area;
   $: maxPlatformAreaPlus = maxPlatformArea * 1.05;
   $: minFreightCapacity = round(tables.capacityRating.find((row) => row.class === freight).rating * cab.width * cab.depth);

   // - Error Checking
   $: invalidMinFreightCapacity = loadingType === 'Freight' ? minFreightCapacity > capacity : false;

   // Reactive Rules
   $: if (save) {
      onSave();
   }

   $: if (flooring.material.weight) {
      flooring.weight = round(cab.width * cab.depth * flooring.material.weight);
   }

   // Lifecycle
   onMount(() => {
      console.log('Platform', workbook);
      const { platform: module } = workbook.modules;

      // Set object variables
      if (module?.dimensions) platform = module.dimensions;
      if (module?.cab) cab = module.cab;
      if (module?.flooring) flooring = module.flooring;
   });

   onDestroy(() => {
      onSave();
   });
</script>

<fieldset>
   <legend>Globals</legend>
   <InputWeight value={capacity} disabled label="Capacity" />
   <Input value={`${loadingType} - ${freight}`} disabled label="Loading" />
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
   <InputLength bind:value={cab.width} disableValidation helperText="Platform doesn't meet min freight capacity" invalid={invalidMinFreightCapacity} label="Interior Width" />
   <InputLength bind:value={cab.depth} disableValidation helperText="Platform doesn't meet min freight capacity" invalid={invalidMinFreightCapacity} label="Interior Depth" />
   <InputArea value={cabArea} disabled label="Interior Area" />

   <fieldset>
      <legend>Flooring</legend>
      <InputPressure bind:value={flooring.material.weight} label="Material Weight" />
      <InputLength bind:value={flooring.material.thickness} label="Material Thickness" />
      <Select bind:value={flooring.material.area} label="Material Area" options={options.platformMaterialArea} />
      <InputWeight bind:value={flooring.weight} disabled={flooring.material.weight} label="Total Weight" />
   </fieldset>
</fieldset>

<fieldset>
   <legend>Code Requirements</legend>

   {#if loadingType === 'Passenger'}
      <InputArea value={maxPlatformArea} disabled label="Max Inside Platform Area" />
      <InputArea value={maxPlatformAreaPlus} disabled label="Max Inside Platform Area + 5%" />
   {/if}

   {#if freight !== 'None'}
      <InputWeight value={minFreightCapacity} disabled label="Min. Freight Capacity" />
   {/if}
</fieldset>
