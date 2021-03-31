<script>
   import { onMount, onDestroy } from 'svelte';
   import * as tables from './tables';
   import * as options from './options';

   // Components
   import { Input, InputLength, InputWeight } from '../../../material/input';
   import { Select } from '../../../material/select';

   // Properties
   export let workbook = {};
   export let save = false;

   // Methods
   const onSave = () => {
      console.log('Saving...');
      // const { modules } = workbook;

      // Setup empty modules
      // if ('counterweight' in modules === false) modules.counterweight = {};

      // Save external module data
      // modules.counterweight = counterweight;

      // Save internal module data
      // const module = modules.weightCalcs;

      // console.log('Weight Calculations', workbook);
   };

   // Variables
   let { metric } = workbook;
   let { capacity, carRoping, carSpeed, loading } = workbook.modules.globals;

   let counterbalance = 40;
   let slingWeight = 0; // Will be passed in if sling page exists
   let platformMaterial = 'Wood'; // Will be passed in if steel platform page exists
   let platformThickness = 3; // Will be passed in if steel platform page exists

   // Reactive Variables
   $: carWeight = slingWeight;
   $: counterweight = carWeight + capacity * counterbalance * 0.01;
   $: platformWeight = 0; // Will be passed in if steel platform page exists
   $: safetyWeight = 0;

   // Reactive Rules
   $: if (save) {
      onSave();
   }

   // Lifecycle
   onMount(() => {
      console.log('Weight Calculations', workbook);
   });

   onDestroy(() => {
      onSave();
   });
</script>

<!-- <fieldset>
   <InputWeight value={carWeight} disabled label="CarWeight" {metric} />
   <InputWeight value={capacity} disabled label="Capacity" {metric} />

   <fieldset>
      <legend>Counterweight</legend>
      <Input bind:value={counterbalance} label="Counterbalance" list="counterbalance" {metric} suffix="%" type="number" />
      <datalist id="counterbalance">
         <option value="40" />
         <option value="50" />
      </datalist>
      <InputWeight value={counterweight} disabled label="Counterweight" {metric} />
   </fieldset>
</fieldset>

<fieldset>
   <legend>Standard Equipment</legend>

   <InputWeight bind:value={slingWeight} label="Sling Weight" {metric} />

   <fieldset>
      <legend>Platform</legend>
      <InputWeight value={platformWeight} disabled label="Platform Weight" {metric} />
      <Select bind:value={platformMaterial} label="Platform Material" options={options.platformMaterial} />
      <InputLength bind:value={platformThickness} label="Platform Thickness" {metric} />
   </fieldset>
   <fieldset>
      <legend>Safety</legend>
   </fieldset>
</fieldset> -->

<!-- NOTE: 3-30-2021 3:28 PM - from platform 
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
      <InputLength bind:value={platform.thickness} display label="Thickness" {metric} />
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
</fieldset> -->
