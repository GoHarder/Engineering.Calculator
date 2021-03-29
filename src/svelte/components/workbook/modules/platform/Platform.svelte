<script>
   import { onMount, onDestroy } from 'svelte';
   import { fade } from 'svelte/transition';
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

      const saveData = {
         dimensions: platform,
         cab,
         flooring,
         doors: {
            qty: doorQty,
            door1,
         },
      };

      if (doorQty === 2) {
         saveData.doors.door2 = door2;
      }

      workbook.modules.platform = { ...workbook.modules.platform, ...saveData };

      saveProject();
   };

   // Constants
   const { metric } = workbook;
   const { capacity, loading } = workbook.modules.globals;
   const { type: loadingType, freight } = loading;
   const { platform: module } = workbook.modules;

   // Variables
   let platform = {
      width: 0,
      depth: 0,
      material: 'Wood',
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

   let doorQty = module?.doors?.qty ?? 1;

   let door1 = {
      type: 'Passenger',
      location: 'Front',
      width: 0,
      height: 0,
      weight: 0,
   };

   let door2 = {
      type: 'Passenger',
      location: 'Back',
      width: 0,
      height: 0,
      weight: 0,
   };

   // Reactive Variables
   $: platformArea = platform.width * platform.depth;
   $: cabArea = cab.width * cab.depth;

   // - Cab Estimated Weight
   $: cabCeilingWeight = cabArea * (4.64 / 144);
   $: cabWallArea = (cab.depth + cab.width) * 2 * cab.height;
   $: doorArea = door1.width * door1.height + (doorQty === 2 ? door2.width * door2.height : 0);
   $: cabWallWeight = (cabWallArea - doorArea) * ((capacity <= 3500 ? 7.21 : 8.9) / 144);
   $: handRailWeight = cab.width + cab.depth * 2 * (2.5 / 144);
   $: coveLightWeight = cab.width + cab.depth * 2 * (5 / 144);
   $: cabWeightCalc = round(cabWallWeight + cabCeilingWeight + handRailWeight + coveLightWeight);

   $: cabWeight = cabWeightCalc;

   // - Code Calculations
   $: maxPlatformArea = tables.maxPlatform.reverse().find((row) => row.capacity <= capacity).area;
   $: maxPlatformAreaPlus = maxPlatformArea * 1.05;
   $: minFreightCapacity = round(tables.capacityRating.find((row) => row.class === freight).rating * cabArea);

   // - Error Checking
   $: invalidMaxPlatformArea = cabArea > maxPlatformAreaPlus;
   $: invalidMinFreightCapacity = minFreightCapacity > capacity;

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
      if (module?.doors?.door1) door1 = module.doors.door1;
      if (module?.doors?.door2) door2 = module.doors.door2;
   });

   onDestroy(() => {
      onSave();
   });
</script>

<fieldset class="globals">
   <legend>Globals</legend>
   <div class="input-bump">
      <InputWeight value={capacity} display label="Capacity" {metric} />
   </div>
   <div class="input-bump">
      <Input value={`${loadingType} - ${freight}`} display label="Loading" />
   </div>
</fieldset>

<fieldset class="dimensions">
   <legend>Dimensions</legend>

   <div class="input-bump">
      <InputLength bind:value={platform.width} label="Width" {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={platform.depth} label="Depth" {metric} />
   </div>
   <div class="input-bump">
      <InputArea value={platformArea} display label="Area" {metric} />
   </div>
</fieldset>

<fieldset>
   <legend>Cab Information</legend>
   <InputLength bind:value={cab.height} label="Height" {metric} />
   <InputLength bind:value={cab.width} label="Interior Width" {metric} />
   <InputLength bind:value={cab.depth} label="Interior Depth" {metric} />
   <InputArea value={cabArea} display label="Interior Area" {metric} />
   <InputWeight bind:value={cabWeight} calc={cabWeightCalc} label="Total Weight" reset {metric} />
</fieldset>

<fieldset>
   <legend>Flooring</legend>
   <InputPressure bind:value={flooring.material.weight} label="Material Weight" {metric} />
   <InputLength bind:value={flooring.material.thickness} label="Material Thickness" {metric} />
   <Select bind:value={flooring.material.area} label="Material Area" {metric} options={options.flooringMaterialArea} />
   <InputWeight bind:value={flooring.weight} disabled={flooring.material.weight} label="Total Weight" {metric} />
</fieldset>

<fieldset>
   <legend>Doors</legend>
   <Select bind:value={doorQty} label="Door Quantity" {metric} options={options.doorQty} />

   <fieldset>
      <legend>Front Door</legend>
      <Select bind:value={door1.type} label="Door Type" {metric} options={options.doorType} />
      <InputLength bind:value={door1.width} label="Width" {metric} />
      <InputLength bind:value={door1.height} label="Height" {metric} />
   </fieldset>

   {#if doorQty === 2}
      <fieldset transition:fade>
         <legend>{`${door2.location} Door`}</legend>
         <Select bind:value={door2.location} label="Location" {metric} options={options.doorLocation} />
         <Select bind:value={door2.type} label="Door Type" {metric} options={options.doorType} />
         <InputLength bind:value={door2.width} label="Width" {metric} />
         <InputLength bind:value={door2.height} label="Height" {metric} />
      </fieldset>
   {/if}
</fieldset>

<fieldset>
   <legend>Code Requirements</legend>

   {#if loadingType === 'Passenger'}
      <div class="input-bump">
         <InputArea value={maxPlatformArea} display label="Max Inside Platform Area" {metric} />
      </div>

      <InputArea
         value={maxPlatformAreaPlus}
         disableValidation
         display
         helperText="Interior area exceeds max area + 5%"
         invalid={invalidMaxPlatformArea}
         label="Max Inside Platform Area + 5%"
         {metric}
      />
   {/if}

   {#if freight !== 'None'}
      <InputWeight
         value={minFreightCapacity}
         disableValidation
         display
         helperText="Capacity exceeds minimum freight capacity"
         invalid={invalidMinFreightCapacity}
         label="Min. Freight Capacity"
         {metric}
      />
   {/if}
</fieldset>

<style>
   /* .container {
      display: flex;
      flex-wrap: wrap;
   }

   .globals {
      flex-basis: calc(calc(600px - 100%) * 10000);
      flex-grow: 1;
      max-width: 500px;
      min-width: 300px;
   }

   .dimensions {
      flex-basis: calc(calc(600px - 100%) * 10000);
      flex-grow: 1;
      max-width: 500px;
      min-width: 300px;
   } */
</style>
