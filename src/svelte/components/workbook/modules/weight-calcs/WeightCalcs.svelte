<script>
   // General Imports
   import { round } from '../../../../../js/modules/round';

   // Table Imports
   import * as table from './tables';

   // Svelte Imports
   import { onMount, onDestroy } from 'svelte';

   // Project Components
   import SectionTitle from '../common/SectionTitle.svelte';
   // import { InputNumber, Select } from '../../../common/controls/lib.js';

   // Properties
   export let workbook = {};
   export let save = false;

   // Constants
   const labelWidth = 180;

   // Methods
   const onSave = () => {
      console.log('Saving...');
      const weightCalcs = { platformLength, platformWidth, insidePlatformLength, insidePlatformWidth };

      workbook.modules.weightCalcs = { ...workbook.modules.weightCalcs, ...weightCalcs };
   };

   // Variables
   let { metric } = workbook;
   let { capacity, loading } = workbook.modules.globals;

   let slingWeight = 0;
   let platformWeight = 0;
   let cabWeight = 0;

   let doorOperator = 150;

   let platformLength = 0;
   let platformWidth = 0;
   let insidePlatformLength = 0;
   let insidePlatformWidth = 0;

   // Reactive Variables
   $: platformArea = platformLength * platformWidth;
   $: insidePlatformArea = insidePlatformLength * insidePlatformWidth;
   $: maxPlatformArea = table.maxPlatform.reverse().find((row) => capacity >= row.capacity).area;
   $: minCapacity = round(table.capacityRating.find((row) => loading.freight === row.class).rating * insidePlatformArea);

   // Reactive Rules
   $: if (save) {
      onSave();
   }

   // Lifecycle
   onMount(() => {
      if (Object.keys(workbook.modules.weightCalcs).length > 1) {
         console.log('Weight Calculations', workbook);

         const module = workbook.modules.weightCalcs;

         platformLength = module.platformLength;
         platformWidth = module.platformWidth;
         insidePlatformLength = module.insidePlatformLength;
         insidePlatformWidth = module.insidePlatformWidth;
      }
   });

   onDestroy(() => {
      onSave();
   });
</script>

<section>
   <div class="input-group">
      <!-- <InputNumber bind:value={capacity} {labelWidth} label="Capacity" type="weight" {metric} display /> -->
   </div>
</section>

<section>
   <SectionTitle>Platform Dimensions</SectionTitle>

   <SectionTitle level={2}>Outside</SectionTitle>
   <div class="input-group level-2">
      <!-- <InputNumber bind:value={platformWidth} {labelWidth} label="Width" type="length" {metric} /> -->
      <!-- <InputNumber bind:value={platformLength} {labelWidth} label="Depth" type="length" {metric} /> -->
      <!-- <InputNumber bind:value={platformArea} {labelWidth} label="Area" type="area" {metric} display /> -->
   </div>

   <SectionTitle level={2}>Inside</SectionTitle>
   <div class="input-group level-2">
      <!-- <InputNumber bind:value={insidePlatformWidth} {labelWidth} label="Width" type="length" {metric} /> -->
      <!-- <InputNumber bind:value={insidePlatformLength} {labelWidth} label="Depth" type="length" {metric} /> -->
      <!-- <InputNumber bind:value={insidePlatformArea} {labelWidth} label="Area" type="area" {metric} display /> -->
   </div>

   <SectionTitle level={2}>A17.1 Table 207.1 Limits</SectionTitle>
   <div class="input-group level-2">
      <!-- <InputNumber value={maxPlatformArea} {labelWidth} label="Max Inside Net Area" type="area" {metric} display /> -->
      <!-- <InputNumber value={round(maxPlatformArea * 1.05, 2)} {labelWidth} label="Net Area + 5%" type="area" {metric} display /> -->

      {#if loading.freight !== 'None'}
         <!-- <InputNumber bind:value={minCapacity} {labelWidth} label="Min. Freight Capacity" type="weight" {metric} display /> -->
      {/if}
   </div>
</section>

<style>
   /* .input-group {
      width: 500px;
   } */

   /* .level-2 {
      margin: 0 0 0 16px;
   } */
</style>
