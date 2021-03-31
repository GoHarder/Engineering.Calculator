<script>
   import { onMount, onDestroy } from 'svelte';
   import { fade } from 'svelte/transition';
   import { round } from '../../../material/lib/round';
   import * as tables from './tables';
   import * as options from './options';

   // Components
   import { Input, InputArea, InputLength, InputWeight } from '../../../material/input';
   import { Select } from '../../../material/select';
   import SteelPlatform from './sections/SteelPlatform.svelte';
   import WoodPlatform from './sections/WoodPlatform.svelte';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Methods
   const onSave = () => {
      console.log('Saving...');

      const saveData = {
         properties: platform,
         cab,
         doors: {
            qty: doorQty,
            door1,
         },
      };

      saveData.doors.door1.weight = door1Weight;

      if (doorQty === 2) {
         saveData.doors.door2 = door2;
         saveData.doors.door2.weight = door2Weight;
      }

      workbook.modules.platform = { ...workbook.modules.platform, ...saveData };

      saveProject();
   };

   // Constants
   const { metric } = workbook;
   const { capacity, loading } = workbook.modules.globals;
   const { type: loadingType, freight } = loading;
   const { platform: module } = workbook.modules;
   const comps = {
      SteelPlatform,
      WoodPlatform,
   };

   // Variables
   let platform = {
      width: 0,
      depth: 0,
      material: 'Wood',
      thickness: 0,
      weight: 0,
   };

   let cab = {
      height: 96,
      width: 0,
      depth: 0,
   };

   let doorQty = module?.doors?.qty ?? 1;

   let door1 = {
      type: 'Single Speed',
      width: 0,
      height: 0,
   };

   let door2 = {
      type: 'Single Speed',
      location: 'Back',
      width: 0,
      height: 0,
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

   // -- Cab Weight with override
   $: cabWeightCalc = round(cabWallWeight + cabCeilingWeight + handRailWeight + coveLightWeight);
   $: cabWeight = cabWeightCalc;

   // - Door Weight with override
   $: door1WeightCalc = door1.width * (86 / 12);
   $: door1Weight = door1WeightCalc;

   $: door2WeightCalc = door2.width * (86 / 12);
   $: door2Weight = door2WeightCalc;

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

   // Lifecycle
   onMount(() => {
      // console.log('Platform', workbook);
      const { platform: module } = workbook.modules;

      // Set object variables
      if (module?.properties) platform = module.properties;
      if (module?.cab) cab = module.cab;
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

<fieldset class="properties">
   <legend>Properties</legend>

   <Select bind:value={platform.material} label="Material" options={options.platformMaterial} />

   <div class="input-bump">
      <InputLength bind:value={platform.width} label="Width" {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={platform.depth} label="Depth" {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={platform.thickness} display label="Thickness" {metric} />
   </div>
   <div class="input-bump">
      <InputArea value={platformArea} display label="Area" {metric} />
   </div>

   <div class="input-bump">
      <InputWeight bind:value={platform.weight} display label="Weight" {metric} />
   </div>
</fieldset>

<svelte:component this={comps[`${platform.material}Platform`]} {workbook} bind:platform />

<fieldset>
   <legend>Cab Information</legend>
   <InputLength bind:value={cab.height} label="Height" {metric} />
   <InputLength bind:value={cab.width} label="Interior Width" {metric} />
   <InputLength bind:value={cab.depth} label="Interior Depth" {metric} />
   <InputArea value={cabArea} display label="Interior Area" {metric} />
   <InputWeight bind:value={cabWeight} calc={cabWeightCalc} label="Weight" reset {metric} />

   <Select bind:value={doorQty} label="Door Quantity" {metric} options={options.doorQty} />

   <fieldset>
      <legend>Front Door</legend>
      <Select bind:value={door1.type} label="Door Type" {metric} options={options.doorType} />
      <InputLength bind:value={door1.width} label="Width" {metric} />
      <InputLength bind:value={door1.height} label="Height" {metric} />
      <InputWeight bind:value={door1Weight} calc={door1WeightCalc} label="Weight" reset {metric} />
   </fieldset>

   {#if doorQty === 2}
      <fieldset transition:fade>
         <legend>{`${door2.location} Door`}</legend>
         <Select bind:value={door2.location} label="Location" {metric} options={options.doorLocation} />
         <Select bind:value={door2.type} label="Door Type" {metric} options={options.doorType} />
         <InputLength bind:value={door2.width} label="Width" {metric} />
         <InputLength bind:value={door2.height} label="Height" {metric} />
         <InputWeight bind:value={door2Weight} calc={door2WeightCalc} label="Weight" reset {metric} />
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
         helperText={`Interior area exceeds max area + 5%`}
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
         helperText="Capacity is below minimum freight capacity"
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
