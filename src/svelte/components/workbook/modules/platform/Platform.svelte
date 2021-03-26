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
   const { metric } = workbook;
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
   $: invalidMinFreightCapacity = minFreightCapacity > capacity;
   $: invalidMaxPlatformArea = cab.area > maxPlatformAreaPlus;

   // Reactive Rules
   $: if (save) {
      onSave();
   }

   $: if (flooring.material.weight) {
      flooring.weight = round((flooring.material.area === 'Interior' ? cabArea : platformArea) * flooring.material.weight);
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
   <InputWeight value={capacity} display label="Capacity" {metric} />
   <Input value={`${loadingType} - ${freight}`} display label="Loading" />
</fieldset>

<fieldset>
   <legend>Dimensions</legend>
   <InputLength bind:value={platform.width} label="Width" {metric} />
   <InputLength bind:value={platform.depth} label="Depth" {metric} />
   <InputArea value={platformArea} disabled label="Area" {metric} />
</fieldset>

<fieldset>
   <legend>Cab Information</legend>
   <InputLength bind:value={cab.height} label="Height" {metric} />
   <InputLength bind:value={cab.width} label="Interior Width" {metric} />
   <InputLength bind:value={cab.depth} label="Interior Depth" {metric} />
   <InputArea value={cabArea} disabled label="Interior Area" {metric} />

   <fieldset>
      <legend>Flooring</legend>
      <InputPressure bind:value={flooring.material.weight} label="Material Weight" {metric} />
      <InputLength bind:value={flooring.material.thickness} label="Material Thickness" {metric} />
      <Select bind:value={flooring.material.area} label="Material Area" {metric} options={options.platformMaterialArea} />
      <InputWeight bind:value={flooring.weight} disabled={flooring.material.weight} label="Total Weight" {metric} />
   </fieldset>
</fieldset>

<fieldset>
   <legend>Code Requirements</legend>

   {#if loadingType === 'Passenger'}
      <InputArea value={maxPlatformArea} disabled label="Max Inside Platform Area" {metric} />
      <InputArea value={maxPlatformAreaPlus} disabled label="Max Inside Platform Area + 5%" {metric} />
   {/if}

   {#if freight !== 'None'}
      <InputWeight value={minFreightCapacity} display label="Min. Freight Capacity" {metric} />
   {/if}
</fieldset>
