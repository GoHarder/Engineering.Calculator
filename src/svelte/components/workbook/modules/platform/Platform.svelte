<script>
   import { onDestroy } from 'svelte';
   import { fade } from 'svelte/transition';
   import { round } from '../../../material/lib/round';
   import * as tables from './tables';
   import * as options from './options';

   // Components
   import { Input, InputArea, InputLength, InputWeight } from '../../../material/input';
   import { Select } from '../../../material/select';
   import { Checkbox } from '../../../material/checkbox';
   import SteelPlatform from './sections/SteelPlatform.svelte';
   import WoodPlatform from './sections/WoodPlatform.svelte';

   // Properties
   export let workbook = {};
   export let save = false;
   export let saveProject = undefined;

   // Methods
   const onSave = () => {
      // console.log('Saving...');
      // const saveData = {
      //    properties: platform,
      //    cab,
      //    doors: {
      //       qty: doorQty,
      //       door1,
      //    },
      // };
      // saveData.properties.material = platformMaterial;
      // saveData.doors.door1.weight = door1Weight;
      // saveData.cab.weight = cabWeight;
      // if (doorQty === 2) {
      //    saveData.doors.door2 = door2;
      //    saveData.doors.door2.weight = door2Weight;
      // }
      // workbook.modules.platform = { ...workbook.modules.platform, ...saveData };
      // saveProject();
   };

   // Constants
   const { metric } = workbook;
   const { capacity, loading } = workbook.modules.globals;
   const { type: loadingType, freight } = loading;
   const { platform: module } = workbook.modules;

   // Variables
   // let platform = {
   //    width: 0,
   //    depth: 0,
   //    frontToRail: 0,
   //    thickness: 0,
   //    weight: 0,
   //    isolation: false,
   // };

   // - Platform
   let platformDepth = module?.properties.depth ?? 0;
   let platformIsolation = module?.properties.isolation ?? false;
   let platformFrontToRail = module?.properties.frontToRail ?? 0;
   let platformMaterial = module?.properties.material ?? 'Wood';
   let platformThickness = module?.properties.thickness ?? 0;
   let platformWeight = module?.properties.weight ?? 0;
   let platformWidth = module?.properties.width ?? 0;

   let platformSteel = module?.properties.steel ?? {
      backChannel: undefined,
      frontChannel: undefined,
      hasSillChannel: false,
      type: 'ASTM A36',
      sideChannel: undefined,
      sillChannel: undefined,
      split: false,
      stringer: undefined,
   };

   // - Cab
   let cabDepth = module?.cab.depth ?? 0;
   let cabHeight = module?.cab.height ?? 96;
   let cabWidth = module?.cab.width ?? 0;

   // let cab = {
   //    height: 96,
   //    width: 0,
   //    depth: 0,
   // };

   // - Doors
   let doorQty = module?.doors.qty ?? 1;

   // -- Door 1
   // let door1 = {
   //    type: 'Single Speed',
   //    width: 0,
   //    height: 0,
   // };

   let door1Height = module?.doors.door1.height ?? 0;
   let door1Type = module?.doors.door1.type ?? 'Single Speed';
   let door1Width = module?.doors.door1.width ?? 0;

   // -- Door 2
   // let door2 = {
   //    type: 'Single Speed',
   //    location: 'Back',
   //    width: 0,
   //    height: 0,
   // };

   let door2Height = module?.doors?.door2?.height ?? 0;
   let door2Location = module?.doors?.door2?.location ?? 'Back';
   let door2Type = module?.doors?.door2?.type ?? 'Single Speed';
   let door2Width = module?.doors?.door2?.width ?? 0;

   // Reactive Variables
   $: comp = platformMaterial === 'Wood' ? WoodPlatform : SteelPlatform;

   // - Area
   $: platformArea = platformWidth * platformDepth;
   $: cabArea = cabWidth * cabDepth;

   // - Cab Estimated Weight
   $: cabCeilingWeight = cabArea * (4.64 / 144);
   $: cabWallArea = (cabDepth + cabWidth) * 2 * cabHeight;
   $: doorArea = door1Width * door1Height + (doorQty === 2 ? door2Width * door2Height : 0);
   $: cabWallWeight = (cabWallArea - doorArea) * ((capacity <= 3500 ? 7.21 : 8.9) / 144);
   $: handRailWeight = cabWidth + cabDepth * 2 * (2.5 / 144);
   $: coveLightWeight = cabWidth + cabDepth * 2 * (5 / 144);

   // -- Cab Weight with override
   $: cabWeightCalc = round(cabWallWeight + cabCeilingWeight + handRailWeight + coveLightWeight);
   $: cabWeight = cabWeightCalc;

   // - Door Weight with override
   $: door1WeightCalc = door1Width * (86 / 12);
   $: door1Weight = door1WeightCalc;

   $: door2WeightCalc = door2Width * (86 / 12);
   $: door2Weight = door2WeightCalc;

   // - Code Calculations
   $: maxPlatformArea = tables.maxPlatform.reverse().find((row) => row.capacity <= capacity).area;
   $: maxPlatformAreaPlus = maxPlatformArea * 1.05;
   $: minFreightCapacity = round(tables.capacityRating.find((row) => row.class === freight).rating * cabArea);

   // - Error Checking
   $: invalidMaxPlatformArea = cabArea > maxPlatformAreaPlus;
   $: invalidMinFreightCapacity = minFreightCapacity > capacity;

   // - Controlls
   $: disableIsolation = ['None', 'A'].includes(freight) === false || platformSteel.split;

   // Reactive Rules
   $: if (save) {
      onSave();
   }

   // $: console.log(platformSteel);

   // Lifecycle
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

   <div class="input-bump">
      <Select bind:value={platformMaterial} label="Material" options={options.platformMaterial} />
   </div>

   <div class="input-bump">
      <InputLength bind:value={platformWidth} label="Width" {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={platformDepth} label="Depth" {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={platformFrontToRail} label="Front of Platform to Rail" {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={platformThickness} display label="Thickness" {metric} />
   </div>
   <div class="input-bump">
      <InputArea value={platformArea} display label="Area" {metric} />
   </div>

   <div class="input-bump">
      <InputWeight bind:value={platformWeight} display label="Weight" {metric} />
   </div>

   <div class="input-bump">
      <Checkbox bind:value={platformIsolation} disabled={disableIsolation} label="Isolation" />
   </div>
</fieldset>

<svelte:component
   this={comp}
   bind:platformSteel
   bind:platformThickness
   bind:platformWeight
   {doorQty}
   {platformDepth}
   {platformIsolation}
   {platformFrontToRail}
   {platformWidth}
   {workbook}
/>

<fieldset>
   <legend>Cab Information</legend>
   <InputLength bind:value={cabHeight} label="Height" {metric} />
   <InputLength bind:value={cabWidth} label="Interior Width" {metric} />
   <InputLength bind:value={cabDepth} label="Interior Depth" {metric} />
   <InputArea value={cabArea} display label="Interior Area" {metric} />
   <InputWeight bind:value={cabWeight} calc={cabWeightCalc} label="Weight" reset {metric} />

   <Select bind:value={doorQty} label="Door Quantity" {metric} options={options.doorQty} />

   <fieldset>
      <legend>Front Door</legend>
      <Select bind:value={door1Type} label="Door Type" {metric} options={options.doorType} />
      <InputLength bind:value={door1Width} label="Width" {metric} />
      <InputLength bind:value={door1Height} label="Height" {metric} />
      <InputWeight bind:value={door1Weight} calc={door1WeightCalc} label="Weight" reset {metric} />
   </fieldset>

   {#if doorQty === 2}
      <fieldset transition:fade>
         <legend>{`${door2Location} Door`}</legend>
         <Select bind:value={door2Location} label="Location" {metric} options={options.doorLocation} />
         <Select bind:value={door2Type} label="Door Type" {metric} options={options.doorType} />
         <InputLength bind:value={door2Width} label="Width" {metric} />
         <InputLength bind:value={door2Height} label="Height" {metric} />
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
