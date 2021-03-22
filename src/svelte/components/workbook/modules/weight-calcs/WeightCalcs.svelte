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
      const { modules } = workbook;

      // Setup empty modules
      if ('counterweight' in modules === false) modules.counterweight = {};

      // Save external module data
      modules.counterweight = counterweight;

      // Save internal module data
      const module = modules.weightCalcs;

      console.log('Weight Calculations', workbook);
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

<fieldset>
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
</fieldset>
