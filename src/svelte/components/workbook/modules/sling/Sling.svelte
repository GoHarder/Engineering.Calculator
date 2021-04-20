<script>
   import { createEventDispatcher, onDestroy, onMount } from 'svelte';
   import { fade } from 'svelte/transition';
   // import { floor, round } from '../round';
   import * as tables from './tables';
   import * as shared from '../shared';

   // Properties
   export let workbook = {};
   // export let save = false;
   // export let saveProject = undefined;

   // Components
   import { Input, InputLength, InputSpeed, InputWeight } from '../../../material/input';
   import { OptGroup, Option, Select } from '../../../material/select';
   import { Checkbox } from '../../../material/checkbox';
   import { IconButton } from '../../../material/button';
   import { Link } from '../../../material/button/icons';

   // Methods
   const onSave = () => {
      console.log('onSave()');
      // saveProject();
   };

   const getEngineeringData = async (capacity, carSpeed) => {
      const res = await fetch(`api/engineering/sling?capacity=${capacity}&carSpeed=${carSpeed}`, {
         headers: { 'Content-Type': 'application/json' },
      }).catch((error) => {
         console.log(error);
         return { ok: false };
      });

      if (res.ok) {
         const body = await res.json();

         shoes = [...body.shoe];
         safeties = [...body.safety];
      } else {
         console.log(res);
      }
   };

   const getShoeOptions = (shoes, railSize) => {
      let options = [{ name: 'Other', railSizes: tables.railSize }];

      if (shoes) options = [...options, ...shoes];

      options = options.filter((shoe) => shoe.railSizes.includes(railSize));

      return options;
   };

   const getSafetyOptions = (safeties, railSize) => {
      let options = [{ name: 'Other', railSizes: tables.railSize }];

      if (safeties) options = [...options, ...safeties];

      options = options.filter((safety) => safety.railSizes.includes(railSize));

      return options;
   };

   // Constants
   const dispatch = createEventDispatcher();
   const { metric, modules } = workbook;
   const { capacity, carRoping, carSpeed } = modules.globals;
   const { sling: module } = workbook.modules;

   console.log(workbook);

   // Variables

   let railLock = module?.railLock ?? false; // if true then two shoe plates
   // rail Lock weight: 108, height: 2.5

   let carRail = '15#';
   let carDBG = 0;

   let stilesBackToBack = 0;
   let underBeamHeight = 20;

   let safetyModel = 'Other';
   let safetyHeight = 0;
   let safetyWeight = 0;

   let shoeModel = 'Other';
   let shoeHeight = 0;
   let shoeWeight = 0;

   // - Controls
   let shoes = undefined;
   let safeties = undefined;

   // Reactive Variables
   console.log(shared.platformThickness(modules, 'value'));
   console.log(shared.platformThickness(modules, 'module'));

   // - Controls
   $: shoeOptions = getShoeOptions(shoes, carRail);
   $: safetyOptions = getSafetyOptions(safeties, carRail);

   // Lifecycle
   onMount(() => {
      getEngineeringData(capacity, carSpeed);
   });

   onDestroy(() => {
      onSave();
   });
</script>

<fieldset>
   <legend>Globals</legend>
   <hr />
   <div class="input-bump link">
      <InputWeight value={capacity} display label="Capacity" {metric} />
      <IconButton on:click={() => dispatch('changePage', 'Requirements')}>
         <Link />
      </IconButton>
   </div>
   <div class="input-bump link">
      <InputSpeed value={carSpeed} display label="Car Speed" {metric} />
      <IconButton on:click={() => dispatch('changePage', 'Requirements')}>
         <Link />
      </IconButton>
   </div>
   <div class="input-bump link">
      <Input value={`${carRoping}:1`} display label="Car Roping" />
      <IconButton on:click={() => dispatch('changePage', 'Requirements')}>
         <Link />
      </IconButton>
   </div>
</fieldset>

<fieldset>
   <legend>Properties</legend>
   <hr />
   <div class="input-bump">
      <Select bind:value={carRail} label="Rail Size">
         {#each tables.railSize as text}
            <Option {text} />
         {/each}
      </Select>
   </div>

   <div class="input-bump">
      <InputLength bind:value={carDBG} label="D.B.G." {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={stilesBackToBack} label="Back to Back of Stiles" {metric} />
   </div>
   <div class="input-bump">
      <InputLength bind:value={underBeamHeight} label="Under Beam Height" {metric} />
   </div>
</fieldset>

{#if carRoping > 1}
   <fieldset>
      <legend>Sheaves</legend>
      <hr />
   </fieldset>
{/if}

<fieldset>
   <legend>Shoes</legend>
   <hr />
   <div class="input-bump">
      <Select bind:value={shoeModel} label="Model">
         {#each shoeOptions as { name }}
            <Option text={name} />
         {/each}
      </Select>
   </div>
   {#if shoeModel === 'Other'}
      <div class="input-bump" transition:fade>
         <InputWeight bind:value={shoeWeight} label="Weight" {metric} />
      </div>
      <div class="input-bump" transition:fade>
         <InputLength bind:value={shoeHeight} label="Height" {metric} />
      </div>
   {/if}
</fieldset>

<fieldset>
   <legend>Shoe Plates</legend>
   <hr />
   {#if ['12#', '15#'].includes(carRail)}
      <div class="input-bump">
         <Checkbox bind:checked={railLock} label="Rail Locks" />
      </div>
   {/if}
</fieldset>

<fieldset>
   <legend>Top Channel</legend>
   <hr />
</fieldset>

<fieldset>
   <legend>Finished Flooring</legend>
   <hr />
</fieldset>

<fieldset>
   <legend>Plywood</legend>
   <hr />
</fieldset>

<fieldset>
   <legend>Safety</legend>
   <hr />
   <div class="input-bump">
      <Select bind:value={safetyModel} label="Model">
         {#each safetyOptions as { name }}
            <Option text={name} />
         {/each}
      </Select>
   </div>
   {#if safetyModel === 'Other'}
      <div class="input-bump" transition:fade>
         <InputWeight bind:value={safetyWeight} label="Weight" {metric} />
      </div>
      <div class="input-bump" transition:fade>
         <InputLength bind:value={safetyHeight} label="Height" {metric} />
      </div>
   {/if}
</fieldset>
